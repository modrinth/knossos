import { get, writable } from 'svelte/store';
import { send } from '$lib/api';
import { token, user } from '$stores/server';

export const loaded = writable(false);

export const following = writable([]);
export const notifications = writable([]);

export async function updateSelf(force = false): Promise<void> {
	if ((!get(loaded) || force) && get(token)) {
		const userValue = get(user);
		await Promise.all([
			following.set(
				((await send('GET', `user/${userValue.id}/follows`)) as []).sort((a, b) =>
					a.title > b.title ? 1 : -1
				)
			),
			notifications.set((await send('GET', `user/${userValue.id}/notifications`)) as []),
		]);

		loaded.set(true);
	}
}
