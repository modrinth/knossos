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
  @extend %card-spaced-b;
  padding: var(--spacing-card-md) var(--spacing-card-lg);
  max-width: calc(100% - (2 * var(--spacing-card-lg)));
}
</style>
