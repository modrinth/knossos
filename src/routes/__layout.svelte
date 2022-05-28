<script context="module" lang="ts">
    import { registerAll } from "$locales";
    import { theme, token, user } from "$stores/server";
    import { init, waitLocale } from "svelte-intl-precompile";

    registerAll();

    /** @type {import('@sveltejs/kit').Load} */
    export async function load({ fetch, session, stuff }) {
        init({
            fallbackLocale: "en",
            initialLocale: session.acceptedLanguage,
        });
        await waitLocale();

        token.set(session.token);
        user.set(session.user);
        if (session.theme) theme.set(session.theme);

        return {};
    }
</script>

<script lang="ts">
    import { browser } from "$app/env";
    import { page } from "$app/stores";
    import Popup from "$components/elements/Popup.svelte";
    import Footer from "$components/layout/Footer.svelte";
    import Header from "$components/layout/Header.svelte";
    import MobileBar from "$components/layout/MobileBar.svelte";
    import Meta from "$components/utils/Meta.svelte";
    import { fetching } from "$lib/api";
    import { create } from "$lib/create";
    import { updateSelf } from "$stores/self";
    import { setSystemTheme, systemTheme } from "$stores/server";
    import NProgress from "nprogress";
    import { onMount } from "svelte";
    import { debounce } from "throttle-debounce";
    import IconModeration from "virtual:icons/fa-regular/life-ring";
    import IconPlus from "virtual:icons/heroicons-outline/plus";
    import IconBell from "virtual:icons/lucide/bell";
    import IconHeart from "virtual:icons/lucide/heart";
    import IconLogout from "virtual:icons/lucide/log-out";
    import IconSettings from "virtual:icons/lucide/settings";

    onMount(() => {
        if ($page.url.searchParams.get("code")) {
            const url = new URL($page.url);
            url.searchParams.delete("code");
            history.replaceState({}, "", url);
        }

        window
            .matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", () => {
                if ($theme === "system") setSystemTheme();
            });

        const storageTheme = localStorage.getItem("modrinth__theme");
        if (storageTheme) theme.set(storageTheme);

        theme.subscribe((t) => localStorage.setItem("modrinth__theme", t));

        updateSelf();
    });

    $: if ($theme && browser) {
        document.body.className = `${
            $theme === "system" ? $systemTheme : $theme
        }-theme`;
    }

    NProgress.configure({
        minimum: 0.1,
        showSpinner: false,
        trickleSpeed: 20,
    });

    const progressStart = debounce(400, true, () => NProgress.start());
    const progressDone = debounce(400, false, () => NProgress.done());

    $: if (browser) {
        if ($fetching) {
            progressStart();
        }
        if (!$fetching) {
            progressDone();
        }
    }

    let dropdownItems;
    $: dropdownItems = [
        {
            label: "@" + $user?.username,
            sublabel: "Go to my profile",
            href: `/user/${$user?.username}`,
        },
        {
            divider: true,
        },
        ...(["admin", "moderator"].includes($user?.role)
            ? [
                  {
                      label: "Moderation",
                      href: "/moderation",
                      icon: IconModeration,
                  },
              ]
            : []),
        {
            label: "Notifications",
            href: "/notifications",
            icon: IconBell,
        },
        {
            label: "Following",
            href: "/following",
            icon: IconHeart,
        },
        {
            id: "create",
            label: "Create",
            action: create,
            icon: IconPlus,
        },
        {
            label: "Settings",
            href: "/settings",
            icon: IconSettings,
        },
        {
            divider: true,
        },
        {
            id: "logout",
            label: "Log out",
            action: () => {
                $user = null;
                $token = "";
                document.cookie =
                    "modrinth-token" +
                    "=test; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                // window.location.replace($page.url.toString()); // Reloads page after logout
            },
            icon: IconLogout,
        },
    ];
</script>

<svelte:head>
    <script
        defer
        async
        src="https://media.ethicalads.io/media/client/ethicalads.min.js"
        type="text/javascript"></script>
    <style lang="postcss">
        @import "../styles/global.postcss";
    </style>
    {#if ($theme === "system" ? $systemTheme : $theme) === "light"}
        <script>
            window.THEME = "light";
        </script>
    {:else if ($theme === "system" ? $systemTheme : $theme) === "dark"}
        <script>
            window.THEME = "dark";
        </script>
    {:else if ($theme === "system" ? $systemTheme : $theme) === "modrinth-light"}
        <script>
            window.THEME = "modrinth-light";
        </script>
    {:else if ($theme === "system" ? $systemTheme : $theme) === "modrinth-dark"}
        <script>
            window.THEME = "modrinth-dark";
        </script>
    {:else if $theme === "oled"}
        <script>
            window.THEME = "oled";
        </script>
    {:else if $theme === "modrinth-oled"}
        <script>
            window.THEME = "modrinth-oled";
        </script>
    {/if}
</svelte:head>

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
    .app {
        width: 100%;
        display: flex;
        justify-content: center;

        &__content {
            display: flex;
            flex-direction: column;
            width: 1275px;
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
