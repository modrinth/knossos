import { get, writable } from 'svelte/store'
import { send } from 'omorphia/utils'

export const loaded = writable(false)

export const token = writable('')
export const user = writable<User | undefined>()

export const following = writable<Project[]>([])
export const notifications = writable<schemas['Notification'][]>([])

export async function updateSelf(force = false): Promise<void> {
	if ((!get(loaded) || force) && get(token)) {
		const userValue = get(user) as User

		const [follows, notifs] = await Promise.all([
			send<'getFollowedProjects'>('GET', `user/${userValue.id}/follows`),
			send<'getNotifications'>('GET', `user/${userValue.id}/notifications`),
		])

		following.set(follows.sort((a, b) => (a.title! > b.title! ? 1 : -1)))

		notifications.set(
			notifs.map((notif) => {
				if (notif.type === null && notif.title.startsWith('A mod you followed')) {
					// Migrate old (Labrinth v1) notification format
					const name = notif.text.match(/Mod (.*) has been/)?.[1]
					return {
						...notif,
						title: `**${name}** has been updated`,
						type: 'project_update',
					}
				} else {
					return notif
				}
			}) as schemas['Notification'][]
		)

		loaded.set(true)
	}
}
