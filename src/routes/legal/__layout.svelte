<script lang="ts">
	import { NavRow } from 'omorphia'
</script>

<div class="single-layout">
	<div class="card">
		<NavRow
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
			level={1} />
	</div>
	<div class="card markdown">
		<slot />
	</div>
</div>
