<template>
  <div class="buttons">
    <button
      v-for="item in items"
      :key="item"
      :class="{ selected: selected === item }"
      @click="toggleItem(item)"
    >
      {{ item }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'ThisOrThat',
  props: {
    items: {
      required: true,
      type: Array,
    },
  },
  data() {
    return {
      selected: '',
    }
  },
  created() {
    if (this.items.length > 0) {
      this.selected = this.items[0]
      this.$emit('input', this.selected)
    }
  },
  methods: {
    toggleItem(item) {
      this.selected = item
      this.$emit('input', item)
    },
  },
}
</script>

<style lang="scss" scoped>
.buttons {
  button {
    margin: 0 1rem 0.25rem 0;
    padding: 0.125rem 0.25rem calc(0.125rem + 6px) 0.25rem;
    text-transform: capitalize;
    background-color: transparent;
    font-weight: bold;
    border-radius: 0;

    font-size: var(--font-size-sm);
    color: var(--color-text);

    &.selected {
      padding-bottom: 0.25rem;
      color: var(--color-text-dark);
    }

    &.selected::after {
      border-bottom: 3px solid var(--color-brand);
      content: '';
      display: block;
      width: 85%;
      margin-top: 3px;
      margin-left: auto;
      margin-right: auto;
    }
  }
}
</style>
