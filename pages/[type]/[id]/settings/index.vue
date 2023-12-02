<template>
  <div>
    <ConfirmModal
      ref="modal_confirm"
      title="Are you sure you want to delete this project?"
      description="If you proceed, all versions and any attached data will be removed from our servers. This may break other projects, so be careful."
      :has-to-type="true"
      :confirmation-text="project.title"
      proceed-label="Delete"
      :noblur="!(cosmetics.advancedRendering ?? true)"
      @proceed="deleteProject"
    />
    <ConfirmModal
      ref="modal_remove"
      title="Are you sure you want to remove this project from the organization?"
      description="If you proceed, this project will no longer be owned by the organization."
      :has-to-type="true"
      :confirmation-text="project.title"
      proceed-label="Remove"
      :noblur="!(cosmetics.advancedRendering ?? true)"
      @proceed="removeFromOrg"
    />
    <section class="card">
      <label for="project-icon">
        <span class="label__title">Icon</span>
      </label>
      <div class="input-group">
        <Avatar
          :src="deletedIcon ? null : previewImage ? previewImage : project.icon_url"
          :alt="project.title"
          size="md"
          class="project__icon"
        />
        <div class="input-stack">
          <FileInput
            id="project-icon"
            :max-size="262144"
            :show-icon="true"
            accept="image/png,image/jpeg,image/gif,image/webp"
            class="choose-image btn"
            prompt="Upload icon"
            :disabled="!hasPermission"
            @change="showPreviewImage"
          >
            <UploadIcon />
          </FileInput>
          <button
            v-if="!deletedIcon && (previewImage || project.icon_url)"
            class="btn"
            :disabled="!hasPermission"
            @click="markIconForDeletion"
          >
            <TrashIcon />
            Remove icon
          </button>
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
        <div class="text-input-wrapper__before">
          https://modrinth.com/{{ getProjectTypeForUrl(project.project_type, project.loaders) }}/
        </div>
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
        />
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
              {{ formatProjectType(project.project_type).toLowerCase() }} has functionality on the
              client side. Just because a mod works in Singleplayer doesn't mean it has actual
              client-side functionality.
            </span>
          </label>
          <Multiselect
            id="project-env-client"
            v-model="clientSide"
            placeholder="Select one"
            :options="sideTypes"
            :custom-label="(value) => value.charAt(0).toUpperCase() + value.slice(1)"
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
              {{ formatProjectType(project.project_type).toLowerCase() }} has functionality on the
              <strong>logical</strong> server. Remember that Singleplayer contains an integrated
              server.
            </span>
          </label>
          <Multiselect
            id="project-env-server"
            v-model="serverSide"
            placeholder="Select one"
            :options="sideTypes"
            :custom-label="(value) => value.charAt(0).toUpperCase() + value.slice(1)"
            :searchable="false"
            :close-on-select="true"
            :show-labels="false"
            :allow-empty="false"
            :disabled="!hasPermission"
          />
        </div>
      </template>
      <div class="adjacent-input">
        <label for="project-visibility">
          <span class="label__title">Visibility</span>
          <div class="label__description">
            Listed and archived projects are visible in search. Unlisted projects are published, but
            not visible in search or on user profiles. Private projects are only accessible by
            members of the project.

            <p>If approved by the moderators:</p>
            <ul class="visibility-info">
              <li>
                <CheckIcon
                  v-if="visibility === 'approved' || visibility === 'archived'"
                  class="good"
                />
                <ExitIcon v-else class="bad" />
                {{ hasModifiedVisibility ? 'Will be v' : 'V' }}isible in search
              </li>
              <li>
                <ExitIcon
                  v-if="visibility === 'unlisted' || visibility === 'private'"
                  class="bad"
                />
                <CheckIcon v-else class="good" />
                {{ hasModifiedVisibility ? 'Will be v' : 'V' }}isible on profile
              </li>
              <li>
                <CheckIcon v-if="visibility !== 'private'" class="good" />
                <IssuesIcon
                  v-else
                  v-tooltip="{
                    content:
                      visibility === 'private'
                        ? 'Only members will be able to view the project.'
                        : '',
                  }"
                  class="warn"
                />
                {{ hasModifiedVisibility ? 'Will be v' : 'V' }}isible via URL
              </li>
            </ul>
          </div>
        </label>
        <Multiselect
          id="project-visibility"
          v-model="visibility"
          placeholder="Select one"
          :options="tags.approvedStatuses"
          :custom-label="(value) => formatProjectStatus(value)"
          :searchable="false"
          :close-on-select="true"
          :show-labels="false"
          :allow-empty="false"
          :disabled="!hasPermission"
        />
      </div>
      <div class="input-group">
        <button
          type="button"
          class="btn btn-primary"
          :disabled="!hasChanges"
          @click="saveChanges()"
        >
          <SaveIcon />
          Save changes
        </button>
      </div>
    </section>
    <Card>
      <div class="label">
        <span class="label__title size-card-header">Organization</span>
      </div>
      <p>
        <template v-if="project.organization">
          This project is owned by an organization. Members permission defaults are set in the
          <nuxt-link :to="`/organization/${project.organization.id}/settings/members`"
            >organization members settings</nuxt-link
          >.
        </template>
        <template v-else>
          This project is not owned by an organization. You can transfer ownership to one of the
          organizations you are a member of below.
        </template>
      </p>
      <SearchDropdown
        v-if="!project.organization"
        v-model="orgText"
        placeholder="Search for organizations..."
        render-up
        circled-icons
        class="search-dropdown"
        :disabled="!hasPermission || !organizations"
        :options="
          organizations.filter((value) => value.title.toLowerCase().includes(orgText.toLowerCase()))
        "
        @on-selected="selectOrg"
      />
      <Button v-else color="danger" @click="$refs.modal_remove.show()">
        <OrganizationIcon />
        Remove from organization
      </Button>
    </Card>
    <section class="card">
      <div class="label">
        <h3>
          <span class="label__title size-card-header">Delete project</span>
        </h3>
      </div>
      <p>
        Removes your project from Modrinth's servers and search. Clicking on this will delete your
        project, so be extra careful!
      </p>
      <Button color="danger" :disabled="!hasDeletePermission" @click="$refs.modal_confirm.show()">
        <TrashIcon />
        Delete project
      </Button>
    </section>
  </div>
