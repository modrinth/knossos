<script lang="ts">
  import { t } from 'svelte-intl-precompile'
  import Nav from '$components/elements/Nav.svelte'
  import Button from '$components/elements/Button.svelte'
  import IconBell from 'virtual:icons/fa-regular/bell'
  import IconGithub from 'virtual:icons/simple-icons/github'
  import { browser } from '$app/env'
  import { user } from '$stores/server'
  import { projectTypes } from '$generated/tags.json'
  import LogoLoader from '$components/elements/LogoLoader.svelte'
  import { notifications } from '$stores/self'
  import IconChevronDown from 'virtual:icons/lucide/chevron-down'

  let navItems = projectTypes.map((type) => ({
    label: $t(`project.types.${type}.plural`),
    href: `/${$t(`project.types.${type}.plural`, {locale: 'en'}).toLowerCase()}`,
  }))

  export let dropdownItems = []

  let hideDropdown: boolean
</script>

<header class="header">
  <a href="/" aria-label="Modrinth Home">
    <LogoLoader height={'24px'}/>
  </a>
  <Nav level={0} links={navItems}/>

  <div class="header__actions">
    {#if $user}
      <Button href="/notifications" color="transparent" title="Notifications" icon={IconBell} badge={$notifications.length > 0}/>
      <div
        class="avatar"
        class:hide-dropdown={hideDropdown}
        tabindex="0"
      >
        <div class="avatar__toggle" on:mouseover={() => hideDropdown = false} on:focus={() => hideDropdown = false}>
          <img class="avatar__toggle__image" src={$user.avatar_url} alt={$user.username}/>
          <IconChevronDown/>
        </div>
        <div class="avatar__dropdown">
          {#each dropdownItems as item}
            {#if item.divider}
              <hr class="divider"/>
            {:else if item.href}
              <a href={item.href} class="avatar__dropdown__item" on:click={() => hideDropdown = true}>
                {#if item.icon}
                  <svelte:component this={item.icon} height={16} width={16}/>
                {/if}
                <span class="avatar__dropdown__item__label">
						{item.label}
                  {#if item.sublabel}
							<br/><span class="avatar__dropdown__item__label__sublabel">{item.sublabel}</span>
						{/if}
					</span>
              </a>
            {:else}
              <button on:click={() => {hideDropdown = true; item.action()}} class="avatar__dropdown__item">
                {#if item.icon}
                  <svelte:component this={item.icon} height={16} width={16}/>
                {/if}
                <span class="avatar__dropdown__item__label">
						{item.label}
                  {#if item.sublabel}
							<br/><span class="avatar__dropdown__item__label__sublabel">{item.sublabel}</span>
						{/if}
					</span>
              </button>
            {/if}
          {/each}
        </div>
      </div>
    {:else}
      <Button
        href={browser ? `${import.meta.env.VITE_API_URL}auth/init?url=${window.location.href}` : ''}
        color="brand"
        label="Sign in with GitHub"
        icon={IconGithub}
      />
    {/if}
  </div>
</header>

<style lang="postcss">
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
            content: ' ';
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
          transition: transform 0.1s ease-in-out, opacity 0.1s ease-in-out;
          position: absolute;
          top: calc(100% + 0.1rem);
          width: auto;
          background-color: var(--color-raised-bg);
          border-radius: var(--rounded);
          box-shadow: var(--shadow-floating);
          padding: 0.75rem;
          z-index: 5;
          border: 0.1rem solid var(--color-raised-bg-hover);
          display: flex;
          flex-direction: column;
          grid-gap: 0.25rem;
          right: 0;

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

        &:not(.hide-dropdown):hover, &:focus-within, &:focus {
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
