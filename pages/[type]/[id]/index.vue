<template>
  <div class="markdown-body" v-html="renderHighlightedString(project.body)" />
</template>

<script>
import { renderHighlightedString } from '~/helpers/highlight.js'

export default defineNuxtComponent({
  props: {
    project: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  methods: { renderHighlightedString },
})
</script>

<style lang="scss" scoped>
.markdown-body {
  :deep(> :first-child) {
    margin-top: 0;
  }

  :deep(> h1, > h2, > h3, > h4) {
    &:first-child {
      padding-top: 0;
    }
  }
}
</style>
