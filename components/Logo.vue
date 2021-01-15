<template>
  <nuxt-link to="/" class="logo">
    <ImageModrinthLogo class="logo__svg" />
  </nuxt-link>
</template>

<script>
import ImageModrinthLogo from '@/assets/images/modrinth-logo.svg?inline'

export default {
  components: {
    ImageModrinthLogo,
  },
}
</script>

<style lang="scss" scoped>
.logo__svg {
  height: inherit;
  width: inherit;
}
</style>
