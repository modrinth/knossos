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
              <nuxt-link tabindex="-1" :to="`/organization/${org.id}`">
                <Avatar
                  :src="org.icon_url"
                  aria-hidden="true"
                  :alt="'Icon for ' + org.name"
                  no-shadow
                />
              </nuxt-link>
            </div>

            <div>
              <h3 class="project-title">
                <nuxt-link class="hover-link wrap-as-needed" :to="`/organization/${org.id}`">
                  {{ org.name }}
                </nuxt-link>
              </h3>
              <div>
                {{ org.description }}
              </div>
            </div>

            <div>
              <CopyCode :text="org.id" />
            </div>

            <div>{{ org.members?.length || 0 }}</div>

            <div>
              <nuxt-link class="square-button" :to="`/organization/${org.id}/settings`">
                <SettingsIcon />
              </nuxt-link>
            </div>
          </div>
        </div>
      </template>
      <template v-else> Make an organization! </template>
    </section>
    <div>
      <pre><code>{{ orgs }}</code></pre>
      <pre><code>{{ error }}</code></pre>
    </div>
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

const openCreateOrgModal = () => {
  createOrgModal.value?.show()
}
</script>

<style scoped lang="scss">
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
        grid-area: settings;
      }
    }

    .grid-table__header {
      grid-template: 'checkbox settings';
      grid-template-columns: min-content minmax(min-content, 1fr);

      :nth-child(2),
      :nth-child(3),
      :nth-child(4) {
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
</style>
