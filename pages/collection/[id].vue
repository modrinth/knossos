<script setup>
import {
  Avatar,
  Button,
  ShareIcon,
  BoxIcon,
  Promotion,
  EditIcon,
  XIcon,
  SearchIcon,
  SaveIcon,
  ReportModal,
  ShareModal,
  FilterIcon,
  OverflowMenu,
  BookmarkIcon,
  MoreHorizontalIcon,
  ServerIcon,
  ImageIcon,
  Modal,
  UploadIcon,
  TrashIcon,
  PopoutMenu,
  FileInput,
  Badge,
  PageBar,
    HistoryIcon,
    ProjectCard,
} from 'omorphia'
import PuzzleIcon from "~/assets/images/utils/puzzle.svg";
import WorldIcon from "assets/images/utils/world.svg";
import GlassesIcon from "assets/images/utils/glasses.svg";
import PackageIcon from "assets/images/utils/package-open.svg";
import BracesIcon from "assets/images/utils/braces.svg";
import UpToDate from "assets/images/illustrations/up_to_date.svg";

const data = useNuxtApp()
const route = useRoute()
const cosmetics = useCosmetics()
const auth = await useAuth()
const user = await useUser()
const tags = useTags()
const editModal = ref(null)

const collection = shallowRef(
  await useAsyncData(`collection/${route.params.id}`, () =>
    useBaseFetch(`collection/${route.params.id}`)
  ).then((res) => res.data)
)

const creator = shallowRef(
  await useAsyncData(`user/${collection.value.user}`, () =>
    useBaseFetch(`user/${collection.value.user}`)
  ).then((res) => res.data)
)

if (!collection.value) {
    throw createError({
        fatal: true,
        statusCode: 404,
        message: 'Collection not found',
    })
}

const projects = shallowRef(
  await useAsyncData(`projects?ids=${JSON.stringify(collection.value.projects)}]`, () =>
    useBaseFetch(`projects?ids=${JSON.stringify(collection.value.projects)}`)
  ).then((res) => res.data)
)

const selectedFilter = ref('all')

const filterOptions = computed(() =>
  projects.value.map((p) => p.project_type).filter((v, i, a) => a.indexOf(v) === i)
)

const inputText = ref('')

const icon = ref(null)
const deletedIcon = ref(false)
const previewImage = ref(null)
const name = ref(collection.value.title)
const summary = ref(collection.value.description)
const visibility = ref(collection.value.status)
const enableEditing = ref(false)

