<template>
  <Modal ref="modal" :header="licenseName">
    <div class="modal-license">
      <div class="markdown-body" v-html="$xss($md.render(getLicenseText()))" />
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
  },
  methods: {
    async getLicenseText() {
      return (await this.$axios.get(`tag/license/${this.licenseId}`))
        .data
    },
    show() {
      this.$refs.modal.show()
    },
  },
}
</script>

<style scoped lang="scss">
.modal-license {
  padding: var(--spacing-card-bg);

  pre {
    line-break: anywhere;
    margin-top: 0;
    margin-bottom: 0;
    border-radius: var(--size-rounded-sm);
  }
}
</style>
