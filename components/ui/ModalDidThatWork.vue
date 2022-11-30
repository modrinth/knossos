<template>
  <Modal ref="modal" header="Did that work?">
    <div class="modal-didthatwork">
      <span>
        Did your launcher open? It might take a moment, or you might need to
        accept a prompt. If it didn't open, you may need to update or
        <a
          href="https://docs.modrinth.com/docs/modpacks/playing_modpacks/#how-do-i-play-a-modpack"
        >
          install a compatible launcher</a
        >.
      </span>
      <section class="universal-card">
        <div class="adjacent-input small">
          <label for="default-install-button">
            <span class="label__title">
              Make <q>Install with Launcher</q> default
            </span>
            <span class="label__description">
              Switches the <q>Download</q> and <q>Install with Launcher</q>
              buttons.
            </span>
          </label>
          <input
            id="default-install-button"
            v-model="defaultInstallButton"
            class="switch stylized-toggle"
            type="checkbox"
          />
        </div>
      </section>
      <div class="button-group">
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
      defaultInstallButton: true,
    }
  },
  methods: {
    cancel() {
      this.$refs.modal.hide()
    },
    proceed() {
      this.$refs.modal.hide()
      this.$emit('proceed')

      localStorage.setItem('default-install-button', this.defaultInstallButton)
      localStorage.setItem('first-run-completed', 'true')
      EventBus.$emit('default-install-button', this.defaultInstallButton)
    },
    show() {
      this.$refs.modal.show()
    },
  },
}
</script>

<style scoped lang="scss">
.modal-didthatwork {
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

.universal-card {
  box-shadow: none;
}
</style>
