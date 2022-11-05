<template>
  <NuxtLink class="nav-link button-base" :to="link">
    <div class="nav-indicator" />
    <div class="nav-content">
      <slot />
      <span>{{ label }}</span>
    </div>
  </NuxtLink>
</template>

<script>
export default {
  name: 'NavStackItem',
  props: {
    link: {
      required: true,
      type: String,
    },
    label: {
      required: true,
      type: String,
    },
  },
}
</script>

<style lang="scss" scoped>
.nav-link {
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  position: relative;
  display: flex;
  flex-direction: row;
  gap: 0.25rem;
  box-shadow: none;

  .nav-content {
    padding: 0.5rem 0.75rem;
    border-radius: var(--size-rounded-xs);
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-grow: 1;
    background-color: var(--color-raised-bg);
  }

  .nav-indicator {
    border-radius: var(--size-rounded-max);
    width: 0.25rem;
    transition: opacity 0.15s ease-in-out;
    background-color: var(--color-brand);
    opacity: 0;
  }

  &.nuxt-link-exact-active {
    .nav-content {
      color: var(--color-button-text-active);
      background-color: var(--color-button-bg);
      box-shadow: var(--shadow-inset-sm), 0 0 0 0 transparent;
    }

    .nav-indicator {
      opacity: 1;
    }
  }

  &:hover,
  &:focus {
    .nav-indicator {
      opacity: 0.4;
    }
  }
}
</style>
