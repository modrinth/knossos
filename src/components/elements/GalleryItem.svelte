<script lang="ts">
	export let url: string;
	export let featured: boolean;
	export let title: string;
	export let description: string;
	export let created: string;
</script>

<div class="card gallery-item">
	<img class="card__banner" src={url} alt="" />
	<h1 class="title">{title}</h1>
	<p class="gallery-item__description">{description}</p>
</div>

<style lang="postcss">
	.gallery-item {
		&__description {
			line-height: normal;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}
	}
</style>
