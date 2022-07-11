<script context="module" lang="ts">
	export const load: import('./__types/index').Load = async ({ stuff }) => {
		return {
			props: {
				...stuff,
			},
		}
	}
</script>

<script lang="ts">
	import { Button, Chips } from 'omorphia'
	import { markdown } from 'omorphia/utils'
	import Meta from '$components/utils/Meta.svelte'
	import { t } from 'svelte-intl-precompile'
	import IconPencil from 'virtual:icons/heroicons-outline/pencil'
	import IconX from 'virtual:icons/heroicons-outline/x'
	import IconTrash from 'virtual:icons/heroicons-outline/trash'
	import IconSave from 'virtual:icons/lucide/save'
	import { permissions, color, members } from './_store'
	import autosize from 'svelte-autosize'
	import { onDestroy, onMount } from 'svelte'
	import { send } from 'omorphia/utils'
	import { browser } from '$app/env'

	export let project: schemas['Project']

	let isEditing = false
	let viewMode: 'editor' | 'preview' = 'editor'

	let modifiedBody = project.body

	let dirty: boolean
	$: dirty = project.body !== modifiedBody

	function preventLeave(e) {
		if (dirty && isEditing) {
			e.preventDefault()
			e.returnValue = ''
		}
	}

	onMount(() => {
		if (browser) window.addEventListener('beforeunload', preventLeave)
	})

	onDestroy(() => {
		if (browser) window.removeEventListener('beforeunload', preventLeave)
	})

	async function save(): Promise<void> {
		if (dirty) {
			await send('PATCH', `project/${project.id}`, { body: modifiedBody })
			project.body = modifiedBody
		}
		isEditing = false
	}
</script>

<Meta
	title="{project.title} - Minecraft {$t(`project.types.${project.project_type}.singular`)}"
	description="{project.description} - Download the Minecraft {project.project_type} {project.title} by {$members.find(
		(it) => it.role === 'Owner'
	).user.username} on Modrinth."
	color={$color}
	image={project?.icon_url} />

<div class="card project-body card--gap-none" style:--padding="0">
	<div class="card__overlay card__overlay--row">
		{#if $permissions.editBody}
			{#if isEditing}
				{#if dirty}
					<Button
						on:click={() => {
							modifiedBody = project.body
							isEditing = false
						}}>
						<IconTrash />
						{$t('generic.actions.discard')}
					</Button>
					<Button color="primary" on:click={save}>
						<IconSave />
						{$t('generic.actions.save')}
					</Button>
				{:else}
					<Button on:click={() => (isEditing = false)}>
						<IconX />
						{$t('generic.actions.cancel')}
					</Button>
				{/if}
			{:else}
				<Button
					color="primary-light"
					on:click={() => {
						viewMode = 'editor'
						isEditing = true
					}}>
					<IconPencil />
					{$t('generic.actions.edit')}
				</Button>
			{/if}
		{/if}
	</div>
	{#if isEditing}
		<div class="project-body__toolbar">
			<Chips
				bind:value={viewMode}
				options={[
					{
						label: $t('project.body.editor'),
						value: 'editor',
					},
					{
						label: $t('generic.actions.preview'),
						value: 'preview',
					},
				]}
				neverEmpty />
		</div>
		{#if viewMode === 'editor'}
			<textarea
				class="project-body__editor"
				placeholder={$t('project.body.placeholder')}
				bind:value={modifiedBody}
				use:autosize />
		{:else}
			<div class="project-body__text markdown">
				{@html markdown(modifiedBody)}
			</div>
		{/if}
	{:else}
		<div class="project-body__text markdown">
			{#if project.body}
				{@html markdown(project.body)}
			{:else}
				<p class="project-body__text__placeholder">{$t('project.body.empty')}</p>
			{/if}
		</div>
	{/if}
</div>

<style lang="postcss">
	.project-body {
		min-height: 4rem;

		&__text {
			padding: 1.5rem;

			&__placeholder {
				color: var(--color-text-lightest);
			}

			position: relative;
		}

		&__toolbar {
			padding: 1rem;
		}

		&__editor {
			border: none;
			padding: 1rem;
			background-color: var(--color-input-text-light);
			border-radius: var(--rounded-bottom);
		}
	}
</style>
