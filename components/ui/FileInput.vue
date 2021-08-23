<template>
  <label class="button" @drop.prevent="addFile" @dragover.prevent>
    <span>
      {{ text }}
    </span>
    <input
      type="file"
      :multiple="multiple"
      :accept="accept"
      @change="onChange"
    />
  </label>
</template>

<script>
export default {
  name: 'FileInput',
  props: {
    prompt: {
      type: String,
      default: 'Select files or drag them here',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    accept: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      text: this.prompt,
      files: [],
    }
  },
  methods: {
    onChange(files, shouldNotReset) {
      if (!shouldNotReset) this.files = files.target.files

      const length = this.files.length
      if (length === 0) {
        this.text = this.prompt
      } else if (length > 0) {
        this.text = this.$i18n.tc('creation.filesSelected', length, [length])
      }
      this.$emit('change', this.files)
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
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--spacing-card-sm) var(--spacing-card-md);
}

input {
  display: none;
}
</style>
