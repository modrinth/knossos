import { writable } from 'svelte/store';
import { browser } from '$app/env';

const initialTheme = browser ? localStorage.getItem('modrinth-theme') : '';
export const theme = writable(initialTheme || 'system');

theme.subscribe((value) => {
	if (browser) {
		localStorage.setItem('modrinth-theme', value);
		if (value === 'system') {
			setSystemTheme();
		} else {
			document.body.className = `${value}-theme`;
		}
	}
});

export function setSystemTheme(): void {
	document.body.className = `${
		window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
	}-theme`;
}

interface Popup {
	title: string;
	body: string;
	type?: {
		deletion?: {
			key: string;
		};
		report?: {
			type: 'project' | 'version' | 'user';
			id: string;
		};
		creation?: 'project';
	};
	button: {
		label: string;
		click: () => Promise<void>;
	};
	style?: {
		wide?: boolean;
	};
}

export const popups = writable<Popup[]>([]);
