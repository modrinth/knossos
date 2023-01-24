<template>
  <div class="normal-page">
    <div class="normal-page__sidebar">
      <aside class="universal-card">
        <h1>Notifications</h1>
        <NavStack>
          <NavStackItem link="" label="All"> </NavStackItem>
          <NavStackItem
            v-for="type in notificationTypes"
            :key="type"
            :link="'?type=' + type"
            :label="NOTIFICATION_TYPES[type]"
          >
          </NavStackItem>
          <h3>Manage</h3>
          <NavStackItem
            link="/settings/follows"
            label="Followed projects"
            chevron
          >
            <SettingsIcon />
          </NavStackItem>
          <NavStackItem
            v-if="$user.notifications.length > 0"
            :action="clearNotifications"
            label="Clear all"
            danger
          >
            <ClearIcon />
          </NavStackItem>
        </NavStack>
      </aside>
    </div>
    <div class="normal-page__content">
      <div class="notifications">
        <div v-for="(notification, index) in notificationsGrouped" :key="index">
          <ProjectUpdateNotification
            v-if="
              notification.type === 'project_update' &&
              notification.count >= COLLAPSE_TRESHHOLD
            "
            :project-title="notification.projectName"
            :versions="notification.data"
          />
          <CompactNotification
            v-else-if="
              notification.type === 'project_update' &&
              notification.count < COLLAPSE_TRESHHOLD
            "
            v-for="data_element in notification.data"
            :key="data_element.id"
            :notification="notification.data[0]"
          />
          <CompactNotification
            v-else-if="
              notification.type === 'team_invite' ||
              notification.type == 'status_update'
            "
            :notification="notification.data"
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
</template>

<script>
import UpToDate from '~/assets/images/illustrations/up_to_date.svg?inline'
import ProjectUpdateNotification from '~/components/ui/ProjectUpdateNotification.vue'
import CompactNotification from '~/components/ui/CompactNotification.vue'
import SettingsIcon from '~/assets/images/utils/settings.svg?inline'
import NavStack from '~/components/ui/NavStack'
import NavStackItem from '~/components/ui/NavStackItem'
import ClearIcon from '~/assets/images/utils/clear.svg?inline'

export default {
  name: 'Notifications',
  components: {
    NavStack,
    NavStackItem,
    SettingsIcon,
    ClearIcon,
    UpToDate,
    ProjectUpdateNotification,
    CompactNotification,
  },
  data() {
    return {
      selectedNotificationType: 'all',
      expandedNames: [],
      COLLAPSE_TRESHHOLD: 2,
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
      return this.$route.query.type !== undefined
        ? this.$user.notifications.filter(
            (x) => x.type === this.$route.query.type
          )
        : this.$user.notifications
    },
    notificationsGrouped() {
      const groupedByTitle = new Map()

      for (const notification of this.notificationsUngrouped) {
        const a = groupedByTitle.get(notification.title) || []
        if (notification.type === 'project_update') {
          notification.version = notification.text.match(
            /The project,? .*,? has released a new version: (.*)/m
          )[1]
        }
        a.push(notification)
        groupedByTitle.set(notification.title, a)
      }

      const grouped = []
      const titleToMetadata = new Map()

      groupedByTitle.forEach((notifications, title) => {
        if (!titleToMetadata.has(title)) {
          let name = ''

          if (notifications[0].type === 'project_update') {
            name = title.match(/\*\*(.*)\*\* has been updated!/m)[1]
          }

          const meta = {
            type: notifications[0].type,
            projectName: name,
            count: groupedByTitle.get(title).length,
            data: undefined,
          }

          switch (meta.type) {
            case 'project_update':
              meta.data = notifications
              break
            case 'team_invite':
              meta.data = notifications[0]
              break
            case 'status_update':
              meta.data = notifications[0]
              break
          }

          titleToMetadata.set(title, meta)
        }
        grouped.push(titleToMetadata.get(title))
      })

      return grouped
    },
    notificationTypes() {
      const obj = {}

      for (const notification of this.$user.notifications.filter(
        (it) => it.type !== null
      )) {
        obj[notification.type] = true
      }

      return Object.keys(obj)
    },
  },
  created() {
    this.NOTIFICATION_TYPES = {
      team_invite: 'Team invites',
      project_update: 'Project updates',
      status_update: 'Status changes',
    }
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
