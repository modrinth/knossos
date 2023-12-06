<template>
  <div>
    <ShareModal
      ref="shareModal"
      :share-title="collection.name"
      :share-text="`Check out the cool projects that are a part of the ${collection.name} collection on Modrinth!`"
      link
    />
    <Modal ref="editModal" :header="`Edit ${collection.name}`">
      <div class="universal-modal">
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
                    @click="markIconForDeletion"
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
        <div class="input-group push-right">
          <Button @click="$refs.editModal.hide()">
            <XIcon />
            Cancel
          </Button>
          <Button color="primary" :disabled="!hasChanges" @click="saveChanges()">
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
            <Avatar size="lg" :src="collection.icon_url" />
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
              <span>
                by
                <router-link :to="`/user/${creator.username}`">{{ creator.username }}</router-link>
              </span>
            </div>
            <div class="markdown-body collection-description">
              <p>{{ collection.description }}</p>
            </div>
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
          <template #right>
            <div
              v-if="auth.user && auth.user.id === creator.id"
              class="nav-button button-base"
              @click="showEditModal"
            >
              <EditIcon />
              Edit collection
            </div>
          </template>
        </PageBar>
        <Promotion />
        <div v-if="projects && projects.length > 0" class="project-list display-mode--list">
          <ProjectCard
            v-for="project in projects
              .filter((p) => selectedFilter === p.project_type || selectedFilter === 'all')
              .filter((p) => p.title.toLowerCase().includes(inputText.toLowerCase()))"
            :id="project.slug || project.id"
            :key="project.id"
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
          >
            <Button
              v-if="enableEditing"
              class="btn"
              color="danger"
              :disabled="!hasPermission"
              @click="() => removeProject(project.id)"
            >
              <XIcon />
              Remove
            </Button>
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
} from 'omorphia'
import WorldIcon from 'assets/images/utils/world.svg'
import GlassesIcon from 'assets/images/utils/glasses.svg'
import PackageIcon from 'assets/images/utils/package-open.svg'
import BracesIcon from 'assets/images/utils/braces.svg'
import UpToDate from 'assets/images/illustrations/up_to_date.svg'
import { addNotification } from '~/composables/notifs'

const route = useRoute()
const cosmetics = useCosmetics()
const auth = await useAuth()
const user = await useUser()
const tags = useTags()
const editModal = ref(null)

const collection = shallowRef(
  await useAsyncData(`collection/${route.params.id}`, () =>
    useBaseFetch(`collection/${route.params.id}`, { apiVersion: 3 })
  ).then((res) => res.data)
)

if (!collection.value) {
  throw createError({
    fatal: true,
    statusCode: 404,
    message: 'Collection not found',
  })
}

const { data: creator } = await useAsyncData(`user/${collection.value.user}`, () =>
  useBaseFetch(`user/${collection.value.user}`)
)

const { data: projects } = await useAsyncData(
  `projects?ids=${JSON.stringify(collection.value.projects)}]`,
  () => useBaseFetch(`projects?ids=${JSON.stringify(collection.value.projects)}`)
)

const selectedFilter = ref('all')
const filterOptions = computed(() =>
  projects.value.map((p) => p.project_type).filter((v, i, a) => a.indexOf(v) === i)
)
const inputText = ref('')
const icon = ref(null)
const deletedIcon = ref(false)
const previewImage = ref(null)
const name = ref(collection.value.name)
const summary = ref(collection.value.description)
const visibility = ref(collection.value.status)
const enableEditing = ref(false)

const patchData = computed(() => {
  const data = {}
  if (name.value !== collection.value.name) {
    data.name = name.value
  }
  if (summary.value !== collection.value.description) {
    data.description = summary.value
  }
  if (hasModifiedVisibility() && tags.value.approvedStatuses.includes(visibility.value)) {
    data.status = visibility.value
  }
  return data
})

const patchCollection = async (resData, quiet = false) => {
  let result = false
  startLoading()
  try {
    await useBaseFetch(`collection/${collection.value.id}`, {
      method: 'PATCH',
      body: resData,
      apiVersion: 3,
    })
    await resetCollection()
    result = true
    if (!quiet) {
      addNotification({
        group: 'main',
        title: 'Collection updated',
        text: 'Your collection has been updated.',
        type: 'success',
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  } catch (err) {
    addNotification({
      group: 'main',
      title: 'An error occurred',
      text: err,
      type: 'error',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  stopLoading()
  return result
}

const patchIcon = async (icon) => {
  let result = false
  startLoading()
  try {
    await useBaseFetch(
      `collection/${collection.value.id}/icon?ext=${
        icon.type.split('/')[icon.type.split('/').length - 1]
      }`,
      {
        method: 'PATCH',
        body: icon,
      }
    )
    await resetCollection()
    result = true
    addNotification({
      group: 'main',
      title: 'Collection icon updated',
      text: "Your collection's icon has been updated.",
      type: 'success',
    })
  } catch (err) {
    addNotification({
      group: 'main',
      title: 'An error occurred',
      text: err,
      type: 'error',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  stopLoading()
  return result
}

const deleteIcon = async () => {
  await useBaseFetch(`collection/${collection.value.id}/icon`, {
    method: 'DELETE',
  })
  await resetCollection()
  addNotification({
    group: 'main',
    title: 'Collection icon removed',
    text: "Your Collections's icon has been removed.",
    type: 'success',
  })
}

const resetCollection = async () => {
  collection.value = await useBaseFetch(`collection/${collection.value.id}`)
  projects.value = await useBaseFetch(`projects?ids=${JSON.stringify(collection.value.projects)}`)
}
const hasPermission = computed(() => {
  return (
    auth.value.user &&
    (auth.value.user.id === collection.value.user || tags.staffRoles.includes(auth.user.role))
  )
})

const hasChanges = computed(() => {
  return (
    Object.keys(patchData.value).length > 0 ||
    deletedIcon.value ||
    icon.value ||
    hasModifiedVisibility()
  )
})

const hasModifiedVisibility = () => {
  const originalVisibility = tags.value.approvedStatuses.includes(collection.value.status)
    ? collection.value.status
    : 'listed'
  return originalVisibility !== visibility.value
}

const saveChanges = async () => {
  if (hasChanges.value) {
    await patchCollection(patchData.value)
  }
  if (deletedIcon.value) {
    await deleteIcon()
    deletedIcon.value = false
  } else if (icon.value) {
    await patchIcon(icon.value)
    icon.value = null
  }
  editModal.value.hide()
}

const markIconForDeletion = () => {
  deletedIcon.value = true
  icon.value = null
  previewImage.value = null
}

const showPreviewImage = (files) => {
  const reader = new FileReader()
  icon.value = files[0]
  deletedIcon.value = false
  reader.readAsDataURL(icon.value)
  reader.onload = (event) => {
    previewImage.value = event.target.result
  }
}

const removeProject = (projectId) => {
  const projectList = collection.value.projects
  projectList.splice(projectList.indexOf(projectId), 1)
  patchCollection({ new_projects: projectList })
}

const showEditModal = () => {
  editModal.value.show()
  name.value = collection.value.name
  summary.value = collection.value.description
  previewImage.value = null
  deletedIcon.value = false
}
</script>

<style scoped lang="scss">
.project-list {
  width: 100%;
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

.edit-section {
  display: grid;
  grid-template:
    'icon name' 40px
    'icon description' auto
    / auto 1fr;
  grid-gap: var(--gap-sm);
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
