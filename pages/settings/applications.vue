<template>
  <div class="universal-card">
    <ConfirmModal
      ref="modal_confirm"
      title="Are you sure you want to delete this application?"
      description="This will permanently delete this application and revoke all access tokens. (forever!)"
      proceed-label="Delete this application"
      @proceed="removeApp(editingId)"
    />
    <Modal ref="appModal" :header="`${editPatIndex !== null ? 'Edit' : 'Create'} application`">
      <div class="universal-modal">
        <label for="app-name"><span class="label__title">Name</span> </label>
        <input
          id="app-name"
          v-model="name"
          maxlength="2048"
          type="text"
          autocomplete="off"
          placeholder="Enter the Application's name..."
        />
        <label for="app-icon"><span class="label__title">Icon</span> </label>
        <input
          id="app-icon"
          v-model="icon"
          maxlength="2048"
          type="url"
          autocomplete="off"
          placeholder="https://example.com/icon.png"
        />
        <label for="app-scopes"><span class="label__title">Scopes</span> </label>
        <div id="app-scopes" class="checkboxes">
          <Checkbox
            v-for="scope in scopeList"
            :key="scope"
            :label="constCaseToTitleCase(scope)"
            :model-value="hasScope(scopesVal, scope)"
            @update:model-value="() => (scopesVal = toggleScope(scopesVal, scope))"
          />
        </div>
        <label for="app-redirect-uris"><span class="label__title">Redirect Uris</span> </label>
        <div class="uri-input-list">
          <div v-for="(_, index) in redirectUris" :key="index">
            <div class="input-group url-input-group-fixes">
              <input
                v-model="redirectUris[index]"
                maxlength="2048"
                type="url"
                autocomplete="off"
                placeholder="https://example.com/auth/callback"
              />
              <Button icon-only @click="() => redirectUris.splice(index, 1)">
                <TrashIcon />
              </Button>
            </div>
          </div>
          <div class="input-group url-input-group-fixes">
            <input
              v-model="newRedirectUri"
              maxlength="2048"
              type="url"
              autocomplete="off"
              placeholder="https://example.com/redirect"
            />
            <button
              :disabled="!newRedirectUri"
              type="button"
              class="iconified-button brand-button"
              @click="
                () => {
                  redirectUris.push(newRedirectUri)
                  newRedirectUri = null
                }
              "
            >
              <PlusIcon />
              Add
            </button>
          </div>
        </div>

        <div class="submit-row input-group push-right">
          <button class="iconified-button" @click="$refs.appModal.hide()">
            <XIcon />
            Cancel
          </button>
          <button
            v-if="editPatIndex !== null"
            :disabled="!canSubmit"
            type="button"
            class="iconified-button brand-button"
            @click="editApp"
          >
            <SaveIcon />
            Save changes
          </button>
          <button
            v-else
            :disabled="!canSubmit"
            type="button"
            class="iconified-button brand-button"
            @click="createApp"
          >
            <PlusIcon />
            Create App
          </button>
        </div>
      </div>
    </Modal>

    <div class="header__row">
      <div class="header__title">
        <h2>Applications</h2>
      </div>
      <button
        class="btn btn-primary"
        @click="
          () => {
            name = null
            scopesVal = 0
            expires = null
            editPatIndex = null
            $refs.appModal.show()
          }
        "
      >
        <PlusIcon /> New Application
      </button>
    </div>
    <p>
      Applications can be used to authenticate Modrinth's users with your products. For more
      information, see
      <a class="text-link" href="https://docs.modrinth.com">Modrinth's API documentation</a>.
    </p>
    <div v-for="(app, index) in usersApps" :key="app.id" class="universal-card recessed token">
      <div>
        <div>
          <strong>{{ app.name }}</strong>
        </div>
        <div>
          <CopyCode :text="app.id" />
        </div>
      </div>
      <div class="input-group">
        <Button
          icon-only
          @click="
            () => {
              editPatIndex = index
              setForm({
                ...app,
                redirect_uris: app.redirect_uris.map((u) => u.uri) || [],
              })
              $refs.appModal.show()
            }
          "
        >
          <EditIcon />
          Edit
        </Button>
        <Button
          color="danger"
          icon-only
          @click="
            () => {
              editingId = app.id
              $refs.modal_confirm.show()
            }
          "
        >
          <TrashIcon />
          Delete
        </Button>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  PlusIcon,
  Modal,
  XIcon,
  Button,
  Checkbox,
  TrashIcon,
  EditIcon,
  SaveIcon,
  CopyCode,
  ConfirmModal,
} from 'omorphia'
import { scopeList, hasScope, toggleScope } from '~/utils/auth/scopes.ts'

