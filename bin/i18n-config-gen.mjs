#!/usr/bin/env node

// @ts-check

import { match as localeMatch } from '@formatjs/intl-localematcher'
import consola from 'consola'
import _glob from 'glob'
import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { scanLocaleDirectory } from './i18n/localeDir.mjs'
import { finalizePath, toPOSIX } from './i18n/paths.mjs'
import { formatterFor } from './i18n/prettier.mjs'

const glob = promisify(_glob)

// @ts-ignore We're in MJS!!
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// @ts-ignore Same!!
const require = createRequire(import.meta.url)

const memo = require('lodash/memoize')

/**
 * @typedef {object} GeneratorOptions
 * @property {string} defaultLocale Default locale code.
 * @property {string} localesDir Directory that contains the locales.
 * @property {string} [srcDir] Directory where app is built from. If omitted,
 *   all imports will be set to absolute paths.
 */

/**
 * @template T
 * @typedef {T extends undefined ? never : T extends null ? never : T} Provided
 */

/**
 * Represents an Intl.NumberFormat data resolver that takes in BCP 47 locale tag
 * and searches for data file associated with that locale, if there is no data
 * file that matches the locale, then `null` is returned. That data must be
 * additionally imported with the locale files so that polyfilled
 * Intl.NumberFormat propertly works.
 *
 * @callback NumberFormatDataResolver
 * @param {string} code BCP 47 locale code that needs resolving.
 * @returns {string | null} Path
 */

/**
 * @returns {NumberFormatDataResolver} A resolver for polyfilled
 *   Intl.NumberFormat locale data. The return value is memoized and can be
 *   called multiple times without performance drawbacks.
 */
const getNumberFormatDataResolver = memo(async () => {
  const numberFormatDir = toPOSIX(
    require.resolve('@formatjs/intl-numberformat')
  )

  const localeDataFiles = await glob(`${numberFormatDir}/locale-data/*.js`, {
    nodir: true,
  })

  const supportedLocales = localeDataFiles.map((it) => path.basename(it, '.js'))

  /** @param {string} code BCP 47 locale code to search locale data for. */
  function resolver(code) {
    const match = localeMatch([code], supportedLocales, 'en-US-x-placeholder')

    if (match === 'en-US-x-placeholder') {
      return null
    }

    return `@formatjs/intl-numberformat/locale-data/${match}.js`
  }

  return resolver
})

/**
 * Generates config from the locale directory
 *
 * @param {string} dirPath Path to the locale directory.
 * @param {string} [srcDirPath] Path to the source directory.
 * @returns {Promise<import('modules/i18n').LocaleDescriptor>} Locale descriptor
 *   for the provided path.
 */
async function createDescriptorForLocaleDir(dirPath, srcDirPath) {
  const code = path.basename(dirPath)
  const localeDir = await scanLocaleDirectory(dirPath)

  if (localeDir.sourceFile == null) {
    throw new Error(`Locale directory is missing source file: ${localeDir}`)
  }

  /**
   * @type {Provided<
   *   import('modules/i18n').LocaleDescriptor['importedData']
   * >}
   */
  const importedData = Object.create(null)

  for (const [resourceName, resourcePath] of Object.entries(
    localeDir.additionalResources
  )) {
    importedData[resourceName] = finalizePath(resourcePath, srcDirPath)
  }

  /**
   * @type {Provided<
   *   import('modules/i18n').LocaleDescriptor['additionalImports']
   * >}
   */
  const additionalImports = []

  {
    const resolveDataImport = await getNumberFormatDataResolver()

    const dataImport = resolveDataImport(code)

    if (dataImport != null) {
      additionalImports.push(dataImport)
    }
  }

  return {
    code,
    file: finalizePath(localeDir.sourceFile, srcDirPath),
    additionalImports,
    importedData,
    data: (await localeDir.parseMetaFile()).getContents(),
  }
}

/**
 * Generates the configuration using the provided options.
 *
 * @param {GeneratorOptions} opts Generator options.
 */
async function generateConfig(opts) {
  const { localesDir, defaultLocale, srcDir } = opts

  /** @type {import('modules/i18n').LocaleDescriptor[]} */
  const locales = []

  for (const _localeDirBase of await glob(`*/`, { cwd: localesDir })) {
    const localeDir = path.join(localesDir, _localeDirBase)

    try {
      locales.push(await createDescriptorForLocaleDir(localeDir, opts.srcDir))
    } catch (err) {
      throw new Error(`Cannot create descriptor for locale: "${localeDir}"`, {
        cause: err,
      })
    }
  }

  return {
    _comment:
      'This file is generated automatically. Use `bin/i18n-config-gen.mjs` script to re-generate it.',
    defaultLocale,
    locales,
  }
}

let parser = yargs(hideBin(process.argv))
  .scriptName('i18n-config-gen')
  .usage('$0', 'generate i18n configuration for knossos')
  .option('output', {
    describe: 'Output path where the configuration file will be written to',
    alias: 'o',
    default: './i18n/config.json',
    type: 'string',
  })
  .option('locales-dir', {
    describe:
      'Directory where the locale files are located. If relative, resolved against src-dir',
    default: './i18n',
    type: 'string',
  })
  .option('default-locale', {
    describe: 'Locale to use as default',
    type: 'string',
    default: 'en-US',
  })
  .option('src-dir', {
    describe: 'Directory containing source files for the app',
    type: 'string',
    default: '.',
  })

parser = parser.wrap(parser.terminalWidth())

async function runProgram() {
  const argv = await parser.parse()

  const srcDir = path.resolve(process.cwd(), argv.srcDir)
  const outFile = path.resolve(process.cwd(), argv.output)

  const config = await generateConfig({
    defaultLocale: argv.defaultLocale,
    localesDir: path.resolve(srcDir, argv.localesDir),
    srcDir,
  })

  const format = await formatterFor(outFile)
  const contents = format(JSON.stringify(config, null, 2))

  await fs.writeFile(outFile, contents, { encoding: 'utf-8' })

  consola.success('Generated new configuration at %s', outFile)
}

runProgram().then(
  () => process.exit(0),
  (err) => {
    consola.fatal('Cannot generate configuration:', err)
    process.exit(1)
  }
)
