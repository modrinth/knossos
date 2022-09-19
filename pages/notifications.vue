<template>
  <div class="page-container">
    <div class="page-contents">
      <div class="content">
        <h1>Notifications</h1>

        <div class="divider card">
          <ThisOrThat
            v-model="selectedNotificationType"
            :items="notificationTypes"
          />
          <button class="iconified-button" @click="clearNotifications">
            <ClearIcon />
            Clear all
          </button>
        </div>
        <div class="notifications">
          <div
            v-for="(notification, index) in notificationsGrouped"
            :key="index"
          >
            <ProjectUpdateNotification
              :projectTitle="notification.projectName"
              :versions="notification.data"
              v-if="notification.type === 'project_update'"
            />
            <TeamInviteNotification
              :notification="notification.data"
              v-if="notification.type === 'team_invite'"
            />
          </div>

          <div v-if="$user.notifications.length === 0" class="error">
            <UpToDate class="icon"></UpToDate>
            <br />
            <span class="text">You are up-to-date!</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClearIcon from '~/assets/images/utils/clear.svg?inline'
import UpToDate from '~/assets/images/illustrations/up_to_date.svg?inline'
import ThisOrThat from '~/components/ui/ThisOrThat'
import ProjectUpdateNotification from '~/components/ui/ProjectUpdateNotification.vue'
import TeamInviteNotification from '~/components/ui/TeamInviteNotification.vue'

const NOTIFICATION_TYPES = {
  'Team invites': 'team_invite',
  'Project updates': 'project_update',
}

export default {
  name: 'Notifications',
  components: {
    ThisOrThat,
    ClearIcon,
    UpToDate,
    ProjectUpdateNotification,
    TeamInviteNotification,
  },
  data() {
    return {
      selectedNotificationType: 'all',
      expandedNames: [],
    }
  },
  async fetch() {
    await this.$store.dispatch('user/fetchNotifications')
  },
  head: {
    title: 'Notifications - Modrinth',
  },
  computed: {
    notificationsUngrouped() {
      return this.selectedNotificationType !== 'all'
        ? this.$user.notifications.filter(
            (x) => x.type === NOTIFICATION_TYPES[this.selectedNotificationType]
          )
        : this.$user.notifications
    },
    notificationsGrouped() {
      const grouped = new Map()

      for (const notification of this.notificationsUngrouped) {
        const a = grouped.get(notification.title) || []
        if (notification.type === 'project_update') {
          notification.version = notification.text.match(
            /The project, .*, has released a new version: (.*)/m
          )[1]
        }
        a.push(notification)
        grouped.set(notification.title, a)
      }

      const groupedArray = []
      const keyToMetadata = new Map()

      grouped.forEach((val, key) => {
        if (!keyToMetadata.has(key)) {
          let name = ''

          if (val[0].type === 'project_update') {
            name = key.match(/\*\*(.*)\*\* has been updated!/m)[1]
          }

          const meta = {
            type: val[0].type,
            projectName: name,
            count: grouped.get(key).length,
            data: undefined,
          }

          switch (meta.type) {
            case 'project_update':
              meta.data = val
              break
            case 'team_invite':
              meta.data = val[0]
              break
          }

          keyToMetadata.set(key, meta)
        }
        groupedArray.push(keyToMetadata.get(key))
      })

      return groupedArray
    },
    notificationTypes() {
      const obj = { all: true }

      for (const notification of this.$user.notifications.filter(
        (it) => it.type !== null
      )) {
        obj[
          Object.keys(NOTIFICATION_TYPES).find(
            (key) => NOTIFICATION_TYPES[key] === notification.type
          )
        ] = true
      }

      return Object.keys(obj)
    },
  },
  created() {
    this.NOTIFICATION_TYPES = NOTIFICATION_TYPES
  },
  methods: {
    async clearNotifications() {
      try {
        const ids = this.$user.notifications.map((x) => x.id)

        await this.$axios.delete(
          `notifications?ids=${JSON.stringify(ids)}`,
          this.$defaultHeaders()
        )

        ids.forEach((x) => this.$store.dispatch('user/deleteNotification', x))
      } catch (err) {
        this.$notify({
          group: 'main',
          title: 'An error occurred',
          text: err.response.data.description,
          type: 'error',
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
h1 {
  color: var(--color-text-dark);
  margin: 0 0 1rem 1.5rem;
}

.divider {
  align-items: center;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  row-gap: 0.5rem;
}

@media screen and (min-width: 1024px) {
  .page-contents {
    max-width: calc(1280px - 20rem) !important;
  }
}
</style>
