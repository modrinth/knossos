import adapter from '@sveltejs/adapter-cloudflare'
import path from 'path'
import { preprocess } from 'omorphia/config/svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [preprocess],

	kit: {
		adapter: adapter(),
		prerender: {
			enabled: false,
		},
		alias: {
			$assets: path.resolve('./src/assets'),
			$components: path.resolve('./src/components'),
			$utils: path.resolve('./src/utils'),
			$stores: path.resolve('./src/stores'),
			$styles: path.resolve('./src/styles'),
			$generated: path.resolve('./generated'),
		},
	},
}

export default config
