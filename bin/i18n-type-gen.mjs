// @ts-check

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import consola from 'consola'
import path from 'node:path'
import fs from 'node:fs/promises'
import { scanLocaleDirectory } from './i18n/localeDir.mjs'
import { formatterFor } from './i18n/prettier.mjs'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { finalizePath } from './i18n/paths.mjs'

// @ts-ignore
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// @ts-ignore
const require = createRequire(import.meta.url)

const t = require('lodash/template')

let parser = yargs(hideBin(process.argv))
  .scriptName('i18n-type-gen')
  .usage('$0', 'generate i18n types')
  .option('output', {
    describe: 'Output path where the configuration file will be written to',
    alias: 'o',
    default: './types/i18n-messages.d.ts',
    type: 'string',
  })
  .option('default-locale-dir', {
    alias: 'i',
    describe:
      'Directory where the locale files are located. If relative, resolved against the src-dir',
    default: './i18n/en-US',
    type: 'string',
  })
  .option('src-dir', {
    alias: 's',
    describe: 'Directory containing source files for the app',
    type: 'string',
    default: '.',
  })
  .option('watch', {
    alias: 'w',
    describe: 'Whether to run the script in watch mode',
    type: 'boolean',
    default: false,
  })

parser = parser.wrap(parser.terminalWidth())

/**
 * @private
 * @typedef {object} Message
 * @property {string} id Unique message identifier.
 */

/**
 * Map of message loaders (function that accept file contents and return the
 * messages).
 *
 * @type {Record<string, (contents: string) => Promise<Message[]>>}
 */
const loaders = {
  async '.toml'(contents) {
    const TOML = await import('@ltd/j-toml')
    const { flatten } = require('flat')

    const table = TOML.parse(contents, { joiner: '\n' })

    const flattened = /** @type {Record<string, string>} */ (
      flatten(table, { delimiter: '.' })
    )

    return Object.keys(flattened).map((id) => ({ id }))
  },
}

/**
 * @param {string} filePath Path to the file from which messages should be
 *   loaded.
 */
async function loadMessages(filePath) {
  const ext = path.extname(filePath)

  if (!Object.prototype.hasOwnProperty.call(loaders, ext)) {
    throw new Error(`There is no loader for "${ext}" file format`)
  }

  return loaders[ext](await fs.readFile(filePath, { encoding: 'utf8' }))
}

/**
 * @typedef {object} GenerationContext
 * @property {Message[]} messages Messages to generate contents from.
 * @property {string} sourcePath Path to the source locale directory.
 * @property {string} metaFilePath Finalised path to meta file.
 * @property {[name: string, type: string][]} additionalResources Additional
 *   resources that will be auto-loaded.
 */

const messageElement = `import('@formatjs/icu-messageformat-parser').MessageFormatElement[]`

const dataTypes = {
  '.md': messageElement,
  '.html': messageElement,
}

const template = `// This file is generated automatically from <%= sourcePath %>
// Use bin/i18n-type-gen.mjs script to re-generate it.

import '~/modules/i18n/templates/i18n'

declare module '~/modules/i18n/templates/i18n.types' {
  interface CustomMessages {
    <% forEach(messages, (message) => { %>
    <%= JSON.stringify(message.id) %>: string
    <% }); %>
  }
}

type DechromifiedMeta<T = typeof import(<%= JSON.stringify(metaFilePath) %>)> = {
  [K in keyof T]: T[K] extends { message: string } ? T[K]['message'] : never
}

declare module '~/modules/i18n/templates/types' {
  interface LocaleData extends DechromifiedMeta {}

  interface LocaleImportedData {
    <% forEach(additionalResources, (resource) => { %>
    <%= JSON.stringify(resource[0]) %>: <%= resource[1] %>
    <% }); %>
  }
}`

/** @typedef {import('~/i18n/en-US/meta.json')} test */

/**
 * Generates contents for the ambient type definitions file using the
 * {@link template}.
 *
 * @param {GenerationContext} ctx Context used for generation.
 * @returns {string} Contents of the type definitions file.
 */
export function generateTypedefFileContents(ctx) {
  return t(template, {
    imports: {
      JSON,
      /**
       * Iterates over array.
       *
       * @template T
       * @param {T[]} values Array with values to iterate over.
       * @param {(value: T, index: number, arr: T[]) => void} fc Function to
       *   call on each value of array.
       */
      forEach(values, fc) {
        if (!Array.isArray(values)) {
          throw new Error('Trying to iterate over a non-array')
        }

        for (let i = 0, l = values.length; i < l; i++) {
          fc.call(undefined, values[i], i, values)
        }
      },
    },
  })(ctx)
}

