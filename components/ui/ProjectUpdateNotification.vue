<template>
  <div class="card notification">
    <div class="header">
      <div class="icon">
        <UpdateIcon />
      </div>
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
      class="iconified-button"
      v-if="versions.length > 1"
      @click="clearNotificationGroup(projectTitle)"
    >
      <ClearIcon />Dismiss all
    </button>
    <hr class="card-divider" />
    <div
      v-for="(notification, index) in versions"
      :key="notification.id"
      class="version"
      v-show="index < maxVersions ? true : isExpanded"
    >
      <div>
        <nuxt-link :to="notification.link">
          Version
          {{ notification.version }}
        </nuxt-link>
        <span>Released {{ $dayjs(notification.created).fromNow() }}</span>
      </div>
      <div class="buttons">
        <button
          v-for="(action, actionIndex) in notification.actions"
          :key="actionIndex"
          class="iconified-button"
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
    <hr class="card-divider" v-if="versions.length > maxVersions" />
    <div class="more">
      <button
        class="iconified-button"
        @click="toggleExpand()"
        v-if="versions.length > maxVersions"
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
import UpdateIcon from '~/assets/images/utils/updated.svg?inline'

export default {
  name: 'ProjectUpdateNotification',
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
  components: {
    ClearIcon,
    UpdateIcon,
  },
  computed: {
    projectPageLink() {
      return this.versions[0].link.match(/(.*\/.*)\/version\/.*/m)[0]
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

  data() {
    return { isExpanded: false }
  },
}
</script>

<style scoped lang="scss">
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
  &:not(:nth-last-of-type(2)) {
    margin-bottom: var(--spacing-card-sm);
  }

  :not(.buttons) {
    // margin-bottom: var(--spacing-card-sm);
    // display: flex;
    flex-grow: 1;
    justify-content: space-between;
    span {
      color: var(--color-text-secondary);
      float: left;
      margin-right: 1rem;
    }
    a {
      text-decoration: underline;
    }
  }
}
.more {
  display: flex;
  justify-content: end;
  margin-bottom: calc(var(--spacing-card-sm) / 2);
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
    :not(.buttons) {
      span {
        float: right;
      }
      a {
        font-weight: bold;
      }
    }
  }

  button {
    float: right;
    margin-top: 0 !important;
  }

  .text {
    flex-direction: column;

    .top {
      flex-direction: row;
    }
  }
}
</style>
