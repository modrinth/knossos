<template>
  <Modal ref="modal" :header="`Report ${itemType}`">
    <div class="modal-report">
      <div class="markdown-body">
        <p>
          Modding should be safe for everyone, so we take abuse and malicious
          intent seriously at Modrinth. We want to hear about harmful content on
          the site that violates our
          <nuxt-link to="/legal/terms">ToS</nuxt-link> and
          <nuxt-link to="/legal/rules">Rules</nuxt-link>. Rest assured, we’ll
          keep your identifying information private.
        </p>
      </div>
      <label class="report-label" for="report-type">
        <span>
          <strong>Reason</strong>
        </span>
      </label>
      <multiselect
        id="report-type"
        v-model="reportType"
        :options="$store.state.tag.reportTypes"
        :custom-label="
          (value) => value.charAt(0).toUpperCase() + value.slice(1)
        "
        :multiple="false"
        :searchable="false"
        :show-no-results="false"
        :show-labels="false"
        placeholder="Choose report type"
      />
      <label class="report-label" for="additional-information">
        <strong>Additional information</strong>
        <span>
          Include links and images if possible. Markdown formatting is
          supported.
        </span>
      </label>
      <div class="textarea-wrapper">
        <textarea id="additional-information" v-model="body" />
      </div>
      <div class="button-group">
        <button class="iconified-button" @click="cancel">
          <CrossIcon />
          Cancel
        </button>
        <button class="iconified-button brand-button" @click="submitReport">
          <CheckIcon />
          Report {{ itemType }}
        </button>
      </div>
    </div>
  </Modal>
</template>

<script>
import Multiselect from 'vue-multiselect'
import CrossIcon from '~/assets/images/utils/x.svg?inline'
import CheckIcon from '~/assets/images/utils/check.svg?inline'
import Modal from '~/components/ui/Modal'

export default {
  name: 'ModalReport',
  components: {
    CrossIcon,
    CheckIcon,
    Modal,
    Multiselect,
  },
  props: {
    itemType: {
      type: String,
      default: '',
    },
    itemId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      reportType: '',
      body: '',
    }
  },
  methods: {
    cancel() {
      this.$refs.modal.hide()
    },
    async submitReport() {
      this.$nuxt.$loading.start()
      try {
        const data = {
          report_type: this.reportType,
          item_id: this.itemId,
          item_type: this.itemType,
          body: this.body,
        }
        await this.$axios.post('report', data, this.$defaultHeaders())

        this.$refs.modal.hide()
      } catch (err) {
        this.$notify({
          group: 'main',
          title: 'An error occurred',
          text: err.response.data.description,
          type: 'error',
        })
      }
      this.$nuxt.$loading.finish()
    },
    show() {
      this.$refs.modal.show()
    },
  },
}
</script>

<style scoped lang="scss">
.modal-report {
  padding: var(--spacing-card-bg);
  display: flex;
  flex-direction: column;

  .markdown-body {
    margin-bottom: 1rem;
  }

  .multiselect {
    max-width: 20rem;
    margin-bottom: 1rem;
  }

  .report-label {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .button-group {
    margin-left: auto;
    margin-top: 1.5rem;
  }

  textarea {
    min-height: 10rem;
  }
}
</style>