/**
 * @template O
 * @param {O} obj Object which own property should be checked.
 * @param {string} property Key to check.
 * @returns {property is keyof O}
 */
function hasKey(obj, property) {
  return Object.prototype.hasOwnProperty.call(obj, property)
}

/**
 * @param {import('./i18n/localeDir.mjs').LocaleDirectory} localeDir Locale
 *   directory.
 * @param {string} [srcDir] Source files directory for path finalization.
 * @returns {Promise<GenerationContext>}
 */
async function contextForDirectoryState(localeDir, srcDir) {
  if (localeDir.sourceFile == null) {
    throw new Error(`Cannot find locale source file in "${localeDir.path}"`)
  }

  if (localeDir.metaFile == null) {
    throw new Error(`Cannot find locale meta file in "${localeDir.path}"`)
  }

  const messages = await loadMessages(localeDir.sourceFile)

  /** @type {GenerationContext['additionalResources']} */
  const resources = []

  for (const resource of Object.keys(localeDir.additionalResources)) {
    let type = 'unknown'

    const ext = path.extname(resource)

    if (hasKey(dataTypes, ext)) {
      type = dataTypes[ext]
    } else {
      consola.warn(
        `Unknown file extension "${ext}", resource "${resource}" is mapped to "unknown" type`
      )
    }

    resources.push([resource, type])
  }

  return {
    messages,
    sourcePath: finalizePath(localeDir.path, srcDir),
    additionalResources: resources,
    metaFilePath: finalizePath(localeDir.metaFile, srcDir),
  }
}

/**
 * @template [V=void] Default is `void`
 * @returns {{
 *   promise: Promise<V>
 *   resolve: (value: V) => void
 *   reject: (reason?: any) => void
 * }}
 */
function defer() {
  /** @type {any} */
  let resolve = undefined

  /** @type {any} */
  let reject = undefined

  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })

  return { promise, resolve, reject }
}

async function runProgram() {
  const argv = await parser.parse()

  const outFilePath = path.resolve(process.cwd(), argv.output)
  const srcPath = path.resolve(process.cwd(), argv.srcDir)

  const localeDirPath = path.resolve(srcPath, argv.defaultLocaleDir)

  async function runOnce() {
    const localeDir = await scanLocaleDirectory(localeDirPath)

    const context = await contextForDirectoryState(localeDir, srcPath)

    const content = generateTypedefFileContents(context)

    const format = await formatterFor(outFilePath)
    const contents = format(content)

    await fs.writeFile(outFilePath, contents, { encoding: 'utf-8' })
  }

  if (argv.watch) {
    const { watch } = await import('chokidar')

    const { promise: watchingComplete, resolve: markAsComplete } = defer()

    const watcher = watch(localeDirPath)

    let ready = false

    /**
     * @param {string} path Changed path
     * @param {boolean} [initial] Default is `false`
     */
    function refresh(path, initial = false) {
      if (!ready) return

      if (initial) {
        console.info('Watching for new changes')
      } else {
        console.info('Changes detected, re-generating definitions file', path)
      }

      runOnce()
        .then(() => {
          if (initial) {
            consola.success('Generated definitions file')
          } else {
            consola.success('Re-generated definitions file')
          }
        })
        .catch((err) => {
          if (initial) {
            consola.error('Cannot generate new definitions:', err)
          } else {
            consola.error('Cannot generate definitions file:', err)
          }
        })
    }

    watcher.on('change', (path) => refresh(path))
    watcher.on('add', (path) => refresh(path))
    watcher.on('unlink', (path) => refresh(path))
    watcher.on('ready', () => {
      ready = true
      refresh(localeDirPath, true)
    })

    watcher.on('close', () => markAsComplete())

    process.on('SIGINT', () => {
      consola.info('Stopping watching...')
      watcher.close()
    })

    await watchingComplete
  } else {
    await runOnce()

    consola.success(`Generated new definitions file at "${outFilePath}"`)
  }
}

runProgram().then(
  () => process.exit(0),
  (err) => {
    consola.fatal('Cannot generate definitions file:', err)
    process.exit(1)
  }
)
