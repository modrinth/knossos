<template>
  <div>
    <ModalConfirm
      v-if="auth.user && auth.user.id === creator.id"
      ref="deleteModal"
      title="Are you sure you want to delete this collection?"
      description="This will remove this collection forever (like really forever)."
      :has-to-type="false"
      proceed-label="Delete"
      @proceed="deleteCollection()"
    />
    <Modal ref="editModal" :header="`Edit ${collection.name}`">
      <div class="universal-modal modal-spacing">
        <div class="edit-section">
          <div class="avatar-section">
            <Avatar
              size="lg"
              :src="deletedIcon ? null : previewImage ? previewImage : collection.icon_url"
            />
            <PopoutMenu class="btn icon-edit-button icon-only" position="bottom" direction="right">
              <EditIcon />
              <template #menu>
                <span class="icon-edit-menu">
                  <FileInput
                    id="project-icon"
                    :max-size="262144"
                    :show-icon="true"
                    accept="image/png,image/jpeg,image/gif,image/webp"
                    class="btn btn-transparent upload"
                    style="white-space: nowrap"
                    prompt=""
                    @change="showPreviewImage"
                  >
                    <UploadIcon />
                    Upload icon
                  </FileInput>
                  <Button
                    v-if="!deletedIcon && (previewImage || collection.icon_url)"
                    style="white-space: nowrap"
                    transparent
                    @click="
                      () => {
                        deletedIcon = true
                        previewImage = null
                      }
                    "
                  >
                    <TrashIcon />
                    Delete icon
                  </Button>
                </span>
              </template>
            </PopoutMenu>
          </div>
          <input v-model="name" type="text" placeholder="Collection title" />
          <textarea v-model="summary" placeholder="Add an optional description" />
        </div>
        <div class="universal-labels">
          <label for="visibility">
            <span class="label__title"> Visibility </span>
          </label>
          <DropdownSelect
            id="visibility"
            v-model="visibility"
            :options="['listed', 'unlisted', 'private']"
            :disabled="visibility === 'rejected'"
            :multiple="false"
            :display-name="
              (s) => {
                if (s === 'listed') return 'Public'
                return capitalizeString(s)
              }
            "
            :searchable="false"
          />
        </div>
        <div class="input-group push-right">
          <Button @click="$refs.editModal.hide()">
            <XIcon />
            Cancel
          </Button>
          <Button color="primary" @click="saveChanges()">
            <SaveIcon />
            Save changes
          </Button>
        </div>
      </div>
    </Modal>
    <div class="normal-page">
      <div class="normal-page__sidebar">
        <div class="card">
          <div class="page-header__icon">
            <Avatar size="md" :src="collection.icon_url" />
          </div>
          <div class="page-header__text">
            <div class="title">
              <h1>{{ collection.name }}</h1>
            </div>

            <div class="collection-info">
              <div class="metadata-item">
                <UserIcon />
                by
                <router-link :to="`/user/${creator.username}`">{{ creator.username }}</router-link>
              </div>

              <div class="metadata-item">
                <template v-if="collection.status === 'listed'">
                  <WorldIcon />
                  <span> Public </span>
                </template>
                <template v-else-if="collection.status === 'unlisted'">
                  <LinkIcon />
                  <span> Unlisted </span>
                </template>
                <template v-else-if="collection.status === 'private'">
                  <LockIcon />
                  <span> Private </span>
                </template>
                <template v-else-if="collection.status === 'rejected'">
                  <XIcon />
                  <span> Rejected </span>
                </template>
              </div>

              <div class="metadata-item">
                <UpdatedIcon />
                Updated
                <span>
                  {{ fromNow(collection.updated) }}
                </span>
              </div>
            </div>
            <div class="markdown-body collection-description">
              <p>{{ collection.description }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="normal-page__content">
        <Promotion />

        <nav class="navigation-card">
          <NavRow
            :links="[
              {
                label: formatMessage(commonMessages.allProjectType),
                href: `/collection/${collection.id}`,
              },
              ...projectTypes.map((x) => {
                return {
                  label: formatMessage(getProjectTypeMessage(x, true)),
                  href: `/collection/${collection.id}/${x}s`,
                }
              }),
            ]"
          />
          <OverflowMenu
            v-if="canEdit"
            class="btn"
            :options="[
              {
                id: 'edit',
                action: showEditModal,
              },
              {
                id: 'delete',
                color: 'danger',
                action: () => $refs.deleteModal.show(),
              },
            ]"
            direction="right"
            position="bottom"
          >
            <SettingsIcon />
            Manage
            <template #edit>
              <EditIcon />
              Edit
            </template>
            <template #delete>
              <TrashIcon />
              Delete
            </template>
          </OverflowMenu>
        </nav>

        <div v-if="projects && projects.length > 0" class="project-list display-mode--list">
          <ProjectCard
            v-for="project in (route.params.projectType !== undefined
              ? projects.filter(
                  (x) =>
                    x.project_type ===
                    route.params.projectType.substr(0, route.params.projectType.length - 1)
                )
              : projects
            )
              .slice()
              .sort((a, b) => b.downloads - a.downloads)"
            :id="project.id"
            :key="project.id"
            :type="project.project_type"
            :categories="project.categories"
            :created-at="project.published"
            :updated-at="project.updated"
            :description="project.description"
            :downloads="project.downloads ? project.downloads.toString() : '0'"
            :follows="project.follows ? project.follows.toString() : '0'"
            :icon-url="project.icon_url"
            :name="project.title"
            :client-side="project.client_side"
            :server-side="project.server_side"
            :color="project.color"
            :show-updated-date="!canEdit && collection.id !== 'following'"
            :show-created-date="!canEdit && collection.id !== 'following'"
          >
            <button
              v-if="canEdit"
              class="iconified-button remove-btn"
              @click="
                () => {
                  removeProjects = [project]
                  saveChanges()
                }
              "
            >
              <TrashIcon />
              Remove project
            </button>
            <button
              v-if="collection.id === 'following'"
              class="iconified-button"
              @click="userUnfollowProject(project)"
            >
              <TrashIcon />
              Unfollow project
            </button>
          </ProjectCard>
        </div>
        <div v-else class="error">
          <UpToDate class="icon" /><br />
          <span v-if="auth.user && auth.user.id === creator.id" class="text">
            You don't have any projects.<br />
            Would you like to
            <a class="link" @click.prevent="$router.push('/mods')"> add one</a>?
          </span>
          <span v-else class="text">This collection has no projects!</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  capitalizeString,
  Avatar,
  Button,
  Promotion,
  EditIcon,
  XIcon,
  SaveIcon,
  OverflowMenu,
  UploadIcon,
  TrashIcon,
  PopoutMenu,
  FileInput,
  DropdownSelect,
  LinkIcon,
  LockIcon,
  UserIcon,
  UpdatedIcon,
  SettingsIcon,
} from 'omorphia'

