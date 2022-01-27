<script lang="ts">
	import Meta from '$components/utils/Meta.svelte';
	import { t } from 'svelte-intl-precompile';
  import { project } from "./_store";
</script>

<Meta title={`${$t('pages.gallery')} - ${$project.title}`} description={$project.description} />

<div class="gallery">
	{#each $project.gallery as item}
    <div class="card gallery--item">
      <img class="card__banner" src={item.url} alt="" />
      <h1 class="title">{item.title}</h1>
      <p class="gallery-item__description">{item.description}</p>
    </div>
	{/each}
</div>

<style lang="postcss">
	.gallery {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
		grid-gap: 1rem;

    &--item {
      &__description {
        line-height: normal;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
	}
</style>
