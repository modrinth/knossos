<template>
  <div>
    <SimpleCreationModal ref="modal_creation" type="collection" />
    <h1>Collections</h1>
    <button v-if="collections.length < 1" class="iconified-button brand-button" @click="$refs.modal_creation.show()">
      <PlusIcon />
      Create a collection
    </button>
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
      <div class="collections">
        <Card
          v-for="collection in collections"
          :key="`collection-${collection.id}`"
          class="collection-card button-base"
          @click="$router.push(`/collection/${collection.id}`)"
        >
          <Avatar
            :src="collection.icon_url"
            aria-hidden="true"
            :alt="'Icon for ' + collection.title"
            size="lg"
            no-shadow
          />
          <div class="text">
            <label>
              <span class="label__title">
                {{ collection.title }}
              </span>
              <span class="label__description">
                {{ collection.description }}
              </span>
            </label>
            <div class="stats">
              <span>
                <BoxIcon />
                {{ collection.projects.length > 0 ? collection.projects.length : 'No' }} projects
              </span>
              <Badge :type="collection.status" />
            </div>
          </div>
        </Card>
      </div>
    </template>
  </div>
</template>

<script setup>
import { Multiselect } from 'vue-multiselect'
import {
  Badge,
  Avatar,
  PlusIcon,
  BoxIcon,
  Card
} from 'omorphia'
import AscendingIcon from '~/assets/images/utils/sort-asc.svg'
import DescendingIcon from '~/assets/images/utils/sort-desc.svg'

import ModalCreation from '~/components/ui/ModalCreation.vue'
import SimpleCreationModal from "~/components/ui/SimpleCreationModal.vue";

const auth = await useAuth()

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

.collections {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  gap: var(--gap-md);
  margin-top: var(--spacing-card-md);
}

.collection-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: var(--gap-md);
  gap: var(--gap-md);
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  .stats {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: var(--gap-md);
    line-height: 1.2em;

    span {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: var(--gap-xs);
    }
  }
}
</style>
