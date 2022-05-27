<script lang="ts">
	import Meta from '$components/utils/Meta.svelte'
	import { t } from 'svelte-intl-precompile'
	import { permissions, project, color } from './_store'
	import { Button, TextInput } from 'omorphia'
	import IconPlus from 'virtual:icons/heroicons-outline/plus'
	import IconPencil from 'virtual:icons/heroicons-outline/pencil'
	import IconTrash from 'virtual:icons/heroicons-outline/trash'
	import IconCheck from 'virtual:icons/heroicons-outline/check'
	import IconX from 'virtual:icons/heroicons-outline/x'
	import { send } from '$lib/api'
	import { popups } from '$stores/app'

	let modifiedItems = {}

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

	function createItem() {
		$popups = [
			{
				title: `Upload gallery image`,
				body: ``,
				type: {
					creation: 'galleryItem',
				},
				button: {
					click: async ({ name, body, file }) => {
						await send(
							'POST',
							`project/${$project.id}/gallery?${new URLSearchParams({
								ext: file.name.split('.').pop(),
								featured: 'false',
								title: name || '\u200b',
								description: body || '\u200b',
							})}`,
							file
						)
						$project.gallery = (await send('GET', `project/${$project.id}`)).gallery
					},
					label: 'Upload image',
				},
			},
			...$popups,
		]
	}

	async function deleteItem(item) {
		if (window.confirm('Are you sure you want to delete this gallery image?')) {
			await send(
				'DELETE',
				`project/${$project.id}/gallery?${new URLSearchParams({
					url: item.url,
				})}`
			)
			$project.gallery = $project.gallery.filter((it) => it.url !== item.url)
		}
	}
</script>

<Meta
	title="{$project.title} - {$t('pages.gallery')}"
	description="View {$project.gallery
		.length} images of the Minecraft {$project.project_type} {$project.title} on Modrinth."
	color={$color}
	image={$project?.icon_url} />

{#if $permissions.data.editDetails}
	<div class="button-group">
		<Button color="primary" on:click={createItem}><IconPlus /> Upload image</Button>
	</div>
{/if}

<div class="gallery">
	{#each $project.gallery.filter((item, index) => $project.gallery
				.map((it) => it.url)
				.indexOf(item.url) === index) as item (item.url)}
		<div class="card gallery__item">
			<img class="gallery__item__image" src={item.url} alt="" />
			{#if modifiedItems[item.url]}
				<TextInput placeholder="Enter title..." bind:value={modifiedItems[item.url].title} />
				<TextInput
					multiline
					placeholder="Enter description..."
					bind:value={modifiedItems[item.url].description} />
			{:else}
				<h1 class="title">{item.title}</h1>
				<p class="gallery__item__description">{item.description}</p>
			{/if}
			{#if $permissions.data.editDetails}
				<div class="button-group">
					{#if modifiedItems[item.url]}
						<Button color="primary" on:click={() => editItem(item)}><IconCheck /> Save</Button>
						<Button
							on:click={() => {
								delete modifiedItems[item.url]
								modifiedItems = modifiedItems
							}}>
							<IconX /> Cancel
						</Button>
					{:else}
						<Button on:click={() => (modifiedItems[item.url] = item)}>
							<IconPencil /> Edit
						</Button>
						<Button on:click={() => deleteItem(item)}>
							<IconTrash /> Delete
						</Button>
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
		grid-gap: 1rem;

		&__item {
			&__image {
				margin: -1rem -1rem 0 -1rem;
				height: auto;
				width: calc(100% + 2rem);
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
