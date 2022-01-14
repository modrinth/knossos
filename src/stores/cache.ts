import { browser } from '$app/env';
import { writable } from 'svelte/store';

const existingCache = browser ? JSON.parse(localStorage.getItem('modrinth-cache')) : '';
export const cache = writable(existingCache || { projectColors: {} });

cache.subscribe((value) => {
	if (browser) {
		localStorage.setItem('modrinth-cache', JSON.stringify(value));
	}
});
