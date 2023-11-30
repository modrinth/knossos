<template>
  <div class="markdown-body card" v-html="renderHighlightedString(project.body)" />
</template>

<script>
import { renderHighlightedString } from 'omorphia'

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
