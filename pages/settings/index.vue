<template>
  <div>
    <ConfirmPopup
      ref="delete_popup"
      title="Are you sure you want to delete your account?"
      description="This will **immediately delete all of your user data and follows**. This will not delete your projects. Deleting your account cannot be reversed.<br><br>If you need help with your account, get support on the [Modrinth Discord](https://discord.gg/EUHuJHt)."
      proceed-label="Yes, irrecoverably delete my account"
      :confirmation-text="$auth.user.username"
      :has-to-type="true"
      @proceed="deleteAccount"
    />

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
          Copy to clipboard
        </button>
        <button
          type="button"
          class="iconified-button"
          @click="$router.replace('/settings/revoke-token')"
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
          @click="$refs.delete_popup.show()"
        >
          Delete account
        </button>
      </div>
    </section>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import ConfirmPopup from '~/components/ui/ConfirmPopup'

export default {
  components: { ConfirmPopup, Multiselect },
  data() {
    return {
      searchLayout: false,
      projectLayout: false,
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
      await navigator.clipboard.writeText(this.$auth.token)
      this.$notify({
        group: 'main',
        title: 'Copied to clipboard.',
        text: 'Copied your Modrinth token to the clipboard.',
        type: 'success',
      })
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
</style>
