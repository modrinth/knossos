import Vue from 'vue'
import xss from 'xss'
import marked from 'marked'

const options = {
  whiteList: {
    ...xss.whiteList,
    summary: [],
    h1: ['id'],
    h2: ['id'],
    h3: ['id'],
    h4: ['id'],
    h5: ['id'],
    h6: ['id'],
  },
  onIgnoreTagAttr: (name, tag, value) => {
    if (tag === 'style') {
      // Convert CSS styles to an array of arrays of each property and value
      const styles = value
        .split(';')
        .map((style) => style.split(':').map((part) => part.trim()))

      // Filter out disallowed CSS styles
      const allowedStyles = [
        'font-size',
        'font-family',
        'color',
        'background-color',
        'background',
        'font-weight',
        'font-style',
        'text-decoration',
        'text-align',
      ]
      styles.forEach((style, index) => {
        if (!allowedStyles.includes(style[0])) {
          styles.splice(index)
        }
      })

      const filteredStyles = styles.map((style) => style.join(':')).join(';')
      return tag + '="' + xss.escapeAttrValue(filteredStyles) + '"'
    }
  },
}

const configuredXss = new xss.FilterXSS(options)
const headerPrefix = 'user-defined-'

function compileMarkdown(target, markdown) {
  target.innerHTML = configuredXss.process(marked(markdown, { headerPrefix }))
}

function onHashChange() {
  const fragment = decodeURIComponent(location.hash.substr(1)) // decodeURIComponent prevents issues with emoji and other unicode character
  const fragmentElement = document.getElementById(headerPrefix + fragment)

  if (fragmentElement != null) {
    fragmentElement.scrollIntoView()
  }
}

Vue.directive('compiled-markdown', {
  bind(el, binding, vnode) {
    compileMarkdown(el, binding.value)

    window.addEventListener('hashchange', onHashChange)
    // `hashchange` does not get triggered if the link doesn't change the hash.
    el.addEventListener('click', (event) => {
      const hrefLocation = event.target.getAttribute('href')
      if (hrefLocation === decodeURIComponent(location.hash)) {
        onHashChange()
      }
    })

    onHashChange()
  },

  update(el, binding, vnode) {
    compileMarkdown(el, binding.value)
  },
})
