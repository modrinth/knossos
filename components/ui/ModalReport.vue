<template>
  <Modal ref="modal" :header="$t('component.report-modal.title', { itemType })">
    <div class="modal-report">
      <div class="markdown-body">
        <p>
          <i18n-formatted message-id="component.report-modal.description">
            <nuxt-link v-i18n:wrap="'tos-link'" to="/legal/terms" />
            <nuxt-link v-i18n:wrap="'rules-link'" to="/legal/rules" />
          </i18n-formatted>
        </p>
      </div>
      <label class="report-label" for="report-type">
        <span>
          <strong>{{ $t('component.report-modal.reason.title') }}</strong>
        </span>
      </label>
      <multiselect
        id="report-type"
        v-model="reportType"
        :options="$store.state.tag.reportTypes"
        :custom-label="(value) => $t(`report-type.${value}`)"
        :multiple="false"
        :searchable="false"
        :show-no-results="false"
        :show-labels="false"
        :placeholder="$t('component.report-modal.reason.placeholder')"
      />
      <label class="report-label" for="additional-information">
        <strong>
          {{ $t('component.report-modal.additional-info.title') }}
        </strong>
        <span>
          {{ $t('component.report-modal.additional-info.description') }}
        </span>
      </label>
      <div class="textarea-wrapper">
        <Chips
          v-model="bodyViewType"
          class="separator"
          :items="['source', 'preview']"
          :custom-label="
            (x) => $t(`component.report-modal.additional-info.tab.${x}`)
          "
        />
        <div v-if="bodyViewType === 'source'" class="textarea-wrapper">
          <textarea id="body" v-model="body" spellcheck="true" />
        </div>
        <div
          v-else
          v-highlightjs
          class="preview"
          v-html="$xss($md.render(body))"
        ></div>
      </div>
      <div class="button-group">
        <button class="iconified-button" @click="cancel">
          <CrossIcon />
          {{ $t('component.report-modal.action.cancel') }}
        </button>
        <button class="iconified-button brand-button" @click="submitReport">
          <CheckIcon />
          {{ $t('component.report-modal.action.report') }}
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
import Chips from '~/components/ui/Chips'

export default {
  name: 'ModalReport',
  components: {
    Chips,
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
      bodyViewType: 'source',
    }
  },
  methods: {
    cancel() {
      this.reportType = ''
      this.body = ''
      this.bodyViewType = 'source'

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
          title: this.$t('error.generic'),
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

  .textarea-wrapper {
    margin-top: 0.5rem;
    height: 12rem;

    .preview {
      overflow-y: auto;
    }
  }
}
</style>
