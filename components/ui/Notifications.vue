<template><div /></template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.vue-notification {
  background: var(--color-special-blue) !important;
  border-left: 5px solid var(--color-special-blue) !important;
  color: var(--color-brand-inverted) !important;

  &.success {
    background: var(--color-special-green) !important;
    border-left-color: var(--color-special-green) !important;
  }

  &.warn {
    background: var(--color-special-orange) !important;
    border-left-color: var(--color-special-orange) !important;
  }

  &.error {
    background: var(--color-special-red) !important;
    border-left-color: var(--color-special-red) !important;
  }
}

.vue-notification-group {
  right: 25px !important;
  bottom: 25px !important;

  .vue-notification-wrapper {
    margin-bottom: 10px;

    .vue-notification-template {
      border-radius: var(--size-rounded-card);
      margin: 0;

      .notification-title {
        font-size: var(--font-size-lg);
        margin-right: auto;
      }

      .notification-content {
        font-size: var(--font-size-md);
      }
    }

    &:last-child {
      margin: 0;
    }
  }

  @media screen and (max-width: 750px) {
    transition: bottom 0.25s ease-in-out;
    bottom: calc(var(--size-mobile-navbar-height) + 10px) !important;

    &.browse-menu-open {
      bottom: calc(var(--size-mobile-navbar-height-expanded) + 10px) !important;
    }
  }
}
</style>
