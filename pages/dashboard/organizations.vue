<template>
  <div>
    <OrganizationCreateModal ref="createOrgModal" />
    <section class="universal-card">
      <div class="header__row">
        <h2 class="header__title">Organizations</h2>
        <div class="input-group">
          <button class="iconified-button brand-button" @click="openCreateOrgModal">
            <PlusIcon />
            Create organization
          </button>
        </div>
      </div>
      <template v-if="orgs?.length > 0">
        <div class="grid-table">
          <div class="grid-table__row grid-table__header">
            <div>
              <Checkbox :model-value="undefined" @update:model-value="undefined" />
            </div>
            <div>Icon</div>
            <div>Name</div>
            <div>ID</div>
            <div>Members</div>
            <div />
          </div>
          <div v-for="org in orgs" :key="org.id" class="grid-table__row">
            <div>
              <Checkbox
                :disabled="false"
                :model-value="undefined"
                @update:model-value="undefined"
              />
            </div>
            <div>
              <nuxt-link tabindex="-1" :to="`/organization/${org.slug}`">
                <Avatar :src="org.icon_url" aria-hidden="true" :alt="org.name" no-shadow />
              </nuxt-link>
            </div>

            <div>
              <span class="project-title">
                <nuxt-link class="hover-link wrap-as-needed" :to="`/organization/${org.slug}`">
                  {{ org.name }}
                </nuxt-link>
              </span>
            </div>

            <div>
              <CopyCode :text="org.id" />
            </div>

            <div>{{ org.members?.length || 0 }}</div>

            <div>
              <nuxt-link class="square-button" :to="`/organization/${org.slug}/settings`">
                <SettingsIcon />
              </nuxt-link>
            </div>
          </div>
        </div>
      </template>
      <template v-else> Make an organization! </template>
    </section>
  </div>
</template>

<script setup>
import { PlusIcon, SettingsIcon, Checkbox, CopyCode, Avatar } from 'omorphia'

import { useAuth } from '~/composables/auth.js'
import OrganizationCreateModal from '~/components/ui/OrganizationCreateModal.vue'

const createOrgModal = ref(null)

const auth = await useAuth()
// @ts-expect-error
const uid = computed(() => auth.value.user?.id || null)

const { data: orgs, error } = useAsyncData('organizations', () => {
  if (!uid.value) return Promise.resolve(null)

  return useBaseFetch('user/' + uid.value + '/organizations', {
    apiVersion: 3,
  })
})

if (error.value) {
  createError({
    statusCode: 500,
    message: 'Failed to fetch organizations',
  })
}

const openCreateOrgModal = () => {
  createOrgModal.value?.show()
}
</script>

<style scoped lang="scss">
.project-meta-item {
  display: flex;
  flex-direction: column;
  justify-content: start;
  padding: var(--spacing-card-sm);

  .project-title {
    margin-bottom: var(--spacing-card-sm);
  }
}

.grid-table {
  display: grid;
  grid-template-columns:
    min-content min-content minmax(min-content, 2fr)
    minmax(min-content, 1fr) minmax(min-content, 1fr) min-content;
  border-radius: var(--size-rounded-sm);
  overflow: hidden;
  margin-top: var(--spacing-card-md);

  .grid-table__row {
    display: contents;

    > div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
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
}

.hover-link:hover {
  text-decoration: underline;
}
</style>
