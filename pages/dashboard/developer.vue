<template>
  <DashboardPage>
    <div class="section-header columns">
      <h3 class="column-grow-1">Developer Tools</h3>
    </div>
    <modal v-show="main_component">
      <section class="essentials">
        <h3>Authorization Token</h3>
        <label>
          <span>
            Your authorization token can be used with the Modrinth API and for
            the Minotaur Gradle plugin. However, it must be kept secret!
          </span>
          <button @click="copyToken">Copy to clipboard.</button>
        </label>
        <h3>Revoke your token</h3>
        <label>
          <span
            >Beware, this will log you out of Modrinth, and you will have to
            login again to access modrinth with a new token.</span
          >
          <button @click="showDelPopup">Revoke Token</button>
        </label>
      </section>
    </modal>
    <modal v-show="revoke_component">
      <RevokeTokenHint @wantClose="showDelPopup"></RevokeTokenHint>
    </modal>
  </DashboardPage>
</template>

<script>
import DashboardPage from '@/components/DashboardPage'
import RevokeTokenHint from '~/components/RevokeTokenHint.vue'
// import axios from 'axios'

export default {
  components: {
    DashboardPage,
    RevokeTokenHint,
  },
  fetch() {
    this.token = this.$auth.getToken('local')
  },
  data() {
    return {
      token: '',
      revoke_component: false,
      main_component: true,
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
    showDelPopup() {
      this.revoke_component = !this.revoke_component
      this.main_component = !this.main_component
    },
  },
}
</script>

<style lang="scss" scoped>
.del-token-popup-body {
  padding-top: var(--spacing-card-lg);
  padding-bottom: var(--spacing-card-lg);
  padding-left: var(--spacing-card-lg);
  padding-right: var(--spacing-card-lg);
}

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
