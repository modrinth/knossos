<script lang="ts">
	import IconArrowRight from 'virtual:icons/heroicons-outline/arrow-right'
	import { Modal, Button, TextInput, Field, Select, Chips } from 'omorphia'
	import { t } from 'svelte-intl-precompile'
	import IconFlag from 'virtual:icons/heroicons-outline/flag'
	import { markdown, send } from 'omorphia/utils'
	import { licenses, projectTypes } from '$generated/tags.json'
	import { user } from '$stores/account'
	import { goto } from '$app/navigation'

	export let open = false

	let data: { project_type: string; name: string; summary: string }

	async function createProject() {
		let slug = data.name.toLowerCase().replace(/ /g, '-')
		// Test for slug conflict
		try {
			await send('GET', `project/${slug}`)
			// Doesn't 404, meaning there is a conflict, so add random suffix
			slug += '-' + window.crypto.getRandomValues(new Uint16Array(1)).join('')
		} catch {
			// Do nothing because there is no slug conflict
		}
		const formData = new FormData()
		formData.append(
			'data',
			JSON.stringify({
				title: data.name,
				project_type: data.project_type,
				slug,
				description: data.summary,
				body: `# Placeholder description
This is your new ${data.project_type}, ${data.name}. A checklist below is provided to help prepare for release.

### Before submitting for review
- [ ] Upload at least one version
- [ ] Edit project description
- [ ] Update metadata
  - [ ] Select license
  - [ ] Set up environments
  - [ ] Choose categories
  - [ ] Add source, wiki, Discord and donation links (optional)
- [ ] Add images to gallery (optional)
- [ ] Invite project team members (optional)

> Submissions are normally reviewed within 24 hours, but may take up to 48 hours

Questions? [Join the Modrinth Discord for support!](/discord)`,
				initial_versions: [],
				team_members: [
					{
						user_id: $user.id,
						name: $user.username,
						role: 'Owner',
					},
				],
				categories: [],
				client_side: 'unknown',
				server_side: 'unknown',
				license_id: licenses.map((it) => it.short).includes('arr') ? 'arr' : licenses[0].short,
				is_draft: true,
			})
		)
		await send('POST', 'project', formData)
		open = false
		await goto(`/${data.project_type}/${slug}`)
	}
</script>

<Modal
	title={$t(`modal.creation.project.title`)}
	bind:open
	bind:data
	defaultData={{ project_type: 'mod', name: '', summary: '' }}>
	<svelte:fragment slot="trigger" let:trigger>
		<slot {trigger} />
	</svelte:fragment>

	{@html markdown($t(`modal.creation.project.description`))}

	<Field label={$t('modal.creation.project.fields.project_type.label')}>
		<Chips
			bind:value={data.project_type}
			options={projectTypes.map((type) => ({
				label: $t(`project.types.${type}.singular`),
				value: type,
			}))} />
	</Field>

	<Field label={$t('modal.creation.project.fields.name.label')} let:id>
		<TextInput
			placeholder={$t('modal.creation.project.fields.name.placeholder')}
			bind:value={data.name}
			{id} />
	</Field>

	<Field
		label={$t('modal.creation.project.fields.summary.label')}
		helper={$t('modal.creation.project.fields.summary.helper')}
		let:id>
		<TextInput
			placeholder={$t('modal.creation.project.fields.summary.placeholder')}
			bind:value={data.summary}
			multiline
			{id} />
	</Field>

	<Button color="primary" slot="button" on:click={createProject}>
		<IconArrowRight />
		{$t(`modal.creation.project.action`)}
	</Button>
</Modal>
