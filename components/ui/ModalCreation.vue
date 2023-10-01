<template>
  <Modal ref="modal" :header="formatMessage(messages.modalTitle)">
    <div class="modal-creation universal-labels">
      <div class="markdown-body">
        <p>{{ formatMessage(messages.modalDescription) }}</p>
      </div>
      <label for="project-type">
        <span class="label__title">
          {{ formatMessage(messages.projectTypeLabel) }}
          <span class="required">*</span>
        </span>
      </label>
      <Chips
        id="project-type"
        v-model="projectType"
        :items="tags.projectTypes.map((x) => x.display)"
        :format-label="formatChipsLabel"
      />
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
        <div class="text-input-wrapper__before">
          https://modrinth.com/{{ getProjectType() ? getProjectType().id : '???' }}/
        </div>
        <input
          id="slug"
          v-model="slug"
          type="text"
          maxlength="64"
          autocomplete="off"
          @input="manualSlug = true"
        />
      </div>
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
import CrossIcon from '~/assets/images/utils/x.svg'
import CheckIcon from '~/assets/images/utils/right-arrow.svg'
import Modal from '~/components/ui/Modal.vue'
import Chips from '~/components/ui/Chips.vue'

const messages = defineMessages({
  modalTitle: {
    id: 'modal.create-project.title',
    defaultMessage: 'Create a project',
  },
  modalDescription: {
    id: 'modal.create-project.description',
    defaultMessage: 'New projects are created as drafts and can be found under your profile page.',
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
    Chips,
    CrossIcon,
    CheckIcon,
    Modal,
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
  setup() {
    const tags = useTags()
    const { formatMessage } = useVIntl()

    return { tags, formatMessage, messages }
  },
  data() {
    return {
      projectType: this.tags.projectTypes[0].display,
      name: '',
      slug: '',
      description: '',
      manualSlug: false,
    }
  },
  methods: {
    cancel() {
      this.$refs.modal.hide()
    },
    formatChipsLabel(item) {
      const itemFormated = item.replaceAll(' ', '')
      return this.formatMessage(getProjectTypeMessage(itemFormated))
    },
    getProjectType() {
      return this.tags.projectTypes.find((x) => this.projectType === x.display)
    },
    getClientSide() {
      switch (this.getProjectType().id) {
        case 'plugin':
          return 'unsupported'
        case 'resourcepack':
          return 'required'
        case 'shader':
          return 'required'
        case 'datapack':
          return 'optional'
        default:
          return 'unknown'
      }
    },
    getServerSide() {
      switch (this.getProjectType().id) {
        case 'plugin':
          return 'required'
        case 'resourcepack':
          return 'unsupported'
        case 'shader':
          return 'unsupported'
        case 'datapack':
          return 'required'
        default:
          return 'unknown'
      }
    },
    async createProject() {
      startLoading()

      const projectType = this.getProjectType()

      const formData = new FormData()

      const auth = await useAuth()

      formData.append(
        'data',
        JSON.stringify({
          title: this.name.trim(),
          project_type: projectType.actual,
          slug: this.slug,
          description: this.description.trim(),
          body: '',
          initial_versions: [],
          team_members: [
            {
              user_id: auth.value.user.id,
              name: auth.value.user.username,
              role: 'Owner',
            },
          ],
          categories: [],
          client_side: this.getClientSide(),
          server_side: this.getServerSide(),
          license_id: 'LicenseRef-Unknown',
          is_draft: true,
        })
      )

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
            type: projectType.id,
            id: this.slug,
          },
          state: {
            overrideProjectType: projectType.id,
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
