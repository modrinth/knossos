<template>
  <nuxt-link :to="link" class="thread-summary" :class="{ raised: raised }">
    <div class="thread-title-row">
      <span v-if="report" class="thread-title">Report thread</span>
      <span v-else class="thread-title">Thread</span>
      <span class="thread-messages"
        >{{ props.thread.messages.length }} messages <ChevronRightIcon
      /></span>
    </div>
    <template v-if="displayMessages.length > 0">
      <ThreadMessage
        v-for="message in displayMessages"
        :key="message.id"
        :message="message"
        :report="report"
        :members="members"
        force-compact
        no-links
      />
    </template>
    <span v-else>There are no messages in this thread yet.</span>
  </nuxt-link>
</template>

<script setup>
import dayjs from 'dayjs'
import { ChevronRightIcon } from 'omorphia'
import ThreadMessage from '~/components/ui/thread/ThreadMessage.vue'

const props = defineProps({
  thread: {
    type: Object,
    required: true,
  },
  report: {
    type: Object,
    required: false,
    default: null,
  },
  raised: {
    type: Boolean,
    default: false,
  },
  link: {
    type: String,
    required: true,
  },
  messages: {
    type: Array,
    required: false,
    default() {
      return []
    },
  },
  auth: {
    type: Object,
    required: true,
  },
})

const members = computed(() => {
  const members = {}
  for (const member of props.thread.members) {
    members[member.id] = member
  }
  members[props.auth.user.id] = props.auth.user
  return members
})

const displayMessages = computed(() => {
  const sortedMessages = props.thread.messages
    .slice()
    .sort((a, b) => dayjs(a.created) - dayjs(b.created))
  if (props.messages.length > 0) {
    return sortedMessages.filter((msg) => props.messages.includes(msg.id))
  } else {
    return sortedMessages.length > 0 ? [sortedMessages[sortedMessages.length - 1]] : []
  }
})
</script>

<style lang="scss" scoped>
.thread-summary {
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg);
  padding: var(--gap-lg);
  border-radius: var(--round-card);
  border: 1px solid var(--color-divider);
  gap: var(--gap-sm);

  .thread-title-row {
    display: flex;
    flex-direction: row;
    align-items: center;

    .thread-title {
      font-weight: bold;
      color: var(--color-base);
      filter: brightness(1.1);
    }

    .thread-messages {
      margin-left: auto;
      color: var(--color-blue);

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
      color: var(--color-secondary);
      font-size: var(--font-size-sm);
    }
  }

  .thread-message,
  .thread-message > span {
    display: flex;
    flex-direction: row;
    gap: var(--gap-xs);
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
