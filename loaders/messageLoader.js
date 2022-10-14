// @ts-check

const parser = require('@formatjs/icu-messageformat-parser')
const { getOptions } = require('loader-utils')

/**
 * @typedef {object} MessageLoaderOptions
 * @property {boolean} [trim=true] Whether to trim the message. Default is
 *   `true`. Default is `true`
 */

/**
 * Loads text file contents, parses it as ICU Message Format AST and emits it as
 * ES6 module.
 *
 * @param {string | Buffer} source Source file contents.
 * @returns {string} ES6 module containing AST for source file message.
 * @this {import('webpack').loader.LoaderContext}
 */
function MessageASTLoader(source) {
  /** @type {string} */
  let text
  if (typeof source !== 'string') {
    text = source.toString('utf8')
  } else {
    text = source
  }

  // Actually webpack recommends that we validate schema and sum, but since its
  // our own module we'll just let it slide, hoping that no one will pass
  // invalid options... :clueless:
  const { trim = true } = getOptions(this)

  if (trim) text = text.trim()

  return `export default ${JSON.stringify(parser.parse(text))}`
}

module.exports = MessageASTLoader
