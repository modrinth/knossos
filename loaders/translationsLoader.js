// @ts-check

const TOML = require('@ltd/j-toml')
const { flatten } = require('flat')
const parser = require('@formatjs/icu-messageformat-parser')

/**
 * Loads TOML file contents, parses it, flattens all the keys and parses AST for
 * every message. Emits a ES6 module with default export of object containing
 * where flattened keys (joined by `.`) are mapped to AST of message they held.
 *
 * @param {string | Buffer} source Source file contents.
 * @returns {string} ES6 module source where default export contains parsed
 *   messages mapped to flattened keys, joined by `.` character.
 * @this {import('webpack').loader.LoaderContext}
 */
function LocaleTOMLLoader(source) {
  /** @type {string} */
  let text
  if (typeof source !== 'string') {
    text = source.toString('utf8')
  } else {
    text = source
  }

  const table = TOML.parse(text, { joiner: '\n' })

  /** @type {Record<string, string>} */
  const flattened = flatten(table, { delimiter: '.' })

  /** @type {Record<string, parser.MessageFormatElement[]>} */
  const result = Object.create(null)

  for (const [key, message] of Object.entries(flattened)) {
    try {
      result[key] = parser.parse(message)
    } catch (err) {
      throw new Error(
        `Could not process "${key}": ${
          err instanceof Error ? err.message : 'unknown error'
        }`,
        {
          cause: err,
        }
      )
    }
  }

  return `export default ${JSON.stringify(result)}`
}

module.exports = LocaleTOMLLoader
