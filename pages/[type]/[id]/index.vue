<template>
  <div class="markdown-body card" v-html="renderHighlightedString(project.body)" />
</template>

<script setup>
import { renderHighlightedString } from 'omorphia'

defineProps({
  project: {
    type: Object,
    default() {
      return {}
    },
  },
})
</script>
