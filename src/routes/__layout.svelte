<script context="module" lang="ts">
	import { theme, token, user } from '$stores/server'

	import { t, init, waitLocale } from 'svelte-intl-precompile'
	import { registerAll } from '$locales'

	registerAll()

	/** @type {import('@sveltejs/kit').Load} */
	export async function load({ session }) {
		init({
			fallbackLocale: 'en',
			initialLocale: session.acceptedLanguage,
		})
		await waitLocale()

		token.set(session.token)
		user.set(session.user)
		if (session.theme) theme.set(session.theme)

		return {}
	}
</script>

<script lang="ts">
	import 'omorphia/styles.postcss'
	import '$styles/layout.postcss'
	import '$styles/progress.postcss'
	import Footer from '$components/layout/Footer.svelte'
	import Header from '$components/layout/Header.svelte'
	import { setSystemTheme, systemTheme } from '$stores/server'
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import Popup from '$components/elements/Popup.svelte'
	import NProgress from 'nprogress'
	import { updateSelf } from '$stores/self'
	import { fetching } from '$lib/api'
	import { browser } from '$app/env'
	import { debounce } from 'throttle-debounce'
	import MobileBar from '$components/layout/MobileBar.svelte'
	import IconSettings from 'virtual:icons/lucide/settings'
	import IconLogout from 'virtual:icons/lucide/log-out'
	import IconHeart from 'virtual:icons/lucide/heart'
	import IconModeration from 'virtual:icons/fa-regular/life-ring'
	import IconPlus from 'virtual:icons/heroicons-outline/plus'
	import { create } from '$lib/create'

	onMount(() => {
		if ($page.url.searchParams.get('code')) {
			const url = new URL($page.url)
			url.searchParams.delete('code')
			history.replaceState({}, '', url)
		}

		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
			if ($theme === 'system') setSystemTheme()
		})

		updateSelf()
	})

	$: if ($theme && browser) {
		document.body.className = `base theme-${$theme === 'system' ? $systemTheme : $theme}`
	}

	NProgress.configure({
		minimum: 0.1,
		showSpinner: false,
		trickleSpeed: 20,
	})

	const progressStart = debounce(400, true, () => NProgress.start())
	const progressDone = debounce(400, false, () => NProgress.done())

	$: if (browser) {
		if ($fetching) {
			progressStart()
		}
		if (!$fetching) {
			progressDone()
		}
	}

	let dropdownItems
	$: dropdownItems = [
		{
			label: '@' + $user?.username,
			sublabel: $t('header.my_profile'),
			href: `/user/${$user?.username}`,
		},
		{
			divider: true,
		},
		...(['admin', 'moderator'].includes($user?.role)
			? [
					{
						label: $t('pages.moderation'),
						href: '/moderation',
						icon: IconModeration,
					},
			  ]
			: []),
		{
			label: $t('pages.following'),
			href: '/following',
			icon: IconHeart,
		},
		{
			id: $t('generic.actions.create'),
			label: 'Create',
			action: create,
			icon: IconPlus,
		},
		{
			label: $t('pages.settings'),
			href: '/settings',
			icon: IconSettings,
		},
		{
			divider: true,
		},
		{
			id: 'logout',
			label: $t('header.logout'),
			action: () => {
				$user = null
				$token = ''
				document.cookie = 'modrinth-token' + '=test; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
				// window.location.replace($page.url.toString()); // Reloads page after logout
			},
			icon: IconLogout,
		},
	]
</script>

<Popup />

<div class="app">
	<div class="app__content">
		<Header {dropdownItems} />

		<main class="main">
			<slot />
		</main>

		<Footer />

		<MobileBar {dropdownItems} />
	</div>
</div>

<style lang="postcss">
	:global(body) {
		overflow: hidden scroll;
	}

	.app {
		width: 100%;
		display: flex;
		justify-content: center;
		min-height: 100vh;
		padding: 1rem;

		&__content {
			display: flex;
			flex-direction: column;
			width: 1200px;
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
