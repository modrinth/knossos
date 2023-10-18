<script setup>
import {
  Avatar,
  Button,
  Promotion,
  ShareIcon,
  Card,
  DropdownSelect,
  SearchIcon,
  XIcon,
  EditIcon,
} from 'omorphia'
import ProjectCard from '~/components/ui/ProjectCard.vue'
import Settings from '~/pages/settings.vue'
import SearchDropdown from '~/components/search/SearchDropdown.vue'

const route = useRoute()
const projectType = ref('All')
const inputText = ref('')
const enableEditing = ref(false)

defineProps({
  collection: {
    type: Object,
    default() {
      return {}
    },
  },
  projects: {
    type: Array,
    default() {
      return []
    },
  },
  projectTypes: {
    type: Array,
    default() {
      return []
    },
  },
  patchCollection: {
    type: Function,
    default() {
      return () => {}
    },
  },
})

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

const addProject = (project) => {
  const projectList = props.collection.projects
  projectList.push(project.id)
  props.patchCollection({ new_projects: projectList })
}

const removeProject = (projectId) => {
  const projectList = props.collection.projects
  projectList.splice(projectList.indexOf(projectId), 1)
  props.patchCollection({ new_projects: projectList })
}

const results = shallowRef(toRaw(rawResults))
</script>

<template>
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
      v-model="inputText"
      name="project-input"
      :options="results?.hits?.map((p) => ({ icon: p.icon_url, title: p.title, id: p.project_id }))"
      @on-selected="addProject"
    />
    <Button @click="() => (enableEditing = !enableEditing)">
      <EditIcon />
      Enable Editing
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
</template>

<style scoped lang="scss">
.project-list {
  width: 100%;
}

.dropdown-input {
  :deep(.selected) {
    height: 40px;
  }
}

.search-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--gap-md);
}
</style>
