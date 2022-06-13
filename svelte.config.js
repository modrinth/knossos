import adapter from './src/adapter/index.js'
import path from 'path'
import precompileIntl from 'svelte-intl-precompile/sveltekit-plugin'
import Generator from 'omorphia/plugins/generator'
import { preprocess, plugins } from 'omorphia/config/svelte.config'

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
				}),
				precompileIntl('locales'),
			],
			server: {
				fs: {
					allow: ['generated'],
				},
				hmr: process.env.GITPOD_WORKSPACE_URL ? {
					clientPort: 443,
					protocol: "wss",
				} : true
			},
		},
	},
}

export default config
