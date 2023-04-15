<template>
  <div v-if="open" class="overflow-menu">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  open: {
    type: Boolean,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
.overflow-menu {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-card-sm);
  position: absolute;
  z-index: 10;
  background-color: var(--color-raised-bg);
  padding: var(--spacing-card-md);
  border-radius: var(--size-rounded-card);
  border: 1px solid var(--color-divider-dark);
  box-shadow: var(--shadow-floating);
}
</style>
