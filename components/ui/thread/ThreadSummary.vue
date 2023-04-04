<template>
  <nuxt-link to="/moderation/report/aW2cfp2s" class="thread-summary" :class="{'raised': raised}">
    <div class="thread-title-row">
      <span v-if="report" class="thread-title">Report thread</span>
      <span v-else class="thread-title">Thread</span>
      <span class="thread-messages">5 messages <ChevronRightIcon /></span>
    </div>
    <div class="thread-message">
      <span class="user">
          <Avatar :src="members[lastMessage.author_id].avatar_url" circle size="xxs" no-shadow :raised="true"/>
          <span>{{ members[lastMessage.author_id].username }}</span>
      </span>
      <span v-if="lastMessage.body.type === 'text'" v-html="renderString(lastMessage.body.body).replace(/<\/?[^>]+(>|$)/g, '')" />
      <span v-else-if="lastMessage.body.type === 'deleted'">posted a message that has been deleted.</span>
      <span v-else-if="lastMessage.body.type === 'status_change'">changed project status to <Badge :type="lastMessage.body.new_status"/>.</span>
      <span v-else-if="lastMessage.body.type === 'thread_closure'">closed the thread.</span>
      <span v-tooltip="$dayjs(lastMessage.created).format('MMMM D, YYYY [at] h:mm A')" class="date">{{ fromNow(lastMessage.created) }}</span>
    </div>
  </nuxt-link>
</template>

<script setup>
import Avatar from "~/components/ui/Avatar.vue";
import Badge from "~/components/ui/Badge.vue";
import ChevronRightIcon from '~/assets/images/utils/chevron-right.svg'
import { renderString } from '~/helpers/parse'

const props = defineProps({
  thread: {
    type: Object,
    required: true
  },
  report: {
    type: Object,
    required: false,
    default: null,
  },
  raised: {
    type: Boolean,
    default: false,
  }
})

const data = useNuxtApp()

const members = computed(() => {
  const members = {}
  for (const member of props.thread.members) {
    members[member.id] = member
  }
  members[data.$auth.user.id] = data.$auth.user
  return members
})

const lastMessage = computed(() => props.thread.messages[props.thread.messages.length - 1])
</script>

<style lang="scss" scoped>
.thread-summary {
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg);
  padding: var(--spacing-card-bg);
  border-radius: var(--size-rounded-card);
  border: 1px solid var(--color-divider-dark);
  gap: var(--spacing-card-sm);

  .thread-title-row {
    display: flex;
    flex-direction: row;
    align-items: center;

    .thread-title {
      font-weight: bold;
      color: var(--color-heading);
    }

    .thread-messages {
      margin-left: auto;
      color: var(--color-link);

      svg {
        vertical-align: top;
      }
    }
  }

  .thread-message {
    .user {
      font-weight: bold;
    }

    .date {
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
    }
  }

  .thread-message, .thread-message > span {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-card-xs);
    align-items: center;
  }

  &.raised {
    background-color: var(--color-raised-bg);
  }

  &:hover .thread-title-row,
  &:focus-visible .thread-title-row {
    text-decoration: underline;
    filter: var(--hover-filter);
  }

  &:active .thread-title-row {
    filter: var(--active-filter);
  }
}
</style>
