import { get } from 'svelte/store'
import { send } from 'omorphia/utils'
import { user } from '$stores/account'
import { licenses } from '$generated/tags.json'

export function create(): void {
	// 	popups.set([
	// 		{
	// 			title: `Create project`,
	// 			body: `New projects are created as drafts, and can be found under your profile page.`,
	// 			type: {
	// 				creation: 'project',
	// 			},
	// 			button: {
	// 				click: async ({ project_type, name, body }) => {
	// 					let slug = name.toLowerCase().replace(/ /g, '-')
	// 					// Test for slug conflict
	// 					try {
	// 						await send('GET', `project/${slug}`)
	// 						// Doesn't 404, meaning there is a conflict, so add random suffix
	// 						slug += '-' + window.crypto.getRandomValues(new Uint16Array(1)).join('')
	// 					} catch {
	// 						// Do nothing because there is no slug conflict
	// 					}
	// 					const formData = new FormData()
	// 					formData.append(
	// 						'data',
	// 						JSON.stringify({
	// 							title: name,
	// 							project_type: project_type,
	// 							slug,
	// 							description: body,
	// 							body: `# Placeholder description
	// This is your new ${project_type}, ${name}. A checklist below is provided to help prepare for release.
	// ### Before submitting for review
	// - [ ] Upload at least one version
	// - [ ] Edit project description
	// - [ ] Update metadata
	// 	- [ ] Select license
	// 	- [ ] Set up environments
	// 	- [ ] Choose categories
	// 	- [ ] Add project and donation links (optional)
	// - [ ] Add images to gallery (optional)
	// - [ ] Invite project team members (optional)
	// > Submissions are normally reviewed within 24 hours, but may take up to 48 hours
	// Questions? [Join the Modrinth Discord server for support!](/discord)`,
	// 							initial_versions: [],
	// 							team_members: [
	// 								{
	// 									user_id: get(user).id,
	// 									name: get(user).username,
	// 									role: 'Owner',
	// 								},
	// 							],
	// 							categories: [],
	// 							client_side: 'unknown',
	// 							server_side: 'unknown',
	// 							license_id: licenses.map((it) => it.short).includes('arr')
	// 								? 'arr'
	// 								: licenses[0].short,
	// 							is_draft: true,
	// 						})
	// 					)
	// 					const project = await send('POST', 'project', new FormData())
	// 					const search = await send('GET', `search`, {
	// 						offset: 1,
	// 					})
	// 					const sodium = await send('GET', `project/${'sodium'}`)
	// 					await send(
	// 						'POST',
	// 						`project/${'mudmod'}/gallery`,
	// 						{
	// 							ext: 'png',
	// 							featured: false,
	// 							title: 'Cool image',
	// 							description: 'More info about cool image',
	// 						},
	// 						{
	// 							file: new File([''], 'image.png'),
	// 						}
	// 					)
	// 				},
	// 			},
	// 		},
	// 		...get(popups),
	// 	])
}
