#!/usr/bin/env node

// @ts-check

import path from 'path'
import posixPath from 'path/posix'
import { match as localeMatch } from '@formatjs/intl-localematcher'
import glob from 'glob'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const require = createRequire(import.meta.url)

/**
 * Converts provided path to POSIX path.
 *
 * @param {string} p Path to convert.
 */
function toPOSIX(p) {
  return p.split(path.sep).join(posixPath.sep)
}

/**
 * @param {string} p Path to finalize.
 * @param {string} [src] Path where to expect the file to be located.
 */
function finalizePath(p, src) {
  if (src == null) return p
  return `~/${toPOSIX(path.relative(src, p))}`
}

/**
 * @typedef {object} GeneratorOptions
 * @property {string} defaultLocale Default locale code.
 * @property {string} localesDir Directory that contains the locales.
 * @property {string} [srcDir] Directory where app is built from. If omitted,
 *   all imports will be set to absolute paths.
 */

/**
 * @template T
 * @typedef {T extends undefined ? never : T} NonUndefined
 */

/**
 * Generates the configuration using the provided options.
 *
 * @param {GeneratorOptions} opts Generator options.
 */
function generateConfig(opts) {
  const { localesDir, defaultLocale, srcDir } = opts

  // #region Automatic locales gathering
  /** @type {import('modules/i18n/index').LocaleDescriptor[]} */
  const locales = []

  const availableNFLocales = glob
    .sync('node_modules/@formatjs/intl-numberformat/locale-data/*.js', {
      nodir: true,
    })
    .map((it) => path.basename(it, '.js'))

  for (const _localeDirBase of glob.sync(`*/`, { cwd: localesDir })) {
    const localeDir = path.join(localesDir, _localeDirBase)
    const code = path.basename(localeDir)

    /**
     * Relative to {@link localesDir} path to locale source file.
     *
     * If `null` after iterating through the resources, then an exception must
     * be thrown.
     *
     * @type {string | null}
     */
    let file = null

    /**
     * All additional imports to add with this locale.
     *
     * @type {string[] | undefined}
     */
    let additionalImports

    /**
     * Represents custom data associated with the locale.
     *
     * @private
     * @typedef {object} LocaleData
     * @property {string} [customLocaleName] Custom name for the locale.
     */
    /**
     * Custom data associated with the locale.
     *
     * @type {LocaleData}
     */
    let data = Object.create(null)

    /**
     * @type {NonUndefined<
     *   import('modules/i18n/index').LocaleDescriptor['importedData']
     * >}
     */
    let importedData = Object.create(null)

    for (const _resourcePathBase of glob.sync(`*`, { cwd: localeDir })) {
      const resourcePath = path.join(localeDir, _resourcePathBase)
      const resourceName = path.basename(resourcePath)
      const resourceBaseName = path.basename(
        resourcePath,
        path.extname(resourcePath)
      )
      const importPath = require.resolve(resourcePath)

      // All files named 'index' are considered source files.
      // There must be only one to avoid prioritisation issues.
      if (resourceBaseName === 'index') {
        if (file != null) {
          throw new Error(`Duplicate source file: ${resourcePath}`)
        }

        file = finalizePath(resourcePath, srcDir)

        continue
      }

      // meta.json is a special file in format similar to Chrome messages
      // format, but without any placeholders. This file is used to extract
      // some of the data variables for the locale.
      if (resourceName === 'meta.json') {
        /**
         * @private
         * @typedef {object} Message
         * @property {string} message Contents of the message.
         * @property {string} [comment] Comment for the message.
         */
        /** @typedef {Record<string, Message | undefined>} MetaFile */
        delete require.cache[importPath] // Clear previous meta on every build.

        const meta = /** @type {MetaFile} */ (require(importPath))

        if (meta.name) {
          data.customLocaleName = meta.name.message
        }

        continue
      }

      importedData[resourceName] = finalizePath(importPath, srcDir)
    }

    if (file == null) {
      throw new Error(`Locale directory is missing source file: ${localeDir}`)
    }

    {
      const nfLocaleMatch = localeMatch(
        [code],
        availableNFLocales,
        'en-US-x-placeholder'
      )

      if (nfLocaleMatch !== 'en-US-x-placeholder') {
        ;(additionalImports ?? (additionalImports = [])).push(
          `@formatjs/intl-numberformat/locale-data/${nfLocaleMatch}.js`
        )
      }
    }

    locales.push({
      code,
      file,
      additionalImports,
      data,
      importedData,
    })
  }

  return {
    _comment:
      'This file is generated automatically. Use `bin/i18n-config-gen.mjs` script to re-generate it.',
    defaultLocale,
    locales,
  }

  // #endregion
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

const argv = parser.parseSync()

const outFile = path.resolve(process.cwd(), argv.output)

{
  const srcDir = path.resolve(process.cwd(), argv.srcDir)

  fs.writeFileSync(
    outFile,
    JSON.stringify(
      generateConfig({
        defaultLocale: argv.defaultLocale,
        localesDir: path.resolve(srcDir, argv.localesDir),
        srcDir,
      }),
      null,
      2
    ),
    { encoding: 'utf-8' }
  )
}

console.log('Generated new configuration at %s', outFile)
