<script context="module" lang="ts">
	import { theme } from '$stores/server'
	import { token, user } from '$stores/account'

	import { init, waitLocale, t, getLocaleFromAcceptLanguageHeader } from 'svelte-intl-precompile'
	import { registerAll, availableLocales } from '$locales'

	registerAll()

	export const load: import('@sveltejs/kit').Load = async ({ session }) => {
		init({
			fallbackLocale: 'en',
			initialLocale: getLocaleFromAcceptLanguageHeader(session.acceptLanguage, availableLocales),
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
	import NProgress from 'nprogress'
	import { updateSelf } from '$stores/account'
	import { fetching } from 'omorphia/utils'
	import { browser } from '$app/env'
	import MobileBar from '$components/layout/MobileBar.svelte'
	import IconSettings from 'virtual:icons/lucide/settings'
	import IconLogout from 'virtual:icons/lucide/log-out'
	import IconHeart from 'virtual:icons/lucide/heart'
	import IconModeration from 'virtual:icons/fa-regular/life-ring'
	import IconPlus from 'virtual:icons/heroicons-outline/plus'
	import ModalCreation from '$components/ModalCreation.svelte'

	let creationModalOpen = false

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

	$: if (browser) {
		if ($fetching) NProgress.start()
		if (!$fetching) NProgress.done()
	}

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
			action: () => (creationModalOpen = true),
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

<ModalCreation bind:open={creationModalOpen} />

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
				gap: 1rem;
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
