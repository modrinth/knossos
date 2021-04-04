<template>
  <Popup :show-popup="shown">
    <div class="consent-container"></div>
  </Popup>
</template>

<script>
export default {
  name: 'ReviewPopup',
  data() {
    return {
      shown: false,
    }
  },
  methods: {
    show() {
      this.shown = true
    },
    hide() {
      this.shown = false
    },
  },
}
</script>

<style scoped lang="scss">
.consent-container {
  overflow-y: auto;
  max-height: 90vh;
  @media screen and (min-width: 900px) {
    max-height: 40vh;
  }
}
</style>
