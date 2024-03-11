<template>
  <div>
    <div class="universal-card">
      <div class="markdown-disclaimer">
        <h2>Description</h2>
        <span class="label__description">
          You can type an extended description of your mod here.
          <span class="label__subdescription">
            The description must clearly and honestly describe the purpose and function of the
            project. See section 2.1 of the
            <nuxt-link to="/legal/rules" class="text-link" target="_blank">Content Rules</nuxt-link>
            for the full requirements.
          </span>
        </span>
      </div>
      <MarkdownEditor
        v-model="description"
        :on-image-upload="onUploadHandler"
        :disabled="(props.currentMember.permissions & EDIT_BODY) !== EDIT_BODY"
      />
      <div class="input-group markdown-disclaimer">
        <button
          type="button"
          class="iconified-button brand-button"
          :disabled="!hasChanges"
          @click="saveChanges()"
        >
          <SaveIcon />
          Save changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { MarkdownEditor, SaveIcon } from 'omorphia'
import { useImageUpload } from '~/composables/image-upload.ts'

const props = defineProps({
  project: {
    type: Object,
    default() {
      return {}
    },
  },
  allMembers: {
    type: Array,
    default() {
      return []
    },
  },
  currentMember: {
    type: Object,
    default() {
      return null
    },
  },
  patchProject: {
    type: Function,
    default() {
      return () => {
        addNotification({
          group: 'main',
          title: 'An error occurred',
          text: 'Patch project function not found',
          type: 'error',
        })
      }
    },
  },
})

const description = ref(props.project.body)

const EDIT_BODY = 1 << 3

const patchData = computed(() => {
  const data = {}

  if (description.value !== props.project.body) {
    data.body = description.value
  }

  return data
})

const hasChanges = computed(() => {
  return Object.keys(patchData.value).length > 0
})

function saveChanges() {
  if (hasChanges.value) {
    props.patchProject(patchData.value)
  }
}

async function onUploadHandler(file) {
  const response = await useImageUpload(file, {
    context: 'project',
    projectID: props.project.id,
  })
  return response.url
}
</script>

<style scoped>
.markdown-disclaimer {
  margin-block: 1rem;
}

.universal-card {
  margin-top: 1rem;
}
</style>
