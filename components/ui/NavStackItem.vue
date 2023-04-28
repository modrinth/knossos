<template>
  <NuxtLink v-if="link !== null" class="nav-link button-base" :to="link">
    <div class="nav-content">
      <slot />
      <span>{{ label }}</span>
      <span v-if="beta" class="beta-badge">BETA</span>
      <span v-if="chevron" class="chevron"><ChevronRightIcon /></span>
      <span v-if="count !== null" class="count-badge">{{ count }}</span>
    </div>
  </NuxtLink>
  <button
    v-else-if="action"
    class="nav-link button-base"
    :class="{ 'danger-button': danger }"
    @click="action"
  >
    <span class="nav-content">
      <slot />
      <span>{{ label }}</span>
      <span v-if="beta" class="beta-badge">BETA</span>
      <span v-if="count !== null" class="count-badge">{{ count }}</span>
    </span>
  </button>
  <span v-else>i forgor 💀</span>
</template>

<script>
import ChevronRightIcon from '~/assets/images/utils/chevron-right.svg'

export default {
  components: {
    ChevronRightIcon,
  },
  props: {
    link: {
      default: null,
      type: String,
    },
    action: {
      default: null,
      type: Function,
    },
    label: {
      required: true,
      type: String,
    },
    beta: {
      default: false,
      type: Boolean,
    },
    chevron: {
      default: false,
      type: Boolean,
    },
    danger: {
      default: false,
      type: Boolean,
    },
    count: {
      default: null,
      type: Number,
    },
  },
}
</script>

<style lang="scss" scoped>
.nav-link {
  font-weight: var(--font-weight-bold);
  background-color: transparent;
  color: var(--text-color);
  position: relative;
  display: flex;
  flex-direction: row;
  gap: 0.25rem;
  box-shadow: none;
  padding: 0;
  width: 100%;

  :where(.nav-link) {
    --text-color: var(--color-text);
    --background-color: var(--color-raised-bg);
  }

  .nav-content {
    box-sizing: border-box;
    padding: 0.5rem 0.75rem;
    border-radius: var(--size-rounded-sm);
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-grow: 1;
    background-color: var(--background-color);
    box-shadow: none;
  }

  &:focus-visible {
    .nav-content {
      border-radius: 0.25rem;
    }
  }

  &:hover,
  &:focus-visible &.router-link-exact-active {
    .nav-content {
      background-color: var(--color-raised-bg);
      filter: none;
    }
  }

  &.router-link-exact-active {
    .nav-content {
      color: var(--color-button-text-active);
      background-color: var(--color-button-bg);

      .count-badge {
        background-color: var(--color-raised-bg);
      }
    }
  }

  .beta-badge {
    margin: 0;
  }

  .count-badge {
    background-color: var(--color-bg);
    padding: 0.125rem 0.3rem;
    border-radius: var(--size-rounded-max);
    font-size: 0.75rem;
  }

  .chevron {
    margin-left: auto;
  }
}

@media screen and (max-width: 1024px) {
  .nav-link {
    width: fit-content;
  }
}
</style>
