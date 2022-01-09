import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-vercel';
import svelteSvg from 'vite-plugin-svelte-svg';
import path from 'path';
import precompileIntl from 'svelte-intl-precompile/sveltekit-plugin.js';
import Icons from 'unplugin-icons/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		preprocess({
			babel: {
				presets: [
					[
						'@babel/preset-env',
						{
							loose: true,
							modules: false,
							targets: {
								esmodules: true,
							},
						},
					],
				],
			},
			postcss: true,
		}),
	],

	kit: {
		target: '#svelte',
		adapter: adapter(),
		vite: {
			plugins: [
				svelteSvg({
					svgoConfig: {
						multipass: true,
					},
				}),
				precompileIntl('locales'),
				Icons({
					compiler: 'svelte',
				}),
			],
			resolve: {
				alias: {
					$assets: path.resolve('./src/assets'),
					$components: path.resolve('./src/components'),
					$lib: path.resolve('./src/lib'),
					$stores: path.resolve('./src/stores'),
					$styles: path.resolve('./src/styles'),
				},
			},
		},
	},
};

export default config;
