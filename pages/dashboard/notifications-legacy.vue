<template>
  <div>
    <nav class="navigation-card">
      <NavRow
        :links="[
          {
            label: 'All',
            href: `/dashboard/notifications`,
          },
          ...notificationTypes.map((type) => {
            return {
              label: NOTIFICATION_TYPES[type],
              href: `/dashboard/notifications/${type}`,
            }
          }),
        ]"
      />
      <div class="input-group">
        <button
          v-if="user.notifications.length > 0"
          class="iconified-button danger-button"
          @click="clearNotifications"
        >
          <ClearIcon />
          Clear all
        </button>
      </div>
    </nav>
    <div class="notifications">
      <div
        v-for="notification in $route.params.type !== undefined
          ? user.notifications.filter((x) => x.type === $route.params.type)
          : user.notifications"
        :key="notification.id"
        class="universal-card adjacent-input"
      >
        <div class="label">
          <span class="label__title">
            <nuxt-link :to="notification.link">
              <h3 v-html="renderString(notification.title)" />
            </nuxt-link>
          </span>
          <div class="label__description">
            <p>{{ notification.text }}</p>
            <span
              v-tooltip="$dayjs(notification.created).format('MMMM D, YYYY [at] h:mm:ss A')"
              class="date"
            >
              <CalendarIcon />
              Received {{ fromNow(notification.created) }}</span
            >
          </div>
        </div>
        <div class="input-group">
          <button
            v-for="(action, actionIndex) in notification.actions"
            :key="actionIndex"
            class="iconified-button"
            :class="`action-button-${action.title.toLowerCase().replaceAll(' ', '-')}`"
            @click="performAction(notification, notificationIndex, actionIndex)"
          >
            {{ action.title }}
          </button>
          <button
            v-if="notification.actions.length === 0"
            class="iconified-button"
            @click="performAction(notification, notificationIndex, null)"
          >
            Dismiss
          </button>
        </div>
      </div>
      <div v-if="user.notifications.length === 0" class="error">
        <UpToDate class="icon" />
        <br />
        <span class="text">You are up-to-date!</span>
      </div>
    </div>
  </div>
</template>

<script>
import ClearIcon from 'assets/images/utils/clear.svg'
import SettingsIcon from 'assets/images/utils/settings.svg'
import CalendarIcon from 'assets/images/utils/calendar.svg'
import UpToDate from 'assets/images/illustrations/up_to_date.svg'
import NavRow from '~/components/ui/NavRow.vue'
import { renderString } from '~/helpers/parse.js'

export default defineNuxtComponent({
  components: {
    NavRow,
    ClearIcon,
    SettingsIcon,
    CalendarIcon,
    UpToDate,
  },
  async setup() {
    definePageMeta({
      middleware: 'auth',
    })

    const user = await useUser()
    if (process.client) {
      await initUserNotifs()
    }

    return { user: ref(user) }
  },
  head: {
    title: 'Notifications - Modrinth',
  },
  computed: {
    notificationTypes() {
      const obj = {}

      for (const notification of this.user.notifications.filter((it) => it.type !== null)) {
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
    renderString,
    async clearNotifications() {
      try {
        const ids = this.user.notifications.map((x) => x.id)

        await useBaseFetch(`notifications?ids=${JSON.stringify(ids)}`, {
          method: 'DELETE',
          ...this.$defaultHeaders(),
        })

        await userDeleteNotifications(ids)
      } catch (err) {
        this.$notify({
          group: 'main',
          title: 'An error occurred',
          text: err.data.description,
          type: 'error',
        })
      }
    },
    async performAction(notification, _notificationIndex, actionIndex) {
      startLoading()
      try {
        await useBaseFetch(`notification/${notification.id}`, {
          method: 'DELETE',
          ...this.$defaultHeaders(),
        })

        await userDeleteNotification(notification.id)

        if (actionIndex !== null) {
          await useBaseFetch(`${notification.actions[actionIndex].action_route[1]}`, {
            method: notification.actions[actionIndex].action_route[0].toUpperCase(),
            ...this.$defaultHeaders(),
          })
        }
      } catch (err) {
        this.$notify({
          group: 'main',
          title: 'An error occurred',
          text: err.data.description,
          type: 'error',
        })
      }
      stopLoading()
    },
  },
})
</script>

<style lang="scss" scoped>
:deep(.navigation .nav-link) {
  text-transform: none;
}

.notifications {
  .label {
    .label__title {
      display: flex;
      gap: var(--spacing-card-sm);
      align-items: baseline;
      margin-block-start: 0;

      :deep(h3) {
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
