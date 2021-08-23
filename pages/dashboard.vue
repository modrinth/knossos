<template>
  <div class="page-container">
    <div class="page-contents">
      <div class="sidebar-l">
        <div v-if="$auth.user != null" class="card page-nav">
          <nuxt-link :to="'/dashboard/projects'" class="tab last">
            <ProjectIcon />
            {{ $t('userControls.myProjects') }}
          </nuxt-link>
          <nuxt-link :to="'/dashboard/notifications'" class="tab last">
            <NotificationsIcon />
            {{ $t('userControls.notifications') }}
            <div v-if="$user.notifications.length > 0" class="notif-count">
              {{ $user.notifications.length }}
            </div>
          </nuxt-link>
          <nuxt-link :to="'/dashboard/follows'" class="tab last">
            <FollowIcon />
            {{ $t('userControls.followedProjects') }}
          </nuxt-link>
          <nuxt-link
            v-if="
              $auth.user.role === 'admin' || $auth.user.role === 'moderator'
            "
            :to="'/dashboard/moderation'"
            class="tab last"
          >
            <ModerationIcon />
            {{ $t('userControls.moderation') }}
          </nuxt-link>
          <nuxt-link :to="'/dashboard/settings'" class="tab last">
            <SettingsIcon />
            {{ $t('userControls.settings') }}
          </nuxt-link>
          <nuxt-link :to="'/dashboard/privacy'" class="tab last">
            <ShieldIcon />
            {{ $t('privacy.settings') }}
          </nuxt-link>
        </div>
        <div v-else class="card page-nav">
          <a :href="authUrl" class="tab last">
            <UserIcon />
            {{ $t('userControls.gitHub') }}
          </a>
          <nuxt-link :to="'/dashboard/privacy'" class="tab last">
            <SettingsIcon />
            {{ $t('privacy.settings') }}
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
import ProjectIcon from '~/assets/images/sidebar/mod.svg?inline'
import ModerationIcon from '~/assets/images/sidebar/admin.svg?inline'
import SettingsIcon from '~/assets/images/sidebar/settings.svg?inline'
import NotificationsIcon from '~/assets/images/sidebar/notifications.svg?inline'
import FollowIcon from '~/assets/images/utils/heart.svg?inline'
import UserIcon from '~/assets/images/utils/user.svg?inline'
import ShieldIcon from '~/assets/images/utils/shield.svg?inline'

export default {
  name: 'DashboardPage',
  components: {
    ProjectIcon,
    ModerationIcon,
    SettingsIcon,
    NotificationsIcon,
    FollowIcon,
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
