import MarkdownIt from 'markdown-it'

export default defineNuxtPlugin((nuxtApp) => {
  const md = new MarkdownIt('default', {
    html: true,
    linkify: true,
    breaks: false,
  })

  const defaultRender =
    md.renderer.rules.link_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options)
    }

  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    tokens[idx].attrJoin('rel', 'noopener noreferrer ugc')

    return defaultRender(tokens, idx, options, env, self)
  }

  return {
    provide: {
      md: (string) => md.render(string),
    },
  }
})
