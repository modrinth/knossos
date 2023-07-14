<template>
  <div>
    <ModalConfirm
      ref="modal_confirm"
      title="Are you sure you want to delete your account?"
      description="This will **immediately delete all of your user data and follows**. This will not delete your projects. Deleting your account cannot be reversed.<br><br>If you need help with your account, get support on the [Modrinth Discord](https://discord.gg/EUHuJHt)."
      proceed-label="Delete this account"
      :confirmation-text="auth.user.username"
      :has-to-type="true"
      @proceed="deleteAccount"
    />
    <Modal ref="changeEmailModal" :header="`${auth.user.email ? 'Change' : 'Add'} email`">
      <div class="universal-modal">
        <p>Your account information is not displayed publicly.</p>
        <label for="email-input"><span class="label__title">Email address</span> </label>
        <input
          id="email-input"
          v-model="email"
          maxlength="2048"
          type="email"
          :placeholder="`Enter your email address...`"
        />
        <div class="input-group push-right">
          <button class="iconified-button" @click="$refs.changeEmailModal.hide()">
            <XIcon />
            Cancel
          </button>
          <button
            type="button"
            class="iconified-button brand-button"
            :disabled="!email"
            @click="saveEmail()"
          >
            <SaveIcon />
            Save email
          </button>
        </div>
      </div>
    </Modal>
    <Modal
      ref="managePasswordModal"
      :header="`${auth.user.has_password ? 'Change' : 'Add'} password`"
    >
      <div class="universal-modal">
        <ul v-if="newPassword !== confirmNewPassword" class="known-errors">
          <li>Input passwords do not match!</li>
        </ul>
        <label for="old-password"><span class="label__title">Old password</span></label>
        <input
          id="old-password"
          v-model="oldPassword"
          maxlength="2048"
          type="password"
          placeholder="Old password"
        />
        <label for="new-password"><span class="label__title">New password</span></label>
        <div class="input-group">
          <input
            id="new-password"
            v-model="newPassword"
            maxlength="2048"
            type="password"
            placeholder="New password"
          />
          <label for="confirm-new-password" hidden>Confirm new password</label>
          <input
            id="confirm-new-password"
            v-model="confirmNewPassword"
            maxlength="2048"
            type="password"
            placeholder="Confirm new password"
          />
        </div>
        <div class="input-group push-right">
          <button type="button" class="iconified-button">
            <TrashIcon />
            Remove password
          </button>
          <button type="button" class="iconified-button brand-button" @click="savePassword">
            <SaveIcon />
            Save password
          </button>
        </div>
      </div>
    </Modal>
    <Modal
      ref="manageTwoFactorModal"
      :header="`${auth.user.has_totp ? 'Remove' : 'Add'} two-factor authentication`"
    >
      <div class="universal-modal">
        <p>this is a test</p>
      </div>
    </Modal>
    <Modal ref="manageProvidersModal" header="Manage authentication providers">
      <div class="universal-modal">
        <p>this is a test</p>
      </div>
    </Modal>
    <section class="universal-card">
      <h2>User profile</h2>
      <p>Visit your user profile to edit your profile information.</p>
      <NuxtLink class="iconified-button" :to="`/user/${auth.user.username}`">
        <UserIcon /> Visit your profile
      </NuxtLink>
    </section>

    <section class="universal-card">
      <h2>Account security</h2>

      <div class="adjacent-input">
        <label for="theme-selector">
          <span class="label__title">Email</span>
          <span class="label__description">Changes the email associated with your account.</span>
        </label>
        <div>
          <button class="iconified-button" @click="$refs.changeEmailModal.show()">
            <template v-if="auth.user.email">
              <EditIcon />
              Change email
            </template>
            <template v-else>
              <PlusIcon />
              Add email
            </template>
          </button>
        </div>
      </div>
      <div class="adjacent-input">
        <label for="theme-selector">
          <span class="label__title">Password</span>
          <span v-if="auth.user.has_password" class="label__description">
            Change <template v-if="auth.user.auth_providers.length > 0">or remove</template> the
            password used to login to your account.
          </span>
          <span v-else class="label__description">
            Set a permanent password to login to your account.
          </span>
        </label>
        <div>
          <button class="iconified-button" @click="$refs.managePasswordModal.show()">
            <KeyIcon />
            <template v-if="auth.user.has_password"> Change password </template>
            <template v-else> Add password </template>
          </button>
        </div>
      </div>
      <div class="adjacent-input">
        <label for="theme-selector">
          <span class="label__title">Two-factor authentication</span>
          <span class="label__description">
            Add an additional layer of security to your account during login.
          </span>
        </label>
        <div>
          <button class="iconified-button" @click="$refs.manageTwoFactorModal.show()">
            <template v-if="auth.user.has_totp"> <TrashIcon /> Remove 2FA </template>
            <template v-else> <PlusIcon /> Add 2FA </template>
          </button>
        </div>
      </div>
      <div class="adjacent-input">
        <label for="theme-selector">
          <span class="label__title">Manage authentication providers</span>
          <span class="label__description">
            Add or remove sign-on methods from your account, including GitHub, GitLab, Microsoft,
            Discord, Steam, and Google.
          </span>
        </label>
        <div>
          <button class="iconified-button" @click="$refs.manageProvidersModal.show()">
            <SettingsIcon /> Manage providers
          </button>
        </div>
      </div>
    </section>

    <section id="delete-account" class="universal-card">
      <h2>Delete account</h2>
      <p>
        Once you delete your account, there is no going back. Deleting your account will remove all
        attached data, excluding projects, from our servers.
      </p>
      <button
        type="button"
        class="iconified-button danger-button"
        @click="$refs.modal_confirm.show()"
      >
        <TrashIcon />
        Delete account
      </button>
    </section>
  </div>
