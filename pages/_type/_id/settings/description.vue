<template>
  <div>
    <section class="universal-card">
      <label
        for="project-description"
        title="You can type an extended description of your project here."
      >
        <span class="label__title size-card-header">Description</span>
        <span class="label__description">
          You can type an extended description of your mod here. This editor
          supports
          <a
            class="text-link"
            href="https://guides.github.com/features/mastering-markdown/"
            target="_blank"
            rel="noopener noreferrer"
            >Markdown</a
          >. HTML can also be used inside your description, not including
          styles, scripts, and iframes (though YouTube iframes are allowed).
        </span>
      </label>
      <Chips v-model="bodyViewMode" :items="['source', 'preview']" />
      <div v-if="bodyViewMode === 'source'" class="resizable-textarea-wrapper">
        <textarea
          id="project-description"
          v-model="description"
          :disabled="(currentMember.permissions & EDIT_BODY) !== EDIT_BODY"
        />
      </div>
      <div
        v-else-if="bodyViewMode === 'preview'"
        v-highlightjs
        class="markdown-body"
        v-html="
          description ? $xss($md.render(description)) : 'No body specified.'
        "
      ></div>
      <div class="input-group">
        <button
          type="button"
          class="iconified-button brand-button"
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

import SaveIcon from '~/assets/images/utils/save.svg?inline'

export default {
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
  },
  data() {
    return {
      description: '',
      bodyViewMode: 'source',
    }
  },
  fetch() {
    this.description = this.project.body
  },
  created() {
    this.EDIT_BODY = 1 << 3
  },
  methods: {
    saveChanges() {
      const data = {}

      if (this.description !== this.project.body) {
        data.body = this.description
      }

      if (Object.keys(data).length > 0) {
        this.patchProject(data)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.resizable-textarea-wrapper textarea {
  min-height: 40rem;
}

.markdown-body {
  margin-bottom: var(--spacing-card-md);
}
</style>
