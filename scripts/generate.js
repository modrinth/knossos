import fetch from 'node-fetch';
import { promises as fs } from 'fs';
import sharp from 'sharp';
import { getAverageColor } from 'fast-average-color-node';

const API_URL = 'https://staging-api.modrinth.com/v2/';
const GENERATED_PATH = './src/generated/';

(async () => {
	console.log('Generating static data from Labrinth');

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
	let stacks = [
		// {
		//   row: 8,
		//   matrix: [-320, -256],
		//   pos: [768, 832],
		// },
		{
			row: 8,
			matrix: [-320, -256],
			pos: [896, 960],
		},
		{
			row: 8,
			matrix: [-320, -256],
			pos: [1024, 1088],
		},
		{
			row: 8,
			matrix: [-320, -256],
			pos: [1152, 1216],
		},
		// {
		//   row: 7,
		//   matrix: [-400, -224],
		//   pos: [768, 832],
		// },
		{
			row: 7,
			matrix: [-400, -224],
			pos: [896, 960],
		},
		{
			row: 7,
			matrix: [-400, -224],
			pos: [1024, 1088],
		},
		{
			row: 7,
			matrix: [-400, -224],
			pos: [1152, 1216],
		},
		{
			row: 7,
			matrix: [-240, -224],
			pos: [1152, 1216],
		},
		// {
		//   row: 6,
		//   matrix: [-320, -192],
		//   pos: [640, 704],
		// },
		{
			row: 6,
			matrix: [-320, -192],
			pos: [768, 832],
		},
		{
			row: 6,
			matrix: [-320, -192],
			pos: [896, 960],
		},
		{
			row: 6,
			matrix: [-320, -192],
			pos: [1024, 1088],
		},
		{
			row: 6,
			matrix: [-320, -192],
			pos: [1152, 1216],
		},
		// {
		//   row: 5,
		//   matrix: [-240, -160],
		//   pos: [512, 576],
		// },
		{
			row: 5,
			matrix: [-240, -160],
			pos: [640, 704],
		},
		{
			row: 5,
			matrix: [-240, -160],
			pos: [768, 832],
		},
		{
			row: 5,
			matrix: [-240, -160],
			pos: [896, 960],
		},
		{
			row: 5,
			matrix: [-240, -160],
			pos: [1024, 1088],
		},
		{
			row: 5,
			matrix: [-240, -160],
			pos: [1152, 1216],
		},
		// {
		//   row: 4,
		//   matrix: [-320, -128],
		//   pos: [512, 576],
		// },
		{
			row: 4,
			matrix: [-320, -128],
			pos: [640, 704],
		},
		{
			row: 4,
			matrix: [-320, -128],
			pos: [768, 832],
		},
		{
			row: 4,
			matrix: [-320, -128],
			pos: [896, 960],
		},
		{
			row: 4,
			matrix: [-320, -128],
			pos: [1024, 1088],
		},
		{
			row: 4,
			matrix: [-320, -128],
			pos: [1152, 1216],
		},
		// {
		//   row: 3,
		//   matrix: [-400, -96],
		//   pos: [512, 576],
		// },
		{
			row: 3,
			matrix: [-240, -96],
			pos: [640, 704],
		},
		{
			row: 3,
			matrix: [-240, -96],
			pos: [512, 576],
		},
		{
			row: 3,
			matrix: [-240, -96],
			pos: [768, 832],
		},
		{
			row: 3,
			matrix: [-240, -96],
			pos: [896, 960],
		},
		{
			row: 3,
			matrix: [-240, -96],
			pos: [1024, 1088],
		},
		{
			row: 3,
			matrix: [-240, -96],
			pos: [1152, 1216],
		},
		// {
		//   row: 2,
		//   matrix: [-480, -64],
		//   pos: [512, 576],
		// },
		{
			row: 2,
			matrix: [-320, -64],
			pos: [640, 704],
		},
		{
			row: 2,
			matrix: [-320, -64],
			pos: [512, 576],
		},
		{
			row: 2,
			matrix: [-320, -64],
			pos: [768, 832],
		},
		{
			row: 2,
			matrix: [-320, -64],
			pos: [896, 960],
		},
		{
			row: 2,
			matrix: [-320, -64],
			pos: [1024, 1088],
		},
		{
			row: 2,
			matrix: [-320, -64],
			pos: [1152, 1216],
		},
		// {
		//   row: 1
		//   matrix: [-560, -32],
		//   pos: [512, 576],
		// },
		{
			row: 1,
			matrix: [-400, -32],
			pos: [640, 704],
		},
		{
			row: 1,
			matrix: [-400, -32],
			pos: [512, 576],
		},
		{
			row: 1,
			matrix: [-400, -32],
			pos: [768, 832],
		},
		{
			row: 1,
			matrix: [-400, -32],
			pos: [896, 960],
		},
		{
			row: 1,
			matrix: [-400, -32],
			pos: [1024, 1088],
		},
		{
			row: 1,
			matrix: [-400, -32],
			pos: [1152, 1216],
		},
		{
			row: 1,
			matrix: [-239, -32],
			pos: [1152, 1216],
		},
	];

	// Randomize heights
	stacks = stacks.map((stack) => ({
		...stack,
		matrix: [stack.matrix[0], stack.matrix[1] + -1 * (Math.random() * 30 + (stack.row - 1) * 55)],
	}));

	// TODO: When enough projects in staging-api: `(await send('GET', 'search?limit=50&index=downloads')).hits`
	// Fetch top projects
	const projects = (
		await (
			await fetch(`https://api.modrinth.com/api/v1/mod?limit=${stacks.length}&index=downloads`)
		).json()
	).hits;

	await Promise.all(
		stacks.map(async (it, index) => {
			// Project information
			const project = projects[index];
			it.project = {
				url: `https://modrinth.com/mod/${project.slug || project.mod_id.replace('local-', '')}/`,
				iconUrl: project.icon_url,
			};

			// Icon colors
			it.colors = {};

			const iconBuffer = Buffer.from(await (await fetch(project.icon_url)).arrayBuffer());

			const iconSharp = await sharp(iconBuffer);

			const { height, width } = await iconSharp.metadata();

			// Left edge
			{
				const edge = await iconSharp.extract({ left: 0, top: 0, width: 1, height }).toBuffer();
				it.colors.left = (await getAverageColor(edge)).hexa;
			}

			// Bottom edge
			{
				const edge = await iconSharp
					.extract({ left: 0, top: height - 1, width, height: 1 })
					.toBuffer();
				it.colors.bottom = (await getAverageColor(edge)).hexa;
			}

			if (it.colors.left === '#00000000' || it.colors.bottom === '#00000000') {
				// Image is transparent, so pick only one color
				const color = (await getAverageColor(iconBuffer)).hexa;
				it.colors = { left: color, bottom: color };
			}

			// Remove color transparency
			it.colors.left = it.colors.left.replace(/.{2}$/, '');
			it.colors.bottom = it.colors.bottom.replace(/.{2}$/, '');

			return it;
		})
	);

	// Write JSON file
	await fs.writeFile(GENERATED_PATH + 'stacks.json', JSON.stringify(stacks));

	console.log('Generated stacks.json');
})();
