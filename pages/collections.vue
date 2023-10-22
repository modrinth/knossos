<template>
  <div>
    <SimpleCreationModal ref="modal_creation" type="collection" />
    <h1>Collections</h1>
    <p v-if="collections.length < 1">
      You don't have any projects yet. Click the green button above to begin.
    </p>
    <template v-else>
      <div class="input-group">
        <button class="iconified-button brand-button" @click="$refs.modal_creation.show()">
          <PlusIcon />
          Create a collection
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
              @update:model-value="collections = updateSort(collections, sortBy, descending)"
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
          <div>Icon</div>
          <div>Name</div>
          <div>Projects</div>
          <div />
        </div>
        <div
          v-for="collection in collections"
          :key="`collection-${collection.id}`"
          class="grid-table__row"
        >
          <div>
            <nuxt-link tabindex="-1" :to="`/collection/${collection.id}`">
              <Avatar
                :src="collection.icon_url"
                aria-hidden="true"
                :alt="'Icon for ' + collection.title"
                no-shadow
              />
            </nuxt-link>
          </div>

          <div>
            <span class="project-title">
              <IssuesIcon
                v-if="collection.moderator_message"
                aria-label="Project has a message from the moderators. View the project to see more."
              />

              <nuxt-link class="hover-link wrap-as-needed" :to="`/collection/${collection.id}`">
                {{ collection.title }}
              </nuxt-link>
            </span>
          </div>

          <div class="projects">
            <Avatar
              v-if="collection.projects"
              v-for="project in collection.projects.slice(0, 6)"
              :key="project?.id"
              v-tooltip="project.title"
              :src="project?.icon_url"
            />
            <div v-if="collection.projects && collection.projects.length > 10" class="avatar overflow">
              +{{ collection.projects.length - 6 }}
            </div>
          </div>

          <div>
            <nuxt-link class="square-button" :to="`/collection/${collection.id}`">
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
import {
  Badge,
  Checkbox,
  Modal,
  Avatar,
  CopyCode,
  SettingsIcon,
  TrashIcon,
  IssuesIcon,
  PlusIcon,
  XIcon,
  EditIcon,
  SaveIcon,
} from 'omorphia'
import AscendingIcon from '~/assets/images/utils/sort-asc.svg'
import DescendingIcon from '~/assets/images/utils/sort-desc.svg'

import ModalCreation from '~/components/ui/ModalCreation.vue'
import SimpleCreationModal from "~/components/ui/SimpleCreationModal.vue";

const auth = await useAuth()

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

const collections = shallowRef(
  await useAsyncData(`user/${auth.value.user.id}/collections`, () =>
    useBaseFetch(`user/${auth.value.user.id}/collections`)
  ).then((res) => res.data)
)

const projects = new Map()

for (const collection of collections.value) {
  if (collection.projects.length > 0) {
    const { data: projectsData } = await useAsyncData(
      `projects?ids=${JSON.stringify(collection.projects)}`,
      () => useBaseFetch(`projects?ids=${JSON.stringify(collection.projects)}`)
    )

    console.log(projectsData)

    collection.projects = projectsData
  }
}

const versions = ref([])
const selectedProjects = ref([])
const sortBy = ref('Name')
const descending = ref(false)

const updateDescending = () => {
  descending.value = !descending.value
  collections.value = updateSort(collections.value, sortBy.value, descending.value)
}
</script>
<style lang="scss" scoped>
.grid-table {
  display: grid;
  grid-template-columns:
    min-content minmax(min-content, 2fr)
    minmax(min-content, 2fr) min-content;
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
      grid-template: 'icon name settings';
      grid-template-columns: min-content 1fr min-content;

      :nth-child(1) {
        grid-area: icon;
      }

      :nth-child(2) {
        grid-area: name;
      }

      :nth-child(3) {
        grid-area: id;
        display: none;
      }

      :nth-child(4) {
        grid-area: settings;
      }
    }
  }

  @media screen and (max-width: 560px) {
    .grid-table__row {
      display: grid;
      grid-template: 'icon name settings';
      grid-template-columns: min-content 1fr min-content;

      :nth-child(5) {
        padding-top: 0;
      }

      :nth-child(3) {
        display: none;
      }
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

.projects {
  display: flex;
  flex-direction: row !important;
  align-items: center;
  justify-content: flex-start !important;

  .avatar {
    background-color: var(--color-bg);
    border: 1px solid var(--color-button-bg);
  }

  .avatar:not(:first-child) {
    margin-left: -0.5rem;
  }

  .overflow {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    border-radius: var(--radius-sm);
    width: 3rem;
    height: 3rem;
  }
}
</style>