</template>

<script setup>
import { EditIcon, UserIcon, SaveIcon, TrashIcon, PlusIcon, SettingsIcon, XIcon } from 'omorphia'
import ModalConfirm from '~/components/ui/ModalConfirm.vue'
import Modal from '~/components/ui/Modal.vue'
import KeyIcon from '~/assets/images/utils/key.svg'

useHead({
  title: 'Account settings - Modrinth',
})

definePageMeta({
  middleware: 'auth',
})

const data = useNuxtApp()
const auth = await useAuth()

const email = ref(auth.value.user.email)

async function saveEmail() {
  if (!email.value) {
    return
  }

  startLoading()
  try {
    const data = {
      email: email.value ?? null,
    }

    await useBaseFetch(`user/${auth.value.user.id}`, {
      method: 'PATCH',
      body: data,
    })
    await useAuth(auth.value.token)
  } catch (err) {
    data.$notify({
      group: 'main',
      title: 'An error occurred',
      text: err.data.description,
      type: 'error',
    })
  }
  stopLoading()
}

const oldPassword = ref('')
const newPassword = ref('')
const confirmNewPassword = ref('')
async function savePassword() {
  if (newPassword.value !== confirmNewPassword.value) {
    return
  }

  startLoading()
  try {
    await useBaseFetch(`auth/password`, {
      method: 'PATCH',
      body: {
        old_password: oldPassword.value,
        new_password: newPassword.value,
      },
    })
    await useAuth(auth.value.token)
  } catch (err) {
    data.$notify({
      group: 'main',
      title: 'An error occurred',
      text: err.data.description,
      type: 'error',
    })
  }
  stopLoading()
}

async function deleteAccount() {
  startLoading()
  try {
    await useBaseFetch(`user/${auth.value.user.id}`, {
      method: 'DELETE',
    })
  } catch (err) {
    data.$notify({
      group: 'main',
      title: 'An error occurred',
      text: err.data.description,
      type: 'error',
    })
  }

  useCookie('auth-token').value = null
  window.location.href = '/'

  stopLoading()
}
</script>
<style lang="scss"></style>
