<template>
  <Modal :header="title" :show="isShowing" @close="cancel" style="--owo: red">
    <div class="modal-delete">
      <div class="markdown-body">
        <slot />
      </div>
      <label v-if="hasToType" for="confirmation" class="confirmation-label">
        <span>
          <IntlFormatted
            message-id="component.confirm-modal.verification.title"
          >
            <template #~text>
              <strong class="confirmation-text">{{ confirmationText }}</strong>
            </template>
          </IntlFormatted>
        </span>
      </label>
      <div class="confirmation-input">
        <input
          v-if="hasToType"
          id="confirmation"
          v-model="confirmation_typed"
          type="text"
          :placeholder="$t('component.confirm-modal.verification.placeholder')"
          @input="type"
        />
      </div>
      <div class="button-group">
        <button class="iconified-button" @click="cancel">
          <CrossIcon />
          {{ $t('generic.action.cancel') }}
        </button>
        <button
          class="iconified-button danger-button"
          :disabled="action_disabled"
          @click="proceed"
        >
          <TrashIcon />
          {{ proceedLabel }}
        </button>
      </div>
    </div>
  </Modal>
</template>

<script>
import CrossIcon from '~/assets/images/utils/x.svg?inline'
import TrashIcon from '~/assets/images/utils/trash.svg?inline'
import Modal from '~/components/ui/Modal'

export default {
  name: 'ModalConfirm',
  components: {
    CrossIcon,
    TrashIcon,
    Modal,
  },
  props: {
    confirmationText: {
      type: String,
      default: '',
    },
    hasToType: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'No title defined',
      required: true,
    },
    proceedLabel: {
      type: String,
      default: 'Proceed',
    },
  },
  data() {
    return {
      action_disabled: this.hasToType,
      confirmation_typed: '',
      isShowing: false,
    }
  },
  methods: {
    cancel() {
      this.isShowing = false
    },
    proceed() {
      this.isShowing = false
      this.$emit('proceed')
    },
    type() {
      if (this.hasToType) {
        this.action_disabled =
          this.confirmation_typed.toLowerCase() !==
          this.confirmationText.toLowerCase()
      }
    },
    show() {
      this.isShowing = true
    },
  },
}
</script>

<style scoped lang="scss">
.modal-delete {
  padding: var(--spacing-card-bg);
  display: flex;
  flex-direction: column;

  .markdown-body {
    margin-bottom: 1rem;
  }

  .confirmation-label {
    margin-bottom: 0.5rem;
  }

  .confirmation-text {
    padding-right: 0.25ch;
  }

  .confirmation-input {
    input {
      width: 20rem;
      max-width: 100%;
    }
  }

  .button-group {
    margin-left: auto;
    margin-top: 1.5rem;
  }
}
</style>
