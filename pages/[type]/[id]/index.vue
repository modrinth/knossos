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

<template>
  <div class="markdown-body card" v-html="renderHighlightedString(project.body)" />
</template>

<style lang="scss" scoped></style>
