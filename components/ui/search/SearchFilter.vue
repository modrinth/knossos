<template>
  <ListSelector :model-value="activeFilters.includes(facetName)" @update:model-value="toggle()">
    <slot />
    <template v-if="displayName"> {{ displayName }}</template>
  </ListSelector>
</template>

<script setup>
import ListSelector from '~/components/ui/ListSelector.vue'

const props = defineProps({
  facetName: {
    type: String,
    default: '',
  },
  displayName: {
    type: String,
    default: '',
  },
  activeFilters: {
    type: Array,
    default() {
      return []
    },
  },
})

const emit = defineEmits(['toggle'])

function toggle() {
  emit('toggle', props.facetName)
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
