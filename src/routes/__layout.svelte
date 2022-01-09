<script context="module" lang="ts">
	import { register, init, waitLocale, getLocaleFromNavigator } from 'svelte-intl-precompile';
	import { updateTags } from '$stores/tags';
	import type { Load } from '@sveltejs/kit';
	import { token, user } from '$stores/server';
	import { browser } from '$app/env';

	register('en', () => import('$locales/en.js'));
	register('en-GB', () => import('$locales/en-GB.js'));

	export async function load({ page, fetch, session, stuff }) {
		init({
			fallbackLocale: 'en',
			initialLocale: session.acceptedLanguage || getLocaleFromNavigator(),
		});
		await waitLocale();

		token.set(session.token);
		user.set(session.user);

		await updateTags(!browser, fetch);

		return {};
	}
</script>

<script lang="ts">
	import '$styles/global.postcss';
	import Footer from '$components/layout/Footer.svelte';
	import Main from '$components/layout/Main.svelte';
	import Header from '$components/layout/Header.svelte';
	import { theme, setSystemTheme } from '$stores/app';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Popup from '$components/elements/Popup.svelte';

	onMount(() => {
		if ($page.query.get('code')) {
			$page.query.delete('code');
			goto(`?${$page.query.toString()}`);
		}

		if ($theme === 'system') {
			setSystemTheme();
		}

		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
			if ($theme === 'system') {
				setSystemTheme();
			}
		});
	});
</script>

<Popup />

<div class="app">
	<div class="app__content">
		<Header />

		<Main>
			<slot />
		</Main>

		<Footer />
	</div>
</div>

<style lang="postcss">
	.app {
		display: flex;
		justify-content: center;
		padding: 1rem;
		height: 100%;

		&__content {
			display: flex;
			flex-direction: column;
			width: 1100px;
			max-width: 100%;
		}
	}
</style>
