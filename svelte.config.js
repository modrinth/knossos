import adapter from '@sveltejs/adapter-cloudflare'
import path from 'path'
import precompileIntl from 'svelte-intl-precompile/sveltekit-plugin'
import { Generator } from 'omorphia/plugins'
import { preprocess, plugins } from 'omorphia/config/svelte'

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
		vite: {
			plugins: [
				...plugins,
				Generator({
					landingPage: true,
					projectColors: true,
					gameVersions: true,
					tags: true,
					openapi: true,
				}),
				precompileIntl('locales', {
					exclude: /crowdin\.yml/,
				}),
			],
			// optimizeDeps: {
			// 	exclude: ['omorphia'], // Allows using omorphia when linked locally `pnpm link`
			// },
			server: {
				fs: {
					allow: ['generated'],
				},
			},
		},
	},
}

export default config
