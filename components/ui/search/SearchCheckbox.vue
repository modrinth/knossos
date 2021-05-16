<template>
  <div class="check-filter" @click="toggle">
    <button class="checkbox">
      <CheckIcon v-if="activeFilters.includes(facetName)" />
    </button>
    <p>{{ displayName }}</p>
  </div>
</template>

<script>
import CheckIcon from '~/assets/images/utils/check.svg?inline'

export default {
  name: 'SearchCheckbox',
  components: {
    CheckIcon,
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

<style lang="scss">
.check-filter {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 3px 0.5rem 0 0.5rem;
  font-size: 1rem;
  letter-spacing: 0.02rem;
}

p {
  padding: 0.2rem 0rem;
  margin: 0;
}

.checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  width: 1.5rem;
  height: 1.5rem;

  padding: 0;
  margin: 0 0.5rem 0 0;

  svg {
    color: var(--color-brand-light);
    stroke-width: 0.2rem;
    height: 1.2rem;
    width: 1.2rem;
    flex-shrink: 0;
  }
}
</style>
