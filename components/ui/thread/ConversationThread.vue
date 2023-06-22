<template>
  <div>
    <div v-if="$cosmetics.developerMode" class="thread-id">
      Thread ID: <CopyCode :text="thread.id" />
    </div>
    <div v-if="sortedMessages.length > 0" class="messages universal-card recessed">
      <ThreadMessage
        v-for="message in sortedMessages"
        :key="'message-' + message.id"
        :thread="thread"
        :message="message"
        :members="members"
        :report="report"
        raised
      />
    </div>
    <span v-if="report && report.closed">
      This thread is closed and new messages cannot be sent to it.
    </span>
    <template v-else-if="!report || !report.closed">
      <div class="resizable-textarea-wrapper">
        <Chips v-model="replyViewMode" class="chips" :items="['source', 'preview']" />
        <textarea
          v-if="replyViewMode === 'source'"
          v-model="replyBody"
          :placeholder="sortedMessages.length > 0 ? 'Reply to thread...' : 'Send a message...'"
        />
        <div v-else class="markdown-body preview" v-html="renderString(replyBody)" />
      </div>
      <div class="input-group push-right">
        <button
          v-if="sortedMessages.length > 0"
          class="iconified-button brand-button"
          :disabled="!replyBody"
          @click="sendReply()"
        >
          <ReplyIcon /> Reply
        </button>
        <button
          v-else
          class="iconified-button brand-button"
          :disabled="!replyBody"
          @click="sendReply()"
        >
          <SendIcon /> Send
        </button>
        <template v-if="report">
          <button
            v-if="replyBody"
            class="iconified-button danger-button"
            @click="closeReport(true)"
          >
            <CloseIcon /> Close with reply
          </button>
          <button v-else class="iconified-button danger-button" @click="closeReport()">
            <CloseIcon /> Close thread
          </button>
        </template>
        <template v-if="project">
          <button
            v-if="replyBody"
            class="iconified-button brand-button"
            @click="sendReply(requestedStatus)"
          >
            <CheckIcon /> Approve with reply
          </button>
          <button v-else class="iconified-button brand-button" @click="setStatus(requestedStatus)">
            <CheckIcon /> Approve project
          </button>
          <button
            v-if="replyBody"
            class="iconified-button moderation-button"
            @click="sendReply('withheld')"
          >
            <EyeOffIcon /> Withhold with reply
          </button>
          <button v-else class="iconified-button moderation-button" @click="setStatus('withheld')">
            <EyeOffIcon /> Withhold project
          </button>
          <button
            v-if="replyBody"
            class="iconified-button danger-button"
            @click="sendReply('rejected')"
          >
            <CrossIcon /> Reject with reply
          </button>
          <button v-else class="iconified-button danger-button" @click="setStatus('rejected')">
            <CrossIcon /> Reject project
          </button>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup>
import Chips from '~/components/ui/Chips.vue'
import CopyCode from '~/components/ui/CopyCode.vue'
import ReplyIcon from '~/assets/images/utils/reply.svg'
import SendIcon from '~/assets/images/utils/send.svg'
import CloseIcon from '~/assets/images/utils/check-circle.svg'
import CrossIcon from '~/assets/images/utils/x.svg'
import EyeOffIcon from '~/assets/images/utils/eye-off.svg'
import CheckIcon from '~/assets/images/utils/check.svg'
import { renderString } from '~/helpers/parse.js'
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
  project: {
    type: Object,
    required: false,
    default: null,
  },
  updateThread: {
    type: Function,
    required: false,
    default: () => {},
  },
  setStatus: {
    type: Function,
    required: false,
    default: () => {},
  },
})
const app = useNuxtApp()

const members = computed(() => {
  const members = {}
  for (const member of props.thread.members) {
    members[member.id] = member
  }
  return members
})

const replyViewMode = ref('source')
const replyBody = ref('')

const sortedMessages = computed(() => {
  if (props.thread !== null) {
    return props.thread.messages
      .slice()
      .sort((a, b) => app.$dayjs(a.created) - app.$dayjs(b.created))
  }
  return []
})

async function preUpdateThread() {
  let threadId = null
  if (props.project) {
    threadId = props.project.thread_id
  } else if (props.report) {
    threadId = props.report.thread_id
  }
  let thread = null
  if (threadId) {
    thread = await useBaseFetch(`thread/${threadId}`, app.$defaultHeaders())
  }
  props.updateThread(thread)
}

async function sendReply(status = null) {
  try {
    await useBaseFetch(`thread/${props.thread.id}`, {
      method: 'POST',
      body: {
        body: {
          type: 'text',
          body: replyBody.value,
        },
      },
      ...app.$defaultHeaders(),
    })
    replyBody.value = ''
    await preUpdateThread()
    if (status !== null) {
      props.setStatus(status)
    }
  } catch (err) {
    app.$notify({
      group: 'main',
      title: 'Error sending message',
      text: err.data ? err.data.description : err,
      type: 'error',
    })
  }
}

async function closeReport(reply) {
  if (reply) {
    await sendReply()
  }

  try {
    await useBaseFetch(`report/${props.report.id}`, {
      method: 'PATCH',
      body: {
        closed: true,
      },
      ...app.$defaultHeaders(),
    })
    await preUpdateThread()
  } catch (err) {
    app.$notify({
      group: 'main',
      title: 'Error closing report',
      text: err.data ? err.data.description : err,
      type: 'error',
    })
  }
}

const requestedStatus = computed(() => props.project.requested_status ?? 'approved')
</script>

<style lang="scss" scoped>
.messages {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-card-lg);
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

.thread-id {
  margin-bottom: var(--spacing-card-md);
  font-weight: bold;
  color: var(--color-heading);
}
</style>
