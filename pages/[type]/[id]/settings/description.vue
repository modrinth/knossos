<template>
  <div>
    <Card>
      <div class="markdown-disclaimer">
        <span class="label__title size-card-header">Description</span>
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
        :disabled="(currentMember.permissions & EDIT_BODY) !== EDIT_BODY"
      />
      <div class="input-group">
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
    </Card>
    <section class="universal-card"></section>
  </div>
</template>

<script>
import { MarkdownEditor, Card } from 'omorphia'
import Chips from '~/components/ui/Chips.vue'
import SaveIcon from '~/assets/images/utils/save.svg'
import { renderHighlightedString } from '~/helpers/highlight.js'

const uploadAndAttachImage = async (file, projectID) => {
  // Make sure file is of type image/png, image/jpeg, image/gif, or image/webp
  if (
    !file.type.startsWith('image/') ||
    !['png', 'jpeg', 'gif', 'webp'].includes(file.type.split('/')[1])
  ) {
    throw new Error('File is not an accepted image type')
  }

  // Make sure file is less than 1MB
  if (file.size > 1024 * 1024) {
    throw new Error('File is too large')
  }

  const qs = new URLSearchParams()
  qs.set('project_id', projectID)
  qs.set('context', 'project')
  qs.set('ext', file.type.split('/')[1])
  const url = `image?${qs.toString()}`

  const response = await useBaseFetch(url, {
    method: 'POST',
    body: file,
  })

  if (!response?.url || typeof response.url !== 'string') {
    throw new Error('Unexpected response from server')
  }

  return response.url
}

export default defineNuxtComponent({
  components: {
    Card,
    Chips,
    SaveIcon,
    MarkdownEditor,
  },
  props: {
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
          this.$notify({
            group: 'main',
            title: 'An error occurred',
            text: 'Patch project function not found',
            type: 'error',
          })
        }
      },
    },
  },
  data() {
    return {
      description: this.project.body,
      bodyViewMode: 'source',
    }
  },
  computed: {
    patchData() {
      const data = {}

      if (this.description !== this.project.body) {
        data.body = this.description
      }

      return data
    },
    hasChanges() {
      return Object.keys(this.patchData).length > 0
    },
  },
  created() {
    this.EDIT_BODY = 1 << 3
  },
  methods: {
    renderHighlightedString,
    saveChanges() {
      if (this.hasChanges) {
        this.patchProject(this.patchData)
      }
    },
    async onUploadHandler(file) {
      return await uploadAndAttachImage(file, this.project.id)
    },
  },
})
</script>

<style scoped>
.markdown-disclaimer {
  margin-bottom: 1rem;
}

.universal-card {
  margin-top: 1rem;
}
</style>
