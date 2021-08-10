<template>
  <div></div>
</template>
<script>
export default {
  auth: true,
  asyncData(ctx) {
    ctx.params.mode = 'edit'
  },
  fetch() {
    this.$emit('update:mode', 'edit')
  },
  created() {
    this.$emit('update:mode', 'edit')
  },
}
</script>

<style lang="scss" scoped></style>
