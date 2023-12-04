<template>
  <div>
    <Modal
      ref="modalSubmit"
      :header="isRejected(project) ? 'Resubmit for review' : 'Submit for review'"
      :noblur="!(cosmetics.advancedRendering ?? true)"
    >
      <div class="modal-submit universal-body">
        <span>
          You're submitting <span class="project-title">{{ project.title }}</span> to be reviewed
          again by the moderators.
        </span>
        <span>
          Make sure you have addressed the comments from the moderation team.
          <span class="known-errors">
            Repeated submissions without addressing the moderators' comments may result in an
            account suspension.
          </span>
        </span>
        <Checkbox
          v-model="submissionConfirmation"
          description="Confirm I have addressed the messages from the moderators"
        >
          I confirm that I have properly addressed the moderators' comments.
        </Checkbox>
        <div class="input-group push-right">
          <button class="btn btn-highlight" :disabled="!submissionConfirmation" @click="resubmit()">
            <ScaleIcon /> Resubmit for review
          </button>
        </div>
      </div>
    </Modal>
    <div v-if="cosmetics.developerMode" class="thread-id">
      Thread ID: <CopyCode :text="thread.id" />
    </div>
    <div v-if="sortedMessages.length > 0" class="messages card recessed">
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
      <div class="markdown-editor-spacing">
        <MarkdownEditor
          v-model="replyBody"
          :placeholder="sortedMessages.length > 0 ? 'Reply to thread...' : 'Send a message...'"
          :on-image-upload="onUploadImage"
        />
      </div>
      <div class="input-group">
        <button
          v-if="sortedMessages.length > 0"
          class="btn btn-primary"
          :disabled="!replyBody"
          @click="sendReply()"
        >
          <ReplyIcon /> Reply
        </button>
        <button v-else class="btn btn-primary" :disabled="!replyBody" @click="sendReply()">
          <SendIcon /> Send
        </button>
        <template v-if="currentMember && !isStaff(auth.user)">
          <template v-if="isRejected(project)">
            <button v-if="replyBody" class="btn btn-highlight" @click="openResubmitModal(true)">
              <ScaleIcon /> Resubmit for review with reply
            </button>
            <button v-else class="btn btn-highlight" @click="openResubmitModal(false)">
              <ScaleIcon /> Resubmit for review
            </button>
          </template>
        </template>
        <div class="spacer"></div>
        <div class="input-group extra-options">
          <template v-if="report">
            <template v-if="isStaff(auth.user)">
              <button v-if="replyBody" class="btn btn-red" @click="closeReport(true)">
                <CheckCircleIcon /> Close with reply
              </button>
              <button v-else class="btn btn-red" @click="closeReport()">
                <CheckCircleIcon /> Close thread
              </button>
            </template>
          </template>
          <template v-if="project">
            <template v-if="isStaff(auth.user)">
              <button
                v-if="replyBody"
                class="btn btn-primary"
                :disabled="isApproved(project)"
                @click="sendReply(requestedStatus)"
              >
                <CheckIcon /> Approve with reply
              </button>
              <button
                v-else
                class="btn btn-primary"
                :disabled="isApproved(project)"
                @click="setStatus(requestedStatus)"
              >
                <CheckIcon /> Approve project
              </button>
              <button
                v-if="replyBody"
                class="btn btn-highlight"
                :disabled="project.status === 'withheld'"
                @click="sendReply('withheld')"
              >
                <EyeOffIcon /> Withhold with reply
              </button>
              <button
                v-else
                class="btn btn-highlight"
                :disabled="project.status === 'withheld'"
                @click="setStatus('withheld')"
              >
                <EyeOffIcon /> Withhold project
              </button>
              <button
                v-if="replyBody"
                class="btn btn-red"
                :disabled="project.status === 'rejected'"
                @click="sendReply('rejected')"
              >
                <XIcon /> Reject with reply
              </button>
              <button
                v-else
                class="btn btn-red"
                :disabled="project.status === 'rejected'"
                @click="setStatus('rejected')"
              >
                <XIcon /> Reject project
              </button>
            </template>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import {
  Modal,
  CopyCode,
  ReplyIcon,
  SendIcon,
  CheckCircleIcon,
  XIcon,
  EyeOffIcon,
  CheckIcon,
  ScaleIcon,
  Checkbox,
  isStaff,
  isApproved,
  isRejected,
  MarkdownEditor,
} from 'omorphia'
import { useImageUpload } from '~/composables/image-upload.ts'
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
  currentMember: {
    type: Object,
    default() {
      return null
    },
  },
  auth: {
    type: Object,
    required: true,
  },
})
const cosmetics = useCosmetics()

