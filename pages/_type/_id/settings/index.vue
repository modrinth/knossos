<template>
  <div>
    <ModalConfirm
      ref="modal_confirm"
      title="Are you sure you want to delete this project?"
      description="If you proceed, all versions and any attached data will be removed from our servers. This may break other projects, so be careful."
      :has-to-type="true"
      :confirmation-text="project.title"
      proceed-label="Delete"
      @proceed="deleteProject"
    />
    <section class="universal-card">
      <div class="label">
        <h3>
          <span class="label__title size-card-header">Project information</span>
        </h3>
      </div>
      <label for="project-name">
        <span class="label__title">Icon</span>
      </label>
      <div class="input-group">
        <Avatar
          :src="previewImage ? previewImage : project.icon_url"
          :alt="project.title"
          size="md"
          class="project__icon"
        />
        <div class="input-group">
          <FileInput
            :max-size="262144"
            :show-icon="true"
            accept="image/png,image/jpeg,image/gif,image/webp"
            class="choose-image iconified-button floating-button"
            prompt="Upload icon"
            :disabled="!hasPermission"
            @change="showPreviewImage"
          >
            <UploadIcon />
          </FileInput>
        </div>
      </div>

      <label for="project-name">
        <span class="label__title">Name</span>
      </label>
      <input
        id="project-name"
        v-model="name"
        maxlength="2048"
        type="text"
        :disabled="!hasPermission"
      />

      <label for="project-slug">
        <span class="label__title">URL</span>
      </label>
      <div class="text-input-wrapper">
        <div class="text-input-wrapper__before">https://modrinth.com/mod/</div>
        <input
          id="project-slug"
          v-model="slug"
          type="text"
          maxlength="64"
          autocomplete="off"
          :disabled="!hasPermission"
        />
      </div>

      <label for="project-summary">
        <span class="label__title">Summary</span>
      </label>
      <div class="textarea-wrapper summary-input">
        <textarea
          id="project-summary"
          v-model="summary"
          maxlength="256"
          :disabled="!hasPermission"
        ></textarea>
      </div>
      <template
        v-if="
          project.project_type !== 'resourcepack' &&
          project.project_type !== 'plugin' &&
          project.project_type !== 'shader' &&
          project.project_type !== 'datapack'
        "
      >
        <div class="adjacent-input">
          <label for="project-env-client">
            <span class="label__title">Client-side</span>
            <span class="label__description">
              Select based on if the
              {{ $formatProjectType(project.project_type).toLowerCase() }} has
              functionality on the client side. Just because a mod works in
              Singleplayer doesn't mean it has actual client-side functionality.
            </span>
          </label>
          <Multiselect
            id="project-env-client"
            v-model="clientSide"
            placeholder="Select one"
            :options="sideTypes"
            :custom-label="
              (value) => value.charAt(0).toUpperCase() + value.slice(1)
            "
            :searchable="false"
            :close-on-select="true"
            :show-labels="false"
            :allow-empty="false"
            :disabled="!hasPermission"
          />
        </div>
        <div class="adjacent-input">
          <label for="project-env-server">
            <span class="label__title">Server-side</span>
            <span class="label__description">
              Select based on if the
              {{ $formatProjectType(project.project_type).toLowerCase() }} has
              functionality on the <strong>logical</strong> server. Remember
              that Singleplayer contains an integrated server.
            </span>
          </label>
          <Multiselect
            id="project-env-server"
            v-model="serverSide"
            placeholder="Select one"
            :options="sideTypes"
            :custom-label="
              (value) => value.charAt(0).toUpperCase() + value.slice(1)
            "
            :searchable="false"
            :close-on-select="true"
            :show-labels="false"
            :allow-empty="false"
            :disabled="!hasPermission"
          />
        </div>
      </template>
      <div class="button-group">
        <button
          type="button"
          class="iconified-button brand-button"
          @click="saveChanges()"
        >
          <SaveIcon />
          Save changes
        </button>
      </div>
    </section>

    <section class="universal-card">
      <div class="label">
        <h3>
          <span class="label__title size-card-header">Delete project</span>
        </h3>
      </div>
      <p>
        Removes your project from Modrinth's servers and search. Clicking on
        this will delete your project, so be extra careful!
      </p>
      <button
        type="button"
        class="iconified-button danger-button"
        @click="$refs.modal_confirm.show()"
      >
        <TrashIcon />
        Delete project
      </button>
    </section>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import Avatar from '~/components/ui/Avatar'
import ModalConfirm from '~/components/ui/ModalConfirm'
import FileInput from '~/components/ui/FileInput'

import UploadIcon from '~/assets/images/utils/upload.svg?inline'
import SaveIcon from '~/assets/images/utils/save.svg?inline'
import TrashIcon from '~/assets/images/utils/trash.svg?inline'

export default {
  components: {
    Avatar,
    ModalConfirm,
    FileInput,
    Multiselect,
    UploadIcon,
    SaveIcon,
    TrashIcon,
  },
  props: {
    project: {
      type: Object,
      default() {
        return {}
      },
    },
    currentMember: {
      type: Object,
      default() {
        return null
      },
    },
    patchProject: {
      type: Function,
      default() {
        return () => {
          this.$notify({
            group: 'main',
            title: 'An error occurred',
            text: 'Patch project function not found',
            type: 'error',
          })
        }
      },
    },
    patchIcon: {
      type: Function,
      default() {
        return () => {
          this.$notify({
            group: 'main',
            title: 'An error occurred',
            text: 'Patch icon function not found',
            type: 'error',
          })
        }
      },
    },
  },
  data() {
    return {
      name: '',
      slug: '',
      summary: '',
      icon: null,
      previewImage: null,
      clientSide: '',
      serverSide: '',
    }
  },
  fetch() {
    this.name = this.project.title
    this.slug = this.project.slug
    this.summary = this.project.description
    this.clientSide = this.project.client_side
    this.serverSide = this.project.server_side
  },
  computed: {
    hasPermission() {
      const EDIT_DETAILS = 1 << 2
      return (this.currentMember.permissions & EDIT_DETAILS) === EDIT_DETAILS
    },
    sideTypes() {
      return ['required', 'optional', 'unsupported']
    },
  },
  methods: {
    saveChanges() {
      const data = {}

      if (this.name !== this.project.title) {
        data.title = this.name
      }
      if (this.slug !== this.project.slug) {
        data.slug = this.slug
      }
      if (this.summary !== this.project.description) {
        data.description = this.summary
      }
      if (this.clientSide !== this.project.client_side) {
        data.client_side = this.clientSide
      }
      if (this.serverSide !== this.project.server_side) {
        data.server_side = this.serverSide
      }

      if (Object.keys(data).length > 0) {
        this.patchProject(data)
      }

      if (this.icon) {
        this.patchIcon(this.icon)
      }
    },
    showPreviewImage(files) {
      const reader = new FileReader()
      this.icon = files[0]
      reader.readAsDataURL(this.icon)
      reader.onload = (event) => {
        this.previewImage = event.target.result
      }
    },
    async deleteProject() {
      await this.$axios.delete(
        `project/${this.project.id}`,
        this.$defaultHeaders()
      )
      await this.$store.dispatch('user/fetchProjects')
      await this.$router.push(`/user/${this.$auth.user.username}`)
      this.$notify({
        group: 'main',
        title: 'Action Success',
        text: 'Your project has been successfully deleted.',
        type: 'success',
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.summary-input {
  min-height: 8rem;
  max-width: 24rem;
}
</style>
