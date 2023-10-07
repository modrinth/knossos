<template>
  <div class="double-icon">
    <slot name="primary" />
    <div class="secondary" :class="color ? `color-${color}` : ''">
      <slot name="secondary" />
    </div>
  </div>
</template>
<script setup>
defineProps({
  color: {
    type: String,
    required: false,
    default: 'gray',
  },
})
</script>
<style lang="scss" scoped>
.double-icon {
  position: relative;
  height: fit-content;
  line-height: 0;
  --_color: var(--color-gray);

  .color-red {
    --_color: var(--color-red);
  }
  .color-orange {
    --_color: var(--color-orange);
  }
  .color-green {
    --_color: var(--color-green);
  }
  .color-blue {
    --_color: var(--color-blue);
  }
  .color-purple {
    --_color: var(--color-purple);
  }
  .color-gray {
    --_color: var(--color-gray);
  }

  .secondary {
    position: absolute;
    bottom: -4px;
    right: -4px;
    background-color: var(--_color);
    padding: 3px;
    border-radius: 50%;
    aspect-ratio: 1 / 1;
    width: fit-content;
    height: fit-content;
    line-height: 0;
    color: var(--color-accent-contrast);
    border: 3px solid var(--color-raised-bg);

    :deep(svg) {
      width: 0.8rem;
      height: 0.8rem;
    }
  }
}
</style>