</template>

<script setup>
import { Multiselect } from 'vue-multiselect'
import {
  Avatar,
  FileInput,
  UploadIcon,
  SaveIcon,
  TrashIcon,
  ExitIcon,
  IssuesIcon,
  CheckIcon,
  ConfirmModal,
  formatProjectType,
  formatProjectStatus,
  Card,
  Button,
} from 'omorphia'
import { getProjectTypeForUrl } from '~/helpers/projects.js'

import OrganizationIcon from '~/assets/images/utils/organization.svg'

const tags = useTags()
const router = useRouter()
const cosmetics = useCosmetics()

definePageMeta({
  middleware: 'auth',
})

const props = defineProps({
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
        addNotification({
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
        addNotification({
          group: 'main',
          title: 'An error occurred',
          text: 'Patch icon function not found',
          type: 'error',
        })
      }
    },
  },
  updateIcon: {
    type: Function,
    default() {
      return () => {
        addNotification({
          group: 'main',
          title: 'An error occurred',
          text: 'Update icon function not found',
          type: 'error',
        })
      }
  },
  organizations: {
    type: Array,
    default() {
      return []
    },
  },
})

const name = ref(props.project.title)
const slug = ref(props.project.slug)
const summary = ref(props.project.description)
const icon = ref(null)
const previewImage = ref(null)
const clientSide = ref(props.project.client_side)
const serverSide = ref(props.project.server_side)
const deletedIcon = ref(false)
const orgText = ref('')

const visibility = ref(
  tags.value.approvedStatuses.includes(props.project.status)
    ? props.project.status
    : props.project.requested_status
)

const hasPermission = computed(() => {
  const EDIT_DETAILS = 1 << 2
  return (props.currentMember.permissions & EDIT_DETAILS) === EDIT_DETAILS
})

