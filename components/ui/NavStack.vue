<template>
  <nav class="navigation">
    <slot />
  </nav>
</template>

<script>
export default {
  name: 'NavStack',
}
</script>

<style lang="scss" scoped>
.navigation {
  display: flex;
  flex-direction: column;
  grid-gap: 0.25rem;
  flex-wrap: wrap;

  h3 {
    margin: var(--spacing-card-lg) 0 var(--spacing-card-sm) 0;
  }
}
</style>
