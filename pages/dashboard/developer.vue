<template>
  <DashboardPage>
    <div class="section-header columns">
      <h3 class="column-grow-1">Developer Tools</h3>
    </div>
    <section class="essentials">
      <h3>Authorization Token</h3>
      <label>
        <span>
          Your authorization token can be used with the Modrinth API and for the
          Minotaur Gradle plugin. However, it must be kept secret!
        </span>
        <button @click="copyToken">Copy to clipboard.</button>
      </label>
      <h3>Revoke your token</h3>
      <label>
        <span
          >Beware, this will log you out of Modrinth, and you will have to login
          again to access modrinth with a new token.</span
        >
        <button @click="showDelPopup = !showDelPopup">Revoke Token</button>
      </label>
    </section>
    <Popup :show-popup="showDelPopup" class="del-token-popup-body">
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
        <a class="revk-link" href="https://iili.io/Kcq4wu.png" target="_blank"
          >See this screenshot if confused.</a
        >
      </p>
      <p>Once you have completed this, press the continue button below.</p>
      <button @click="showDelPopup = !showDelPopup">Cancel</button>
      <button @click="logout">Continue</button>
    </Popup>
  </DashboardPage>
</template>

<script>
import DashboardPage from '@/components/DashboardPage'
// import axios from 'axios'

export default {
  components: {
    DashboardPage,
  },
  fetch() {
    this.token = this.$auth.getToken('local')
  },
  data() {
    return {
      token: '',
      showDelPopup: false,
    }
  },
  methods: {
    // async deleteToken() {
    //   try {
    //     await axios.delete(
    //       `https://api.github.com/applications/3acffb2e808d16d4b226/token`,
    //       {
    //         data: {
    //           access_token: this.token,
    //         },
    //       }
    //     )
    //     await this.$router.replace('/')
    //   } catch (e) {
    //     this.$notify({
    //       group: 'main',
    //       title: 'There was an error revoking the token:',
    //       text: e.toString(),
    //       type: 'error',
    //     })
    //   }
    // },
    async copyToken() {
      await this.$copyText(this.token)
      this.$notify({
        group: 'main',
        title: 'Copied to clipboard.',
        text: 'Copied your Modrinth token to the clipboard.',
        type: 'success',
      })
    },
    async logout() {
      await this.$auth.setToken('local', false)
      await this.$router.go('/')
    },
  },
}
</script>

<style lang="scss" scoped>
section {
  @extend %card;
  padding: var(--spacing-card-md) var(--spacing-card-lg);
}
.revk-link {
  color: var(--color-link);
}

.severe-button {
  background-color: red;
  color: white;
}

label {
  display: flex;

  span {
    flex: 2;
    padding-right: var(--spacing-card-lg);
  }

  input {
    .token-box {
      -webkit-text-security: circle;
    }
    flex: 3;
    height: fit-content;
  }
}
</style>
