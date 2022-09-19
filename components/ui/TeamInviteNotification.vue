<template>
  <div class="card notification">
    <div class="icon">
      <UsersIcon />
    </div>
    <div class="text">
      <nuxt-link :to="notification.link" class="top">
        <h3 v-html="$xss($md.render(notification.title))" />
        <span> Notified {{ $dayjs(notification.created).fromNow() }}</span>
      </nuxt-link>
      <p>{{ notification.text }}</p>
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
</template>
<script>
import UsersIcon from '~/assets/images/utils/users.svg?inline'
export default {
  name: 'TeamInviteNotification',
  props: {
    notification: {
      required: true,
      type: Object,
    },
  },
  components: {
    UsersIcon,
  },
  methods: {
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

.notification {
  display: flex;
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
  .text {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    a {
      span {
        color: var(--color-text-secondary);
      }
    }
    .top {
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

@media screen and (min-width: 1024px) {
  .page-contents {
    max-width: calc(1280px - 20rem) !important;
  }

  .notification {
    flex-wrap: nowrap;
    .text {
      flex-direction: column;
      .top {
        flex-direction: row;
      }

      a {
        span {
          color: var(--color-text);
        }
      }
    }
  }
}
</style>
