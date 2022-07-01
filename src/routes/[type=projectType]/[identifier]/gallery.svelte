<script lang="ts">
	import IconArrowRight from 'virtual:icons/heroicons-outline/arrow-right'
	import Meta from '$components/utils/Meta.svelte'
	import { t } from 'svelte-intl-precompile'
	import { permissions, project, color } from './_store'
	import { Button, TextInput, Modal, Field, FileUpload } from 'omorphia'
	import IconPlus from 'virtual:icons/heroicons-outline/plus'
	import IconPencil from 'virtual:icons/heroicons-outline/pencil'
	import IconTrash from 'virtual:icons/heroicons-outline/trash'
	import IconCheck from 'virtual:icons/heroicons-outline/check'
	import IconX from 'virtual:icons/heroicons-outline/x'
	import { send } from 'omorphia/utils'

	let modifiedItems = {}

	let newItem: { file?: File; name?: string; body?: string } = {}

	async function editItem(item) {
		await send(
			'PATCH',
			`project/${$project.id}/gallery?${new URLSearchParams({
				url: item.url,
				featured: 'false',
				title: item.title || '\u200b',
				description: item.description || '\u200b',
			})}`
		)
		delete modifiedItems[item.url]
		modifiedItems = modifiedItems
	}

	async function createItem() {
		await send<'addGalleryImage'>(
			'POST',
			`project/${$project.id}/gallery`,
			{
				ext: newItem.file.name.split('.').pop(),
				featured: 'false',
				title: newItem.name || '\u200b',
				description: newItem.body || '\u200b',
			},
			{ file: newItem.file }
		)
		$project.gallery = (await send('GET', `project/${$project.id}`)).gallery
	}

	async function deleteItem(item) {
		await send(
			'DELETE',
			`project/${$project.id}/gallery?${new URLSearchParams({
				url: item.url,
			})}`
		)
		$project.gallery = $project.gallery.filter((it) => it.url !== item.url)
	}
</script>

<Meta
	title="{$project.title} - {$t('pages.gallery')}"
	description="View {$project.gallery
		.length} images of the Minecraft {$project.project_type} {$project.title} on Modrinth."
	color={$color}
	image={$project?.icon_url} />

{#if $permissions.editDetails}
	<Modal title={$t('modal.creation.image.title')} bind:data={newItem}>
		<div class="button-group" slot="trigger" let:trigger>
			<Button color="primary" on:click={trigger}>
				<IconPlus />
				{$t('project.gallery.upload')}
			</Button>
		</div>

		<Field label="Image file">
			<FileUpload accept="image/*" constrained bind:file={newItem.file} />
		</Field>
		<Field label={$t('modal.creation.image.fields.title.label')} let:id>
			<TextInput
				bind:value={newItem.name}
				placeholder={$t('modal.creation.image.fields.title.placeholder')}
				{id} />
		</Field>
		<Field label={$t('modal.creation.image.fields.description.label')} let:id>
			<TextInput
				multiline
				placeholder={$t('modal.creation.image.fields.description.placeholder')}
				bind:value={newItem.body}
				{id} />
		</Field>

		<Button
			slot="button"
			color="primary"
			let:close
			on:click={async () => {
				await createItem()
				close()
			}}>
			<IconArrowRight />
			{$t('modal.creation.image.action')}
		</Button>
	</Modal>
{/if}

<div class="gallery">
	{#each $project.gallery.sort((a, b) => new Date(a.created).valueOf() - new Date(b.created).valueOf()) as item (item.url)}
		<div class="card gallery__item">
			<img class="gallery__item__image" src={item.url} alt="" />
			{#if modifiedItems[item.url]}
				<Field label="Title" let:id>
					<TextInput
						placeholder={$t('project.gallery.placeholder.title')}
						bind:value={modifiedItems[item.url].title}
						fill
						{id} />
				</Field>
				<Field label="Description" let:id>
					<TextInput
						multiline
						placeholder={$t('project.gallery.placeholder.description')}
						bind:value={modifiedItems[item.url].description}
						fill
						{id} />
				</Field>
			{:else}
				<h1 class="title-secondary">{item.title}</h1>
				<p class="gallery__item__description">{item.description}</p>
			{/if}
			{#if $permissions.editDetails}
				<div class="button-group">
					{#if modifiedItems[item.url]}
						<Button color="primary" on:click={() => editItem(item)}><IconCheck /> Save</Button>
						<Button
							on:click={() => {
								delete modifiedItems[item.url]
								modifiedItems = modifiedItems
							}}>
							<IconX />
							{$t('generic.actions.cancel')}
						</Button>
					{:else}
						<Button on:click={() => (modifiedItems[item.url] = item)}>
							<IconPencil />
							{$t('generic.actions.edit')}
						</Button>
						<Modal let:trigger size="sm">
							<Button on:click={trigger} slot="trigger">
								<IconTrash />
								{$t('generic.actions.delete')}
							</Button>

							{$t('modal.deletion.image.description')}

							<Button
								color="danger"
								slot="button"
								let:close
								on:click={() => {
									deleteItem(item)
									close()
								}}><IconTrash /> {$t('modal.deletion.image.action')}</Button>
						</Modal>
					{/if}
				</div>
			{/if}
		</div>
	{/each}
</div>

<style lang="postcss">
	.gallery {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
		gap: 1rem;

		&__item {
			&__image {
				margin: -1rem -1rem 0 -1rem;
				height: auto;
				width: calc(100% + 2rem);
				border-radius: var(--rounded-top);
			}
			&__description {
				line-height: normal;
				display: -webkit-box;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
				overflow: hidden;
			}

			.button-group {
				margin-top: auto;
			}
		}
	}
</style>
