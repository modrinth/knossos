<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <div class="chips-container">
      <Chips v-model="bodyViewMode" :items="['source', 'preview']" />
    </div>
    <div v-if="bodyViewMode === 'source'">
      <prism-editor
        v-model="newProject.body"
        class="md-editor"
        :highlight="highlighter"
        line-numbers
      ></prism-editor>
    </div>
    <div
      v-if="bodyViewMode === 'preview'"
      class="markdown-body"
      v-html="
        newProject.body
          ? $xss($md.render(newProject.body))
          : 'No body specified.'
      "
    ></div>
  </div>
</template>

<script>
import 'vue-prism-editor/dist/prismeditor.min.css' // import the styles somewhere

import hljs from 'highlight.js/lib/core'
import markdown from 'highlight.js/lib/languages/markdown'

import { PrismEditor } from 'vue-prism-editor'

import Chips from './Chips.vue'

export default {
  components: {
    PrismEditor,
    Chips,
  },
  props: {
    bodyViewMode: {
      type: String,
      default() {
        return 'source'
      },
    },
    newProject: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  // data() {
  //   return {
  //     viewMode: 'source',
  //   }
  // },
  methods: {
    highlighter(body) {
      hljs.registerLanguage('markdown', markdown)
      return hljs.highlight('markdown', body).value
    },
  },
}
</script>

<style lang="scss">
.separator {
  margin: var(--spacing-card-sm) 0;
}

.chips-container {
  margin: 0.75rem 0;
}

.md-editor {
  background-color: var(--color-button-bg);
  width: auto;

  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;

  padding: 1rem 0.65rem;
  border-radius: 1em;

  pre.prism-editor__editor {
    border-radius: 0 !important;
  }
}

.prism-editor__textarea {
  box-shadow: none;
}

pre {
  border-radius: 0 !important;
}
</style>
