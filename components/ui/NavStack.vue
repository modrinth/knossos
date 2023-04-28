<template>
  <nav>
    <ul>
      <slot />
    </ul>
  </nav>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
ul {
  display: flex;
  flex-direction: column;
  grid-gap: var(--spacing-card-xs);
  flex-wrap: wrap;
  list-style-type: none;
  margin: 0;
  padding: 0;
}

li {
  display: unset;
  text-align: unset;
}

@media screen and (max-width: 1024px) {
  ul {
    flex-direction: row;
  }

  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4) {
    width: 100%;
  }
}
</style>
