<script setup>
import { Avatar, Button, Promotion, ShareIcon, Card, DropdownSelect, SearchIcon, XIcon, SettingsIcon } from 'omorphia'
import ProjectCard from '~/components/ui/ProjectCard.vue'
import Settings from "~/pages/settings.vue";

const route = useRoute()
const projectType = ref('All');
const inputText = ref('');

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
})
</script>

<template>
  <Promotion />
  <Card class="search-card">
    <div class="dropdown-input">
      <DropdownSelect
          v-model="projectType"
          :options="projectTypes"
      />
      <div class="iconified-input">
        <SearchIcon/>
        <input
            v-model="inputText"
            type="text"
            placeholder="Search projects..."
        />
        <Button @click="() => inputText = ''">
          <XIcon/>
        </Button>
      </div>
    </div>
    <Button @click="$router.push(`${collection.id}/settings`)">
      <SettingsIcon/>
      Settings
    </Button>
  </Card>
  <div class="project-list display-mode--list">
    <ProjectCard
        v-for="project in projects.filter(p => projectType === 'All' || p.project_type === projectType).filter(p => p.title.toLowerCase().includes(inputText.toLowerCase()))"
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
