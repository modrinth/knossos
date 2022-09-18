<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <Chips v-model="viewMode" :items="['source', 'preview']" />
    <div v-if="viewMode === 'source'" class="editor-wrapper">
      <prism-editor
        v-model="newProject.body"
        class="md-editor"
        :highlight="highlighter"
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
import hljs from 'highlight.js/lib/core'
import markdown from 'highlight.js/lib/languages/markdown'

import { PrismEditor } from 'vue-prism-editor'

export default {
  components: {
    PrismEditor,
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
  data() {
    return {
      viewMode: 'source',
    }
  },
  methods: {
    highlighter(body) {
      hljs.registerLanguage('markdown', markdown)
      return hljs.highlight('markdown', body).value
    },
  },
}
</script>

<style lang="scss" scoped>
.separator {
  margin: var(--spacing-card-sm) 0;
}

// from the example https://github.com/koca/vue-prism-editor
.md-editor {
  background: #2d2d2d;
  color: #ccc;

  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px !important;

  width: 100%;
  height: 100%;
}

.prism-editor__textarea:focus {
  outline: none;
}
</style>
