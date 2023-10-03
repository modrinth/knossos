<template>
  <div class="chips">
    <button
      v-for="(item, i) in items"
      :key="toKey(item, i)"
      class="iconified-button"
      :class="{ selected: activeItem === item, capitalize }"
      :aria-pressed="activeItem === item"
      @click="toggleItem(item)"
    >
      <CheckIcon v-if="activeItem === item" aria-hidden />
      <span>{{ formatLabel(item) }}</span>
    </button>
  </div>
</template>

<script setup lang="ts" generic="T extends any, NeverEmpty extends boolean = false">
import { toDisplayString } from 'vue'
import CheckIcon from '~/assets/images/utils/check.svg?component'

const props = withDefaults(
  defineProps<{
    modelValue?: T | null | undefined
    items: T[]
    formatLabel?(item: T): string
    neverEmpty?: NeverEmpty
    capitalize?: boolean
    toKey?(item: T, index: number): string | symbol | number
  }>(),
  {
    neverEmpty: true as any,
    formatLabel: (item: T) => toDisplayString(item),
    toKey: (_item: T, index: number) => index,
    modelValue: null,
    capitalize: true,
  }
)

if (process.dev) {
  watchEffect(() => {
    if (props.capitalize) {
      console.warn('<Chips> `capitalize` property is deprecated. Use `formatLabel` instead')
    }
  })
}

const emit = defineEmits<{
  'update:modelValue': [value: NeverEmpty extends true ? T : T | null]
}>()

const activeItem = computed<T | null>({
  get() {
    return props.modelValue ?? (props.neverEmpty ? props.items[0] ?? null : null)
  },
  set(value) {
    type ValueType = NeverEmpty extends true ? T : T | null
    if ((props.neverEmpty && value != null) || !props.neverEmpty) {
      emit('update:modelValue', value as ValueType)
    }
  },
})

function toggleItem(item: T) {
  if (activeItem.value === item && !props.neverEmpty) {
    activeItem.value = null
  } else {
    activeItem.value = item
  }
}
</script>

<style lang="scss" scoped>
.chips {
  display: flex;
  grid-gap: 0.5rem;
  flex-wrap: wrap;

  .iconified-button {
    &.capitalize {
      text-transform: capitalize;
    }

    svg {
      width: 1em;
      height: 1em;
    }

    &:focus-visible {
      outline: 0.25rem solid #ea80ff;
      border-radius: 0.25rem;
    }
  }

  .selected {
    color: var(--color-button-text-active);
    background-color: var(--color-brand-highlight);
    box-shadow: inset 0 0 0 transparent, 0 0 0 2px var(--color-brand);
  }
}
</style>
