import { popups } from '$stores/app';
import { get } from 'svelte/store';
import { send } from '$lib/api';
import { user } from '$stores/server';

export function create(type: 'project' | 'user' | 'version', id: string): void {
	popups.set([
		{
			title: `Create project`,
			body: `New projects are created as drafts, and can be found under your profile page.`,
			type: {
				creation: 'project',
			},
			button: {
				click: async ({ project_type, name, body }) => {
					let slug = name.toLowerCase().replace(/ /g, '-');

					// Test for slug conflict
					try {
						await send('GET', `project/${slug}`);
						// There is a conflict
						slug += (window.crypto || window.msCrypto).getRandomValues(new Uint32Array(3)).join('');
					} catch {
						// Do nothing because there is no slug conflict
					}

					const formData = new FormData();

					formData.append(
						'data',
						JSON.stringify({
							title: name,
							project_type: project_type,
							slug,
							description: body,
							body: `# Placeholder description

This is your new ${project_type}, ${name}. A checklist below is provided to help prepare for release.

### Before submitting for review

- [ ] Upload at least one version
- [ ] Edit project description
- [ ] Update metadata
	- [ ] Select license
	- [ ] Set up environments
	- [ ] Choose categories
	- [ ] Add project and donation links (optional)
- [ ] Add images to gallery (optional)
- [ ] Invite project team members (optional)

> Submissions are normally reviewed within 24 hours, but may take up to 48 hours

Questions? [Join the Modrinth Discord server for support!](/discord)`,
							initial_versions: [],
							team_members: [
								{
									user_id: get(user).id,
									name: get(user).username,
									role: 'Owner',
								},
							],
							categories: [],
							client_side: 'unknown',
							server_side: 'unknown',
							license_id: 'arr',
							is_draft: true,
						})
					);

					await send('POST', 'project', formData);
				},
			},
		},
		...get(popups),
	]);
}
