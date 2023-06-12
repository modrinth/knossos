<script setup lang="ts">
const props = defineProps({
  prompt: {
    type: String,
    default: 'Select file',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  accept: {
    type: String,
    default: null,
  },
  /**
   * The max file size in bytes
   */
  maxSize: {
    type: Number,
    default: null,
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
  shouldAlwaysReset: {
    type: Boolean,
    default: false,
  },
  longStyle: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['change'])

const files = ref<any[]>([])

function addFiles(selectedFiles: any[], shouldNotReset = false) {
  if (!shouldNotReset || props.shouldAlwaysReset)
    files.value = selectedFiles

  const validationOptions = { maxSize: props.maxSize, alertOnInvalid: true }
  files.value = [...files.value].filter(file => fileIsValid(file, validationOptions))

  if (files.value.length > 0)
    emit('change', files.value)
}

function handleDrop(e: any) {
  addFiles(e.dataTransfer.files)
}

function handleChange(e: any) {
  addFiles(e.target.files)
}
</script>

<template>
  <label
    :class="{ 'long-style': longStyle }"
    :disabled="disabled"
    @drop.prevent="handleDrop"
    @dragover.prevent
  >
    <slot />
    {{ prompt }}
    <input
      type="file"
      :multiple="multiple"
      :accept="accept"
      :disabled="disabled"
      @change="handleChange"
    >
  </label>
</template>

<style lang="scss" scoped>
label {
  flex-direction: unset;
  max-height: unset;

  svg {
    height: 1rem;
  }

  input {
    display: none;
  }

  &.long-style {
    display: flex;
    padding: 1.5rem 2rem;
    justify-content: center;
    align-items: center;
    grid-gap: 0.5rem;
    background-color: var(--color-button-bg);
    border-radius: var(--size-rounded-sm);
    border: dashed 0.3rem var(--color-text);
    cursor: pointer;
    color: var(--color-text-dark);
  }
}
</style>
