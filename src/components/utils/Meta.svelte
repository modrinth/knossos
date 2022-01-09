<script lang="ts">
	export let title = 'Modrinth';
	export let description =
		'Modrinth is an open-source mod distribution platform. Modrinth is modern, easy to use, and built for modders. Modrinth currently supports Minecraft, including Forge and Fabric mod loaders.';
	export let indexable = true;
	export let image = 'https://cdn.modrinth.com/modrinth.png';
</script>

<svelte:head>
	<title>{title === 'Modrinth' ? title : title + ' - Modrinth'}</title>
	<meta name="og:title" content={title} />
	<meta name="apple-mobile-web-app-title" content={title} />
	<meta name="og:description" content={description} />
	<meta name="description" content={description} />
	<meta name="og:image" content={image} />
	<meta name="robots" content={indexable ? 'all' : 'noindex'} />
</svelte:head>
