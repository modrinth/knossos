<script lang="ts">
  import LogoIcon from '$assets/images/logo/icon.svg'
  import { projectTypes } from '$generated/tags.json'
  import { t } from 'svelte-intl-precompile'
  import Nav from "$components/elements/Nav.svelte";
  import IconMenu from 'virtual:icons/lucide/menu'

  let navItems = projectTypes.map((type) => ({
    label: $t(`project.types.${type}.plural`),
    href: `/${$t(`project.types.${type}.plural`, {locale: 'en'}).toLowerCase()}`,
  }))
</script>

<div class="mobile-bar">
  &nbsp;
  <div class="mobile-bar__nav">
    <a class="mobile-bar__nav__item" href="/">
      <LogoIcon height={32} />
    </a>
    <Nav level={0} links={navItems} resetScroll/>
    <button class="mobile-bar__nav__item">
      <IconMenu height={32} width="auto" />
    </button>
  </div>
</div>

<style lang="postcss">
  .mobile-bar {
    display: flex;
    --height: 4rem;
    height: var(--height);
    margin-top: 3rem;

    &__nav {
      z-index: 10;
      background-color: var(--color-raised-bg);
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: var(--height);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
    }
  }
</style>
