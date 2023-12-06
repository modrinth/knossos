<template>
  <div class="card">
    <CollectionCreateModal ref="modal_creation" />
    <h2>Collections</h2>
    <div class="input-group">
      <Button color="primary" @click="$refs.modal_creation.show()">
        <PlusIcon />
        Create a collection
      </Button>
    </div>
    <p v-if="collections.length < 1">
      You don't have any projects yet. Click the green button above to begin.
    </p>
    <div class="collections">
      <Card
        v-for="collection in collections"
        :key="`collection-${collection.id}`"
        class="collection-card recessed button-base"
        @click="$router.push(`/collection/${collection.id}`)"
      >
        <Avatar
          :src="collection.icon_url"
          aria-hidden="true"
          :alt="'Icon for ' + collection.name"
          size="lg"
          no-shadow
        />
        <div class="text">
          <label>
            <span class="label__title">
              {{ collection.name }}
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
import CollectionCreateModal from '~/components/ui/CollectionCreateModal.vue'

const auth = await useAuth()

const { data: collections } = await useAsyncData(`user/${auth.value.user.id}/collections`, () =>
  useBaseFetch(`user/${auth.value.user.id}/collections`, { apiVersion: 3 })
)
</script>
<style lang="scss" scoped>
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
  padding: var(--gap-md);
  gap: var(--gap-md);
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
