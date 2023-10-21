<template>
  <div ref="dropdown" class="popup-container" tabindex="0" :aria-expanded="dropdownVisible">
    <button v-bind="$attrs" @click="toggleDropdown">
      <slot></slot>
    </button>
    <div
      class="popup-menu"
      :class="`position-${position} from-${from} ${dropdownVisible ? 'visible' : ''}`"
    >
      <slot name="menu"> </slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  position: {
    type: String,
    default: 'bottom-left',
  },
  from: {
    type: String,
    default: 'top-right',
  },
})
defineOptions({
  inheritAttrs: false,
})

const dropdownVisible = ref(false)
const selectedValue = ref(props.modelValue || props.defaultValue)
const dropdown = ref(null)

watch(
  () => props.modelValue,
  (newValue) => {
    selectedValue.value = newValue
  }
)

const toggleDropdown = () => {
  if (!props.disabled) {
    dropdownVisible.value = !dropdownVisible.value
    dropdown.value.focus()
  }
}

const handleClickOutside = (event) => {
  const elements = document.elementsFromPoint(event.clientX, event.clientY)
  if (
    dropdown.value.$el !== event.target &&
    !elements.includes(dropdown.value.$el) &&
    !dropdown.value.contains(event.target)
  ) {
    dropdownVisible.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped>
.popup-container {
  position: relative;

  .popup-menu {
    --_animation-offset: -1rem;
    position: absolute;
    scale: 0.75;
    border: 1px solid var(--color-button-bg);
    padding: var(--gap-sm);
    min-width: 10rem;
    width: fit-content;
    border-radius: var(--radius-md);
    background-color: var(--color-raised-bg);
    box-shadow: var(--shadow-floating);
    z-index: 10;
    opacity: 0;
    pointer-events: none;
    transition: bottom 0.125s ease-in-out, top 0.125s ease-in-out, left 0.125s ease-in-out,
      right 0.125s ease-in-out, opacity 0.125s ease-in-out, scale 0.125s ease-in-out;

    &.position-bottom-left {
      top: calc(100% + var(--gap-sm) - 1rem);
      right: -1rem;
    }

    &.position-left-top {
      bottom: -1rem;
      left: calc(100% + var(--gap-sm) - 1rem);
    }

    &.visible,
    &:focus-within {
      opacity: 1;
      pointer-events: unset;
      scale: 1;

      &.position-bottom-left {
        top: calc(100% + var(--gap-sm));
        right: 0;
      }

      &.position-left-top {
        bottom: 0rem;
        left: calc(100% + var(--gap-sm));
      }
    }

    .btn {
      white-space: nowrap;
    }
  }
}
</style>
