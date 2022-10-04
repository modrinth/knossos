// @ts-check

const parser = require('@formatjs/icu-messageformat-parser')

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

  return `export default ${JSON.stringify(parser.parse(text))}`
}

module.exports = MessageASTLoader
