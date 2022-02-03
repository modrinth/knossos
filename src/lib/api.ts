import { token as tokenStore } from '$stores/server';
import { get } from 'svelte/store';

interface Overrides {
	token?: string;
	fetch?: any;
}

export async function send(
	method: string,
	route: string,
	data: unknown = null,
	overrides: Overrides = { token: '', fetch: null }
): Promise<unknown> {
	const token = get(tokenStore);

	const fetchFunction = overrides.fetch || fetch;

	const response = await fetchFunction(import.meta.env.VITE_API_URL + route, {
		method,
		headers: {
			...(data ? (data instanceof FormData ? {} : { 'Content-Type': 'application/json' }) : {}),
			...(token || overrides.token ? { Authorization: token || overrides.token } : {}),
		},
		...(data ? (data instanceof FormData ? { body: data } : { body: JSON.stringify(data) }) : {}),
	});

	if (!response.ok) {
		throw new Error('Error when communicating with API');
	}

	let parsed = {};
	if (response.status !== 204) {
		try {
			parsed = await response.json();
		} catch {
			console.error('Could not parse API response');
		}
	}

	return parsed;
}
