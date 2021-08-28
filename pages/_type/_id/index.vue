<template>
  <div
    v-highlightjs
    class="markdown-body"
    v-html="$xss($md.render(project.body))"
  ></div>
</template>

<script>
export default {
  auth: false,
  props: {
    project: {
      type: Object,
      default() {
        return {}
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.markdown-body {
  margin-bottom: var(--spacing-card-md);
  background: var(--color-raised-bg);
  border-radius: var(--size-rounded-card);
}
</style>
