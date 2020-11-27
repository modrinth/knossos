<template>
  <div class="button">
    <slot></slot>
    <input
      :id="inputId"
      class="file-input"
      type="file"
      :accept="inputAccept"
      :multiple="inputMultiple"
      @change="onChange"
    />
    <label :for="inputId">{{ text }}</label>
  </div>
</template>

<script>
export default {
  name: 'FileInput',
  props: {
    defaultText: {
      type: String,
      default: '',
    },
    inputId: {
      type: String,
      default: '',
    },
    inputAccept: {
      type: String,
      default: '',
    },
    inputMultiple: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      text: this.defaultText,
    }
  },
  methods: {
    onChange(files) {
      const length = files.target.files.length

      if (length === 0) {
        this.text = this.defaultText
      } else if (length === 1) {
        this.text = '1 file selected'
      } else if (length > 1) {
        this.text = length + ' files selected'
      }

      this.$emit('change', files)
    },
  },
}
</script>

<style lang="scss" scoped>
[type='file'] {
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  overflow: hidden;
  padding: 0;
  position: absolute !important;
  white-space: nowrap;
  width: 1px;

  + label {
    cursor: pointer;
    border-radius: 5px;
    padding: 10px 20px;
  }
}
</style>
