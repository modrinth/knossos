<template>
  <div class="card notification">
    <div class="text">
      <nuxt-link :to="notification.link" class="top">
        <h3 v-html="$xss($md.render(notification.title))" />
        <span
          v-tooltip="
            $dayjs(notification.created).format('MMMM D, YYYY [at] h:mm:ss A')
          "
        >
          {{ notification.type == 'team_invite' ? 'Invited' : 'Released' }}
          {{ $dayjs(notification.created).fromNow() }}<CalendarIcon
        /></span>
      </nuxt-link>
      <p>{{ notification.text }}</p>
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
</template>
<script>
import CalendarIcon from '~/assets/images/utils/calendar.svg?inline'

export default {
  name: 'TeamInviteNotification',
  components: {
    CalendarIcon,
  },
  props: {
    notification: {
      required: true,
      type: Object,
    },
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
  align-items: center;

  .text {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    a {
      span {
        display: flex;
        align-items: center;
        color: var(--color-text-secondary);
        svg {
          margin-left: 0.3rem;
        }
      }
    }
    .top {
      display: flex;
      align-items: baseline;
      flex-direction: column;
      h3 ::v-deep {
        font-size: var(--font-size-lg);
        margin: 0 0.5rem 0 0;

        color: var(--color-brand);
        text-decoration: underline;

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
    flex-direction: row;
    justify-content: center;
    margin-left: auto;
    text-align: right;
    button {
      margin-left: 0.5rem;
      // margin-bottom: 0.25rem;
    }
  }
}

@media screen and (min-width: 1024px) {
  .notification {
    flex-wrap: nowrap;
    .text {
      flex-direction: column;
      .top {
        flex-direction: row;
      }

      a {
        span {
          color: var(--color-text-secondary);
        }
      }
    }
  }
}
</style>
