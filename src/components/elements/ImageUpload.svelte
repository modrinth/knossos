<script lang="ts">
	import FileDropzone from '$components/elements/FileDropzone.svelte'
	import { t } from 'svelte-intl-precompile'
	import { Button } from 'omorphia'
	import IconTrash from 'virtual:icons/heroicons-outline/trash'

	export let file: File | undefined
	let files = []
	let image: HTMLImageElement
	let reader

	$: if (files[0]) {
		file = files[0]
		if (image) {
			reader = new FileReader()
			reader.addEventListener('load', function () {
				image.setAttribute('src', reader.result.toString())
			})
			reader.readAsDataURL(file)
		}
	}
</script>

<div class="image-upload">
	{#if !file}
		<FileDropzone accept="image/*" bind:files />
	{:else}
		<img bind:this={image} src="" alt={file.name} class="image-upload__preview" />
		<Button
			on:click={() => {
				files = []
				file = undefined
			}}><IconTrash /> {$t('images.replace')}</Button>
	{/if}
</div>

<style lang="postcss">
	.image-upload {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1rem;

		&__preview {
			border-radius: var(--rounded-sm);
			height: 12rem;
		}
	}
</style>
