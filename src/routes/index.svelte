<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import Meta from '$components/utils/Meta.svelte';
	import Form from '$components/elements/Form.svelte';

	let fields = [
		{
			key: 'username',
			type: 'text',
      placeholder: 'Username',
		},
		{
			key: 'type',
			type: 'select',
			label: 'Type',
			options: [
				{
					value: 'admin',
					label: 'Admin',
				},
				{
					value: 'user',
					label: 'User',
				},
			],
		},
		{
			key: 'category',
			type: 'checkboxes',
			label: 'Categories',
			options: [
				{
					value: 'news',
					label: 'News',
				},
				{
					value: 'events',
					label: 'Events',
				},
				{
					value: 'products',
					label: 'Products',
				},
			],
		},
	];
</script>

<Meta />

<div class="search-page">
	<div class="card">
		<Form {fields} route="/test" />
	</div>
</div>

<style lang="postcss">
	.search-page {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 15rem;
	}
</style>
