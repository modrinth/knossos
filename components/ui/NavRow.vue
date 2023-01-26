<template>
  <nav class="navigation">
    <NuxtLink
      v-for="(link, index) in filteredLinks"
      v-show="link.shown === undefined ? true : link.shown"
      :key="index"
      ref="linkElements"
      :to="query ? (link.href ? `?${query}=${link.href}` : '?') : link.href"
      class="nav-link button-animation"
    >
      <span>{{ link.label }}</span>
    </NuxtLink>
  </nav>
</template>

<script>
export default {
  props: {
    links: {
      default: () => [],
      type: Array,
    },
    query: {
      default: null,
      type: String,
    },
  },
  computed: {
    filteredLinks() {
      return this.links.filter((x) => (x.shown === undefined ? true : x.shown))
    },
  },
}
</script>

<style lang="scss" scoped>
.navigation {
  display: flex;
  flex-direction: row;
  align-items: center;
  grid-gap: 1rem;
  flex-wrap: wrap;
  position: relative;

  .nav-link {
    text-transform: capitalize;
    font-weight: var(--font-weight-bold);
    color: var(--color-text);
    position: relative;

    &::after {
      content: '';
      display: block;
      position: absolute;
      bottom: -5px;
      width: 100%;
      border-radius: var(--size-rounded-max);
      height: 0.25rem;
      transition: opacity 0.1s ease-in-out;
      background-color: var(--color-brand);
      opacity: 0;
    }

    &:hover {
      color: var(--color-text);

      &::after {
        opacity: 0.4;
      }
    }

    &:active::after {
      opacity: 0.2;
    }

    &.router-link-exact-active {
      color: var(--color-text);

      &::after {
        opacity: 1;
      }
    }
  }

  &.use-animation {
    .nav-link {
      &.is-active::after {
        opacity: 0;
      }
    }
  }

  .nav-indicator {
    position: absolute;
    height: 0.25rem;
    border-radius: var(--size-rounded-max);
    background-color: var(--color-brand);
    transition-property: left, right, top;
    transition-duration: 350ms;
    visibility: hidden;

    @media (prefers-reduced-motion) {
      transition: none !important;
    }
  }
}
</style>
