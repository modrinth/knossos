<template>
  <div
    v-highlightjs
    class="markdown-body card"
    v-html="$xss($md(project.body))"
  ></div>
</template>

<script>
export default defineNuxtComponent({
  auth: false,
  props: {
    project: {
      type: Object,
      default() {
        return {}
      },
    },
  },
})
</script>

<style lang="scss" scoped></style>
