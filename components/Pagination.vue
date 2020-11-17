<template>
  <div v-if="pages.length > 1" class="columns paginates">
    <svg
      :class="{
        'paginate current': currentPage === 1,
        paginate: currentPage !== 1,
      }"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      @click="currentPage !== 1 ? switchPage(currentPage - 1) : null"
    >
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
    <p
      v-for="(item, index) in pages"
      :key="'page-' + item"
      :class="{
        'page-number': currentPage !== item,
      }"
      @click="currentPage !== item ? switchPage(item) : null"
    >
      <span v-if="pages[index - 1] + 1 !== item && item !== 1">...</span>
      <span :class="{ 'page-number current': currentPage === item }">{{
        item
      }}</span>
    </p>

    <svg
      :class="{
        'paginate current': currentPage === pages[pages.length - 1],
        paginate: currentPage !== pages[pages.length - 1],
      }"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      @click="
        currentPage !== pages[pages.length - 1]
          ? switchPage(currentPage + 1)
          : null
      "
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    currentPage: {
      type: Number,
      default: 1,
    },
    pages: {
      type: Array,
      default() {
        return []
      },
    },
  },
  methods: {
    switchPage(newPage) {
      this.$emit('switch-page', newPage)
    },
  },
}
</script>

<style scoped lang="scss">
.paginates {
  align-items: center;
  height: 2.5rem;
}

.paginate {
  user-select: none;
  cursor: pointer;
  border-radius: 50% !important;
  padding: 0.5rem 0.5rem;
  background-color: transparent;
}

.paginate:hover {
  background: var(--color-button-bg-hover);
  color: var(--color-button-text-hover);
}

.paginate.current:hover,
.paginate.current {
  cursor: default;
  background-color: transparent;
  color: var(--color-button-text-disabled);
}

.page-number {
  user-select: none;
  cursor: pointer;
  border-radius: 50% !important;
  padding: 0.5rem 0.8rem;
  margin: 0 2px;
  background: transparent;
}

.page-number:hover {
  background: var(--color-button-bg-hover);
  color: var(--color-button-text-hover);
}

.page-number.current {
  cursor: default;
  background-color: var(--color-button-bg-active);
  color: var(--color-button-text-active);
}
</style>
