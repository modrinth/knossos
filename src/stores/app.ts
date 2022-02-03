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
	body?: string;
	type?: {
		deletion?: {
			key: string;
		};
		report?: boolean;
		creation?: 'project';
		moderation?: boolean;
	};
	button?: {
		label: string;
		click: ({ body, status, report_type, project_type, name }) => Promise<void>;
	};
	style?: {
		wide?: boolean;
	};
}

export const popups = writable<Popup[]>([]);
