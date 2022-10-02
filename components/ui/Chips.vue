<template>
  <div class="chips">
    <button
      v-for="(item, index) in items"
      :key="index"
      class="iconified-button"
      :class="{ 'light-brand-button': selected === item }"
      @click="toggleItem(item)"
    >
      <CheckIcon v-if="selected === item" />
      <span>{{ customLabel(item) }}</span>
    </button>
  </div>
</template>

<script>
import CheckIcon from '~/assets/images/utils/check.svg?inline'

export default {
  name: 'Chips',
  components: {
    CheckIcon,
  },
  props: {
    items: {
      required: true,
      type: Array,
    },
    customLabel: {
      type: Function,
      default: (item) => item,
    },
    neverEmpty: {
      default: true,
      type: Boolean,
    },
  },
  data() {
    return {
      selected: null,
    }
  },
  created() {
    if (this.items.length > 0 && this.neverEmpty) {
      this.selected = this.items[0]
      this.$emit('input', this.selected)
    }
  },
  methods: {
    toggleItem(item) {
      if (this.selected === item && !this.neverEmpty) {
        this.selected = null
      } else {
        this.selected = item
      }

      this.$emit('input', this.selected)
    },
  },
}
</script>

<style lang="scss" scoped>
.chips {
  display: flex;
  grid-gap: 0.5rem;
  flex-wrap: wrap;

  .iconified-button {
    svg {
      width: 1em;
      height: 1em;
    }
  }
}
</style>
