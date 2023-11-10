<template>
  <div class="universal-card">
    <ConfirmModal
      ref="modal_confirm"
      title="Are you sure you want to revoke this application?"
      description="This will revoke the application's access to your account. You can always re-authorize it later."
      proceed-label="Revoke"
      @proceed="revokeApp(revokingId)"
    />
    <div class="header__row">
      <div class="header__title">
        <h2>Authorizations</h2>
      </div>
    </div>
    <p>
      When you authorize an application with your Modrinth account, you grant it access to your
      account. You can manage and review access to your account here at any time.
    </p>
    <div v-if="appInfoLookup.length === 0" class="universal-card recessed">
      You have not authorized any applications.
    </div>
    <div
      v-for="authorization in appInfoLookup"
      :key="authorization.id"
      class="universal-card recessed token"
    >
      <div>
        <div>
          <div class="icon-name">
            <div class="icon">
              <img :src="authorization.app.icon_url" :alt="authorization.app.name + ' icon'" />
            </div>
            <div>
              <strong>{{ authorization.app.name }}</strong>
            </div>
          </div>
        </div>
        <div>
          <div>
            <strong>Scopes:</strong>
          </div>
          <div class="scope-list">
            <div
              v-for="scope in decodeScopes(authorization.scopes)"
              :key="scope"
              class="scope-list-item"
            >
              <div class="scope-list-item-icon">
                <CheckIcon />
              </div>
              {{ constCaseToTitleCase(scope) }}
            </div>
          </div>
        </div>
      </div>

      <div class="input-group">
        <Button
          color="danger"
          icon-only
          @click="
            () => {
              revokingId = authorization.app_id
              $refs.modal_confirm.show()
            }
          "
        >
          <TrashIcon />
          Revoke
        </Button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Button, TrashIcon, CheckIcon, ConfirmModal } from 'omorphia'
import { decodeScopes } from '~/utils/auth/scopes.ts'

const revokingId = ref(null)

definePageMeta({
  middleware: 'auth',
})

useHead({
  title: 'Authorizations - Modrinth',
})

const { data: usersApps, refresh } = await useAsyncData('userAuthorizations', () =>
  useBaseFetch(`oauth/authorizations`, {
    apiVersion: 3,
  })
)

const { data: appInformation } = await useAsyncData(
  'appInfo',
  () =>
    useBaseFetch('oauth/apps', {
      apiVersion: 3,
      query: {
        ids: usersApps.value.map((c) => c.app_id).join(','),
      },
    }),
  {
    watch: usersApps,
  }
)

const appInfoLookup = computed(() => {
  return usersApps.value.map((app) => {
    const info = appInformation.value.find((c) => c.id === app.app_id)
    return {
      ...app,
      app: info || null,
    }
  })
})

async function revokeApp(id) {
  try {
    await useBaseFetch(`oauth/authorizations`, {
      apiVersion: 3,
      method: 'DELETE',
      query: {
        client_id: id,
      },
    })
    revokingId.value = null
    await refresh()
  } catch (err) {
    data.$notify({
      group: 'main',
      title: 'An error occurred',
      text: err.data ? err.data.description : err,
      type: 'error',
    })
  }
}

const constCaseToTitleCase = (str) =>
  str
    .split('_')
    .map((x) => x[0].toUpperCase() + x.slice(1).toLowerCase())
    .join(' ')
</script>
<style lang="scss" scoped>
.scope-list {
  display: flex;
  flex-direction: column;
  gap: var(--gap-sm);
  padding-block: var(--gap-sm);

  .scope-list-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-radius: 0.25rem;
    background-color: var(--color-gray-200);
    color: var(--color-gray-700);
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25rem;
  }

  .scope-list-item-icon {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-green);
    color: #fff;
  }
}

.icon-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: var(--gap-sm);

  .icon {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-gray-200);
    border: 1px solid var(--color-gray-300);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center; /* Optional, for adjusting image alignment */
    }
  }
}
.submit-row {
  padding-top: var(--gap-lg);
}
.uri-input-list {
  display: grid;
  row-gap: 0.5rem;
}
.url-input-group-fixes {
  width: 100%;

  input {
    width: 100% !important;
    flex-basis: 24rem !important;
  }
}
.checkboxes {
  display: grid;
  column-gap: 0.5rem;

  @media screen and (min-width: 432px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (min-width: 800px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.token {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .input-group {
    // Align to the right on mobile
    margin-left: auto;
  }

  @media screen and (min-width: 800px) {
    flex-direction: row;
    align-items: start;
  }
}
</style>
