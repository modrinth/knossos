<template>
  <Modal ref="modal" :header="formatMessage(messages.modalTitle)">
    <div class="modal-creation universal-labels">
      <div class="markdown-body">
        <p>{{ formatMessage(messages.modalDescription) }}</p>
        <p v-if="isEnglishLocal" class="important-text">
          {{ formatMessage(messages.modalDescriptionNote) }}
        </p>
      </div>
      <label for="name">
        <span class="label__title">
          {{ formatMessage(messages.nameLabel) }}
          <span class="required">*</span>
        </span>
      </label>
      <input
        id="name"
        v-model="name"
        type="text"
        maxlength="64"
        :placeholder="formatMessage(messages.namePlaceholder)"
        autocomplete="off"
        @input="updatedName()"
      />
      <label for="slug">
        <span class="label__title">
          {{ formatMessage(messages.urlLabel) }}
          <span class="required">*</span>
        </span>
      </label>
      <div class="text-input-wrapper">
        <div class="text-input-wrapper__before">https://modrinth.com/project/</div>
        <input
          id="slug"
          v-model="slug"
          type="text"
          maxlength="64"
          autocomplete="off"
          @input="manualSlug = true"
        />
      </div>
      <label for="visibility">
        <span class="label__title">Visibility<span class="required">*</span></span>
        <span class="label__description">
          The visibility of your project after it has been approved.
        </span>
      </label>
      <multiselect
        id="visibility"
        v-model="visibility"
        :options="visibilities"
        track-by="actual"
        label="display"
        :multiple="false"
        :searchable="false"
        :show-no-results="false"
        :show-labels="false"
        placeholder="Choose visibility.."
        open-direction="bottom"
      />
      <label for="additional-information">
        <span class="label__title">
          {{ formatMessage(messages.summaryLabel) }}
          <span class="required">*</span>
        </span>
        <span class="label__description">
          {{ formatMessage(messages.summaryDescription) }}
        </span>
      </label>
      <div class="textarea-wrapper">
        <textarea id="additional-information" v-model="description" maxlength="256" />
      </div>
      <div class="push-right input-group">
        <button class="iconified-button" @click="cancel">
          <CrossIcon />
          {{ formatMessage(commonMessages.cancelButton) }}
        </button>
        <button class="iconified-button brand-button" @click="createProject">
          <CheckIcon />
          {{ formatMessage(commonMessages.continueButton) }}
        </button>
      </div>
    </div>
  </Modal>
</template>

<script>
import { Multiselect } from 'vue-multiselect'
import CrossIcon from '~/assets/images/utils/x.svg'
import CheckIcon from '~/assets/images/utils/right-arrow.svg'
import Modal from '~/components/ui/Modal.vue'

const messages = defineMessages({
  modalTitle: {
    id: 'modal.create-project.title',
    defaultMessage: 'Create a project',
  },
  modalDescription: {
    id: 'modal.create-project.description',
    defaultMessage: 'New projects are created as drafts and can be found under your profile page.',
  },
  modalDescriptionNote: {
    id: 'modal.create-project.description.note',
    defaultMessage:
      'Some project metadata, such as the summary and description, must be written in English.',
  },
  nameLabel: {
    id: 'modal.create-project.input.name.label',
    defaultMessage: 'Name',
  },
  namePlaceholder: {
    id: 'modal.create-project.input.name.placeholder',
    defaultMessage: 'Enter project name...',
  },
  projectTypeLabel: {
    id: 'modal.create-project.input.project-type.label',
    defaultMessage: 'Project type',
  },
  urlLabel: {
    id: 'modal.create-project.input.url.label',
    defaultMessage: 'URL',
  },
  summaryLabel: {
    id: 'modal.create-project.input.summary.label',
    defaultMessage: 'Summary',
  },
  summaryDescription: {
    id: 'modal.create-project.input.summary.description',
    defaultMessage: "This appears in search and on the sidebar of your project's page.",
  },
})

export default {
  components: {
    CrossIcon,
    CheckIcon,
    Modal,
    Multiselect,
  },
  props: {
    organizationId: {
      type: String,
      required: false,
      default: null,
    },
  },
  setup() {
    const tags = useTags()
    const vintl = useVIntl()
    const { formatMessage } = vintl

    return { tags, vintl, formatMessage, messages }
  },
  data() {
    return {
      name: '',
      slug: '',
      description: '',
      manualSlug: false,
      isEnglishLocal: this.vintl.locale !== 'en-US',
      visibilities: [
        {
          actual: 'approved',
          display: 'Public',
        },
        {
          actual: 'private',
          display: 'Private',
        },
        {
          actual: 'unlisted',
          display: 'Unlisted',
        },
      ],
      visibility: {
        actual: 'approved',
        display: 'Public',
      },
    }
  },
  methods: {
    cancel() {
      this.$refs.modal.hide()
    },
    async createProject() {
      startLoading()

      const formData = new FormData()

      const auth = await useAuth()

      const projectData = {
        title: this.name.trim(),
        project_type: 'mod',
        slug: this.slug,
        description: this.description.trim(),
        body: '',
        requested_status: this.visibility.actual,
        initial_versions: [],
        team_members: [
          {
            user_id: auth.value.user.id,
            name: auth.value.user.username,
            role: 'Owner',
          },
        ],
        categories: [],
        client_side: 'required',
        server_side: 'required',
        license_id: 'LicenseRef-Unknown',
        is_draft: true,
      }

      if (this.organizationId) {
        projectData.organization_id = this.organizationId
      }

      formData.append('data', JSON.stringify(projectData))

      try {
        await useBaseFetch('project', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Disposition': formData,
          },
        })

        this.$refs.modal.hide()
        await this.$router.push({
          name: 'type-id',
          params: {
            type: 'project',
            id: this.slug,
          },
        })
      } catch (err) {
        this.$notify({
          group: 'main',
          title: this.formatMessage(commonMessages.errorNotificationTitle),
          text: err.data.description,
          type: 'error',
        })
      }
      stopLoading()
    },
    show() {
      this.projectType = this.tags.projectTypes[0].display
      this.name = ''
      this.slug = ''
      this.description = ''
      this.manualSlug = false
      this.$refs.modal.show()
    },
    updatedName() {
      if (!this.manualSlug) {
        this.slug = this.name
          .trim()
          .toLowerCase()
          .replaceAll(' ', '-')
          .replaceAll(/[^a-zA-Z0-9!@$()`.+,_"-]/g, '')
          .replaceAll(/--+/gm, '-')
      }
    },
  },
}
</script>

<style scoped lang="scss">
.modal-creation {
  padding: var(--spacing-card-bg);
  display: flex;
  flex-direction: column;

  .markdown-body {
    margin-bottom: 0.5rem;
  }

  input {
    width: 20rem;
    max-width: 100%;
  }

  .text-input-wrapper {
    width: 100%;
  }

  textarea {
    min-height: 5rem;
  }

  .input-group {
    margin-top: var(--spacing-card-md);
  }
}
</style>
