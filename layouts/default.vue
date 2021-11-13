<template>
  <div class="layout">
    <AppHeader class="layout__header" />
    <CookieConsent />
    <notifications
      group="main"
      position="bottom right"
      :max="5"
      :ignore-duplicates="true"
    />
    <Nuxt class="layout__main" />
    <AppFooter class="layout__footer" />
  </div>
</template>

<script>
import CookieConsent from '~/components/ads/CookieConsent'

export default {
  components: {
    CookieConsent,
  },
  async fetch() {
    await Promise.all([
      this.$store.dispatch('user/fetchAll', { force: true }),
      this.$store.dispatch('tag/fetchAllTags'),
    ])
  },
  watch: {
    $route() {
      this.$store.dispatch('user/fetchAll')
    },
  },
  beforeCreate() {
    if (this.$route.query.code) {
      this.$router.push(this.$route.path)
    }
  },
}
</script>

<style></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
