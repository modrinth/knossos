/// <reference types="@sveltejs/kit" />
/// <reference types="unplugin-icons/types/svelte" />

declare module '$assets/images/*'
declare module '$locales'
declare module '$generated/*'

declare module '$assets/images/*.svg' {
	export { SvelteComponentDev as default } from 'svelte/internal'
}
