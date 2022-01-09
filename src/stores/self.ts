import { get, writable } from 'svelte/store';
import { send } from '$lib/api';
import { token, user } from '$stores/server';

let loaded = false;

export const follows = writable([]);
export const notifications = writable([]);

export async function updateSelf(force = false): Promise<void> {
	if ((!loaded || force) && get(token)) {
		const userValue = get(user);
		await Promise.all([
			follows.set((await send('GET', `user/${userValue.id}/follows`)) as []),
			notifications.set((await send('GET', `user/${userValue.id}/follows`)) as []),
		]);

		loaded = true;
	}
}
