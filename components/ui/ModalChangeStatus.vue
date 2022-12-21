<template>
  <Modal ref="modal" :header="`Change ${itemType} status`">
    <div v-if="baseItem" class="modal-change-status">
      <div class="markdown-body">
        <p v-if="moderation">
          Both of these fields are optional, but can be used to communicate
          problems with a project's team members. The body supports markdown
          formatting!
        </p>
      </div>
      <div v-if="itemType === 'project' && moderation" class="moderation-form">
        <h3>New project status</h3>
        <div v-if="baseItem.requested_status" class="status">
          <span>Requested status: </span>
          <Badge :type="baseItem.requested_status" />
        </div>
        <p>todo: add selector</p>
        <h3>Message</h3>
        <input
          v-model="baseItem.moderation_message"
          type="text"
          placeholder="Enter the message..."
        />
        <h3>Body</h3>
        <div class="textarea-wrapper">
          <Chips
            v-model="bodyViewMode"
            class="separator"
            :items="['source', 'preview']"
          />
          <textarea
            v-if="bodyViewMode === 'source'"
            id="body"
            v-model="baseItem.moderation_message_body"
          />
          <div
            v-else
            v-highlightjs
            class="markdown-body preview"
            v-html="
              $xss(
                $md.render(
                  baseItem.moderation_message_body
                    ? baseItem.moderation_message_body
                    : ''
                )
              )
            "
          ></div>
        </div>
      </div>
      <div class="input-group">
        <button
          :disabled="!$nuxt.$loading"
          class="iconified-button"
          @click="$refs.modal.hide()"
        >
          <CrossIcon />
          Cancel
        </button>
        <button
          class="iconified-button brand-button"
          :disabled="!$nuxt.$loading"
        >
          <RightArrowIcon />
          <template v-if="moderation">Confirm</template>
          <template
            v-else-if="
              statusTypes.find((x) => x.status === baseItem.status).approved
            "
          >
            Submit for review
          </template>
          <template v-else>Change status</template>
        </button>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from '~/components/ui/Modal'
import Chips from '~/components/ui/Chips'
import Badge from '~/components/ui/Badge'

import CrossIcon from '~/assets/images/utils/x.svg?inline'
import RightArrowIcon from '~/assets/images/utils/right-arrow.svg?inline'

export default {
  name: 'ModalChangeStatus',
  components: { Modal, Chips, Badge, CrossIcon, RightArrowIcon },
  props: {
    itemType: {
      type: String,
      required: true,
    },
    moderation: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      bodyViewMode: 'source',
      baseItem: null,
      statusTypes: [
        {
          display: 'Listed',
          status: 'approved',
          approved: true,
          description:
            'Your project will be displayed in search and accessible by URL',
        },
        {
          display: 'Archived',
          status: 'archived',
          approved: true,
          description:
            'Same functionality as listed, but an archived banner will be displayed on your page',
        },
        {
          display: 'Rejected',
          status: 'rejected',
          approved: false,
        },
        {
          display: 'Draft',
          status: 'draft',
          approved: false,
        },
        {
          display: 'Unlisted',
          status: 'unlisted',
          approved: true,
          description:
            'Your project will only be accessible by URL and hidden from search',
        },
        {
          display: 'under review',
          status: 'processing',
          approved: false,
        },
        {
          display: 'Withheld',
          status: 'withheld',
          approved: false,
        },
        {
          display: 'Scheduled',
          status: 'scheduled',
          approved: true,
        },
        {
          display: 'Private',
          status: 'private',
          approved: true,
          description:
            'Your project will only be accessible by its team members',
        },
      ],
    }
  },
  methods: {
    show(item) {
      this.baseItem = item
      this.$refs.modal.show()
    },
  },
}
</script>

<style scoped lang="scss">
.modal-change-status {
  padding: var(--spacing-card-bg);
  display: flex;
  flex-direction: column;

  .status {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;

    span {
      margin-right: 0.5rem;
    }
  }

  .textarea-wrapper {
    margin-top: 0.5rem;
    height: 15rem;
    .preview {
      overflow-y: auto;
    }
  }
  .separator {
    margin: var(--spacing-card-sm) 0;
  }

  .input-group {
    margin-top: 0.5rem;
    margin-left: auto;
  }
}
</style>
