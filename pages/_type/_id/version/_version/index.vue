<template>
  <div></div>
</template>
<script>
export default {
  auth: false,
  asyncData(ctx) {
    ctx.params.mode = 'normal'
  },
  fetch() {
    this.$emit('update:mode', 'normal')
  },
  created() {
    this.$emit('update:mode', 'normal')
  },
}
</script>

<style lang="scss" scoped></style>
