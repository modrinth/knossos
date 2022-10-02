// @ts-check

const parser = require('@formatjs/icu-messageformat-parser')

/**
 * @param {string | Buffer} source Source file contents.
 * @this {import('webpack').loader.LoaderContext}
 */
function MessageFormatASTLoader(source) {
  let text

  if (typeof source === 'string') {
    text = source
  } else {
    text = source.toString('utf8')
  }

  const messages = JSON.parse(text)

  /** @type {Record<string, parser.MessageFormatElement[]>} */
  const newMessages = Object.create(null)

  for (const [key, value] of Object.entries(messages)) {
    newMessages[key] = parser.parse(value)
  }

  return `export default ${JSON.stringify(newMessages)};`
}

module.exports = MessageFormatASTLoader
