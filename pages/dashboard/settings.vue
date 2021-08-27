/* eslint-disable vue/attribute-hyphenation */
<template>
  <div>
    <ConfirmPopup
      ref="delete_popup"
      title="Are you sure you want to delete your account?"
      description="If you proceed, your user and all attached data will be removed from our
        servers. This cannot be reversed, so be careful!"
      proceed-label="Delete account"
      :confirmation-text="username"
      :has-to-type="true"
      @proceed="deleteAccount"
    />
    <div class="section-header columns">
      <h3 class="column-grow-1">{{ $t('settings.settings') }}</h3>
      <button class="brand-button column" @click="editProfile">
        {{ $t('generic.save') }}
      </button>
    </div>
    <section>
      <h3>{{ $t('settings.username') }}</h3>
      <label>
        <span>{{ $t('settings.usernameDescription') }}</span>
        <input
          v-model="username"
          type="text"
          placeholder="Enter your username"
        />
      </label>
      <h3>{{ $t('generic.name') }}</h3>
      <label>
        <span>{{ $t('settings.nameDescription') }}</span>
        <input v-model="name" type="text" placeholder="Enter your name" />
      </label>
      <h3>{{ $t('settings.email') }}</h3>
      <label>
        <span>{{ $t('settings.emailDescription') }}</span>
        <input v-model="email" type="email" placeholder="Enter your email" />
      </label>
      <h3>{{ $t('settings.bio') }}</h3>
      <label>
        <span>{{ $t('settings.bioDescription') }}</span>
        <input v-model="bio" type="text" placeholder="Enter your bio" />
      </label>
    </section>
    <section class="pad-maker">
      <h3>{{ $t('settings.theme') }}</h3>
      <label>
        <span>{{ $t('settings.themeDescription') }}</span>
        <input
          type="button"
          class="button pad-rem"
          value="Cycle theme"
          @click="changeTheme"
        />
      </label>
    </section>
    <section class="pad-maker">
      <h3>{{ $t('settings.token') }}</h3>
      <label>
        <span>{{ $t('settings.tokenDescription') }}</span>
        <input
          type="button"
          class="button pad-rem"
          value="Copy to clipboard"
          @click="copyToken"
        />
      </label>
      <h3>{{ $t('settings.revokeToken') }}</h3>
      <label>
        <span>{{ $t('settings.revokeTokenDescription') }}</span>
        <input
          type="button"
          class="button"
          value="Revoke token"
          @click="gotoRevoke"
        />
      </label>
      <h3>{{ $t('settings.delete') }}</h3>
      <label>
        <span>{{ $t('settings.deleteDescription') }}</span>
        <input
          value="Delete account"
          type="button"
          class="button"
          @click="showPopup"
        />
      </label>
    </section>
  </div>
</template>

<script>
import ConfirmPopup from '~/components/ui/ConfirmPopup'

export default {
  components: {
    ConfirmPopup,
  },
  data() {
    return {
      username: '',
      name: '',
      email: '',
      bio: '',
      token: '',
      confirm_delete: false,
    }
  },
  fetch() {
    this.username = this.$auth.user.username
    this.name = this.$auth.user.name
    this.email = this.$auth.user.email
    this.bio = this.$auth.user.bio
    this.token = this.$auth.token
  },
  head: {
    title: 'Settings - Modrinth',
  },
  methods: {
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
    gotoRevoke() {
      this.$router.replace('/dashboard/misc/revoke-token')
    },
    async copyToken() {
      await navigator.clipboard.writeText(this.token)
      this.$notify({
        group: 'main',
        title: this.$i18n.t('settings.copied'),
        text: this.$i18n.t('settings.copiedDescription'),
        type: 'success',
      })
    },
    async editProfile() {
      this.$nuxt.$loading.start()

      try {
        const data = {
          username: this.username,
          name: this.name,
          email: this.email,
          bio: this.bio,
        }

        await this.$axios.patch(
          `user/${this.$auth.user.id}`,
          data,
          this.$auth.headers
        )

        await this.$store.dispatch('auth/fetchUser', {
          token: this.$auth.token,
        })
      } catch (err) {
        this.$notify({
          group: 'main',
          title: this.$i18n.t('error.error'),
          text: err.response.data.description,
          type: 'error',
        })
      }

      this.$nuxt.$loading.finish()
    },
    async deleteAccount() {
      this.$nuxt.$loading.start()

      try {
        await this.$axios.delete(
          `user/${this.$auth.user.id}`,
          this.$auth.headers
        )
      } catch (err) {
        this.$notify({
          group: 'main',
          title: this.$i18n.t('error.error'),
          text: err.response.data.description,
          type: 'error',
        })
      }

      this.$nuxt.$loading.finish()
    },
    showPopup() {
      this.$refs.delete_popup.show()
    },
  },
}
</script>

<style lang="scss" scoped>
.pad-rem {
  margin-top: 0;
}

.pad-maker {
  margin-top: var(--spacing-card-md);
}

.save-btn-div {
  overflow: hidden;
  clear: both;
}

.save-btn {
  float: right;
}

section {
  @extend %card;
  padding: var(--spacing-card-md) var(--spacing-card-lg);
}
</style>
