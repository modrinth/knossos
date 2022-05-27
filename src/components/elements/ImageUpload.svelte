<script lang="ts">
	import FileDropzone from '$components/elements/FileDropzone.svelte'
	import { onMount } from 'svelte'
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
			}}><IconTrash /> Replace image</Button>
	{/if}
</div>

<style lang="postcss">
	.image-upload {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		grid-gap: 1rem;

		&__preview {
			border-radius: var(--rounded-sm);
			height: 12rem;
		}
	}
</style>
