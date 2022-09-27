<template>
  <Modal ref="modal" header="Create project">
    <div class="modal-creation">
      <div class="markdown-body">
        <p>
          New projects are created as drafts, and can be found under your
          profile page.
        </p>
      </div>
      <label class="create-label" for="project-type">
        <span>
          <strong>Project type</strong>
        </span>
      </label>
      <Chips
        id="project-type"
        v-model="projectType"
        :items="$tag.projectTypes.map((x) => x.display)"
      />
      <label class="create-label" for="name">
        <strong>Name</strong>
      </label>
      <input
        id="name"
        v-model="name"
        type="text"
        maxlength="64"
        placeholder="Enter project name..."
      />
      <label class="create-label" for="slug">
        <strong>Slug</strong>
        <span>The slug is a vanity URL for your project</span>
      </label>
      <input
        id="slug"
        v-model="slug"
        type="text"
        maxlength="64"
        placeholder="Enter project slug..."
      />
      <label class="create-label" for="additional-information">
        <strong>Summary</strong>
        <span>
          This appears in search and on the sidebar of your project's page.
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
          Cancel
        </button>
        <button class="iconified-button brand-button" @click="createProject">
          <CheckIcon />
          Continue
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
    }
  },
  methods: {
    cancel() {
      this.$refs.modal.hide()
    },
    async createProject() {
      this.$nuxt.$loading.start()

      const projectType = this.$tag.projectTypes.find(
        (x) => this.projectType === x.display
      )

      const formData = new FormData()

      formData.append(
        'data',
        JSON.stringify({
          title: this.name,
          project_type: projectType.actual,
          slug: this.slug,
          description: this.description,
          body: `# Placeholder description
This is your new ${projectType.display}, ${this.name}. A checklist below is provided to help prepare for release.

### Before submitting for review
- [ ] Upload at least one version
- [ ] Edit project description
- [ ] Update metadata
  - [ ] Select license
  - [ ] Set up environments
  - [ ] Choose categories
  - [ ] Add source, wiki, Discord and donation links (optional)
- [ ] Add images to gallery (optional)
- [ ] Invite project team members (optional)

> Submissions are normally reviewed within 24 hours, but may take up to 48 hours

Questions? [Join the Modrinth Discord for support!](https://discord.gg/EUHuJHt)`,
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

        this.$refs.modal.hide()
        await this.$router.replace(`/${projectType.display}/${this.slug}`)
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
