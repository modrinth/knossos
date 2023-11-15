<template>
  <div class="categories" :class="{ badges: badge }">
    <slot />
    <span
      v-for="category in categoriesFiltered"
      :key="category.name"
      v-html="$formatCategory(category.name)"
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
    badge: {
      type: Boolean,
      default: false,
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
    background-color: var(--tag-bg);
    padding: 0 8px;
    line-height: 1.5em;
    border-radius: var(--radius-max);
    font-size: var(--font-size-sm);
    text-transform: lowercase;

    &:not(.badge) {
      color: var(--color-text-secondary);
    }

    svg {
      width: 0.75rem;
      height: 0.75rem;
      margin-right: 3px;
    }
  }
}
</style>
