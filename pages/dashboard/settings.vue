<template>
  <DashboardPage>
    <div class="section-header columns">
      <h3 class="column-grow-1">Settings</h3>
      <button class="brand-button column" @click="editProfile">Save</button>
    </div>
    <modal v-show="main_component">
      <section class="essentials">
        <h3>Username</h3>
        <label>
          <span>
            The username used on the Modrinth site to identify yourself. This
            must be unique.
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
            displayed in any API routes or your profile. It is also optional.
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
      <section class="essentials pad-maker">
        <h3>Authorization Token</h3>
        <label>
          <span>
            Your authorization token can be used with the Modrinth API and for
            the Minotaur Gradle plugin. However, it must be kept secret!
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
            >Beware, this will log you out of Modrinth, and you will have to
            login again to access Modrinth with a new token.</span
          >
          <input
            type="button"
            class="button"
            value="Revoke token"
            @click="showDelPopup"
          />
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
import axios from 'axios'
import RevokeTokenHint from '@/components/RevokeTokenHint.vue'

export default {
  components: {
    DashboardPage,
    RevokeTokenHint,
  },
  fetch() {
    this.username = this.$auth.user.username
    this.name = this.$auth.user.name
    this.email = this.$auth.user.email
    this.bio = this.$auth.user.bio
    this.token = this.$auth.getToken('local')
  },
  data() {
    return {
      username: '',
      name: '',
      email: '',
      bio: '',
      token: '',
      revoke_component: false,
      main_component: true,
    }
  },
  methods: {
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
    async editProfile() {
      const config = {
        headers: {
          Authorization: this.$auth.getToken('local'),
        },
      }

      this.$nuxt.$loading.start()

      try {
        const data = {
          username: this.username,
          name: this.name,
          email: this.email,
          bio: this.bio,
        }

        await axios.patch(
          `https://api.modrinth.com/api/v1/user/${this.$auth.user.id}`,
          data,
          config
        )
      } catch (err) {
        this.$notify({
          group: 'main',
          title: 'An Error Occurred',
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

label {
  display: flex;

  span {
    flex: 2;
    padding-right: var(--spacing-card-lg);
  }

  input {
    flex: 3;
    height: fit-content;
  }
  input[type='button'] {
    flex: 1;
  }
}
.header-top {
  font-size: 125%;
}
</style>
