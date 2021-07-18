<template>
  <div></div>
</template>

<script>
export default {
  name: 'Mods',
  asyncData(ctx) {
    ctx.params.projectType = 'modpack'
  },
}
</script>

<style lang="scss" scoped></style>
