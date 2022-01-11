<script lang="ts">
	import { t } from 'svelte-intl-precompile';
	import LogoWordmark from '$assets/images/logo/wordmark.svg';
	import LogoIcon from '$assets/images/logo/icon.svg';
	import Nav from '$components/elements/Nav.svelte';
	import Button from '$components/elements/Button.svelte';
	import IconBell from 'virtual:icons/fa-regular/bell';
	import IconGitHub from 'virtual:icons/simple-icons/github';
	import { browser } from '$app/env';
	import { user } from '$stores/server';
	import Avatar from '$components/elements/Avatar.svelte';
	import MobileNav from '$components/elements/MobileNav.svelte';
	import { projectTypes } from '$stores/tags';
	import { setContext } from 'svelte';

	let screenWidth = 1000;

	let navItems = $projectTypes.map((type) => ({
		label: $t(`project.types.${type}.plural`),
		href: `/${$t(`project.types.${type}.plural`, { locale: 'en' }).toLowerCase()}`,
	}));
	setContext('navItems', navItems);
</script>

<svelte:window bind:innerWidth={screenWidth} />

<header class="header">
	{#if screenWidth > 500}
		<a href="/" aria-label="Modrinth Home">
			<LogoWordmark height={24} />
		</a>
		<Nav level={0} links={navItems} />
	{:else}
		<MobileNav />
		<a href="/" aria-label="Modrinth Home">
			<LogoIcon height={36} />
		</a>
	{/if}
	<div class="header__actions">
		{#if $user}
			<Button href="/notifications" color="transparent" title="Notifications" icon={IconBell} />
			<Avatar />
		{:else}
			<Button
				href={browser ? `${import.meta.env.VITE_API_URL}auth/init?url=${window.location.href}` : ''}
				color="brand"
				label="Sign in with GitHub"
				icon={IconGitHub}
			/>
		{/if}
	</div>
</header>

<style lang="postcss">
	.header {
		display: flex;
		align-items: center;
		grid-gap: 1rem;

		&__actions {
			display: flex;
			margin-left: auto;
			grid-gap: 0.5rem;
		}
	}
</style>
