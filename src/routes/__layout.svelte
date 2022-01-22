<script context="module" lang="ts">
	import { token, user } from '$stores/server';

  import { init, waitLocale } from 'svelte-intl-precompile';
  import { registerAll, availableLocales } from '$locales';

  registerAll();

  /** @type {import('@sveltejs/kit').Load} */
  export async function load({ fetch, session, stuff }) {
		init({
			fallbackLocale: 'en',
			initialLocale: session.acceptedLanguage,
		});
		await waitLocale();

		token.set(session.token);
		user.set(session.user);

		return {};
	}
</script>

<script lang="ts">
	import '$styles/global.postcss';
	import Footer from '$components/layout/Footer.svelte';
	import Main from '$components/layout/Main.svelte';
	import Header from '$components/layout/Header.svelte';
  import { theme, setSystemTheme } from '$stores/app'
	import { onMount } from 'svelte';
  import { navigating, page } from '$app/stores'
	import Popup from '$components/elements/Popup.svelte';
  import NProgress from 'nprogress'
  import { goto } from '$app/navigation'

	onMount(() => {
		if ($page.url.searchParams.get('code')) {
      const url = new URL($page.url)
			url.searchParams.delete('code');
      history.replaceState({}, '', url)
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

  NProgress.configure({
    minimum: 0.1,
    showSpinner: false,
    trickleSpeed: 20,
  })

  $: {
    if ($navigating) {
      NProgress.start();
    }
    if (!$navigating) {
      NProgress.done();
    }
  }
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
