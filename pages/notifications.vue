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
        </NavStack>
        <h3>Manage</h3>
        <div class="input-group">
          <NuxtLink class="iconified-button" to="/settings/follows">
            <SettingsIcon />
            Followed projects
          </NuxtLink>
          <button
            v-if="$user.notifications.length > 0"
            class="iconified-button danger-button"
            @click="clearNotifications"
          >
            <ClearIcon />
            Clear all
          </button>
        </div>
      </aside>
    </div>
    <div class="normal-page__content">
      <div class="notifications">
        <div v-for="(notification, index) in notificationsGrouped" :key="index">
          <ProjectUpdateNotification
            v-if="
              notification.type === 'project_update' &&
              notification.data.length > 1
            "
            :project-title="notification.projectName"
            :versions="notification.data"
          />
          <CompactNotification
            v-if="
              notification.type === 'project_update' &&
              notification.data.length == 1
            "
            :notification="notification.data[0]"
          />
          <CompactNotification
            v-if="notification.type === 'team_invite'"
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

const NOTIFICATION_TYPES = {
  team_invite: 'Team invites',
  project_update: 'Project updates',
}

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
      NOTIFICATION_TYPES,
    }
  },
  async fetch() {
    this.NOTIFICATION_TYPES = NOTIFICATION_TYPES

    await this.$store.dispatch('user/fetchNotifications')
  },
  head: {
    title: 'Notifications - Modrinth',
  },
  computed: {
    notificationsUngrouped() {
      return JSON.parse(
        '[{"id": "UUVVWWXX","user_id": "EEFFGGHH","type": "team_invite","title": "You have been invited to join a team!","text": "Team invite from xyz to join the team for project abc","link": "mod/AABBCCDD/version/IIJJKKLL","read": false,"created": "string","actions":[{"title": "Accept"}, {"title": "Deny"} ]}, {"id": "asx","user_id": "EEFFGGHH","type": "project_update","title": "**My Project** has been updated!","text": "The project, My Project, has released a new version: 1.0.0","link": "mod/AABBCCDD/version/IIJJKKLL","read": false,"created": "string","actions": []}]'
      )
      // return this.$route.query.type !== undefined
      //   ? this.$user.notifications.filter(
      //       (x) => x.type === this.$route.query.type
      //     )
      //   : this.$user.notifications
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
      const obj = {}

      for (const notification of this.$user.notifications.filter(
        (it) => it.type !== null
      )) {
        obj[notification.type] = true
      }

      return Object.keys(obj)
    },
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
