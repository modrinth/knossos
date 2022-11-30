<template>
  <Modal ref="modal" header="Launcher Integration">
    <div class="modal-firstrun">
      <span>
        Do you have a launcher installed? If so, click <q>Yes</q> and we'll try
        to open your launcher so it can install this mod. <br /><br />
        If you don't have a launcher installed, we
        <a
          href="https://docs.modrinth.com/docs/modpacks/playing_modpacks/#how-do-i-play-a-modpack"
        >
          have a few recommended ones
        </a>
        you can try out.
      </span>
      <div class="button-group">
        <button class="iconified-button danger-button" @click="cancelForever">
          <CrossIcon />
          Don't Show Again
        </button>
        <button class="iconified-button" @click="cancel">
          <CrossIcon />
          Cancel
        </button>
        <button class="iconified-button brand-button" @click="proceed">
          <CheckIcon />
          Yes
        </button>
      </div>
    </div>
  </Modal>
</template>

<script>
import CrossIcon from '~/assets/images/utils/x.svg?inline'
import CheckIcon from '~/assets/images/utils/check.svg?inline'
import Modal from '~/components/ui/Modal'

import { EventBus } from '~/app/event-bus'

export default {
  name: 'ModalConfirm',
  components: {
    CrossIcon,
    CheckIcon,
    Modal,
  },
  props: {},
  data() {
    return {
      link: '',
    }
  },
  methods: {
    cancelForever() {
      this.cancel()
      localStorage.setItem('integration-enabled', 'false')
      EventBus.$emit('integration-enabled', false)
    },
    cancel() {
      this.$refs.modal.hide()
    },
    proceed() {
      this.$refs.modal.hide()
      this.$emit('proceed')

      window.location = this.link
      this.$parent.$refs.modal_didthatwork.show()
    },
    show(link) {
      this.$refs.modal.show()
      this.link = link
    },
  },
}
</script>

<style scoped lang="scss">
.modal-firstrun {
  padding: var(--spacing-card-bg);
  display: flex;
  flex-direction: column;

  .button-group {
    margin-left: auto;
    margin-top: 1.5rem;
  }
}

a {
  color: var(--color-brand);
  text-decoration: underline;
}
</style>
