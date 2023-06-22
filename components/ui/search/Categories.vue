<template>
  <div class="categories">
    <slot />
    <span
      v-for="category in categoriesFiltered"
      :key="category.name"
      v-html="category.icon + $formatCategory(category.name)"
    />
  </div>
</template>

<script>
export default {
  props: {
    categories: {
      type: Array,
      default() {
        return []
      },
    },
    type: {
      type: String,
      required: true,
    },
  },
  computed: {
    categoriesFiltered() {
      return this.$tag.categories
        .concat(this.$tag.loaders)
        .filter(
          (x) =>
            this.categories.includes(x.name) && (!x.project_type || x.project_type === this.type)
        )
    },
  },
}
</script>

<style lang="scss" scoped>
.categories {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--spacing-card-sm);

  :deep(span) {
    display: flex;
    align-items: center;
    flex-direction: row;

    &:not(.badge) {
      color: var(--color-icon);
    }

    svg {
      width: 1rem;
      margin-right: var(--spacing-card-xs);
    }
  }
}
</style>
