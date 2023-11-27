<template>
  <button
    v-bind="$attrs"
    class="btn btn-transparent"
    :class="{ selected: modelValue && !noActiveState }"
    role="checkbox"
    :aria-checked="modelValue"
    @click="toggle"
  >
    <slot />
    <span v-if="count" class="count">{{ count }}</span>
    <CheckIcon v-else-if="modelValue && !noActiveState" />
  </button>
</template>

<script setup>
import { CheckIcon } from 'omorphia'

defineOptions({
  inheritAttrs: false,
})

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: Boolean,
  count: {
    type: Number,
    required: false,
    default: undefined,
  },
  noActiveState: {
    type: Boolean,
    required: false,
    default: false,
  },
})

function toggle() {
  emit('update:modelValue', !props.modelValue)
}
</script>

<style lang="scss" scoped>
.btn {
  width: 100%;
  justify-content: space-between;
  line-height: 0.75rem;

  svg {
    width: 0.75rem;
    height: 0.75rem;
  }

  &:not(.selected) .count {
    opacity: 0.5;
  }

  &.selected {
    background-color: var(--color-brand-highlight);
    color: var(--color-contrast);
  }
}
</style>
