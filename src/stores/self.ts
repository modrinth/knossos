// noinspection JSVoidFunctionReturnValueUsed

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
				((await send('GET', `user/${userValue.id}/follows`)) as Project[]).sort((a, b) =>
					a.title > b.title ? 1 : -1
				)
			),
			notifications.set(
				((await send('GET', `user/${userValue.id}/notifications`)) as Notification[]).map(
					(notif) => {
						if (notif.type === null && notif.title.startsWith('A mod you followed')) {
							// Migrate old (Labrinth v1) notification format
							const name = notif.text.match(/Mod (.*) has been/)[1];
							return {
								...notif,
								title: `**${name}** has been updated`,
								type: 'project_update',
							};
						} else {
							return notif;
						}
					}
				)
			),
		]);

		loaded.set(true);
	}
}
