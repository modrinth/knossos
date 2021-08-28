<template>
  <div class="categories">
    <span
      v-for="category in categoriesFiltered"
      :key="category.name"
      v-html="category.icon + category.name"
    />
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
  },
  computed: {
    categoriesFiltered() {
      return this.$tag.categories
        .concat(this.$tag.loaders)
        .filter((x) => this.categories.includes(x.name))
    },
  },
}
</script>

<style lang="scss" scoped>
.categories {
  @extend %row;
  flex-wrap: wrap;

  span ::v-deep {
    display: flex;
    align-items: center;
    flex-direction: row;
    background-color: var(--color-category-bg);
    border-radius: var(--size-rounded-max);
    color: var(--color-category-text);
    margin-top: 0.25em;
    margin-bottom: 0.25em;
    margin-right: 0.5em;
    padding: 0.4em 0.7em;
    font-size: var(--font-size-sm);
    height: 1em;
    text-transform: capitalize;

    svg {
      width: 15px;
      margin-right: 5px;
    }
  }
}
</style>
