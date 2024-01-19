<template>
  <div class="universal-card">
    <ConfirmModal
      ref="modal_confirm"
      :title="formatMessage(messages.deletePatModalTitle)"
      :description="formatMessage(messages.deletePatModalDescription)"
      :proceed-label="formatMessage(messages.deletePatModalProceedLabel)"
      @proceed="removePat(deletePatIndex)"
    />
    <Modal
      ref="patModal"
      :header="`${editPatIndex !== null ? 'Edit' : 'Create'} personal access token`"
    >
      <div class="universal-modal">
        <label for="pat-name"><span class="label__title">Name</span> </label>
        <input
          id="pat-name"
          v-model="name"
          maxlength="2048"
          type="email"
          placeholder="Enter the PAT's name..."
        />
        <label for="pat-scopes"><span class="label__title">Scopes</span> </label>
        <div id="pat-scopes" class="checkboxes">
          <Checkbox
            v-for="scope in scopeList"
            :key="scope"
            :label="scopesToLabels(getScopeValue(scope)).join(', ')"
            :model-value="hasScope(scopesVal, scope)"
            @update:model-value="scopesVal = toggleScope(scopesVal, scope)"
          />
        </div>
        <label for="pat-name"><span class="label__title">Expires</span> </label>
        <input id="pat-name" v-model="expires" type="date" />
        <p></p>
        <div class="input-group push-right">
          <button class="iconified-button" @click="$refs.patModal.hide()">
            <XIcon />
            {{ formatMessage(commonMessages.cancelButton) }}
          </button>
          <button
            v-if="editPatIndex !== null"
            :disabled="loading || !name || !expires"
            type="button"
            class="iconified-button brand-button"
            @click="editPat"
          >
            <SaveIcon />
            Save changes
          </button>
          <button
            v-else
            :disabled="loading || !name || !expires"
            type="button"
            class="iconified-button brand-button"
            @click="createPat"
          >
            <PlusIcon />
            {{ formatMessage(messages.createPatButton) }}
          </button>
        </div>
      </div>
    </Modal>

    <div class="header__row">
      <div class="header__title">
        <h2>Personal Access Tokens</h2>
      </div>
      <button
        class="btn btn-primary"
        @click="
          () => {
            name = null
            scopesVal = 0
            expires = null
            editPatIndex = null
            $refs.patModal.show()
          }
        "
      >
        <PlusIcon /> Create a PAT
      </button>
    </div>
    <p>
      PATs can be used to access Modrinth's API. For more information, see
      <a class="text-link" href="https://docs.modrinth.com">Modrinth's API documentation</a>. They
      can be created and revoked at any time.
    </p>
    <div v-for="(pat, index) in pats" :key="pat.id" class="universal-card recessed token">
      <div>
        <div>
          <strong>{{ pat.name }}</strong>
        </div>
        <div>
          <template v-if="pat.access_token">
            <CopyCode :text="pat.access_token" />
          </template>
          <template v-else>
            <span
              v-tooltip="
                pat.last_used
                  ? formatMessage(commonMessages.dateAtTimeTooltip, {
                      date: new Date(pat.last_used),
                      time: new Date(pat.last_used),
                    })
                  : null
              "
            >
              <template v-if="pat.last_used">
                {{
                  formatMessage(messages.lastUsedAgoLabel, {
                    ago: formatRelativeTime(pat.last_used),
                  })
                }}
              </template>
              <template v-else>{{ formatMessage(messages.neverUsedLabel) }}</template>
            </span>
            ⋅
            <span
              v-tooltip="
                formatMessage(commonMessages.dateAtTimeTooltip, {
                  date: new Date(pat.expires),
                  time: new Date(pat.expires),
                })
              "
            >
              <template v-if="new Date(pat.expires) > new Date()">
                Expires {{ fromNow(pat.expires) }}
              </template>
              <template v-else> Expired {{ fromNow(pat.expires) }} </template>
            </span>
            ⋅
            <span
              v-tooltip="
                formatMessage(commonMessages.dateAtTimeTooltip, {
                  date: new Date(pat.created),
                  time: new Date(pat.created),
                })
              "
            >
              Created {{ fromNow(pat.created) }}
            </span>
          </template>
        </div>
      </div>
      <div class="input-group">
        <button
          class="iconified-button raised-button"
          @click="
            () => {
              editPatIndex = index
              name = pat.name
              scopesVal = pat.scopes
              expires = $dayjs(pat.expires).format('YYYY-MM-DD')
              $refs.patModal.show()
            }
          "
        >
          <EditIcon /> {{ formatMessage(messages.editTokenButton) }}
        </button>
        <button
          class="iconified-button raised-button"
          @click="
            () => {
              deletePatIndex = pat.id
              $refs.modal_confirm.show()
            }
          "
        >
          <TrashIcon /> {{ formatMessage(messages.revokeTokenButton) }}
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { PlusIcon, XIcon, Checkbox, TrashIcon, EditIcon, SaveIcon, ConfirmModal } from 'omorphia'

