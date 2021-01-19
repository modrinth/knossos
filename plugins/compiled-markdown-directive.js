import Vue from 'vue'
import xss from 'xss'
import marked from 'marked'

function compileMarkdown(target, markdown) {
  target.innerHTML = xss(marked(markdown), {
    whiteList: Object.assign(xss.whiteList, { summary: [] }),
  })
}

Vue.directive('compiled-markdown', {
  bind(el, binding, vnode) {
    compileMarkdown(el, binding.value)
  },

  update(el, binding, vnode) {
    compileMarkdown(el, binding.value)
  },
})
