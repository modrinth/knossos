import { writable } from 'svelte/store'
import { browser } from '$app/env'

export const theme = writable('system')
export const systemTheme = writable('light')

theme.subscribe((value) => {
	if (browser) {
		document.cookie = `modrinth-theme=${value}; expires=Mod, 18 Jan 2038 02:14:08 GMT; SameSite=Strict; Secure; path=/`
		if (value === 'system') {
			setSystemTheme()
		}
	}
})

export function setSystemTheme(): void {
	systemTheme.set(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
}
