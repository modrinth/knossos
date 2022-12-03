<template>
  <Modal ref="modal" :header="licenseName">
    <div class="modal-license">
      <div class="markdown-body" v-html="$xss($md.render(licenseText))" />
    </div>
  </Modal>
</template>

<script>
import Modal from '~/components/ui/Modal'

export default {
  name: 'ModalLicense',
  components: { Modal },
  props: {
    licenseName: {
      type: String,
      required: true,
    },
    licenseId: {
      type: String,
      required: true,
    },
    licenseText: {
      type: String,
      required: true,
    },
  },
  methods: {
    show() {
      this.$refs.modal.show()
    },
  },
}
</script>

<style scoped lang="scss">
.modal-license {
  padding: var(--spacing-card-bg);
}
</style>
