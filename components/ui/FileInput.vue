<template>
  <div class="columns">
    <label @drop.prevent="addFile" @dragover.prevent>
      <span>
        <UploadIcon v-if="showIcon" />
        {{ prompt }}
      </span>
      <input
        type="file"
        :multiple="multiple"
        :accept="accept"
        @change="onChange"
      />
    </label>
  </div>
</template>

<script>
import { fileIsValid } from '~/plugins/fileUtils'
import UploadIcon from '~/assets/images/utils/upload.svg?inline'

export default {
  name: 'FileInput',
  components: {
    UploadIcon,
  },
  props: {
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
  },
  data() {
    return {
      files: [],
    }
  },
  methods: {
    onChange(files, shouldNotReset) {
      if (!shouldNotReset || this.shouldAlwaysReset)
        this.files = files.target.files

      const validationOptions = { maxSize: this.maxSize, alertOnInvalid: true }
      this.files = [...this.files].filter((file) =>
        fileIsValid(file, validationOptions)
      )

      if (this.files.length > 0) {
        this.$emit('change', this.files)
      }
    },
    addFile(e) {
      const droppedFiles = e.dataTransfer.files

      if (!this.multiple) this.files = []

      if (!droppedFiles) return
      ;[...droppedFiles].forEach((f) => {
        this.files.push(f)
      })

      if (!this.multiple && this.files.length > 0) this.files = [this.files[0]]

      if (this.files.length > 0) this.onChange(null, true)
    },
  },
}
</script>

<style lang="scss" scoped>
label {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--spacing-card-sm) var(--spacing-card-md);
  box-shadow: var(--shadow-inset-sm);

  color: var(--color-button-text);
  background-color: var(--color-button-bg);
  border-radius: var(--size-rounded-max);

  transition: opacity 0.5s ease-in-out, filter 0.2s ease-in-out,
    transform 0.05s ease-in-out, outline 0.2s ease-in-out;

  &:hover:not(&:disabled) {
    filter: brightness(0.85);
  }

  &:active:not(&:disabled) {
    transform: scale(0.95);
    filter: brightness(0.8);
  }
}

span {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.5rem;
  padding-right: 0;

  svg {
    height: 1.25rem;
  }
}

input {
  display: none;
}

.known-error label {
  border-color: var(--color-badge-red-bg) !important;
  background-color: var(--color-warning-bg) !important;

  span {
    border-color: var(--color-badge-red-bg);
  }

  &::placeholder {
    color: var(--color-warning-text);
  }
}
</style>
