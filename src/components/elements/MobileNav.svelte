<script lang="ts">
	import IconMenu from 'virtual:icons/lucide/menu';
	import Button from '$components/elements/Button.svelte';
	import FloatingMenu from '$components/elements/FloatingMenu.svelte';
	import { clickOutside } from 'svelte-use-click-outside';
	import { getContext } from 'svelte';

	let isOpen = false;
</script>

<div
	class="mobile-nav"
	use:clickOutside={() => {
		isOpen = false;
	}}
>
	<Button
		on:click={() => {
			isOpen = !isOpen;
		}}
		color="transparent"
		title="Navigation"
		icon={IconMenu}
		iconSize={24}
	/>
	<FloatingMenu display={isOpen} align="left" items={getContext('navItems')} />
</div>

<style lang="postcss">
	.mobile-nav {
		position: relative;
	}
</style>
