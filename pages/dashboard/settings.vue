<template>
  <DashboardPage>
    <div class="section-header columns">
      <h3 class="column-grow-1">Settings</h3>
      <button class="brand-button column">Save</button>
    </div>
    <section class="essentials">
      <h3>Username</h3>
      <label>
        <span>
          The username used on the modrinth site to identify yourself. This must
          be unique.
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
          Give a quick description to your mod. It will appear in the search
        </span>
        <input v-model="bio" type="text" placeholder="Enter your bio" />
      </label>
    </section>
  </DashboardPage>
</template>

<script>
import DashboardPage from '@/components/DashboardPage'

export default {
  components: {
    DashboardPage,
  },
  fetch() {
    this.username = this.$auth.user.username
    this.name = this.$auth.user.name
    this.email = this.$auth.user.email
    this.bio = this.$auth.user.bio
  },
  data() {
    return {
      username: '',
      name: '',
      email: '',
      bio: '',
    }
  },
}
</script>

<style lang="scss" scoped>
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
}
</style>
