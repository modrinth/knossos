<template>
  <div class="card notification">
    <div class="header">
      <div class="text">
        <div>
          <h3>
            <nuxt-link :to="projectPageLink">
              <strong>
                {{ projectTitle }}
              </strong>
            </nuxt-link>
          </h3>
        </div>
        <p>
          {{ projectTitle }} has been updated
          {{ versions.length == 1 ? '1 time' : `${versions.length} times` }}
        </p>
      </div>
    </div>
    <button
      v-if="versions.length > 1"
      class="iconified-button"
      @click="clearNotificationGroup(projectTitle)"
    >
      <ClearIcon />Dismiss all
    </button>
    <hr class="card-divider" />
    <div
      v-for="(notification, index) in versions"
      v-show="index < maxVersions ? true : isExpanded"
      :key="notification.id"
      class="version"
    >
      <div class="content">
        <nuxt-link :to="notification.link">
          Version
          {{ notification.version }}
        </nuxt-link>
        <span
          v-tooltip="
            $dayjs(notification.created).format('MMMM D, YYYY [at] h:mm:ss A')
          "
          >Released {{ $dayjs(notification.created).fromNow() }}<CalendarIcon
        /></span>
      </div>
      <div class="buttons">
        <button
          v-for="(action, actionIndex) in notification.actions"
          :key="actionIndex"
          class="iconified-button"
          @click="performAction(notification, 0, actionIndex)"
        >
          {{ action.title }}
        </button>
        <button
          v-if="notification.actions.length === 0"
          class="iconified-button"
          @click="performAction(notification, 0, null)"
        >
          Dismiss
        </button>
      </div>
    </div>
    <hr v-if="versions.length > maxVersions" class="card-divider" />
    <div class="more">
      <button
        v-if="versions.length > maxVersions"
        class="iconified-button"
        @click="toggleExpand()"
      >
        <span v-show="!isExpanded"
          >Show {{ versions.length - maxVersions }} more</span
        >
        <span v-show="isExpanded">Collapse</span>
      </button>
    </div>
  </div>
</template>
<script>
import ClearIcon from '~/assets/images/utils/clear.svg?inline'
import CalendarIcon from '~/assets/images/utils/calendar.svg?inline'

export default {
  name: 'ProjectUpdateNotification',
  components: {
    ClearIcon,
    CalendarIcon,
  },
  props: {
    projectTitle: {
      required: true,
      type: String,
    },
    versions: {
      required: true,
      type: Array,
    },
    maxVersions: { type: Number, default: 3 },
  },

  data() {
    return { isExpanded: false }
  },
  computed: {
    projectPageLink() {
      return this.versions[0].link.match(/(.*\/.*)\/version\/.*/m)[1] || ''
    },
  },
  methods: {
    toggleExpand() {
      this.isExpanded = !this.isExpanded
    },
    async clearNotificationGroup(projectName) {
      await this.$props.versions.forEach(async (el) => {
        await this.performAction(el, null)
      })
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

<style scoped lang="scss">
.version {
  display: flex;
  &:not(:nth-last-of-type(2)) {
    margin-bottom: var(--spacing-card-sm);
  }

  .content {
    justify-content: space-between;
    width: 100%;
    span {
      color: var(--color-text-secondary);
      float: left;
      margin-right: 1rem;
      display: flex;
      align-items: center;
      justify-content: end;

      svg {
        margin-left: 0.3rem;
      }
    }

    a {
      text-decoration: underline;
      font-weight: bold;
    }
  }
}
.more {
  display: flex;
  margin-bottom: calc(var(--spacing-card-sm) / 2);
  button {
    margin-left: auto;
  }
}

.header + button {
  margin-top: var(--spacing-card-md);
}
.header {
  display: inline-flex;
  // margin-bottom: var(--spacing-card-md);
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

        * {
          margin: 0;

          strong {
            color: var(--color-brand);
            text-decoration: underline;
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
  height: fit-content;

  button {
    margin-left: auto;
    margin-bottom: 0.25rem;
  }
}

@media screen and (min-width: 1024px) {
  .page-contents {
    max-width: calc(1280px - 20rem) !important;
  }

  .version {
    .content {
      display: flex;
      align-items: center;
      span {
        float: right;
      }
    }
  }

  button {
    float: right;
    margin-top: 0 !important;
  }

  .text {
    flex-direction: column;
  }
}
</style>
