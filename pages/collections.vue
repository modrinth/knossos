<template>
  <div class="normal-page no-sidebar">
    <div class="normal-page__header">
      <SimpleCreationModal ref="modal_creation" type="collection" />
      <h1>Collections</h1>
      <div class="input-group">
        <Button color="primary" @click="$refs.modal_creation.show()">
          <PlusIcon />
          Create a collection
        </Button>
      </div>
      <p v-if="collections.length < 1">
        You don't have any projects yet. Click the green button above to begin.
      </p>
    </div>
    <div class="normal-page__content collections">
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
  </div>
</template>

<script setup>
import { Badge, Avatar, PlusIcon, BoxIcon, Card, Button } from 'omorphia'

import SimpleCreationModal from '~/components/ui/SimpleCreationModal.vue'

const auth = await useAuth()

const collections = shallowRef(
  await useAsyncData(`user/${auth.value.user.id}/collections`, () =>
    useBaseFetch(`user/${auth.value.user.id}/collections`)
  ).then((res) => res.data)
)
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
  gap: var(--gap-sm);
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
  margin-top: var(--gap-md);
}

.collection-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: var(--gap-lg);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  margin-bottom: 0;
  width: 100%;

  .avatar {
    --size: 6rem !important;
    min-width: 6rem;
    min-height: 6rem;
  }

  .label__description {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .label__title {
    margin: 0 0 var(--gap-xs);
  }

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
