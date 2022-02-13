<script context="module" lang="ts">
	import { token, user } from '$stores/server';
  import { theme } from '$stores/server'

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
    if (session.theme) theme.set(session.theme)

		return {};
	}
</script>

<script lang="ts">
	import Footer from '$components/layout/Footer.svelte';
	import Header from '$components/layout/Header.svelte';
  import { setSystemTheme, systemTheme } from '$stores/server'
	import { onMount } from 'svelte';
  import { navigating, page } from '$app/stores'
	import Popup from '$components/elements/Popup.svelte';
  import NProgress from 'nprogress'
  import { updateSelf } from '$stores/self'
  import { fetching } from '$lib/api'
  import { browser } from '$app/env'
  import { debounce } from 'throttle-debounce'
  import MobileBar from "$components/layout/MobileBar.svelte";

	onMount(() => {
		if ($page.url.searchParams.get('code')) {
      const url = new URL($page.url)
			url.searchParams.delete('code');
      history.replaceState({}, '', url)
    }

		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
			if ($theme === 'system') setSystemTheme();
		});

    updateSelf()
	});

  NProgress.configure({
    minimum: 0.1,
    showSpinner: false,
    trickleSpeed: 20,
    parent: '#app',
  })

  const progressStart = debounce(400, true, () => NProgress.start())
  const progressDone = debounce(400, false, () => NProgress.done())

  $: if (browser) {
    if (($fetching)) {
      progressStart();
    }
    if (!$fetching) {
      progressDone();
    }
  }
</script>

<svelte:head>
  <script defer async src="https://media.ethicalads.io/media/client/ethicalads.min.js" type="text/javascript" />
  <style lang="postcss">
    @import "../styles/global.postcss";
  </style>
</svelte:head>

<div class="{$theme === 'system' ? $systemTheme : $theme}-theme" id="app">
  <Popup />

  <div class="app__content">
    <Header />

		<main class="main">
			<slot />
		</main>

		<Footer />

    <MobileBar />
	</div>
</div>

<style lang="postcss">
  :global(body) {
    height: 100%;
  }

	:global(#app) {
		display: flex;
		justify-content: center;
    background-color: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-standard);
    font-size: var(--font-size-nm);
    font-weight: var(--font-weight-regular);
    overflow-y: scroll;
    overflow-x: hidden;
    max-height: 100vh;
    min-height: 100vh;
    padding: 1rem;

    scrollbar-color: var(--color-scrollbar) var(--color-bg);

    &::-webkit-scrollbar {
      width: 14px;
    }

    &::-webkit-scrollbar-track {
      background-color: var(--color-bg);
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--color-scrollbar);
      border-radius: 999px;
      border: 3px solid var(--color-bg);
    }
	}

  .app__content {
    display: flex;
    flex-direction: column;
    width: 1100px;
    max-width: 100%;

    .main {
      display: flex;
      grid-gap: 1rem;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 0 0 2rem 0;
    }
  }

  :global(.mobile-bar) {
    display: none !important;
  }

  @media (width <= 480px) {
    :global(.mobile-bar) {
      display: flex !important;
    }

    :global(.header) {
      display: none !important;
    }
  }
</style>
