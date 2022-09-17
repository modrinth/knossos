<template>
  <div>
    <ModalConfirm
      ref="modal_confirm"
      title="Are you sure you want to delete your account?"
      description="This will **immediately delete all of your user data and follows**. This will not delete your projects. Deleting your account cannot be reversed.<br><br>If you need help with your account, get support on the [Modrinth Discord](https://discord.gg/EUHuJHt)."
      proceed-label="Yes, irrecoverably delete my account"
      :confirmation-text="$auth.user.username"
      :has-to-type="true"
      @proceed="deleteAccount"
    />

    <Modal ref="modal_revoke_token" header="Revoke your Modrinth token">
      <div class="modal-revoke-token markdown-body">
        <p>
          Revoking your Modrinth token can have unintended consequences. Please
          be aware that the following could break:
        </p>
        <ul>
          <li>Any application that uses your token to access the API.</li>
          <li>
            Gradle - if Minotaur is given a incorrect token, your Gradle builds
            could fail.
          </li>
          <li>
            GitHub - if you use a GitHub action that uses the Modrinth API, it
            will cause errors.
          </li>
        </ul>
        <p>If you are willing to continue, complete the following steps:</p>
        <ol>
          <li>
            <a
              href="https://github.com/settings/connections/applications/3acffb2e808d16d4b226"
              target="_blank"
            >
              Head to the Modrinth Application page on GitHub.
            </a>
            Make sure to be logged into the GitHub account you used for
            Modrinth!
          </li>
          <li>
            Press the big red "Revoke Access" button next to the "Permissions"
            header.
          </li>
        </ol>
        <p>
          Once you have completed those steps, press the continue button below.
        </p>
        <p>
          <strong>
            This will log you out of Modrinth, however, when you log back in,
            your token will be regenerated.
          </strong>
        </p>
        <div class="button-group">
          <button
            class="iconified-button"
            @click="$refs.modal_revoke_token.hide()"
          >
            <CrossIcon />
            Cancel
          </button>
          <button class="iconified-button brand-button" @click="logout">
            <RightArrowIcon />
            Log out
          </button>
        </div>
      </div>
    </Modal>

    <section class="card">
      <div class="header">
        <h2 class="title">Display settings</h2>
      </div>
      <label>
        <span>
          <h3>Theme</h3>
          <span>Change the global site theme.</span>
        </span>
        <Multiselect
          v-model="$colorMode.preference"
          :options="['system', 'light', 'dark', 'oled']"
          :custom-label="
            (value) =>
              value === 'oled'
                ? 'OLED'
                : value.charAt(0).toUpperCase() + value.slice(1)
          "
          :searchable="false"
          :close-on-select="true"
          :show-labels="false"
          :allow-empty="false"
        />
      </label>
      <label>
        <span>
          <h3>Search sidebar on the right</h3>
          <span>
            Enabling this will put the search page's filters sidebar on the
            right side.
          </span>
        </span>
        <input
          v-model="searchLayout"
          class="switch stylized-toggle"
          type="checkbox"
          @change="changeLayout"
        />
      </label>
      <label>
        <span>
          <h3>Project sidebar on the right</h3>

          <span>
            Enabling this will put the project pages' info sidebars on the right
            side.
          </span>
        </span>
        <input
          v-model="projectLayout"
          class="switch stylized-toggle"
          type="checkbox"
          @change="changeLayout"
        />
      </label>
    </section>

    <section class="card">
      <h2 class="title">Authorization token</h2>
      <p>
        Your authorization token can be used with the Modrinth API, the Minotaur
        Gradle plugin, and other applications that interact with Modrinth's API.
        Be sure to keep this secret!
      </p>
      <div class="button-group">
        <button
          type="button"
          class="iconified-button"
          value="Copy to clipboard"
          @click="copyToken"
        >
          <template v-if="copied">
            <CheckIcon v-if="copied" />
            Copied token to clipboard
          </template>
          <template v-else>Copy token to clipboard</template>
        </button>
        <button
          type="button"
          class="iconified-button"
          @click="$refs.modal_revoke_token.show()"
        >
          Revoke token
        </button>
      </div>
    </section>

    <section class="card">
      <h2 class="title">Delete account</h2>
      <p>
        Once you delete your account, there is no going back. Deleting your
        account will remove all attached data, excluding projects, from our
        servers.
      </p>
      <div class="button-group">
        <button
          type="button"
          class="iconified-button danger-button"
          @click="$refs.modal_confirm.show()"
        >
          Delete account
        </button>
      </div>
    </section>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import ModalConfirm from '~/components/ui/ModalConfirm'
import Modal from '~/components/ui/Modal'

import CrossIcon from '~/assets/images/utils/x.svg?inline'
import RightArrowIcon from '~/assets/images/utils/right-arrow.svg?inline'
import CheckIcon from '~/assets/images/utils/check.svg?inline'

export default {
  components: {
    Modal,
    ModalConfirm,
    Multiselect,
    CrossIcon,
    RightArrowIcon,
    CheckIcon,
  },
  data() {
    return {
      searchLayout: false,
      projectLayout: false,
      copied: false,
    }
  },
  fetch() {
    this.searchLayout = this.$store.state.cosmetics.searchLayout
    this.projectLayout = this.$store.state.cosmetics.projectLayout
  },
  head: {
    title: 'Settings - Modrinth',
  },
  methods: {
    async changeLayout() {
      await this.$store.dispatch('cosmetics/save', {
        searchLayout: this.searchLayout,
        projectLayout: this.projectLayout,
        $cookies: this.$cookies,
      })
    },
    changeTheme() {
      const shift = event.shiftKey
      switch (this.$colorMode.preference) {
        case 'dark':
          this.$colorMode.preference = shift ? 'light' : 'oled'
          break
        case 'oled':
          this.$colorMode.preference = shift ? 'dark' : 'light'
          break
        default:
          this.$colorMode.preference = shift ? 'oled' : 'dark'
      }
    },
    async copyToken() {
      this.copied = true
      await navigator.clipboard.writeText(this.$auth.token)
    },
    async deleteAccount() {
      this.$nuxt.$loading.start()
      try {
        await this.$axios.delete(
          `user/${this.$auth.user.id}`,
          this.$defaultHeaders()
        )
      } catch (err) {
        this.$notify({
          group: 'main',
          title: 'An error occurred',
          text: err.response.data.description,
          type: 'error',
        })
      }
      this.$nuxt.$loading.finish()
    },
    logout() {
      this.$refs.modal_revoke_token.hide()
      this.$cookies.set('auth-token-reset', true)

      window.location.href = `${this.$axios.defaults.baseURL}auth/init?url=${process.env.domain}`
    },
  },
}
</script>
<style lang="scss" scoped>
.card {
  padding: var(--spacing-card-lg);
}

.multiselect {
  max-width: 20rem;
}

.modal-revoke-token {
  padding: var(--spacing-card-bg);

  .button-group {
    width: fit-content;
    margin-left: auto;
  }
}
</style>
