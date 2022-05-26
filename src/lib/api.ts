import { token as tokenStore } from '$stores/server';
import { get, writable } from 'svelte/store';

interface Overrides {
	token?: string;
	fetch?: any;
}

export const fetching = writable<number>(0);

export async function send(
	method: string,
	route: string,
	data: any = null,
	overrides: Overrides = { token: '', fetch: null }
): Promise<unknown> {
	fetching.set(get(fetching) + 1);

	const options = {
		method,
		headers: {},
	};

	const token = get(tokenStore) || overrides.token;
	if (token) {
		options.headers['Authorization'] = token;
	}

	if (data?.type && data?.lastModified && data?.size) {
		// Data is a File
		options.headers['Content-Type'] = data.type;
	} else if (data && !data.entries) {
		// Data is an object that is not a FormData
		options.headers['Content-Type'] = 'application/json';
		(options as any).body = JSON.stringify(data);
	}

	const response = await (overrides.fetch || fetch)(import.meta.env.VITE_API_URL + route, options);

	fetching.set(get(fetching) - 1);

	if (!response.ok) {
		throw response;
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
