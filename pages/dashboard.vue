<template>
  <div class="page-container">
    <div class="page-contents">
      <div class="sidebar-l">
        <div v-if="$auth.user != null" class="card page-nav">
          <nuxt-link :to="'/dashboard/projects'" class="tab last">
            <FolderIcon />
            My projects
          </nuxt-link>
          <nuxt-link :to="'/dashboard/notifications'" class="tab last">
            <BellIcon />
            Notifications
            <div v-if="$user.notifications.length > 0" class="notif-count">
              {{ $user.notifications.length }}
            </div>
          </nuxt-link>
          <nuxt-link :to="'/dashboard/follows'" class="tab last">
            <HeartIcon />
            Followed projects
          </nuxt-link>
          <nuxt-link
            v-if="
              $auth.user.role === 'admin' || $auth.user.role === 'moderator'
            "
            :to="'/dashboard/moderation'"
            class="tab last"
          >
            <FlagIcon />
            Moderation
          </nuxt-link>
          <nuxt-link :to="'/dashboard/settings'" class="tab last">
            <SettingsIcon />
            Settings
          </nuxt-link>
          <nuxt-link :to="'/dashboard/privacy'" class="tab last">
            <ShieldIcon />
            Privacy settings
          </nuxt-link>
        </div>
        <div v-else class="card page-nav">
          <a :href="authUrl" class="tab last">
            <UserIcon />
            Log in
          </a>
          <nuxt-link :to="'/dashboard/privacy'" class="tab last">
            <SettingsIcon />
            Privacy settings
          </nuxt-link>
        </div>
      </div>
      <div class="content">
        <NuxtChild />
      </div>
    </div>
  </div>
</template>
<script>
import {
  FolderIcon,
  BellIcon,
  SettingsIcon,
  HeartIcon,
  UserIcon,
  ShieldIcon,
  FlagIcon,
} from 'vue-feather-icons'

export default {
  name: 'DashboardPage',
  components: {
    FolderIcon,
    FlagIcon,
    SettingsIcon,
    BellIcon,
    HeartIcon,
    UserIcon,
    ShieldIcon,
  },
  computed: {
    authUrl() {
      return `${this.$axios.defaults.baseURL}auth/init?url=${process.env.domain}${this.$route.fullPath}`
    },
  },
}
</script>

<style lang="scss" scoped>
.hideSmall {
  padding-top: 0;
}

.notif-count {
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: rgba(180, 180, 180, 0.4);
  border-radius: 2rem;
  padding: 0.1rem 0.35rem;
  margin: 0 0.2rem 0 auto;

  font-size: 0.9rem;
}
</style>
