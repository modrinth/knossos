<template>
  <div>
    <section class="universal-card">
      <label for="project-description">
        <span class="label__title size-card-header">Description</span>
        <span class="label__description">
          You can type an extended description of your mod here. This editor supports
          <a
            class="text-link"
            href="https://guides.github.com/features/mastering-markdown/"
            target="_blank"
            rel="noopener noreferrer"
            >Markdown</a
          >. HTML can also be used inside your description, not including styles, scripts, and
          iframes (though YouTube iframes are allowed).
          <span class="label__subdescription">
            The description must clearly and honestly describe the purpose and function of the
            project. See section 2.1 of the
            <nuxt-link to="/legal/rules" class="text-link" target="_blank">Content Rules</nuxt-link>
            for the full requirements.
          </span>
        </span>
      </label>
      <Chips v-model="bodyViewMode" :items="['source', 'preview']" />
      <div v-if="bodyViewMode === 'source'" class="resizable-textarea-wrapper">
        <textarea
          id="project-description"
          v-model="description"
          :disabled="(currentMember.permissions & EDIT_BODY) !== EDIT_BODY"
          @input="processInput"
          @keyup="updateCursorPosition"
          @click="updateCursorPosition"
          @select="updateCursorPosition"
        />
      </div>
      <div
        v-else-if="bodyViewMode === 'preview'"
        class="markdown-body"
        v-html="description ? renderHighlightedString(description) : 'No body specified.'"
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
    </section>
  </div>
</template>

<script>
import Chips from '~/components/ui/Chips'
import SaveIcon from '~/assets/images/utils/save.svg'
import { renderHighlightedString } from '~/helpers/highlight'

export default defineNuxtComponent({
  components: {
    Chips,
    SaveIcon,
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
      original: '',
      cursorPosition: 0,
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
    processInput(event) {
      if (event.inputType === 'insertFromPaste') {
        // Replaces <div class="spoiler"> with <details> from only the pasted text, not the rest
        const start = this.cursorPosition
        const end = start + this.description.length - this.original.length
        const pasted = event.target.value.slice(start, end)
        const parsed = new DOMParser().parseFromString(pasted, 'text/html')
        let spoilers = parsed.querySelectorAll('.spoiler')

        // only hijack paste if it contains spoiler tags
        if (spoilers.length !== 0) {
          event.stopPropagation()
          event.preventDefault()

          const startTimestamp = Date.now()
          while (spoilers.length && Date.now() - startTimestamp < 1000) {
            const spoiler = spoilers[0]
            const details = document.createElement('details')
            details.innerHTML = spoiler.innerHTML
            spoiler.replaceWith(details)
            spoilers = parsed.querySelectorAll('.spoiler')
          }

          this.description =
            this.description.slice(0, start) + parsed.body.innerHTML + this.description.slice(end)
        }
      }

      this.original = this.description
      this.updateCursorPosition(event)
    },

    updateCursorPosition(event) {
      this.cursorPosition = event.target.selectionStart
    },
  },
})
</script>
<style lang="scss" scoped>
.resizable-textarea-wrapper textarea {
  min-height: 40rem;
}

.markdown-body {
  margin-bottom: var(--spacing-card-md);
}
</style>