// import WorldIcon from 'assets/images/utils/world.svg'
// import ManageIcon from '~/assets/images/utils/settings-2.svg'

import UpToDate from 'assets/images/illustrations/up_to_date.svg'
import { addNotification } from '~/composables/notifs.js'
import ModalConfirm from '~/components/ui/ModalConfirm.vue'
import Modal from '~/components/ui/Modal.vue'
import NavRow from '~/components/ui/NavRow.vue'
import ProjectCard from '~/components/ui/ProjectCard.vue'

const vintl = useVIntl()
const { formatMessage } = vintl

const route = useRoute()
const auth = await useAuth()
const editModal = ref(null)

let collection, refreshCollection, creator, projects, refreshProjects

try {
  if (route.params.id === 'following') {
    collection = ref({
      id: 'following',
      icon_url: 'https://cdn.modrinth.com/follow-collection.png',
      name: 'Followed projects',
      description: "Auto-generated collection of all the projects you're following.",
      status: 'listed',
      user: auth.value.user.id,
      created: auth.value.user.created,
      updated: auth.value.user.created,
    })
    const data = await useAsyncData(`user/${auth.value.user.id}/follows`, () =>
      useBaseFetch(`user/${auth.value.user.id}/follows`)
    )
    projects = ref(data.data)
    console.log(projects.value)

    creator = ref(auth.value.user)
    refreshProjects = async () => {}
    refreshCollection = async () => {}
    console.log('dwadaw')
  } else {
    const val = await useAsyncData(`collection/${route.params.id}`, () =>
      useBaseFetch(`collection/${route.params.id}`, { apiVersion: 3 })
    )
    collection = val.data
    console.log(collection.value)
    refreshCollection = val.refresh
    ;[{ data: creator }, { data: projects, refresh: refreshProjects }] = await Promise.all([
      await useAsyncData(`user/${collection.value.user}`, () =>
        useBaseFetch(`user/${collection.value.user}`)
      ),
      await useAsyncData(`projects?ids=${JSON.stringify(collection.value.projects)}]`, () =>
        useBaseFetch(`projects?ids=${JSON.stringify(collection.value.projects)}`)
      ),
    ])
  }
} catch (err) {
  console.error(err)
  throw createError({
    fatal: true,
    statusCode: 404,
    message: 'Collection not found',
  })
}

