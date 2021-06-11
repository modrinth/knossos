<template>
  <div class="filter-wrapper">
    <p
      v-if="icon"
      class="filter"
      :class="{
        'filter-active': activeFilters.includes(facetName),
      }"
      @click="toggle"
      v-html="icon + displayName"
    />
    <p
      v-else
      class="filter"
      :class="{
        'filter-active': activeFilters.includes(facetName),
      }"
      @click="toggle"
    >
      <slot />
      {{ displayName }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'SearchFilter',
  props: {
    facetName: {
      type: String,
      default: '',
    },
    displayName: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    activeFilters: {
      type: Array,
      default() {
        return []
      },
    },
  },
  methods: {
    toggle() {
      this.$emit('toggle', this.facetName)
    },
  },
}
</script>

<style lang="scss" scoped>
.filter-wrapper ::v-deep {
  .filter {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0.4rem 0.3rem;
    margin: 3px 0 0 0.5rem;
    font-size: 1rem;
    letter-spacing: 0.02rem;
    text-transform: capitalize;
    @extend %transparent-clickable;

    @media screen and (min-width: 1024px) {
      padding: 0.2rem 0.3rem;
    }

    svg {
      height: 1rem;
      color: var(--color-icon);
      margin-right: 5px;
      flex-shrink: 0;
      padding: 0;
    }
  }

  .filter-active {
    @extend %transparent-clickable, .selected;
    svg {
      color: var(--color-brand-light);
    }
  }
}
</style>
