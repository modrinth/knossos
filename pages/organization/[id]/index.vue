<script setup>
import {
  Card,
  SearchIcon,
  ChevronRightIcon,
  EditIcon,
  Button,
  XIcon,
  SaveIcon,
  DropdownSelect,
    SettingsIcon,
  formatCategory
} from 'omorphia'
import ProjectCard from '~/components/ui/ProjectCard.vue'
import Avatar from '~/components/ui/Avatar.vue'
import PopoutMenu from "~/components/ui/PopoutMenu.vue";
import FilterIcon from "assets/images/utils/filter.svg";
import Checkbox from "~/components/ui/Checkbox.vue";
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
})

const inputText = ref('')

const selectedFilters = ref([])
selectedFilters.value.push(
    ...props.projects.map((p) => p.project_type).filter((v, i, a) => a.indexOf(v) === i)
)

const filterOptions = computed(() => props.projects.map((p) => p.project_type).filter((v, i, a) => a.indexOf(v) === i))
</script>

<template>
  <div class="normal-page__sidebar">
    <Card class="creator-list">
      <div class="title-and-link">
        <h3>Creators</h3>
      </div>
      <div v-for="member in organization.members" :key="ignored" class="creator button-base" @click="$router.push(`/user/${member.user.username}`)">
        <Avatar :src="member.user.avatar_url" circle />
        <p class="name">{{member.user.username}}</p>
        <p class="role">{{member.role}}</p>
      </div>
    </Card>
  </div>
  <div class="normal-page__content">
    <div class="search-row">
      <div class="iconified-input">
        <label for="search-input" hidden>Search notifications</label>
        <SearchIcon />
        <input id="search-input" v-model="inputText" type="text" placeholder="Search projects..." />
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
      <Button @click="$router.push(`/organization/${organization.title}/settings`)">
        <SettingsIcon />
        Settings
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

.creator-list {
  display: flex;
  flex-direction: column;
  padding: var(--gap-xl);

  h3 {
    margin: 0 0 var(--gap-sm);
  }

  .creator {
    display: grid;
    gap: var(--gap-xs);
    background-color: var(--color-raised-bg);
    padding: var(--gap-sm);
    margin-left: -.5rem;
    border-radius: var(--radius-lg);
    grid-template:
      'avatar name' auto
      'avatar role' auto
      / auto 1fr;

    p {
      margin: 0;
    }

    .name {
      grid-area: name;
      align-self: flex-end;
      margin-left: var(--gap-xs);
      font-weight: bold;
    }

    .role {
      grid-area: role;
      align-self: flex-start;
      margin-left: var(--gap-xs);
    }

    .avatar {
      grid-area: avatar;
    }
  }
}


.search-row {
  margin-bottom: var(--gap-md);
  display: flex;

  .iconified-input {
    flex-grow: 1;

    input {
      height: 3rem;
      background-color: var(--color-raised-bg);
      border: 1px solid var(--color-button-bg);
    }
  }

  :deep(.btn) {
    height: 3rem;
    margin-left: var(--gap-sm);
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
