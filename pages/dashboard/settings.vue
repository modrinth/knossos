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
      <h3 class="column-grow-1">Settings</h3>
      <button class="brand-button column" @click="editProfile">Save</button>
    </div>
    <section>
      <h3>Username</h3>
      <label>
        <span>
          The username used on Modrinth to identify yourself. This must be
          unique.
        </span>
        <input
          v-model="username"
          type="text"
          placeholder="Enter your username"
        />
      </label>
      <h3>Name</h3>
      <label>
        <span>
          Your display name on your Modrinth profile. This does not have to be
          unique, can be set to anything, and is optional.
        </span>
        <input v-model="name" type="text" placeholder="Enter your name" />
      </label>
      <h3>Email</h3>
      <label>
        <span>
          The email for your account. This is private information which is not
          exposed in any API routes or on your profile. It is also optional.
        </span>
        <input v-model="email" type="email" placeholder="Enter your email" />
      </label>
      <h3>Bio</h3>
      <label>
        <span>
          A description of yourself which other users can see on your profile.
        </span>
        <input v-model="bio" type="text" placeholder="Enter your bio" />
      </label>
    </section>
    <section class="pad-maker">
      <h3>Site theme</h3>
      <label>
        <span
          >Change the global site theme of Modrinth. You can choose between
          light mode, dark mode, and OLED mode. You can cycle between the three
          options using this button, or you can toggle between light and dark
          mode at any time in the navigation bar at the top of the page.</span
        >
        <input
          type="button"
          class="button pad-rem"
          value="Cycle theme"
          @click="changeTheme"
        />
      </label>
    </section>
    <section class="pad-maker">
      <h3>Authorization token</h3>
      <label>
        <span>
          Your authorization token can be used with the Modrinth API and for the
          Minotaur Gradle plugin. However, it must be kept secret!
        </span>
        <input
          type="button"
          class="button pad-rem"
          value="Copy to clipboard"
          @click="copyToken"
        />
      </label>
      <h3>Revoke your token</h3>
      <label>
        <span
          >This will log you out of Modrinth, and you will have to log in again
          to access Modrinth with a new token.</span
        >
        <input
          type="button"
          class="button"
          value="Revoke token"
          @click="gotoRevoke"
        />
      </label>
      <h3>Delete your account</h3>
      <label>
        <span
          >Clicking on this WILL delete your account. Do not click on this
          unless you want your account deleted. If you delete your account, all
          attached data, including projects, will be removed from our servers.
          This cannot be reversed, so be careful!</span
        >
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
export default {
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
        title: 'Copied to clipboard.',
        text: 'Copied your Modrinth token to the clipboard.',
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
          title: 'An error occurred',
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
          title: 'An error occurred',
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
