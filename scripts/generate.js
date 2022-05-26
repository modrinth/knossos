import fetch from 'node-fetch';
import { promises as fs } from 'fs';
import sharp from 'sharp';
import { getAverageColor } from 'fast-average-color-node';

const API_URL =
	process.env.VITE_API_URL || process.env?.NODE_ENV === 'development'
		? 'https://staging-api.modrinth.com/v2/'
		: 'https://api.modrinth.com/v2/';
const GENERATED_PATH = './src/generated/';

(async () => {
	/* GAME VERSIONS */

	// Fetch data
	let gameVersions = await (await fetch(API_URL + 'tag/game_version')).json();

	// Write JSON file
	await fs.writeFile(GENERATED_PATH + 'gameVersions.json', JSON.stringify(gameVersions));

	console.log('Generated gameVersions.json');

	/* TAGS */

	// Fetch data
	let [categories, loaders, licenses, donationPlatforms] = await Promise.all([
		await (await fetch(API_URL + 'tag/category')).json(),
		await (await fetch(API_URL + 'tag/loader')).json(),
		await (await fetch(API_URL + 'tag/license')).json(),
		await (await fetch(API_URL + 'tag/donation_platform')).json(),
	]);

	// Create single object with icons
	const tagIcons = {
		...categories.reduce((a, v) => ({ ...a, [v.name]: v.icon }), {}),
		...loaders.reduce((a, v) => ({ ...a, [v.name]: v.icon }), {}),
	};

	// Delete icons from original arrays
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	categories = categories.map(({ icon, ...rest }) => rest);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	loaders = loaders.map(({ icon, ...rest }) => rest);

	// Set project types
	const projectTypes = ['mod', 'modpack'];

	// Write JSON file
	await fs.writeFile(
		GENERATED_PATH + 'tags.json',
		JSON.stringify({ categories, loaders, projectTypes, licenses, donationPlatforms, tagIcons })
	);

	console.log('Generated tags.json');

	/* PROJECTS */

	// Put all mods into an array
	const modCount = (
		await (await fetch(API_URL + 'search?limit=0&facets=[["project_type:mod"]]')).json()
	).total_hits;

	let mods = [];

	for (let i = 0; i < Math.ceil(modCount / 100); i++) {
		mods = [
			...mods,
			...(
				await (
					await fetch(API_URL + `search?limit=100&facets=[["project_type:mod"]]&offset=${i * 100}`)
				).json()
			).hits || [],
		];
	}

	// Put all other types of projects into an array
	const otherCount = (
		await (await fetch(API_URL + 'search?limit=0&filters=project_type!%3D%22mod%22')).json()
	).total_hits;

	let others = [];

	for (let i = 0; i < Math.ceil(otherCount / 100); i++) {
		others = [
			...others,
			...(
				await (
					await fetch(
						API_URL + `search?limit=100&filters=project_type!%3D%22mod%22&offset=${i * 100}`
					)
				).json()
			).hits,
		];
	}

	// Combine the arrays
	const projects = [...mods, ...others];

	// Simplified array with the format: ['ID', 'color', 'png']
	let compressed = [];

	await Promise.all(
		projects
			.filter((project) => project.icon_url)
			.map(async (project, index) => {
				try {
					let color = '';

					// Icon colors
					const iconBuffer = Buffer.from(await (await fetch(project.icon_url)).arrayBuffer());
					const iconSharp = await sharp(iconBuffer);

					const { height, width } = await iconSharp.metadata();

					// Bottom edge
					{
						const edge = await iconSharp
							.extract({ left: 0, top: height - 1, width, height: 1 })
							.toBuffer();
						color = (await getAverageColor(edge)).hexa;
					}

					if (color === '#00000000') {
						// Image is transparent, so pick only one color
						color = (await getAverageColor(iconBuffer)).hexa;
					}

					// Remove color transparency
					color = color.replace(/.{2}$/, '');

					compressed[index] = [
						project.slug || project.project_id,
						color,
						...(index < 100 ? [project.icon_url.match(/\.[0-9a-z]+$/i)[0].substring(1)] : []),
						...(index < 100 && project.slug ? [project.project_id] : []),
					];
				} catch {
					console.log('Image failed with', project.title);
				}
			})
	);

	// Write JSON file
	await fs.writeFile(GENERATED_PATH + 'projects.json', JSON.stringify(compressed));

	console.log('Generated projects.json');

	/* HOMEPAGE */

	// Write JSON file
	await fs.writeFile(GENERATED_PATH + 'homepage.json', JSON.stringify({ random: Math.random() }));

	console.log('Generated homepage.json');
})();
