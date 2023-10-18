<script setup>
import {
  Avatar,
  Button,
  Card,
  ShareIcon,
  BoxIcon,
  Promotion,
  EditIcon,
  DropdownSelect,
  XIcon,
  SearchIcon,
  SaveIcon,
} from 'omorphia'
import Breadcrumbs from '~/components/ui/Breadcrumbs.vue'
import SettingsIcon from 'assets/images/utils/settings.svg'
import NavStackItem from '~/components/ui/NavStackItem.vue'
import NavStack from '~/components/ui/NavStack.vue'
import ProjectCard from '~/components/ui/ProjectCard.vue'
import SearchDropdown from '~/components/search/SearchDropdown.vue'
import FileInput from '~/components/ui/FileInput.vue'
import TrashIcon from 'assets/images/utils/trash.svg'
import UploadIcon from 'assets/images/utils/upload.svg'

const data = useNuxtApp()
const route = useRoute()

const collection = shallowRef(
  await useAsyncData(`collection/${route.params.id}`, () =>
    useBaseFetch(`collection/${route.params.id}`)
  ).then((res) => res.data)
)
const projects = shallowRef(
  await useAsyncData(
    `projects?ids=[${collection.value.projects.map((p) => `"${p}"`).join(',')}]`,
    () => useBaseFetch(`projects?ids=[${collection.value.projects.map((p) => `"${p}"`).join(',')}]`)
  ).then((res) => res.data)
)

const projectTypes = ref(['All'])
projectTypes.value.push(
  ...projects.value.map((p) => p.project_type).filter((v, i, a) => a.indexOf(v) === i)
)
const projectType = ref('All')
const inputText = ref('')
const icon = ref(null)
const deletedIcon = ref(false)
const previewImage = ref(null)
const name = ref(collection.value.title)
const summary = ref(collection.value.description)
const visibility = ref(collection.value.status)
const tags = useTags()
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
  projects.value = await useBaseFetch(
    `projects?ids=[${collection.value.projects.map((p) => `"${p}"`).join(',')}]`
  )
}

const hasPermission = computed(() => {
  const EDIT_DETAILS = 1 << 2
  return true
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

const addProject = (project) => {
  const projectList = collection.value.projects
  projectList.push(project.id)
  patchCollection({ new_projects: projectList })
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
</script>

<template>
  <div
    class="normal-page"
    :class="{
      'no-sidebar': !$route.name.startsWith('collection-id-settings'),
      'left-sidebar': $route.name.startsWith('collection-id-settings'),
    }"
  >
    <div v-if="!$route.name.startsWith('collection-id-settings')" class="normal-page__header">
      <div class="page-header">
        <div class="page-header__icon">
          <Avatar
            size="md"
            :src="deletedIcon ? null : previewImage ? previewImage : collection.icon_url"
          />
          <FileInput
            v-if="enableEditing"
            id="project-icon"
            :max-size="262144"
            :show-icon="true"
            accept="image/png,image/jpeg,image/gif,image/webp"
            class="btn icon-only upload"
            prompt=""
            :disabled="!hasPermission"
            @change="showPreviewImage"
          >
            <UploadIcon />
          </FileInput>
          <button
            v-if="enableEditing && !deletedIcon && (previewImage || collection.icon_url)"
            class="btn icon-only delete"
            :disabled="!hasPermission"
            @click="markIconForDeletion"
          >
            <TrashIcon />
          </button>
        </div>
        <div class="page-header__text">
          <div v-if="!enableEditing" class="title">
            <h1>{{ collection.title }}</h1>
            <Button>
              <ShareIcon />
            </Button>
          </div>
          <div v-else class="iconified-input">
            <BoxIcon />
            <input v-model="name" type="text" placeholder="Collection name..." />
            <Button @click="() => (enableEditing = !enableEditing)">
              <XIcon />
            </Button>
          </div>
          <div v-if="!enableEditing" class="markdown-body">
            <p>{{ collection.description }}</p>
          </div>
          <div v-else class="textarea-wrapper summary-input">
            <textarea
              id="project-summary"
              v-model="summary"
              maxlength="256"
              :disabled="!hasPermission"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="normal-page__content">
      <Promotion />
      <Card class="search-card">
        <div v-if="!enableEditing" class="dropdown-input">
          <DropdownSelect v-model="projectType" :options="projectTypes" />
          <div class="iconified-input">
            <SearchIcon />
            <input v-model="inputText" type="text" placeholder="Search projects..." />
            <Button @click="() => (inputText = '')">
              <XIcon />
            </Button>
          </div>
        </div>
        <SearchDropdown
          v-else
          v-model="searchText"
          name="project-input"
          :options="
            results?.hits?.map((p) => ({ icon: p.icon_url, title: p.title, id: p.project_id }))
          "
          placeholder="Add projects..."
          @on-selected="addProject"
        />
        <Button v-if="!hasChanges" @click="() => (enableEditing = !enableEditing)">
          <EditIcon />
          {{ enableEditing ? 'Disable' : 'Enable' }} editing
        </Button>
        <Button v-else color="primary" @click="saveChanges">
          <SaveIcon />
          Save changes
        </Button>
      </Card>
      <div class="project-list display-mode--list">
        <ProjectCard
          v-for="project in projects
            .filter((p) => projectType === 'All' || p.project_type === projectType)
            .filter((p) => p.title.toLowerCase().includes(inputText.toLowerCase()))"
          :id="project.slug"
          :type="project.project_type"
          :name="project.title"
          :description="project.description"
          :icon-url="project.icon_url"
          :downloads="project.downloads"
          :follows="project.follows"
          :created-at="project.created_at"
          :updated-at="project.updated_at"
          :project-type-display="project.project_type"
          :project-type-url="`/${project.project_type}`"
          :categories="project.display_categories"
          :server-side="project.server_side"
          :client-side="project.client_side"
          :show-updated-date="false"
          color="1716041"
        />
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

.search-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--gap-md);
}

.project-list {
  width: 100%;
}

.dropdown-input {
  :deep(.selected) {
    height: 40px;
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
</style>