if (!collection.value) {
  throw createError({
    fatal: true,
    statusCode: 404,
    message: 'Collection not found',
  })
}

const canEdit = computed(
  () =>
    auth.value.user &&
    auth.value.user.id === collection.value.user &&
    collection.value.id !== 'following'
)

const projectTypes = computed(() => {
  const obj = {}

  for (const project of projects.value) {
    obj[project.project_type] = true
  }

  return Object.keys(obj)
})

const icon = ref(null)
const deletedIcon = ref(false)
const previewImage = ref(null)

const name = ref(collection.value.name)
const summary = ref(collection.value.description)
const visibility = ref(collection.value.status)
const removeProjects = ref([])

async function saveChanges() {
  startLoading()
  try {
    if (deletedIcon.value) {
      await useBaseFetch(`collection/${collection.value.id}/icon`, {
        method: 'DELETE',
        apiVersion: 3,
      })
    } else if (icon.value) {
      await useBaseFetch(
        `collection/${collection.value.id}/icon?ext=${
          icon.value.type.split('/')[icon.value.type.split('/').length - 1]
        }`,
        {
          method: 'PATCH',
          body: icon.value,
          apiVersion: 3,
        }
      )
    }

    const projectsToRemove = removeProjects.value.map((p) => p.id)
    const newProjects = projects.value
      .filter((p) => !projectsToRemove.includes(p.id))
      .map((p) => p.id)
    const newProjectIds = projectsToRemove.length > 0 ? newProjects : undefined

    await useBaseFetch(`collection/${collection.value.id}`, {
      method: 'PATCH',
      body: {
        name: name.value,
        description: summary.value,
        status: visibility.value,
        new_projects: newProjectIds,
      },
      apiVersion: 3,
    })

    await refreshCollection()
    await refreshProjects()

    name.value = collection.value.name
    summary.value = collection.value.description
    visibility.value = collection.value.status
    removeProjects.value = []

    editModal.value.hide()
  } catch (err) {
    addNotification({
      group: 'main',
      title: 'An error occurred',
      text: err.data.description,
      type: 'error',
    })
  }
  stopLoading()
}

async function deleteCollection() {
  startLoading()
  try {
    await useBaseFetch(`collection/${collection.value.id}`, {
      method: 'DELETE',
      apiVersion: 3,
    })
    await navigateTo('/dashboard/collections')
  } catch (err) {
    addNotification({
      group: 'main',
      title: 'An error occurred',
      text: err.data.description,
      type: 'error',
    })
  }
  stopLoading()
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

function showEditModal() {
  name.value = collection.value.name
  summary.value = collection.value.description
  previewImage.value = null
  deletedIcon.value = false
  editModal.value.show()
}
</script>

<style scoped lang="scss">
.remove-btn {
  margin-top: auto;
}
</style>
