<template>
  <div class="buttons">
    <button v-for="item in items" :key="item">{{ item }}</button>
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
  methods: {
    toggleItem(item) {
      this.$emit('input', item)
    },
  },
}
</script>

<style lang="scss" scoped>
.buttons {
  button {
    margin: 0 1rem 0 0;
    padding: 0;
    text-transform: capitalize;
    background-color: transparent;
    font-weight: bold;

    font-size: var(--font-size-sm);
    color: var(--color-text);
  }
}
</style>
