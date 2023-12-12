<template>
  <div>
    <ShareModal
      ref="shareModal"
      :share-title="collection.name"
      :share-text="`Check out the cool projects that are a part of the ${collection.name} collection on Modrinth!`"
      link
    />
    <Modal ref="deleteModal" :header="`Delete ${collection.name}`">
      <div class="universal-modal">
        <p>Are you sure you want to delete this collection? This action cannot be undone.</p>
        <div class="input-group push-right">
          <Button @click="$refs.deleteModal.hide()">
            <XIcon />
            Cancel
          </Button>
          <Button color="danger" @click="deleteCollection()">
            <TrashIcon />
            Delete collection
          </Button>
        </div>
      </div>
    </Modal>
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
            v-model="visibility"
            id="visibility"
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
          <label v-if="projects" for="remove-projects">
            <span class="label__title"> Remove Projects </span>
          </label>

          <Multiselect
            v-if="projects"
            v-model="removeProjects"
            id="remove-projects"
            :options="projects"
            label="title"
            track-by="id"
            :multiple="true"
            :close-on-select="false"
            :show-labels="false"
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
    <div class="normal-page no-sidebar">
      <div class="normal-page__header">
        <div class="page-header">
          <div class="page-header__icon">
            <Avatar size="md" :src="collection.icon_url" />
          </div>
          <div class="page-header__text">
            <div class="title">
              <h1>{{ collection.name }}</h1>
              <Button
                @click="$refs.shareModal.show(`https://modrinth.com/collection/${collection.id}`)"
              >
                <ShareIcon />
              </Button>
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
          <div class="page-header__buttons">
            <OverflowMenu
              v-if="auth.user && auth.user.id === creator.id"
              class="btn btn-primary btn-large"
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
            >
              <ManageIcon />
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
          </div>
        </div>
      </div>
      <div class="normal-page__content">
        <PageBar>
          <span class="page-bar__title"><FilterIcon /> Filter by</span>
          <div
            class="button-base nav-button"
            :class="{ 'router-link-exact-active': selectedFilter === 'all' }"
            @click="() => (selectedFilter = 'all')"
          >
            All
          </div>
          <template v-for="(filter, index) in filterOptions" :key="filter">
            <div
              v-if="filter === selectedFilter || index < 2"
              class="button-base nav-button"
              :class="{ 'router-link-exact-active': selectedFilter === filter }"
              @click="() => (selectedFilter = filter)"
            >
              <template v-if="filter === 'mod'"><BoxIcon /> Mods </template>
              <template v-if="filter === 'datapack'"><BracesIcon /> Data Packs </template>
              <template v-if="filter === 'resourcepack'"><ImageIcon /> Resource Packs </template>
              <template v-if="filter === 'shader'"><GlassesIcon /> Shaders </template>
              <template v-if="filter === 'world'"><WorldIcon /> Worlds </template>
              <template v-if="filter === 'plugin'"><ServerIcon /> Plugins </template>
              <template v-if="filter === 'modpack+'"><PackageIcon /> Modpacks </template>
            </div>
          </template>
          <OverflowMenu
            v-if="
              filterOptions.length > 2 &&
              filterOptions
                .slice(2, filterOptions.length)
                .filter((filter) => filter !== selectedFilter).length > 0
            "
            class="link btn transparent"
            :options="
              filterOptions
                .slice(2, filterOptions.length)
                .filter((filter) => filter !== selectedFilter)
                .map((filter) => ({
                  id: filter,
                  action: () => {
                    selectedFilter = filter
                  },
                }))
            "
            position="right"
            direction="down"
          >
            <MoreHorizontalIcon />
            <template #mod> <BoxIcon /> Mods </template>
            <template #datapack> <BracesIcon /> Data Packs </template>
            <template #resourcepack> <ImageIcon /> Resource Packs </template>
            <template #shader> <GlassesIcon /> Shaders </template>
            <template #world> <WorldIcon /> Worlds </template>
            <template #plugin> <ServerIcon /> Plugins </template>
            <template #modpack> <PackageIcon /> Modpacks </template>
          </OverflowMenu>
        </PageBar>
        <Promotion />
        <div v-if="projects && projects.length > 0" class="project-list display-mode--list">
          <ProjectCard
            v-for="project in projects.filter(
              (p) => selectedFilter === p.project_type || selectedFilter === 'all'
            )"
            :key="project.id"
            :id="project.slug || project.id"
            :name="project.title"
            :display="cosmetics.searchDisplayMode.user"
            :featured-image="
              project.gallery
                .slice()
                .sort((a, b) => b.featured - a.featured)
                .map((x) => x.url)[0]
            "
            :description="project.description"
            :created-at="project.published"
            :updated-at="project.updated"
            :downloads="project.downloads.toString()"
            :follows="project.followers.toString()"
            :icon-url="project.icon_url"
            :categories="project.categories"
            :client-side="project.client_side"
            :server-side="project.server_side"
            :status="
              auth.user && (auth.user.id === user.id || tags.staffRoles.includes(auth.user.role))
                ? project.status
                : null
            "
            :type="project.project_type"
            :color="project.color"
            :from-now="fromNow"
          />
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
  ShareIcon,
  BoxIcon,
  Promotion,
  EditIcon,
  XIcon,
  SaveIcon,
  ShareModal,
  FilterIcon,
  OverflowMenu,
  MoreHorizontalIcon,
  ServerIcon,
  ImageIcon,
  Modal,
  UploadIcon,
  TrashIcon,
  PopoutMenu,
  FileInput,
  PageBar,
  ProjectCard,
  DropdownSelect,
  LinkIcon,
  LockIcon,
  UserIcon,
  UpdatedIcon,
} from 'omorphia'
import { Multiselect } from 'vue-multiselect'

