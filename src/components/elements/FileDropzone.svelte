<script lang="ts">
	import IconUpload from 'virtual:icons/heroicons-outline/upload'
	import { t } from 'svelte-intl-precompile'

	export let multiple = false
	export let accept: string

	export let files = []
	let inputElement

	function openFileDialog() {
		if (inputElement) {
			inputElement.click()
		}
	}

	function dropFiles(e) {
		const droppedFiles = e.dataTransfer.files

		if (droppedFiles) {
			if (!multiple) {
				files = []
				inputElement.value = ''
			}

			;[...droppedFiles].forEach((file, index) => {
				if (multiple || index === 0) {
					files.push(file)
				}
			})
		}
	}

	function onInputChange(event) {
		files = [...event.target.files]
	}
</script>

<div
	class="file-dropzone"
	on:drop|preventDefault={dropFiles}
	on:dragover|preventDefault
	on:click={openFileDialog}>
	<IconUpload />
	{$t('images.how_to')}
	<input
		type="file"
		{multiple}
		{accept}
		style:display="none"
		bind:this={inputElement}
		on:change={onInputChange} />
</div>

<style lang="postcss">
	.file-dropzone {
		display: flex;
		width: 100%;
		padding: 1.5rem 1rem;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		background-color: var(--color-button-bg);
		border-radius: var(--rounded-sm);
		border: dashed 0.3rem var(--color-text-lightest);
		cursor: pointer;
		color: var(--color-text-light);
	}
</style>
