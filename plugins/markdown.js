// @ts-check
import MarkdownIt from 'markdown-it'

/** @type {import('@nuxt/types').Plugin} */
export default function (_ctx, inject) {
  const md = new MarkdownIt('default', {
    html: true,
    linkify: true,
    breaks: false,
  })

  md.use(require('markdown-it-task-lists'))

  inject('md', md)
}
