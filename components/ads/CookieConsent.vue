<template>
  <div
    ref="container"
    class="container"
    :style="{ visibility: shown ? 'visible' : 'hidden' }"
  >
    <div class="banner">
      <span>
        Modrinth uses cookies for various purposes, including advertising.<br />
        We encourage you to review your privacy settings<br />
        by clicking on the button below:
      </span>
      <div class="actions">
        <button class="btn button" @click="hide">Dismiss</button>
        <button class="btn brand-button" @click="review">Review</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CookieConsent',
  data() {
    return {
      shown: false,
    }
  },
  mounted() {
    // Get informations in the store
    this.$store.dispatch('consent/loadFromCookies', this.$cookies)
    if (!this.$store.state.consent.is_consent_given) {
      this.shown = true
    }
  },
  methods: {
    hide() {
      this.shown = false
    },
    review() {},
  },
}
</script>

<style scoped lang="scss">
.container {
  z-index: 20;
  position: fixed;
  bottom: 0;
  right: 0;
  .banner {
    @extend %card;
    margin: 0 2rem 2rem 0;
    padding: 1rem;
  }
  .actions {
    display: flex;
    flex-direction: row-reverse;
    margin-top: 1rem;
    .btn {
      margin-left: 0.5rem;
    }
  }
}
</style>
