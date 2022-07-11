<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	/** Accepted file types. Can be only a prefix, ex: `application/` */
	export let accept: string[] = []

	const dispatch = createEventDispatcher()
	let dropArea: HTMLDivElement

	function allowDrag(event: DragEvent) {
		const file = event.dataTransfer?.items[0]
		// Checks if file is a JAR, ZIP, or Modpack
		if (
			file &&
			accept.reduce((acc, t) => acc || file.type.startsWith(t) || file.type === t, false)
		) {
			// Adds file dropping indicator
			event.dataTransfer!.dropEffect = 'copy'
			event.preventDefault()
		}
	}
</script>

<svelte:body on:dragenter={() => (dropArea.style.visibility = 'visible')} />

<div
	class="drop-area"
	bind:this={dropArea}
	on:drop|preventDefault={(event) => {
		dispatch('drop', {
			dataTransfer: event.dataTransfer,
		})
		dropArea.style.visibility = 'hidden'
	}}
	on:dragenter={allowDrag}
	on:dragover={allowDrag}
	on:dragleave={() => (dropArea.style.visibility = 'hidden')} />

<style lang="postcss">
	.drop-area {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 10;
		visibility: hidden;
		background-color: hsla(0, 0%, 0%, 0.5);
		transition: visibility 0.2s ease-in-out, background-color 0.1s ease-in-out;
		display: flex;
		padding: 2rem;

		&::before {
			--indent: 1rem;
			content: ' ';
			position: relative;
			top: var(--indent);
			left: var(--indent);
			width: calc(100% - (2 * var(--indent)));
			height: calc(100% - (2 * var(--indent)));
			border-radius: 1rem;
			border: 0.25rem dashed var(--color-button-bg);
		}
	}
</style>
