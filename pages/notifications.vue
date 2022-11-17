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
            v-if="notification.type === 'project_update'"
            :project-title="notification.projectName"
            :versions="notification.data"
          />
          <TeamInviteNotification
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
import TeamInviteNotification from '~/components/ui/TeamInviteNotification.vue'
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
    TeamInviteNotification,
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
      return this.$route.query.type !== undefined
        ? this.$user.notifications.filter(
            (x) => x.type === this.$route.query.type
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
.notifications {
  .label {
    .label__title {
      display: flex;
      gap: var(--spacing-card-sm);
      align-items: baseline;
      margin-block-start: 0;

      h3 ::v-deep {
        margin: 0;
        p {
          margin: 0;
        }
      }
    }

    .label__description {
      margin: 0;

      .date {
        display: flex;
        align-items: center;
        gap: var(--spacing-card-xs);
        color: var(--color-heading);
        font-weight: 500;
        font-size: 1rem;
        width: fit-content;
      }

      p {
        margin-block: 0 var(--spacing-card-md);
      }
    }
  }
}
</style>
