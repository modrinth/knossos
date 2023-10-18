<template>
  <div>
    <ModalCreation ref="modal_creation" :organization="`${organization.team_id}`"/>
    <h1>Projects</h1>
    <div class="input-group">
      <button class="iconified-button brand-button" @click="$refs.modal_creation.show()">
        <PlusIcon />
        Create a project
      </button>
    </div>
    <p v-if="projects.length < 1">
      You don't have any projects yet. Click the green button above to begin.
    </p>
    <template v-else>
      <p>You can edit multiple projects at once by selecting them below.</p>
      <div class="input-group">
        <button
            class="iconified-button"
            :disabled="selectedProjects.length === 0"
            @click="$refs.editLinksModal.show()"
        >
          <EditIcon />
          Edit links
        </button>
        <div class="push-right">
          <div class="labeled-control-row">
            Sort by
            <Multiselect
                v-model="sortBy"
                :searchable="false"
                class="small-select"
                :options="['Name', 'Status', 'Type']"
                :close-on-select="true"
                :show-labels="false"
                :allow-empty="false"
                @update:model-value="projects = updateSort(projects, sortBy, descending)"
            />
            <button
                v-tooltip="descending ? 'Descending' : 'Ascending'"
                class="square-button"
                @click="updateDescending()"
            >
              <DescendingIcon v-if="descending" />
              <AscendingIcon v-else />
            </button>
          </div>
        </div>
      </div>
      <div class="grid-table universal-card">
        <div class="grid-table__row grid-table__header">
          <div>
            <Checkbox
                :model-value="selectedProjects === projects"
                @update:model-value="
                selectedProjects === projects
                  ? (selectedProjects = [])
                  : (selectedProjects = projects)
              "
            />
          </div>
          <div>Icon</div>
          <div>Name</div>
          <div>ID</div>
          <div>Type</div>
          <div>Status</div>
          <div />
        </div>
        <div v-for="project in projects" :key="`project-${project.id}`" class="grid-table__row">
          <div>
            <Checkbox
                :disabled="(project.permissions & EDIT_DETAILS) === EDIT_DETAILS"
                :model-value="selectedProjects.includes(project)"
                @update:model-value="
                selectedProjects.includes(project)
                  ? (selectedProjects = selectedProjects.filter((it) => it !== project))
                  : selectedProjects.push(project)
              "
            />
          </div>
          <div>
            <nuxt-link
                tabindex="-1"
                :to="`/${$getProjectTypeForUrl(project.project_type, project.loaders)}/${
                project.slug ? project.slug : project.id
              }`"
            >
              <Avatar
                  :src="project.icon_url"
                  aria-hidden="true"
                  :alt="'Icon for ' + project.title"
                  no-shadow
              />
            </nuxt-link>
          </div>

          <div>
            <span class="project-title">
              <IssuesIcon
                  v-if="project.moderator_message"
                  aria-label="Project has a message from the moderators. View the project to see more."
              />

              <nuxt-link
                  class="hover-link wrap-as-needed"
                  :to="`/${$getProjectTypeForUrl(project.project_type, project.loaders)}/${
                  project.slug ? project.slug : project.id
                }`"
              >
                {{ project.title }}
              </nuxt-link>
            </span>
          </div>

          <div>
            <CopyCode :text="project.id" />
          </div>

          <div>
            {{ $formatProjectType($getProjectTypeForUrl(project.project_type, project.loaders)) }}
          </div>

          <div>
            <Badge v-if="project.status" :type="project.status" class="status" />
          </div>

          <div>
            <nuxt-link
                class="square-button"
                :to="`/${$getProjectTypeForUrl(project.project_type, project.loaders)}/${
                project.slug ? project.slug : project.id
              }/settings`"
            >
              <SettingsIcon />
            </nuxt-link>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { Multiselect } from 'vue-multiselect'
import { Badge, Checkbox, Modal, Avatar, CopyCode, SettingsIcon, TrashIcon, IssuesIcon, PlusIcon, XIcon, EditIcon, SaveIcon} from 'omorphia'

import ModalCreation from '~/components/ui/ModalCreation.vue'

defineProps({
  organization: {
    type: Object,
    default() {
      return {}
    },
  },
})

const auth = await useAuth()
await initUserProjects()

const UPLOAD_VERSION = shallowRef(1 << 0)
const DELETE_VERSION = shallowRef(1 << 1)
const EDIT_DETAILS = shallowRef(1 << 2)
const EDIT_BODY = shallowRef(1 << 3)
const MANAGE_INVITES = shallowRef(1 << 4)
const REMOVE_MEMBER = shallowRef(1 << 5)
const EDIT_MEMBER = shallowRef(1 << 6)
const DELETE_PROJECT = shallowRef(1 << 7)

const updateSort = (projects, sort, descending) => {
  let sortedArray = projects
  switch (sort) {
    case 'Name':
      sortedArray = projects.slice().sort((a, b) => {
        return a.title.localeCompare(b.title)
      })
      break
    case 'Status':
      sortedArray = projects.slice().sort((a, b) => {
        if (a.status < b.status) {
          return -1
        }
        if (a.status > b.status) {
          return 1
        }
        return 0
      })
      break
    case 'Type':
      sortedArray = projects.slice().sort((a, b) => {
        if (a.project_type < b.project_type) {
          return -1
        }
        if (a.project_type > b.project_type) {
          return 1
        }
        return 0
      })
      break
    default:
      break
  }

  if (descending) {
    sortedArray = sortedArray.reverse()
  }

  return sortedArray
}

const projects = shallowRef(
    await useAsyncData(`user/${auth.value.user.id}/collections`, () =>
        useBaseFetch(`user/${auth.value.user.id}/collections`)
    ).then((res) => res.data)
)
const versions = ref([])
const selectedProjects = ref([])
const sortBy = ref('Name')
const descending = ref(false)

const updateDescending = () => {
  descending.value = !descending.value
  projects.value = updateSort(projects.value, sortBy.value, descending.value)
}
</script>
<style lang="scss" scoped>
.grid-table {
  display: grid;
  grid-template-columns:
    min-content min-content minmax(min-content, 2fr)
    minmax(min-content, 1fr) minmax(min-content, 1fr) minmax(min-content, 1fr) min-content;
  border-radius: var(--size-rounded-sm);
  overflow: hidden;
  margin-top: var(--spacing-card-md);

  .grid-table__row {
    display: contents;

    > div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: var(--spacing-card-sm);

      // Left edge of table
      &:first-child {
        padding-left: var(--spacing-card-bg);
      }

      // Right edge of table
      &:last-child {
        padding-right: var(--spacing-card-bg);
      }
    }

    &:nth-child(2n + 1) > div {
      background-color: var(--color-table-alternate-row);
    }

    &.grid-table__header > div {
      background-color: var(--color-bg);
      font-weight: bold;
      color: var(--color-text-dark);
      padding-top: var(--spacing-card-bg);
      padding-bottom: var(--spacing-card-bg);
    }
  }

  @media screen and (max-width: 750px) {
    display: flex;
    flex-direction: column;

    .grid-table__row {
      display: grid;
      grid-template: 'checkbox icon name type settings' 'checkbox icon id status settings';
      grid-template-columns:
        min-content min-content minmax(min-content, 2fr)
        minmax(min-content, 1fr) min-content;

      :nth-child(1) {
        grid-area: checkbox;
      }

      :nth-child(2) {
        grid-area: icon;
      }

      :nth-child(3) {
        grid-area: name;
      }

      :nth-child(4) {
        grid-area: id;
        padding-top: 0;
      }

      :nth-child(5) {
        grid-area: type;
      }

      :nth-child(6) {
        grid-area: status;
        padding-top: 0;
      }

      :nth-child(7) {
        grid-area: settings;
      }
    }

    .grid-table__header {
      grid-template: 'checkbox settings';
      grid-template-columns: min-content minmax(min-content, 1fr);

      :nth-child(2),
      :nth-child(3),
      :nth-child(4),
      :nth-child(5),
      :nth-child(6) {
        display: none;
      }
    }
  }

  @media screen and (max-width: 560px) {
    .grid-table__row {
      display: grid;
      grid-template: 'checkbox icon name settings' 'checkbox icon id settings' 'checkbox icon type settings' 'checkbox icon status settings';
      grid-template-columns: min-content min-content minmax(min-content, 1fr) min-content;

      :nth-child(5) {
        padding-top: 0;
      }
    }

    .grid-table__header {
      grid-template: 'checkbox settings';
      grid-template-columns: min-content minmax(min-content, 1fr);
    }
  }
}

.project-title {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-card-xs);

  svg {
    color: var(--color-special-orange);
  }
}

.status {
  margin-top: var(--spacing-card-xs);
}

.hover-link:hover {
  text-decoration: underline;
}

.labeled-control-row {
  flex: 1;
  display: flex;
  flex-direction: row;
  min-width: 0;
  align-items: center;
  gap: var(--spacing-card-md);
  white-space: nowrap;
}

.small-select {
  width: fit-content;
  width: -moz-fit-content;
}

.label-button[data-active='true'] {
  --background-color: var(--color-special-red);
  --text-color: var(--color-brand-inverted);
}

.links-modal {
  .links {
    display: grid;
    gap: var(--spacing-card-sm);
    grid-template-columns: 1fr 2fr;

    .input-group {
      flex-wrap: nowrap;
    }

    @media screen and (max-width: 530px) {
      grid-template-columns: 1fr;
      .input-group {
        flex-wrap: wrap;
      }
    }
  }

  ul {
    margin: 0 0 var(--spacing-card-sm) 0;
  }
}

h1 {
  margin-block: var(--gap-sm) var(--gap-lg);
  font-size: 2em;
  line-height: 1em;
}

.universal-card {
  padding: 0;
}
</style>
