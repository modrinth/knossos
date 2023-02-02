<template>
  <div class="categories">
    <slot />
    <template v-for="category in categoriesFiltered">
      <template v-if="shouldLink">
        <a
          :key="category.name"
          :href="`/${type}s?f=categories%3A'${category.name}'`"
          v-html="category.icon + $formatCategory(category.name)"
        />
      </template>
      <template v-else>
        <span
          :key="category.name"
          v-html="category.icon + $formatCategory(category.name)"
        />
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Categories',
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
    shouldLink: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    categoriesFiltered() {
      return this.$tag.categories
        .concat(this.$tag.loaders)
        .filter(
          (x) =>
            this.categories.includes(x.name) &&
            (!x.project_type || x.project_type === this.type)
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

  :is(a, span) ::v-deep {
    display: flex;
    align-items: center;
    flex-direction: row;
    color: var(--color-icon);
    margin-right: var(--spacing-card-md);

    svg {
      width: 1rem;
      margin-right: 0.2rem;
    }
  }
}
</style>