import WorldIcon from 'assets/images/utils/world.svg'
import GlassesIcon from 'assets/images/utils/glasses.svg'
import PackageIcon from 'assets/images/utils/package-open.svg'
import BracesIcon from 'assets/images/utils/braces.svg'
import UpToDate from 'assets/images/illustrations/up_to_date.svg'
import { addNotification } from '~/composables/notifs'

import ManageIcon from '~/assets/images/utils/settings-2.svg'

const route = useRoute()
const cosmetics = useCosmetics()
const auth = await useAuth()
const user = await useUser()
const tags = useTags()
const editModal = ref(null)
const deleteModal = ref(null)

const { data: collection, refresh: refreshCollection } = await useAsyncData(
  `collection/${route.params.id}`,
  () => useBaseFetch(`collection/${route.params.id}`, { apiVersion: 3 })
)

if (!collection.value) {
  throw createError({
    fatal: true,
    statusCode: 404,
    message: 'Collection not found',
  })
}

const [{ data: creator }, { data: projects, refresh: refreshProjects }] = await Promise.all([
  await useAsyncData(`user/${collection.value.user}`, () =>
    useBaseFetch(`user/${collection.value.user}`)
  ),
  await useAsyncData(`projects?ids=${JSON.stringify(collection.value.projects)}]`, () =>
    useBaseFetch(`projects?ids=${JSON.stringify(collection.value.projects)}`)
  ),
])

const selectedFilter = ref('all')
const filterOptions = computed(() =>
  projects.value.map((p) => p.project_type).filter((v, i, a) => a.indexOf(v) === i)
)

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
    const new_projects = projectsToRemove.length > 0 ? newProjects : undefined

    await useBaseFetch(`collection/${collection.value.id}`, {
      method: 'PATCH',
      body: {
        name: name.value,
        description: summary.value,
        status: visibility.value,
        new_projects,
      },
      apiVersion: 3,
    })

    await refreshCollection()
    await refreshProjects()

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

async function removeProjectFromCollection(id) {
  startLoading()
  try {
    await useBaseFetch(`collection/${collection.value.id}`, {
      method: 'PATCH',
      apiVersion: 3,
      body: {
        new_projects: collection.value.projects.filter((p) => p !== id),
      },
    })
    await refreshCollection() // Need to be refreshed first to get the new projects list
    await refreshProjects()
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
    await navigateTo('/settings/collections')
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
.metadata-item {
  display: flex;
  align-items: center;

  color: var(--color-text);

  span {
    font-weight: var(--font-weight-medium);
  }
}

.project-list {
  width: 100%;

  .project-list__item {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }
}

.page-header {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: var(--gap-md);
  .page-header__text {
    flex: 1;
  }
  .page-header__buttons {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--gap-sm);
  }
}

.page-header__icon {
  position: relative;
  .upload {
    position: absolute;
    top: var(--gap-sm);
    right: var(--gap-sm);
  }
  .delete {
    position: absolute;
    top: calc(var(--gap-sm) * 2 + 2.25rem);
    right: var(--gap-sm);
  }
}

.summary-input {
  width: 100%;
  max-width: 24rem;
}

.popout-heading {
  padding: var(--gap-sm) var(--gap-md);
  margin: 0;
  font-size: var(--font-size-md);
  color: var(--color-text);
}

.popout-checkbox {
  padding: var(--gap-sm) var(--gap-md);
}

.filter-row {
  margin-bottom: 1rem;
  .title {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem 0.75rem 0;
    color: var(--color-secondary);
    svg {
      margin-right: 0.5rem;
    }
  }
}

.collection-info {
  // font-size: var(--font-size-sm);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--gap-md);
  margin-bottom: var(--gap-sm);
  > * {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }
  a {
    color: var(--color-blue);
    &:hover {
      text-decoration: underline;
    }
  }
}

.collection-description {
  margin-bottom: var(--gap-sm);
}

.modal-spacing {
  display: grid;
  gap: var(--gap-md);
}

.edit-section {
  display: grid;
  grid-template:
    'icon name' 40px
    'icon description' auto
    / auto 1fr;
  grid-gap: var(--gap-md);
  .avatar-section {
    position: relative;
    grid-area: icon;
    width: 9rem;
    height: 9rem;
    .avatar {
      background-color: var(--color-bg);
      border: 1px solid var(--color-button-bg);
    }
    .popup-container {
      position: absolute;
      top: var(--gap-sm);
      right: var(--gap-sm);
    }
  }
  input {
    grid-area: name;
  }
  textarea {
    grid-area: description;
  }
}

.icon-edit-menu {
  display: flex;
  flex-direction: column;
  gap: var(--gap-xs);
  .btn {
    width: 100%;
    justify-content: flex-start;
    gap: var(--gap-xs);
  }
}
</style>
