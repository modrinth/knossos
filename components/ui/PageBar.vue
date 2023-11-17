<template>
  <div class="page-bar">
    <div>
      <slot />
    </div>
    <div>
      <slot name="right" />
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.page-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid var(--color-divider);
  margin-bottom: 1rem;

  :deep(.page-bar__title) {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem 0.75rem 0;
    color: var(--color-secondary);

    svg {
      margin-right: 0.5rem;
    }
  }

  :deep(.page-bar__buttons) {
    display: flex;
    gap: var(--gap-xs);
  }

  > div {
    display: flex;
    align-items: center;
  }

  svg {
    height: 1.2rem;
    width: 1.2rem;
  }

  :deep(.nav-button) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    border-bottom: 3px solid transparent;
    padding: 0.75rem 1rem;
    margin-bottom: -2px;
    background-color: transparent;
    color: var(--color-text);

    &.router-link-exact-active {
      color: var(--color-contrast);
      border-color: var(--color-brand);
      pointer-events: none;

      &::before {
        pointer-events: none;
      }
    }
  }
}
</style>
