<script setup>
import { Card, SearchIcon, Button, XIcon, Avatar, Promotion, ProjectCard } from 'omorphia'
const cosmetics = useCosmetics()
const tags = useTags()
const auth = await useAuth()
const user = await useUser()

const props = defineProps({
  organization: {
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
  typeFilter: {
    type: String,
    default: '',
  },
})

const inputText = ref('')

const selectedFilters = ref([])
selectedFilters.value.push(
  ...props.projects.map((p) => p.project_type).filter((v, i, a) => a.indexOf(v) === i)
)

</script>

<template>
  <div class="normal-page__content">
      <Promotion />
      <div class="search-row">
        <div class="iconified-input">
          <SearchIcon />
          <input
            id="search-input"
            v-model="inputText"
            type="text"
            placeholder="Search projects..."
          />
          <Button class="r-btn" :class="inputText ? '' : 'empty'" @click="() => (inputText = '')">
            <XIcon />
          </Button>
        </div>
      </div>
      <div class="project-list display-mode--list">
        <ProjectCard
          v-for="project in projects
            .filter((p) => typeFilter === p.project_type || typeFilter === 'all')
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
</template>

<style scoped lang="scss">
.title-and-link {
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
  }

  a {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    color: var(--color-blue);
  }
}

.project-overview {
  gap: var(--gap-md);
  padding: var(--gap-xl);

  .project-card {
    padding: 0;
    border-radius: 0;
    background-color: transparent;
    box-shadow: none;

    :deep(.title) {
      font-size: var(--font-size-nm) !important;
    }
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
