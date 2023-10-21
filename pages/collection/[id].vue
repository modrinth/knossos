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
  SaveIcon, formatCategory, ReportIcon,
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
import PopoutMenu from "~/components/ui/PopoutMenu.vue";
import FilterIcon from "assets/images/utils/filter.svg";
import Checkbox from "~/components/ui/Checkbox.vue";
import CopyCode from "~/components/ui/CopyCode.vue";

const data = useNuxtApp()
const route = useRoute()
const cosmetics = useCosmetics()
const auth = await useAuth()
const user = await useUser()
const tags = useTags()

const collection = shallowRef(
  await useAsyncData(`collection/${route.params.id}`, () =>
    useBaseFetch(`collection/${route.params.id}`)
  ).then((res) => res.data)
)
const projects = shallowRef(
  await useAsyncData(
    `projects?ids=${JSON.stringify(collection.value.projects)}]`,
    () => useBaseFetch(`projects?ids=${JSON.stringify(collection.value.projects)}`)
  ).then((res) => res.data)
)

const selectedFilters = ref([])
selectedFilters.value.push(
    ...projects.value.map((p) => p.project_type).filter((v, i, a) => a.indexOf(v) === i)
)

const filterOptions = computed(() => projects.value.map((p) => p.project_type).filter((v, i, a) => a.indexOf(v) === i))
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

    await resetCollection();

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
    class="normal-page no-sidebar"
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
        <div class="page-header__buttons">
          <div class="group">
            <Button @click="$refs.reportModal.show()">
              <ReportIcon />
              Report
            </Button>
            <Button @click="$refs.shareModal.show(`https://modrinth.com/organization/${organization.title}`)">
              <ShareIcon />
              Share
            </Button>
          </div>
          <div class="group">
            <CopyCode :text="collection.id"/>
          </div>
        </div>
      </div>
    </div>
    <div class="normal-page__content">
      <Promotion />
      <div class="search-row">
        <template v-if="enableEditing">
          <SearchDropdown
              v-model="searchText"
              name="project-input"
              :options="
            results?.hits?.map((p) => ({ icon: p.icon_url, title: p.title, id: p.project_id }))
          "
              placeholder="Add projects..."
              @on-selected="addProject"
          />
          <Button color="primary" @click="saveChanges">
            <SaveIcon />
            Save changes
          </Button>
        </template>
        <template v-else>
          <div class="iconified-input">
            <label for="search-input" hidden>Search notifications</label>
            <SearchIcon />
            <input id="search-input" v-model="inputText" type="text" />
            <Button
                :class="inputText ? '' : 'empty'"
                @click="() => (inputText = '')"
            >
              <XIcon />
            </Button>
          </div>
          <PopoutMenu class="btn" position="bottom-left" from="top-right">
            <FilterIcon />
            Filter...
            <template #menu>
              <h2 class="popout-heading">Type</h2>
              <Checkbox
                  v-for="option in filterOptions"
                  :key="`option-${option}`"
                  class="popout-checkbox"
                  :model-value="selectedFilters.includes(option)"
                  @click="
                  () => {
                    if (selectedFilters.includes(option)) {
                      selectedFilters = selectedFilters.filter((f) => f !== option)
                    } else {
                      selectedFilters.push(option)
                    }
                  }
                "
              >
                {{ formatCategory(option) }}
              </Checkbox>
            </template>
          </PopoutMenu>
        </template>
        <Button @click="() => (enableEditing = !enableEditing)">
          <EditIcon />
          {{ enableEditing ? 'Disable': 'Enable'}} editing
        </Button>
      </div>
      <div class="project-list display-mode--list">
        <ProjectCard
            v-for="project in projects
            .filter((p) => selectedFilters.includes(p.project_type))
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



.search-row {
  margin-bottom: var(--gap-md);
  display: flex;

  .iconified-input, :deep(.animated-dropdown) > .iconified-input {
    flex-grow: 1;

    input {
      height: 3rem;
      background-color: var(--color-raised-bg);
      border: 1px solid var(--color-button-bg);
    }
  }

  :deep(.animated-dropdown) {
    width: 100%;

    .option {
      background-color: var(--color-raised-bg);
    }

    .options {
      border-radius: 0 0 var(--radius-md) var(--radius-md);
      border: 1px solid var(--color-button-bg);
    }
  }

  :deep(.btn) {
    height: 3rem;
    margin-left: var(--gap-sm);
    white-space: nowrap;
  }
}

.iconified-input {
  .empty {
    visibility: hidden;
  }
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
</style>
