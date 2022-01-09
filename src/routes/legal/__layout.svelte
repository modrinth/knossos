<script lang="ts">
	import Nav from '$components/elements/Nav.svelte';
</script>

<div class="legal">
	<div class="card">
		<Nav
			links={[
				{
					label: 'Terms and conditions',
					href: '/terms',
				},
				{
					label: 'Privacy policy',
					href: '/privacy',
				},
				{
					label: 'Project rules',
					href: '/rules',
				},
			]}
			level={1}
		/>
	</div>
	<div class="card card--text">
		<slot />
	</div>
</div>

<style lang="postcss">
	.legal {
		display: flex;
		flex-direction: column;
		grid-gap: 1rem;
		max-width: 800px;
	}
</style>
