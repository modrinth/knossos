<script lang="ts">
	import GalleryItem from '$components/elements/GalleryItem.svelte';
	import Meta from '$components/utils/Meta.svelte';
	import { getContext } from 'svelte';
	import { t } from 'svelte-intl-precompile';

	let project: Project = getContext('project');
</script>

<Meta title={`${$t('pages.gallery')} -  ${project.title}`} description={project.description} />

<div class="gallery">
	{#each project.gallery as item}
		<GalleryItem {...item} />
	{/each}
</div>

<style lang="postcss">
	.gallery {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
		grid-gap: 1rem;
	}
</style>
