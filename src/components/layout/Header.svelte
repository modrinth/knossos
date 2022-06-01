<script lang="ts">
    import { browser } from "$app/env";
    import LogoLoader from "$components/elements/LogoLoader.svelte";
    import ThemePicker from "$components/elements/ThemePicker.svelte";
    import { projectTypes } from "$generated/tags.json";
    import { search } from "$lib/search";
    import { notifications } from "$stores/self";
    import { user } from "$stores/server";
    import { Button, NavRow } from "omorphia";
    import { t } from "svelte-intl-precompile";
    import IconBell from "virtual:icons/fa-regular/bell";
    import IconSearch from "virtual:icons/heroicons-outline/search";
    import IconChevronDown from "virtual:icons/lucide/chevron-down";
    import IconGithub from "virtual:icons/simple-icons/github";

    let navItems = projectTypes.map((type) => ({
        label: $t(`project.types.${type}.plural`),
        href: `/${$t(`project.types.${type}.plural`, {
            locale: "en",
        }).toLowerCase()}`,
    }));

    user.subscribe((v) => {
        if (v) {
            navItems.push({
                label: "Builder",
                href: "/builder",
            });
        } else {
            navItems = navItems.filter((n) => n.label !== "Builder");
        }
    });

    export let dropdownItems = [];

    let hideDropdown: boolean;
</script>

<header class="header">
    <a href="/" aria-label="Modrinth Home">
        <LogoLoader height={"24px"} />
    </a>

    <NavRow level={0} links={navItems} />

    <form class="nav__search" on:submit|preventDefault={() => {}}>
        <input
            type="text"
            placeholder={$t("project.types.mod.search")}
            name="term"
            class="nav__search__input"
            autocomplete="off"
        />

        <button type="submit" class="nav__search__button" title="Search">
            <IconSearch />
        </button>
    </form>

    <div class="header__actions">
        <ThemePicker />
        {#if $user}
            <Button
                href="/notifications"
                color="transparent"
                badge={$notifications.length > 0}><IconBell /></Button
            >
            <div class="avatar" class:hide-dropdown={hideDropdown} tabindex="0">
                <div
                    class="avatar__toggle"
                    on:mouseover={() => (hideDropdown = false)}
                    on:focus={() => (hideDropdown = false)}
                >
                    <img
                        class="avatar__toggle__image"
                        src={$user.avatar_url}
                        alt={$user.username}
                    />
                    <IconChevronDown />
                </div>
                <div class="avatar__dropdown">
                    {#each dropdownItems as item}
                        {#if item.divider}
                            <hr class="divider" />
                        {:else if item.href}
                            <a
                                href={item.href}
                                class="avatar__dropdown__item"
                                on:click={() => (hideDropdown = true)}
                            >
                                {#if item.icon}
                                    <svelte:component
                                        this={item.icon}
                                        height={16}
                                        width={16}
                                    />
                                {/if}
                                <span class="avatar__dropdown__item__label">
                                    {item.label}
                                    {#if item.sublabel}
                                        <br /><span
                                            class="avatar__dropdown__item__label__sublabel"
                                            >{item.sublabel}</span
                                        >
                                    {/if}
                                </span>
                            </a>
                        {:else}
                            <button
                                on:click={() => {
                                    hideDropdown = true;
                                    item.action();
                                }}
                                class="avatar__dropdown__item"
                            >
                                {#if item.icon}
                                    <svelte:component
                                        this={item.icon}
                                        height={16}
                                        width={16}
                                    />
                                {/if}
                                <span class="avatar__dropdown__item__label">
                                    {item.label}
                                    {#if item.sublabel}
                                        <br /><span
                                            class="avatar__dropdown__item__label__sublabel"
                                            >{item.sublabel}</span
                                        >
                                    {/if}
                                </span>
                            </button>
                        {/if}
                    {/each}
                </div>
            </div>
        {:else}
            <Button
                href={browser
                    ? `${import.meta.env.VITE_API_URL}auth/init?url=${
                          window.location.href
                      }`
                    : ""}
                color="primary"><IconGithub /> Sign in with GitHub</Button
            >
        {/if}
    </div>
</header>

<style lang="postcss">
    .nav {
        &__search {
            width: 40%;
            @media (width < 950px) {
                display: none;
            }
            display: flex;
            align-items: center;
            margin-left: 2rem;

            &__input {
                background-color: var(--color-button-bg);
                border-radius: 0.8rem;
                box-shadow: var(--shadow-raised), var(--shadow-inset);
                padding: 0.5rem 1.25rem;
                border: none;
                width: 100%;
            }

            &__button {
                margin-left: -2.25rem;
                z-index: 2;
                display: flex;
            }
        }
    }

    .header {
        display: flex;
        align-items: center;
        grid-gap: 1rem;
        margin-bottom: 1rem;

        &__actions {
            display: flex;
            margin-left: auto;
            grid-gap: 0.5rem;

            .avatar {
                position: relative;

                &__toggle {
                    position: relative;

                    &__image {
                        width: 2rem;
                        border-radius: 100%;
                        border: 0.15rem solid transparent;
                        transition: border-color 0.2s ease-in-out;
                    }

                    &::after {
                        content: " ";
                        position: absolute;
                        bottom: -0.5rem;
                        left: 0;
                        width: 100%;
                        height: 0.5rem;
                    }
                }

                &__dropdown {
                    visibility: hidden;
                    transform: scaleY(0.9);
                    opacity: 0;
                    transform-origin: top;
                    transition: transform 0.1s ease-in-out,
                        opacity 0.1s ease-in-out, visibility 0.1s ease-in-out;
                    position: absolute;
                    top: calc(100% + 0.2rem);
                    width: auto;
                    background-color: var(--color-raised-bg);
                    border-radius: var(--rounded);
                    box-shadow: var(--shadow-floating);
                    padding: 0.6rem;
                    z-index: 5;
                    border: 0.1rem solid var(--color-raised-bg-hover);
                    display: flex;
                    flex-direction: column;
                    grid-gap: 0.25rem;
                    right: 0;

                    @media (width >= 1200px) {
                        right: -1rem;
                    }

                    &__item {
                        padding: 0.2rem 0.4rem;
                        border-radius: var(--rounded-sm);
                        display: flex;
                        align-items: center;
                        grid-gap: 0.3rem;

                        &:hover {
                            background-color: var(--color-raised-bg-hover);
                        }

                        &__label {
                            min-width: 7.5rem;
                            text-align: left;

                            &__sublabel {
                                color: var(--color-text-lightest);
                            }
                        }
                    }
                }

                &:hover {
                    .avatar__toggle {
                        &__image {
                            border-color: var(--color-brand);
                        }
                    }
                }

                &:not(.hide-dropdown):hover,
                &:focus-within,
                &:focus {
                    .avatar__dropdown {
                        visibility: visible;
                        transform: scaleY(1);
                        opacity: 1;
                    }
                }
            }
        }
    }
</style>