definePageMeta({
  middleware: 'auth',
})

useHead({
  title: 'Applications - Modrinth',
})

const data = useNuxtApp()
const appModal = ref()

const editPatIndex = ref(null)

const editingId = ref(null)
const name = ref(null)
const icon = ref(null)
const scopesVal = ref(BigInt(0))
const redirectUris = ref([])
const newRedirectUri = ref(null)

const loading = ref(false)

const auth = await useAuth()

const { data: usersApps, refresh } = await useAsyncData(
  'usersApps',
  () =>
    useBaseFetch(`user/${auth.value.user.id}/oauth_apps`, {
      apiVersion: 3,
    }),
  {
    watch: [auth],
  }
)

const setForm = (app) => {
  if (app?.id) {
    editingId.value = app.id
  } else {
    editingId.value = null
  }
  name.value = app?.name || ''
  icon.value = app?.icon_url || ''
  scopesVal.value = app?.max_scopes || BigInt(0)
  redirectUris.value = app?.redirect_uris || []
}

const canSubmit = computed(() => {
  // Make sure name, scopes, and return uri are at least filled in
  return name.value !== '' && redirectUris.value.length > 0
})

async function createApp() {
  startLoading()
  loading.value = true
  try {
    await useBaseFetch('oauth/app', {
      method: 'POST',
      apiVersion: 3,
      body: {
        name: name.value,
        icon_url: icon.value,
        max_scopes: Number(scopesVal.value), // JS is 52 bit for ints so we're good for now
        redirect_uris: redirectUris.value,
      },
    })

    await refresh()
    setForm(null)

    appModal.value.hide()
  } catch (err) {
    data.$notify({
      group: 'main',
      title: 'An error occurred',
      text: err.data ? err.data.description : err,
      type: 'error',
    })
  }
  loading.value = false
  stopLoading()
}

async function editApp() {
  startLoading()
  loading.value = true
  try {
    if (!editingId.value) {
      throw new Error('No editing id')
    }

    await useBaseFetch('oauth/app/' + editingId.value, {
      method: 'PATCH',
      apiVersion: 3,
      body: {
        name: name.value,
        icon_url: icon.value,
        max_scopes: Number(scopesVal.value), // JS is 52 bit for ints so we're good for now
        redirect_uris: redirectUris.value,
      },
    })

    await refresh()
    setForm(null)
    editingId.value = null

    appModal.value.hide()
  } catch (err) {
    data.$notify({
      group: 'main',
      title: 'An error occurred',
      text: err.data ? err.data.description : err,
      type: 'error',
    })
  }
  loading.value = false
  stopLoading()
}

async function removeApp() {
  startLoading()
  try {
    if (!editingId.value) {
      throw new Error('No editing id')
    }
    await useBaseFetch(`oauth/app/${editingId.value}`, {
      apiVersion: 3,
      method: 'DELETE',
    })
    await refresh()
    editingId.value = null
  } catch (err) {
    data.$notify({
      group: 'main',
      title: 'An error occurred',
      text: err.data ? err.data.description : err,
      type: 'error',
    })
  }
  stopLoading()
}

const constCaseToTitleCase = (str) =>
  str
    .split('_')
    .map((x) => x[0].toUpperCase() + x.slice(1).toLowerCase())
    .join(' ')
</script>
<style lang="scss" scoped>
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

  @media screen and (min-width: 800px) {
    flex-direction: row;
    align-items: center;

    .input-group {
      margin-left: auto;
    }
  }
}
</style>
