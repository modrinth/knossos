import { sveltekit } from '@sveltejs/kit/vite'
import precompileIntl from 'svelte-intl-precompile/sveltekit-plugin'
import { Generator } from 'omorphia/plugins'
import { plugins } from 'omorphia/config/svelte'

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		sveltekit(),
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
}

export default config