const members = computed(() => {
  const members = {}
  for (const member of props.thread.members) {
    members[member.id] = member
  }
  return members
})

const replyBody = ref('')

const sortedMessages = computed(() => {
  if (props.thread !== null) {
    return props.thread.messages.slice().sort((a, b) => dayjs(a.created) - dayjs(b.created))
  }
  return []
})

const modalSubmit = ref(null)

async function updateThreadLocal() {
  let threadId = null
  if (props.project) {
    threadId = props.project.thread_id
  } else if (props.report) {
    threadId = props.report.thread_id
  }
  let thread = null
  if (threadId) {
    thread = await useBaseFetch(`thread/${threadId}`)
  }
  props.updateThread(thread)
}

const imageIDs = ref([])

async function onUploadImage(file) {
  const response = await useImageUpload(file, { context: 'thread_message' })

  imageIDs.value.push(response.id)
  // Keep the last 10 entries of image IDs
  imageIDs.value = imageIDs.value.slice(-10)

  return response.url
}

async function sendReply(status = null) {
  try {
    const body = {
      body: {
        type: 'text',
        body: replyBody.value,
      },
    }

    if (imageIDs.value.length > 0) {
      body.body = {
        ...body.body,
        uploaded_images: imageIDs.value,
      }
    }

    await useBaseFetch(`thread/${props.thread.id}`, {
      method: 'POST',
      body,
    })

    replyBody.value = ''

    await updateThreadLocal()
    if (status !== null) {
      props.setStatus(status)
    }
  } catch (err) {
    addNotification({
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
    })
    await updateThreadLocal()
  } catch (err) {
    addNotification({
      group: 'main',
      title: 'Error closing report',
      text: err.data ? err.data.description : err,
      type: 'error',
    })
  }
}

const replyWithSubmission = ref(false)
const submissionConfirmation = ref(false)

function openResubmitModal(reply) {
  submissionConfirmation.value = false
  replyWithSubmission.value = reply
  modalSubmit.value.show()
}

async function resubmit() {
  if (replyWithSubmission.value) {
    await sendReply('processing')
  } else {
    await props.setStatus('processing')
  }
  modalSubmit.value.hide()
}

const requestedStatus = computed(() => props.project.requested_status ?? 'approved')
</script>

<style lang="scss" scoped>
.markdown-editor-spacing {
  margin-bottom: var(--gap-md);
}

.messages {
  display: flex;
  flex-direction: column;
  padding: var(--gap-md);
}

.resizable-textarea-wrapper {
  margin-bottom: var(--gap-sm);

  textarea {
    padding: var(--gap-lg);
    width: 100%;
  }

  .chips {
    margin-bottom: var(--gap-md);
  }

  .preview {
    overflow-y: auto;
  }
}

.thread-id {
  margin-bottom: var(--gap-md);
  font-weight: bold;
  color: var(--color-base);
  filter: brightness(1.1);
}

.input-group {
  .spacer {
    flex-grow: 1;
    flex-shrink: 1;
  }

  .extra-options {
    flex-basis: fit-content;
  }
}

.modal-submit {
  padding: var(--gap-lg);
  display: flex;
  flex-direction: column;
  gap: var(--gap-xl);

  .project-title {
    font-weight: bold;
  }
}
</style>