const hasDeletePermission = computed(() => {
  const DELETE_PROJECT = 1 << 7
  return (props.currentMember.permissions & DELETE_PROJECT) === DELETE_PROJECT
})

const sideTypes = ref(['required', 'optional', 'unsupported'])

const patchData = computed(() => {
  const data = {}

  if (name.value !== props.project.title) {
    data.title = name.value.trim()
  }
  if (slug.value !== props.project.slug) {
    data.slug = slug.value.trim()
  }
  if (summary.value !== props.project.description) {
    data.description = summary.value.trim()
  }
  if (clientSide.value !== props.project.client_side) {
    data.client_side = clientSide.value
  }
  if (serverSide.value !== props.project.server_side) {
    data.server_side = serverSide.value
  }
  if (tags.value.approvedStatuses.includes(props.project.status)) {
    if (visibility.value !== props.project.status) {
      data.status = visibility.value
    }
  } else if (visibility.value !== props.project.requested_status) {
    data.requested_status = visibility.value
  }

  return data
})

const hasChanges = computed(() => {
  return Object.keys(patchData.value).length > 0 || deletedIcon.value || icon.value
})

const hasModifiedVisibility = computed(() => {
  const originalVisibility = tags.value.approvedStatuses.includes(props.project.status)
    ? props.project.status
    : props.project.requested_status

  return originalVisibility !== visibility.value
})

async function saveChanges() {
  if (hasChanges.value) {
    await props.patchProject(patchData.value)
  }

  if (deletedIcon.value) {
    await deleteIcon()
    deletedIcon.value = false
  } else if (icon.value) {
    await props.patchIcon(icon.value)
    icon.value = null
  }
}

function showPreviewImage(files) {
  const reader = new FileReader()
  icon.value = files[0]
  deletedIcon.value = false
  reader.readAsDataURL(icon.value)
  reader.onload = (event) => {
    previewImage.value = event.target.result
  }
}

async function deleteProject() {
  await useBaseFetch(`project/${props.project.id}`, {
    method: 'DELETE',
  })
  await initUserProjects()
  await router.push('/projects')
  addNotification({
    group: 'main',
    title: 'Project deleted',
    text: 'Your project has been deleted.',
    type: 'success',
  })
}

function markIconForDeletion() {
  deletedIcon.value = true
  icon.value = null
  previewImage.value = null
}

async function deleteIcon() {
  await useBaseFetch(`project/${props.project.id}/icon`, {
    method: 'DELETE',
  })
  await props.updateIcon()
  addNotification({
    group: 'main',
    title: 'Project icon removed',
    text: "Your project's icon has been removed.",
    type: 'success',
  })
}

const selectOrg = async (org) => {
  await useBaseFetch(`organization/${org.title}/projects`, {
    method: 'POST',
    body: JSON.stringify({
      project_id: props.project.id,
    }),
  })
  props.updateIcon()
  addNotification({
    group: 'main',
    title: 'Project organization updated',
    text: `Your project's organization has been updated.`,
    type: 'success',
  })
}

async function removeFromOrg() {
  await useBaseFetch(`organization/${props.project.organization}/projects/${props.project.id}`, {
    method: 'DELETE',
  })
  props.updateIcon()
  addNotification({
    group: 'main',
    title: 'Project organization updated',
    text: `Your project's organization has been updated.`,
    type: 'success',
  })
}
</script>
<style lang="scss" scoped>
.visibility-info {
  padding: 0;
  list-style: none;
}

svg {
  &.good {
    color: var(--color-brand);
  }

  &.bad {
    color: var(--color-red);
  }

  &.warn {
    color: var(--color-orange);
  }
}

.summary-input {
  min-height: 8rem;
  max-width: 24rem;
}

.multiselect {
  max-width: 15rem;
}

.search-dropdown {
  :deep(.btn) {
    position: absolute;
    right: 0.25rem;
    z-index: 1;
    background: none;
    box-shadow: none;
    border-color: transparent;
    padding: var(--gap-sm);

    svg {
      position: relative;
      left: 0;
    }
  }
}
</style>
