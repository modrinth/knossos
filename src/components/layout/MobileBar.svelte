<script lang="ts">
  import LogoIcon from '$assets/images/logo/icon.svg'
  import { projectTypes } from '$generated/tags.json'
  import { t } from 'svelte-intl-precompile'
  import Nav from '$components/elements/Nav.svelte'
  import IconMenu from 'virtual:icons/lucide/menu'
  import { page } from '$app/stores'
  import { user } from '$stores/server'
  import { browser } from '$app/env'
  import IconX from 'virtual:icons/heroicons-outline/x'
  import IconGithub from 'virtual:icons/simple-icons/github'
  import { clickOutside } from 'svelte-use-click-outside'

  let navItems = projectTypes.map((type) => ({
    label: $t(`project.types.${type}.plural`),
    href: `/${$t(`project.types.${type}.plural`, {locale: 'en'}).toLowerCase()}`,
  }))

  let showMenu = false

  export let dropdownItems = []

  $: if ($page.url.pathname) showMenu = false
</script>

<div class="mobile-bar">
  &nbsp;
  <div class="mobile-bar__nav" use:clickOutside={() => showMenu = false}>
    <a class="mobile-bar__nav__item" href="/" style:--color-brand={$page.url.pathname === '/' ? '' : 'var(--color-text-lightest)'}>
      <LogoIcon/>
    </a>
    <Nav level={0} links={navItems} resetScroll/>
    {#if showMenu}
      <button class="mobile-bar__nav__item" on:click={() => showMenu = false}>
        <IconX/>
      </button>
    {:else}
      <button class="mobile-bar__nav__item" on:click={() => showMenu = true}>
        <IconMenu/>
      </button>
    {/if}
  </div>

  <div class="mobile-bar__menu" class:is-shown={showMenu}>
    {#if $user}
      {#each dropdownItems.filter(it => !it.divider && (!it.id || it.id !== 'create')) as item}
        {#if item.href}
          <a class="mobile-bar__menu__item" href={item.href}>
              <span class="mobile-bar__menu__item__title">
                <svelte:component this={item.icon}/>
                {item.label}
              </span>
            {#if item.sublabel}
              <span class="mobile-bar__menu__item__sublabel">{item.sublabel}</span>
            {/if}
          </a>
        {:else}
          <button class="mobile-bar__menu__item {item?.id === 'logout' ? 'mobile-bar__menu__item--color-red' : ''}">
              <span class="mobile-bar__menu__item__title">
                <svelte:component this={item.icon}/>
                {item.label}
              </span>
          </button>
        {/if}
      {/each}
    {:else}
      <a class="mobile-bar__menu__item mobile-bar__menu__item--color-brand" href={browser ? `${import.meta.env.VITE_API_URL}auth/init?url=${window.location.href}` : ''}>
          <span class="mobile-bar__menu__item__title">
            <IconGithub/>
            Sign in with GitHub
          </span>
      </a>
    {/if}
  </div>
</div>

<style lang="postcss">
  .mobile-bar {
    display: flex;
    --height: 4rem;
    height: var(--height);
    margin-top: 3rem;

    &__nav {
      z-index: 31;
      background-color: var(--color-raised-bg);
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: var(--height);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      box-shadow: var(--shadow-bar);

      &__item {
        z-index: 50;
        :global(svg) {
          width: 2rem;
          height: auto;
        }
      }
    }

    &__menu {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      opacity: 0;
      visibility: hidden;
      width: 100%;
      height: calc(100% - var(--height));
      display: flex;
      z-index: 30;
      align-items: center;
      justify-content: flex-end;
      flex-direction: column;
      padding: 1rem;
      grid-gap: 1rem;
      transition: opacity 0.1s ease-in-out,
                  visibility 0.1s ease-in-out;

      &.is-shown {
        opacity: 1;
        visibility: visible;
        background: hsla(0, 0%, 0%, 0.7);
        backdrop-filter: blur(3px);
      }

      &__item {
        width: 90%;
        max-width: 18rem;
        padding: 1rem 0;
        background-color: var(--color-raised-bg);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        grid-gap: 0.25rem;
        border-radius: var(--rounded);
        box-shadow: var(--shadow-raised), var(--shadow-inset);

        &--color {
          &-red {
            color: white;
            background-color: var(--color-badge-red-dot);
          }

          &-brand {
            color: white;
            background-color: var(--color-brand);
          }
        }

        &__title {
          display: flex;
          grid-gap: 0.5rem;
          align-items: center;
        }

        &__sublabel {
          color: var(--color-text-lightest);
        }
      }
    }
  }
</style>