import {
  hasScope,
  scopeList,
  toggleScope,
  useScopes,
  getScopeValue,
} from '~/composables/auth/scopes.ts'

import CopyCode from '~/components/ui/CopyCode.vue'
import Modal from '~/components/ui/Modal.vue'

const { formatMessage } = useVIntl()

const formatRelativeTime = useRelativeTime()

const messages = defineMessages({
  createPatButton: {
    id: 'settings.pats.modal.pat.button.create-pat',
    defaultMessage: 'Create PAT',
  },
  deletePatModalDescription: {
    id: 'settings.pats.modal.delete-pat.description',
    defaultMessage: 'This will remove this token forever (like really forever).',
  },
  deletePatModalProceedLabel: {
    id: 'settings.pats.modal.delete-pat.proceed-label',
    defaultMessage: 'Delete this token',
  },
  deletePatModalTitle: {
    id: 'settings.pats.modal.delete-pat.title',
    defaultMessage: 'Are you sure you want to delete this token?',
  },
  editTokenButton: {
    id: 'settings.pats.button.edit-token',
    defaultMessage: 'Edit token',
  },
  lastUsedAgoLabel: {
    id: 'settings.pats.label.last-used-ago',
    defaultMessage: 'Last used {ago}',
  },
  neverUsedLabel: {
    id: 'settings.pats.label.never-used',
    defaultMessage: 'Never used',
  },
  patsTitle: {
    id: 'settings.pats.title',
    defaultMessage: 'PATs',
  },
  revokeTokenButton: {
    id: 'settings.pats.button.revoke-token',
    defaultMessage: 'Revoke token',
  },
})

definePageMeta({
  middleware: 'auth',
})

useHead({
  title: `${formatMessage(messages.patsTitle)} - Modrinth`,
})

const data = useNuxtApp()
const { scopesToLabels } = useScopes()
const patModal = ref()

const editPatIndex = ref(null)

const name = ref(null)
const scopesVal = ref(BigInt(0))
const expires = ref(null)

const deletePatIndex = ref(null)

const loading = ref(false)

const { data: pats, refresh } = await useAsyncData('pat', () => useBaseFetch('pat'))

async function createPat() {
  startLoading()
  loading.value = true
  try {
    const res = await useBaseFetch('pat', {
      method: 'POST',
      body: {
        name: name.value,
        scopes: Number(scopesVal.value),
        expires: data.$dayjs(expires.value).toISOString(),
      },
    })
    pats.value.push(res)
    patModal.value.hide()
  } catch (err) {
    data.$notify({
      group: 'main',
      title: formatMessage(commonMessages.errorNotificationTitle),
      text: err.data ? err.data.description : err,
      type: 'error',
    })
  }
  loading.value = false
  stopLoading()
}

async function editPat() {
  startLoading()
  loading.value = true
  try {
    await useBaseFetch(`pat/${pats.value[editPatIndex.value].id}`, {
      method: 'PATCH',
      body: {
        name: name.value,
        scopes: Number(scopesVal.value),
        expires: data.$dayjs(expires.value).toISOString(),
      },
    })
    await refresh()
    patModal.value.hide()
  } catch (err) {
    data.$notify({
      group: 'main',
      title: formatMessage(commonMessages.errorNotificationTitle),
      text: err.data ? err.data.description : err,
      type: 'error',
    })
  }
  loading.value = false
  stopLoading()
}

async function removePat(id) {
  startLoading()
  try {
    pats.value = pats.value.filter((x) => x.id !== id)
    await useBaseFetch(`pat/${id}`, {
      method: 'DELETE',
    })
    await refresh()
  } catch (err) {
    data.$notify({
      group: 'main',
      title: formatMessage(commonMessages.errorNotificationTitle),
      text: err.data ? err.data.description : err,
      type: 'error',
    })
  }
  stopLoading()
}
</script>
<style lang="scss" scoped>
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