const patchData = computed(() => {
  const data = {}

  if (name.value !== collection.value.title) {
    data.title = name.value
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
    })

    await resetCollection()

    result = true
    if (!quiet) {
      data.$notify({
        group: 'main',
        title: 'Collection updated',
        text: 'Your collection has been updated.',
        type: 'success',
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  } catch (err) {
    data.$notify({
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
    data.$notify({
      group: 'main',
      title: 'Collection icon updated',
      text: "Your collection's icon has been updated.",
      type: 'success',
    })
  } catch (err) {
    data.$notify({
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
  this.$notify({
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
  return auth.value.user && (auth.value.user.id === collection.value.user || tags.staffRoles.includes(auth.user.role))
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

const searchText = ref('')

const noLoad = ref(false)
const { data: rawResults } = useLazyFetch(
  () => {
    const config = useRuntimeConfig()
    const base = process.server ? config.apiBaseUrl : config.public.apiBaseUrl

    const params = [`limit=20`]

    if (searchText.value.length > 0) {
      params.push(`query=${encodeURIComponent(searchText.value.replace(/ /g, '+'))}`)
    }

    let url = 'search'

    if (params.length > 0) {
      for (let i = 0; i < params.length; i++) {
        url += i === 0 ? `?${params[i]}` : `&${params[i]}`
      }
    }

    return `${base}${url}`
  },
  {
    transform: (hits) => {
      noLoad.value = false
      return hits
    },
  }
)

const results = shallowRef(toRaw(rawResults))

const showEditModal = () => {
  editModal.value.show()
  name.value = collection.value.title
  summary.value = collection.value.description
  previewImage.value = null
  deletedIcon.value = false
}
</script>

<template>
  <ShareModal
      ref="shareModal"
      :share-title="collection.title"
      :share-text="`Check out the cool projects that are a part of the ${collection.title} collection on Modrinth!`"
      link
  />
  <ReportModal
      ref="reportModal"
      item-type="collection"
      :item-id="collection?.id"
      :report-types="[
      'Spam',
      'Inappropriate',
      'Malicious',
      'Name-squatting',
      'Poor description',
      'Invalid metadata',
      'Other',
    ]"
  />
  <Modal
    ref="editModal"
    :header="`Edit ${collection.title}`"
  >
    <div class="modal-body">
      <div class="edit-section">
        <div class="avatar-section">
          <Avatar size="lg" :src="deletedIcon ? null : previewImage ? previewImage : collection.icon_url" />
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
                  @click="markIconForDeletion"
                  style="white-space: nowrap"
                  transparent
              >
                <TrashIcon />
                Delete icon
              </Button>
            </span>
            </template>
          </PopoutMenu>
        </div>
        <input
            type="text"
            placeholder="Collection title"
            v-model="name"
        />
        <textarea
            placeholder="Add an optional description"
            v-model="summary"
        />
      </div>
      <div class="input-group push-right">
        <Button @click="$refs.editModal.hide()">
          <XIcon/>
          Cancel
        </Button>
        <Button
          color="primary"
          :disabled="!hasChanges"
          @click="saveChanges()"
        >
          <SaveIcon />
          Save changes
        </Button>
      </div>
    </div>
  </Modal>
  <div class="normal-page no-sidebar">
    <div v-if="!$route.name.startsWith('collection-id-settings')" class="normal-page__header">
      <div class="page-header">
        <div class="page-header__icon">
          <Avatar
            size="lg"
            :src="collection.icon_url"
          />
        </div>
        <div class="page-header__text">
          <div class="title">
            <h1>{{ collection.title }}</h1>
            <Button @click="$refs.shareModal.show(`https://modrinth.com/collection/${collection.id}`)">
              <ShareIcon />
            </Button>
          </div>
          <div class="collection-info">
            <span>
              by <router-link :to="`/user/${creator.username}`">{{ creator.username }}</router-link>
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
        <div class="button-base nav-button" :class="{'router-link-exact-active': selectedFilter === 'all'}" @click="() => selectedFilter = 'all'">All</div>
        <template v-for="(filter, index) in filterOptions" :key="filter">
          <div class="button-base nav-button" v-if="filter === selectedFilter || index < 2" :class="{'router-link-exact-active': selectedFilter === filter}" @click="() => selectedFilter = filter">
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
            v-if="filterOptions.length > 2 && filterOptions.slice(2, filterOptions.length).filter((filter) => filter !== selectedFilter).length > 0"
            class="link btn transparent"
            :options="filterOptions.slice(2, filterOptions.length).filter((filter) => filter !== selectedFilter).map(
                (filter) => ({
                'id': filter,
                'action': () => {
                  selectedFilter = filter
                },
              })
            )"
            position="right"
            direction="down"
        >
          <MoreHorizontalIcon/>
          <template #mod> <BoxIcon /> Mods </template>
          <template #datapack> <BracesIcon /> Data Packs </template>
          <template #resourcepack> <ImageIcon /> Resource Packs </template>
          <template #shader> <GlassesIcon /> Shaders </template>
          <template #world> <WorldIcon /> Worlds </template>
          <template #plugin> <ServerIcon /> Plugins </template>
          <template #modpack> <PackageIcon /> Modpacks </template>
        </OverflowMenu>
        <template #right>
          <div class="nav-button button-base" v-if="auth.user && auth.user.id === creator.id" @click="showEditModal">
            <EditIcon />
            Edit collection
          </div>
        </template>
      </PageBar>
      <Promotion />
      <div v-if="projects && projects.length > 0" class="search-row">
        <div class="iconified-input">
          <SearchIcon />
          <input id="search-input" v-model="inputText" type="text" placeholder="Search for mods..." />
          <Button class="r-btn" :class="inputText ? '' : 'empty'" @click="() => (inputText = '')">
            <XIcon />
          </Button>
        </div>
      </div>
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
        >
          <Button
            v-if="enableEditing"
            class="btn"
            color="danger"
            @click="() => removeProject(project.id)"
            :disabled="!hasPermission"
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
</template>

<style scoped lang="scss">
.settings-header {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-card-sm);
  align-items: center;
  margin-bottom: var(--spacing-card-bg);

  .settings-header__icon {
    flex-shrink: 0;
  }

  .settings-header__text {
    h1 {
      font-size: var(--font-size-md);
      margin: 0;
    }
  }
}

.sidebar {
  margin-bottom: var(--gap-md);
}

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

.new-nav {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 2px solid var(--color-button-bg);

  svg {
    height: 1.2rem;
    width: 1.2rem;
  }

  a, .link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    border-bottom: 3px solid transparent;
    padding: 0.75rem 1rem;
    margin-bottom: -2px;

    &.router-link-exact-active {
      color: var(--color-contrast);
      border-color: var(--color-brand);
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

.modal-body {
  display: flex;
  flex-direction: column;
  gap: var(--gap-md);
  padding: var(--gap-lg);
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
