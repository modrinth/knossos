<template>
  <div>
    <CollectionCreateModal ref="modal_creation" />
    <h2>Collections</h2>
    <div class="search-row">
      <div class="iconified-input">
        <label for="search-input" hidden>Search your collections</label>
        <SearchIcon />
        <input id="search-input" v-model="filterQuery" type="text" />
        <Button v-if="filterQuery" class="r-btn" @click="() => (filterQuery = '')">
          <XIcon />
        </Button>
      </div>
      <Button color="primary" @click="$refs.modal_creation.show()">
        <PlusIcon /> Create new
      </Button>
    </div>
    <div class="collections-grid">
      <nuxt-link
        v-for="collection in orderedCollections"
        :to="`/collection/${collection.id}`"
        class="card collection"
      >
        <Avatar :src="collection.icon_url" class="icon" />
        <div class="details">
          <span class="title">{{ collection.name }}</span>
          <span class="description">
            {{ collection.description }}
          </span>
          <span class="stats"><BoxIcon /> {{ collection.projects?.length || 0 }} projects</span>
        </div>
      </nuxt-link>
      <nuxt-link
        v-if="'followed projects'.includes(filterQuery)"
        :to="`/collection/following`"
        class="card collection"
      >
        <Avatar src="https://cdn.modrinth.com/follow-collection.png" class="icon" />
        <div class="details">
          <span class="title">Followed projects</span>
          <span class="description">
            Auto-generated collection of all the projects you're following.
          </span>
          <span class="stats"><BoxIcon /> {{ user.follows.length }} projects</span>
        </div>
      </nuxt-link>
      <div v-else>
        <p>No collections matching '{{ filterQuery }}'</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Avatar, BoxIcon, SearchIcon, XIcon, Button, PlusIcon } from 'omorphia'
import CollectionCreateModal from '~/components/ui/CollectionCreateModal.vue'

definePageMeta({
  middleware: 'auth',
})

useHead({
  title: 'Your collections - Modrinth',
})

const user = await useUser()
const auth = await useAuth()
if (process.client) {
  await initUserFollows()
}

const { data: collections } = await useAsyncData(`user/${auth.value.user.id}/collections`, () =>
  useBaseFetch(`user/${auth.value.user.id}/collections`, { apiVersion: 3 })
)

const orderedCollections = computed(() => {
  if (!collections.value) return []
  return collections.value.sort((a, b) => {
    const aUpdated = new Date(a.updated)
    const bUpdated = new Date(b.updated)
    return bUpdated - aUpdated
  })
})

const filterQuery = ref('')
</script>
<style lang="scss">
.collections-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--gap-lg);

  .collection {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--gap-md);

    .icon {
      width: 100% !important;
      height: 6rem !important;
      max-width: unset !important;
      max-height: unset !important;
      aspect-ratio: 1 / 1;
      object-fit: cover;
    }

    .details {
      display: flex;
      flex-direction: column;
      gap: var(--gap-sm);

      .title {
        color: var(--color-contrast);
        font-weight: 600;
        font-size: var(--font-size-md);
      }

      .description {
        color: var(--color-secondary);
        font-size: var(--font-size-sm);
      }

      .stats {
        display: flex;
        align-items: center;
        gap: var(--gap-xs);
        margin-top: auto;

        svg {
          color: var(--color-secondary);
        }
      }
    }
  }
}
</style>
