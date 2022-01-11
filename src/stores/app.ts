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
	description: string;
	form?: {
		action: (this: HTMLFormElement, event: Event) => void;
		fields: {
			label: string;
			type: string;
			options?: [];
			placeholder: string;
		}[];
	};
}

export const popups = writable<Popup[]>([
	// {
	// 	title: 'Report',
	// 	description:
	// 		'Modding should be safe for everyone, so we take abuse and harassment seriously at Modrinth. Report harmful behavior on the site that violates Modrinth’s [Terms of Service](/legal/terms) and [Project Rules](/legal/rules).',
	// },
]);
