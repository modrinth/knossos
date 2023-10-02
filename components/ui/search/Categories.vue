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
  setup() {
    const tags = useTags()

    return { tags }
  },
  computed: {
    categoriesFiltered() {
      return this.tags.categories
        .concat(this.tags.loaders)
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
  gap: var(--gap-xs);

  :deep(span) {
    display: flex;
    align-items: center;
    flex-direction: row;
    border: 1px solid var(--color-button-bg);
    background-color: var(--color-bg);
    padding: var(--gap-xs) var(--gap-sm);
    border-radius: var(--radius-sm);

    &:not(.badge) {
      color: var(--color-text-secondary);
    }

    svg {
      width: 1.1rem;
      height: 1.1rem;
      margin-right: var(--gap-sm);
    }
  }
}
</style>
