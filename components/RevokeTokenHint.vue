<template>
  <div class="section-header pad-maker">
    <h3>How to revoke your modrinth token.</h3>
    <p>
      First of all,
      <a
        class="revk-link"
        target="_blank"
        href="https://github.com/settings/connections/applications/3acffb2e808d16d4b226"
        >head to the Modrinth Application page on Github.</a
      ><br />
      Then press the <strong>Revoke access</strong> button found next to the
      <strong>Permissions</strong> header.<br /><br />
      <a
        class="revk-link"
        href="~/assets/images/revoke-token.png"
        target="_blank"
        >See this screenshot if confused.</a
      >
    </p>
    <p>Once you have completed this, press the continue button below.</p>
    <button @click="wantClose">Cancel</button>
    <button @click="logout">Continue</button>
  </div>
</template>
<script>
export default {
  methods: {
    async logout() {
      await this.$auth.setToken('local', false)
      await this.$router.go('/')
    },
    wantClose() {
      this.$emit('wantClose')
    },
  },
}
</script>
<style lang="scss" scoped>
.pad-maker {
  margin-top: var(--spacing-card-md);
}
.revk-link {
  color: var(--color-link);
}
</style>
