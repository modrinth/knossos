import fetch from 'node-fetch';
import { promises as fs } from 'fs';
import sharp from 'sharp';
import { getAverageColor } from 'fast-average-color-node';

const API_URL = 'https://staging-api.modrinth.com/v2/';
const GENERATED_PATH = './src/generated/';
const COLORS_LENGTH = 100;

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

	/* HOMEPAGE */

	// Stack SVG positions
	let colors = [];

	// TODO: When enough projects in staging-api: `(await send('GET', 'search?limit=50&index=downloads')).hits`
	// Fetch top projects
	const projects = (
		await (
			await fetch(`https://api.modrinth.com/api/v1/mod?limit=${COLORS_LENGTH}&index=downloads`)
		).json()
	).hits;

	await Promise.all(
		projects.map(async (project, index) => {
			// Project information
			const project_id = project.mod_id.replace('local-', '');
			colors[index] = {
				icon: `${project_id}/icon${project.icon_url.match(/\.[0-9a-z]+$/i)[0]}`,
				project: project.slug || project_id,
			};

			// Icon colors
			const iconBuffer = Buffer.from(await (await fetch(project.icon_url)).arrayBuffer());
			const iconSharp = await sharp(iconBuffer);

			const { height, width } = await iconSharp.metadata();

			// Bottom edge
			{
				const edge = await iconSharp
					.extract({ left: 0, top: height - 1, width, height: 1 })
					.toBuffer();
				colors[index].color = (await getAverageColor(edge)).hexa;
			}

			if (colors[index].color === '#00000000') {
				// Image is transparent, so pick only one color
				colors[index].color = (await getAverageColor(iconBuffer)).hexa;
			}

			// Remove color transparency
			colors[index].color = colors[index].color.replace(/.{2}$/, '');
		})
	);

	// Write JSON file
	await fs.writeFile(GENERATED_PATH + 'colors.json', JSON.stringify(colors));

	console.log('Generated colors.json');
})();
