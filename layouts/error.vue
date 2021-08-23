<template>
  <div class="main">
    <div class="container">
      <NuxtLink to="/">
        <h2>{{ error.message }}</h2>
        <p>{{ $t('error.error') }}</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'home',
  props: {
    error: {
      type: Object,
      default() {
        return {
          message: this.$i18n.t('error.unknown'),
        }
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.main {
  margin: var(--spacing-card-sm) auto;
  max-width: 800px;
}

.container {
  @extend %card;
  padding: var(--spacing-card-md) var(--spacing-card-lg);
}
</style>
