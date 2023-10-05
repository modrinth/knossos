<template>
  <TriStateCheckbox
    class="filter"
    :model-value="
      activeFilters.includes(facetName) ? 1
        : negativeFilters.includes(facetName) ? 2
        : 0
    "
    :description="displayName"
    @update:model-value="toggle()"
  >
    <div class="filter-text">
      <div v-if="icon" aria-hidden="true" class="icon" v-html="icon" />
      <div v-else class="icon">
        <slot />
      </div>
      <span aria-hidden="true"> {{ displayName }}</span>
    </div>
  </TriStateCheckbox>
</template>

<script>
import TriStateCheckbox from "~/components/ui/search/TriStateCheckbox.vue";

export default {
  components: {
    TriStateCheckbox,
  },
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
    negativeFilters: {
      type: Array,
      default() {
        return []
      },
    },
  },
  emits: ['toggle'],
  methods: {
    toggle() {
      this.$emit('toggle', this.facetName)
    },
  },
}
</script>

<style lang="scss" scoped>
.filter {
  margin-bottom: 0.5rem;

  :deep(.filter-text) {
    display: flex;
    align-items: center;

    .icon {
      height: 1rem;

      svg {
        margin-right: 0.25rem;
        width: 1rem;
        height: 1rem;
      }
    }
  }

  span {
    user-select: none;
  }
}
</style>
