<template>
  <div>
    <section class="card">
      <h2>Profile information</h2>
      <p>
        Your profile information is publicly viewable on Modrinth and through the
        <a href="https://docs.modrinth.com/" target="_blank" class="text-link">Modrinth API</a>.
      </p>
      <label>
        <span class="label__title">Profile picture</span>
      </label>
      <div class="avatar-changer">
        <Avatar
          :src="previewImage ? previewImage : avatarUrl"
          size="md"
          circle
          :alt="auth.user.username"
        />
        <div class="input-stack">
          <FileInput
            :max-size="262144"
            :show-icon="true"
            class="btn"
            :prompt="'Upload image'"
            accept="image/png,image/jpeg,image/gif,image/webp"
            @change="showPreviewImage"
          >
            <UploadIcon />
          </FileInput>
          <Button
            v-if="previewImage"
            :action="
              () => {
                icon = null
                previewImage = null
              }
            "
          >
            <UndoIcon />Reset icon
          </Button>
        </div>
      </div>
      <label for="username-field">
        <span class="label__title">Username</span>
        <span class="label__description">
          A unique case-insensitive name to identify your profile.
        </span>
      </label>
      <input id="username-field" v-model="username" type="text" />
      <label for="bio-field">
        <span class="label__title">Bio</span>
        <span class="label__description">
          A short description to tell everyone a little bit about you.
        </span>
      </label>
      <textarea id="bio-field" v-model="bio" type="text" />
      <div v-if="hasUnsavedChanges" class="input-group">
        <Button color="primary" :action="() => saveChanges()"> <SaveIcon /> Save changes </Button>
        <Button :action="() => cancel()"> <XIcon /> Cancel </Button>
      </div>
      <div v-else class="input-group">
        <Button disabled color="primary" :action="() => saveChanges()">
          <SaveIcon /> {{ saved ? 'Changes saved' : 'Save changes' }}
        </Button>
        <Button :link="`/user/${auth.user.username}`"> <UserIcon /> Visit your profile </Button>
      </div>
    </section>
  </div>
</template>

<script setup>
import {
  Button,
  UserIcon,
  SaveIcon,
  Avatar,
  FileInput,
  UploadIcon,
  UndoIcon,
  XIcon,
} from 'omorphia'

useHead({
  title: 'Account settings - Modrinth',
})

definePageMeta({
  middleware: 'auth',
})

const auth = await useAuth()

const username = ref(auth.value.user.username)
const bio = ref(auth.value.user.bio)
const avatarUrl = ref(auth.value.user.avatar_url)
const icon = shallowRef(null)
const previewImage = shallowRef(null)
const saved = ref(false)

const hasUnsavedChanges = computed(
  () =>
    username.value !== auth.value.user.username ||
    bio.value !== auth.value.user.bio ||
    previewImage.value
)

function showPreviewImage(files) {
  const reader = new FileReader()
  icon.value = files[0]
  reader.readAsDataURL(icon.value)
  reader.onload = (event) => {
    previewImage.value = event.target.result
  }
}

function cancel() {
  icon.value = null
  previewImage.value = null
  username.value = auth.value.user.username
  bio.value = auth.value.user.bio
}

async function saveChanges() {
  startLoading()
  try {
    if (icon.value) {
      await useBaseFetch(
        `user/${auth.value.user.id}/icon?ext=${
          icon.value.type.split('/')[icon.value.type.split('/').length - 1]
        }`,
        {
          method: 'PATCH',
          body: icon.value,
        }
      )
      icon.value = null
      previewImage.value = null
    }

    const body = {}

    if (auth.value.user.username !== username.value) {
      body.username = username.value
    }

    if (auth.value.user.bio !== bio.value) {
      body.bio = bio.value
    }

    await useBaseFetch(`user/${auth.value.user.id}`, {
      method: 'PATCH',
      body,
    })
    await useAuth(auth.value.token)
    avatarUrl.value = auth.value.user.avatar_url
    saved.value = true
  } catch (err) {
    addNotification({
      group: 'main',
      title: 'An error occurred',
      text: err
        ? err.data
          ? err.data.description
            ? err.data.description
            : err.data
          : err
        : 'aaaaahhh',
      type: 'error',
    })
  }
  stopLoading()
}
</script>
<style lang="scss" scoped>
.avatar-changer {
  display: flex;
  gap: var(--gap-lg);
}

textarea {
  height: 6rem;
  width: 40rem;
  margin-bottom: var(--gap-lg);
}
</style>
