<template>
  <Modal
    :header="$t('component.create-modal.title')"
    :show="isShowing"
    @close="cancel"
  >
    <div class="modal-creation">
      <div class="markdown-body">
        <p>
          {{ $t('component.create-modal.description') }}
        </p>
      </div>
      <label class="create-label" for="project-type">
        <span>
          <strong>
            {{ $t('component.create-modal.project-type.title') }}
          </strong>
        </span>
      </label>
      <Chips
        id="project-type"
        v-model="projectType"
        :items="$tag.projectTypes"
        :custom-label="(x) => $t(`project-type.${x.id}.singular`)"
      />
      <label class="create-label" for="name">
        <strong>{{ $t('component.create-modal.name.title') }}</strong>
      </label>
      <input
        id="name"
        v-model="name"
        type="text"
        maxlength="64"
        :placeholder="$t('component.create-modal.name.placeholder')"
      />
      <label class="create-label" for="slug">
        <strong>{{ $t('component.create-modal.slug.title') }}</strong>
        <span>{{ $t('component.create-modal.slug.description') }}</span>
      </label>
      <input
        id="slug"
        v-model="slug"
        type="text"
        maxlength="64"
        :placeholder="$t('component.create-modal.slug.placeholder')"
      />
      <label class="create-label" for="additional-information">
        <strong>{{ $t('component.create-modal.summary.title') }}</strong>
        <span>
          {{ $t('component.create-modal.summary.description') }}
        </span>
      </label>
      <div class="textarea-wrapper">
        <textarea
          id="additional-information"
          v-model="description"
          maxlength="256"
        />
      </div>
      <div class="button-group">
        <button class="iconified-button" @click="cancel">
          <CrossIcon />
          {{ $t('generic.action.cancel') }}
        </button>
        <button class="iconified-button brand-button" @click="createProject">
          <CheckIcon />
          {{ $t('component.create-modal.action.continue') }}
        </button>
      </div>
    </div>
  </Modal>
</template>

<script>
import CrossIcon from '~/assets/images/utils/x.svg?inline'
import CheckIcon from '~/assets/images/utils/right-arrow.svg?inline'
import Modal from '~/components/ui/Modal'
import Chips from '~/components/ui/Chips'

export default {
  name: 'ModalCreation',
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
  data() {
    return {
      projectType: '',
      name: '',
      slug: '',
      description: '',
      isShowing: false,
    }
  },
  methods: {
    cancel() {
      this.isShowing = false
    },
    async createProject() {
      this.$nuxt.$loading.start()

      const formData = new FormData()

      formData.append(
        'data',
        JSON.stringify({
          title: this.name,
          project_type: this.projectType.actual,
          slug: this.slug,
          description: this.description,
          body: (() => {
            let body = ''

            if (
              this.$i18n.intlLocale.language !== 'en' ||
              this.$i18n.locale.includes('-x-')
            ) {
              body += this.$t(
                'component.create-modal.auto-description.language-warning',
                {
                  projectType: this.projectType.id,
                }
              )
              body += '\n\n'
            }

            body += this.$fmt.customMessage(
              this.$i18n.data['starter.md'],
              {
                projectType: this.projectType.id,
                projectName: this.name,
              },
              {
                ignoreTag: true,
              }
            )

            return body
          })(),
          initial_versions: [],
          team_members: [
            {
              user_id: this.$auth.user.id,
              name: this.$auth.user.username,
              role: 'Owner',
            },
          ],
          categories: [],
          client_side: 'unknown',
          server_side: 'unknown',
          license_id: this.$tag.licenses.map((it) => it.short).includes('arr')
            ? 'arr'
            : this.$tag.licenses[0].short,
          is_draft: true,
        })
      )

      console.log(formData)

      try {
        await this.$axios({
          url: 'project',
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: this.$auth.token,
          },
        })

        this.isShowing = false
        await this.$router.replace(`/${this.projectType.actual}/${this.slug}`)
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
      this.isShowing = true
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
    max-width: 20rem;
  }

  .create-label {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 0.75rem;
  }

  .button-group {
    margin-left: auto;
    margin-top: 1.5rem;
  }

  textarea {
    min-height: 5rem;
  }
}
</style>
