import { writable } from 'svelte/store';
import { send } from '$lib/api';

let loaded = false;

export const categories = writable([]);
export const loaders = writable([]);
export const gameVersions = writable([]);
export const licenses = writable([]);
export const donationPlatforms = writable([]);
export const projectTypes = writable(['mod', 'modpack']);
export const tagIcons = writable();

categories.subscribe((categories) => {
	tagIcons.set(categories.reduce((a, v) => ({ ...a, [v.name]: v.icon }), {}));
});

export async function updateTags(force = false, fetchOverride): Promise<void> {
	const fetchFunction = fetchOverride || fetch;

	if (!loaded || force) {
		await Promise.all([
			categories.set((await send('GET', 'tag/category', null, { fetch: fetchFunction })) as []),
			loaders.set((await send('GET', 'tag/loader', null, { fetch: fetchFunction })) as []),
			gameVersions.set(
				(await send('GET', 'tag/game_version', null, { fetch: fetchFunction })) as []
			),
			licenses.set((await send('GET', 'tag/license', null, { fetch: fetchFunction })) as []),
			donationPlatforms.set(
				(await send('GET', 'tag/donation_platform', null, { fetch: fetchFunction })) as []
			),
		]);

		loaded = true;
	}
}
