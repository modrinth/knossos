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
            v-for="(
              notificationMeta, notificationIndex
            ) in notificationsGrouped.keys()"
            :key="notificationMeta.title"
            class="card notification"
          >
            <div class="header">
              <div class="icon">
                <UpdateIcon v-if="notificationMeta.type === 'project_update'" />
                <UsersIcon
                  v-else-if="notificationMeta.type === 'team_invite'"
                />
              </div>
              <div class="text">
                <div>
                  <h3
                    v-html="
                      $xss(
                        $md.render('**' + notificationMeta.projectName + '**')
                      )
                    "
                  />
                </div>
                <p>
                  {{ notificationMeta.projectName }} has been updated
                  {{
                    notificationMeta.count == 1
                      ? '1 time'
                      : `${notificationMeta.count} times`
                  }}
                </p>
              </div>
            </div>
            <button
              class="iconified-button"
              @click="clearNotificationGroup(notificationMeta.projectName)"
            >
              Dismiss all
            </button>
            <hr class="card-divider" />
            <div
              v-for="(notification, index) in notificationsGrouped.get(
                notificationMeta
              )"
              :key="notification.id"
              class="version"
              v-show="
                index < MAX_VERSIONS
                  ? true
                  : expandedNames.includes(notificationMeta.projectName)
              "
            >
              <div>
                <nuxt-link :to="notification.link">
                  Version
                  {{
                    notification.text.match(
                      /The project, .*, has released a new version: (.*)/m
                    )[1]
                  }}
                </nuxt-link>
                <span>
                  Notified {{ $dayjs(notification.created).fromNow() }}
                </span>
              </div>
              <div class="buttons">
                <button
                  v-for="(action, actionIndex) in notification.actions"
                  :key="actionIndex"
                  class="iconified-button"
                  @click="
                    performAction(notification, notificationIndex, actionIndex)
                    {
                      {
                        action.title
                      }
                    }
                  "
                ></button>
                <button
                  v-if="notification.actions.length === 0"
                  class="iconified-button"
                  @click="performAction(notification, notificationIndex, null)"
                >
                  Dismiss
                </button>
              </div>
            </div>
            <hr
              class="card-divider"
              v-if="notificationMeta.count > MAX_VERSIONS"
            />
            <div class="more">
              <button
                class="iconified-button"
                v-if="notificationMeta.count > MAX_VERSIONS"
                @click="toggleVersionExpand(notificationMeta.projectName)"
              >
                <span
                  v-show="!expandedNames.includes(notificationMeta.projectName)"
                  >And {{ notificationMeta.count - MAX_VERSIONS }} more</span
                >
                <span
                  v-show="expandedNames.includes(notificationMeta.projectName)"
                  >Collapse</span
                >
              </button>
            </div>
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
import UpdateIcon from '~/assets/images/utils/updated.svg?inline'
import UsersIcon from '~/assets/images/utils/users.svg?inline'
import UpToDate from '~/assets/images/illustrations/up_to_date.svg?inline'
import ThisOrThat from '~/components/ui/ThisOrThat'

const NOTIFICATION_TYPES = {
  'Team invites': 'team_invite',
  'Project updates': 'project_update',
}

const MAX_VERSIONS = 3

export default {
  name: 'Notifications',
  components: {
    ThisOrThat,
    ClearIcon,
    UpdateIcon,
    UsersIcon,
    UpToDate,
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

      const titleToMetadata = new Map()

      for (const notification of this.notificationsUngrouped) {
        const a = grouped.get(notification.title) || []
        a.push(notification)
        grouped.set(notification.title, a)
      }
      console.log(grouped)

      const withMetadata = new Map()

      grouped.forEach((val, key) => {
        if (!titleToMetadata.has(key)) {
          const meta = {
            type: val[0].type,
            projectName: key.match(/\*\*(.*)\*\* has been updated!/m)[1],
            count: grouped.get(key).length,
          }
          titleToMetadata.set(key, meta)
        }

        withMetadata.set(titleToMetadata.get(key), grouped.get(key))
      })

      console.log(withMetadata)

      return withMetadata
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
    this.MAX_VERSIONS = MAX_VERSIONS
  },
  methods: {
    toggleVersionExpand(title) {
      const isExpanded = this.$data.expandedNames.includes(title)

      if (isExpanded) {
        this.$data.expandedNames = this.$data.expandedNames.filter(
          (el) => el !== title
        )
      } else {
        this.$data.expandedNames.push(title)
      }
      console.log(this.$data.expandedNames)
    },
    // async clearNotificationGroup(projectName) {
    //   await this.notificationsGrouped.get(projectName).forEach(async (el) => {
    //     await this.performAction(el, null)
    //   })
    // },
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
    async performAction(notification, notificationIndex, actionIndex) {
      this.$nuxt.$loading.start()
      try {
        await this.$axios.delete(
          `notification/${notification.id}`,
          this.$defaultHeaders()
        )

        await this.$store.dispatch('user/deleteNotification', notification.id)

        if (actionIndex !== null) {
          const config = {
            method:
              notification.actions[actionIndex].action_route[0].toLowerCase(),
            url: `${notification.actions[actionIndex].action_route[1]}`,
            headers: {
              Authorization: this.$auth.token,
            },
          }
          await this.$axios(config)
        }
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

.notifications {
  .notification {
    // display: flex;
    flex-wrap: wrap;
    padding: var(--spacing-card-sm) var(--spacing-card-lg);

    .icon {
      display: flex;
      flex-direction: column;
      justify-content: center;

      svg {
        height: calc(3rem - var(--spacing-card-sm));
        width: auto;
        margin-right: 1rem;
      }
    }

    .version {
      display: flex;
      margin-bottom: var(--spacing-card-sm);

      :not(.buttons) {
        margin-bottom: var(--spacing-card-sm);
        // display: flex;
        flex-grow: 1;
        justify-content: space-between;
        span {
          color: var(--color-text-secondary);
          margin-right: 1rem;
        }
      }
    }

    // .version:nth-of-type(n + 4) {
    //   display: none;
    // }

    .version:nth-last-of-type(2) {
      margin-bottom: 0;
      div {
        margin-bottom: 0;
      }
    }

    .more {
      display: flex;
      justify-content: end;
    }

    .header {
      display: inline-flex;
      margin-bottom: var(--spacing-card-md);

      .text {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        div {
          display: flex;
          align-items: baseline;
          flex-direction: column;

          h3 ::v-deep {
            font-size: var(--font-size-lg);
            margin: 0 0.5rem 0 0;

            p {
              margin: 0;

              strong {
                color: var(--color-brand);
              }
            }
          }
        }
      }

      p {
        padding: 0;
        margin: 0;
      }
    }

    .buttons {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: auto;
      text-align: right;

      button {
        margin-left: auto;
        margin-bottom: 0.25rem;
      }
    }
  }
}

@media screen and (min-width: 1024px) {
  .page-contents {
    max-width: calc(1280px - 20rem) !important;
  }

  .version {
    :not(.button) {
      span {
        float: right;
      }
      a {
        font-weight: bold;
      }
    }
  }

  .notifications {
    .notification {
      transition: 0.15s height;
      button {
        float: right;
      }
      flex-wrap: nowrap;

      .text {
        flex-direction: column;

        .top {
          flex-direction: row;
        }
      }
    }
  }
}
</style>
