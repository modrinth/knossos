<template>
  <div>
    <div class="messages universal-card recessed">
      <div v-for="message in thread.messages" :key="'message-'+message.id" class="message" :class="{'has-body': message.body.type === 'text'}">
        <template v-if="members[message.author_id]">
          <nuxt-link class="message__icon" :to="`/user/${members[message.author_id].username}`" tabindex="-1">
            <Avatar class="message__icon" :src="members[message.author_id].avatar_url" circle raised/>
          </nuxt-link>
          <span :class="`message__author role-${members[message.author_id].role}`">
          <nuxt-link :to="`/user/${members[message.author_id].username}`">
            {{ members[message.author_id].username }}
          </nuxt-link>
          <ModeratorIcon v-if="members[message.author_id].role === 'moderator'" v-tooltip="'Moderator'"/>
          <ModrinthIcon v-else-if="members[message.author_id].role === 'admin'" v-tooltip="'Modrinth Team'"/>
          <MicIcon v-if="report && message.author_id === report.reporter.id" v-tooltip="'Reporter'" class="reporter-icon"/>
        </span>
        </template>
        <template v-else>
          <div class="message__icon backed-svg circle raised moderation-color"><ModeratorIcon /></div>
          <span class="message__author moderation-color">
          Moderator
          <ModeratorIcon v-tooltip="'Moderator'"/>
        </span>
        </template>
        <span class="message__date">
          <span v-tooltip="$dayjs(message.created).format('MMMM D, YYYY [at] h:mm A')">{{ fromNow(message.created) }}</span>
        </span>
        <div v-if="message.body.type === 'text'" class="message__body markdown-body" v-html="renderString(message.body.body)" />
        <div v-else class="message__body status-message">
          <span v-if="message.body.type === 'deleted'">posted a message that has been deleted.</span>
          <span v-else-if="message.body.type === 'status_change'">changed project status to <Badge :type="message.body.new_status"/>.</span>
          <span v-else-if="message.body.type === 'thread_closure'">closed the thread.</span>
        </div>
      </div>
    </div>
    <div class="resizable-textarea-wrapper">
      <Chips v-model="replyViewMode" class="chips" :items="['source', 'preview']" />
      <textarea v-if="replyViewMode === 'source'" v-model="replyBody" placeholder="Reply to thread..."/>
      <div v-else class="markdown-body preview" v-html="renderString(replyBody)" />
    </div>
    <div class="input-group push-right">
      <button class="iconified-button" :disabled="!replyBody"><ReplyIcon /> Reply</button>
      <template v-if="report">
        <button v-if="replyBody" class="iconified-button danger-button"><CloseIcon /> Close with reply</button>
        <button v-else class="iconified-button danger-button"><CloseIcon /> Close thread</button>
      </template>
    </div>
  </div>
</template>

<script setup>
import Avatar from "~/components/ui/Avatar.vue";
import Badge from "~/components/ui/Badge.vue";
import Chips from "~/components/ui/Chips.vue";
import ReplyIcon from "~/assets/images/utils/reply.svg"
import CloseIcon from "~/assets/images/utils/check-circle.svg"
import ModeratorIcon from "~/assets/images/sidebar/admin.svg"
import ModrinthIcon from "~/assets/images/utils/modrinth.svg"
import MicIcon from "~/assets/images/utils/mic.svg"
import { renderString } from '~/helpers/parse'

const props = defineProps({
  thread: {
    type: Object,
    required: true
  },
  report: {
    type: Object,
    required: false,
    default: null
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

const replyViewMode = ref('source')
const replyBody = ref('')
</script>

<style lang="scss" scoped>
.messages {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-card-lg);
}

.message {
  --gap-size: var(--spacing-card-xs);
  display: grid;
  grid-template:
      'icon author'
      'body body'
      'date date';
  grid-template-columns: auto 1fr;
  gap: var(--gap-size);
  align-items: center;

  :deep(.avatar), .backed-svg {
    --size: 1.5rem;
  }

  &.has-body {
    --gap-size: var(--spacing-card-sm);
    grid-template:
      'icon author'
      'icon body'
      'date date';
    grid-template-columns: min-content 1fr;
    column-gap: var(--gap-size);
    row-gap: var(--spacing-card-xs);

    :deep(.avatar), .backed-svg {
      --size: 3rem;
    }
  }
}

.message__icon {
  grid-area: icon;
}

.message__author {
  grid-area: author;
  font-weight: bold;
  display: flex;
  gap: var(--spacing-card-xs);
  flex-wrap: wrap;
  flex-shrink: 0;
}

.message__date {
  grid-area: date;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary)
}

.message__body {
  grid-area: body;
}

.status-message > span {
  display: flex;
  align-items: center;
  gap: var(--spacing-card-xs);
  flex-wrap: wrap;
}

.resizable-textarea-wrapper {
  margin-bottom: var(--spacing-card-sm);

  textarea {
    padding: var(--spacing-card-bg);
  }

  .chips {
    margin-bottom: var(--spacing-card-md);
  }

  .preview {
    overflow-y: auto;
  }
}

a {
  display: flex;
  align-items: center;
  text-decoration: none;
}

a:focus-visible + .message__author a,
a:hover + .message__author a,
.message__author a:focus-visible,
.message__author a:hover {
  text-decoration: underline;
  filter: var(--hover-filter);
}

a:active + .message__author a,
.message__author a:active {
  filter: var(--active-filter);
}

.moderation-color, role-moderator {
  color: var(--color-special-orange);
}

.role-admin {
  color: var(--color-brand-green);
}

.reporter-icon {
  color: var(--color-special-purple);
}

@media screen and (min-width: 600px) {
  .message {
    grid-template:
      'icon author body'
      'date date date';
    grid-template-columns: min-content auto 1fr;

    &.has-body {
      grid-template:
      'icon author'
      'icon body'
      'date date';
      grid-template-columns: min-content 1fr;
    }
  }
}

@media screen and (min-width: 1024px) {
  .message {
    grid-template:
      'icon author body date';
    grid-template-columns: min-content auto 1fr auto;

    &.has-body {
      grid-template:
      'icon author date'
      'icon body body';
      grid-template-columns: min-content auto 1fr;
      grid-template-rows: min-content 1fr;
    }
  }
}
</style>
