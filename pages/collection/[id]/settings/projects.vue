<script setup>
import { Card, SearchIcon, XIcon, Button, Avatar, CopyCode, TrashIcon, SaveIcon } from 'omorphia'
import Checkbox from '~/components/ui/Checkbox.vue'
import SearchDropdown from '~/components/search/SearchDropdown.vue'

const props = defineProps({
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
  patchCollection: {
    type: Function,
    default() {
      return () => {}
    },
  },
})

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

const inputText = ref('')

const noLoad = ref(false)
const { data: rawResults } = useLazyFetch(
  () => {
    const config = useRuntimeConfig()
    const base = process.server ? config.apiBaseUrl : config.public.apiBaseUrl

    const params = [`limit=20`]

    if (inputText.value.length > 0) {
      params.push(`query=${encodeURIComponent(inputText.value.replace(/ /g, '+'))}`)
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
  <Card class="add-projects-card">
    <div class="title-row">
      <div class="label">
        <h3>
          <span class="label__title size-card-header">Collection's projects</span>
        </h3>
      </div>
      <SearchDropdown
        v-model="inputText"
        name="project-input"
        :options="
          results?.hits?.map((p) => ({ icon: p.icon_url, title: p.title, id: p.project_id }))
        "
        @on-selected="addProject"
      />
    </div>
    <div class="table">
      <div class="table-row table-head">
        <div class="table-cell">
          <Checkbox
            :model-value="projects.every((p) => p.selected)"
            @update:model-value="(value) => projects.forEach((p) => (p.selected = value))"
          />
        </div>
        <div class="table-cell">Project name</div>
        <div class="table-cell">ID</div>
        <div class="table-cell">Project type</div>
        <div class="table-cell"></div>
      </div>
      <div v-for="project in projects" :key="project.id" class="table-row">
        <div class="table-cell">
          <Checkbox v-model="project.selected" />
        </div>
        <div class="table-cell centered-cell">
          <Avatar
            :src="project.icon_url"
            size="sm"
            class="button-base"
            @click="$router.push(`/${project.project_type}/${project.slug}`)"
          />
          <span
            class="button-base"
            @click="$router.push(`/${project.project_type}/${project.slug}`)"
            >{{ project.title }}</span
          >
        </div>
        <div class="table-cell centered-cell">
          <div>
            <CopyCode :text="project.id" />
          </div>
        </div>
        <div class="table-cell">
          {{ project.project_type }}
        </div>
        <div class="table-cell">
          <Button icon-only @click="removeProject(project.id)">
            <TrashIcon />
          </Button>
        </div>
      </div>
    </div>
  </Card>
</template>

<style scoped lang="scss">
.title-row {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
}

.animated-dropdown {
  margin-bottom: var(--gap-md);
}

.table-row {
  display: grid;
  grid-template-columns: 2rem 2fr 1fr 1fr 4.25rem;

  .table-cell {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--gap-md);
  }
}
</style>
