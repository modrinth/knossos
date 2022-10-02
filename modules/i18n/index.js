// @ts-check

// Some of the code is inspired or directly ported from @nuxtjs/i18n module,
// which is licensed under MIT: https://github.com/nuxt-community/i18n-module/blob/main/LICENSE
//
// @nuxtjs/i18n source code: https://github.com/nuxt-community/i18n-module/

import './forceNumberFormatPolyfill'
import { join } from 'path'
import { readdir, stat } from 'fs/promises'
import { customNamespace } from './consts'
import merge from 'lodash/merge'

/**
 * Describes a path that should be imported.
 *
 * @typedef {string} ImportPath
 */

/**
 * Represents value for improted data. It can be just path to import, for which
 * 'default' will be assumed to be importKey, or array (tuple) of import path
 * and key to use from imported module.
 *
 * For example, if you define your module as
 *
 * ```js
 * export const importMe = 'hello world'
 *
 * export default {}
 * ```
 *
 * And want to import just `importMe`, then you should use combination of `path`
 * and `importKey` as such: `['./path-to-my-module.js', 'importMe']`
 *
 * @typedef {ImportPath | [path: ImportPath, importKey: string]} DataImport
 */

/**
 * @typedef {object} LocaleDescriptor
 * @property {string} code BCP47 code for the locale.
 * @property {string} file Relative to locales directory path.
 * @property {ImportPath[] | null} [additionalImports] List of additional
 *   imports (like polyfils).
 * @property {Record<string, DataImport>} [importedData={}] List of mapped
 *   imports. Unlike additional imports, these imports will be mapped to
 *   provided key. This is useful for language-associated documents, which would
 *   otherwise create frustrating experience for translators be they left as
 *   regular strings in locale file. Default is `{}`
 * @property {unknown | null} [data] Custom data for the locale.
 */

/**
 * @typedef {object} Options
 * @property {string} defaultLocale BCP47 code of the locale to use by default.
 * @property {string} localesDir Directory containing locale descriptor files.
 * @property {string | null} [baseURL=null] Base URL (domain of the site).
 *   Default is `null`. If not set, head meta tags won't generate. Default is
 *   `null`. Default is `null`
 * @property {LocaleDescriptor[]} locales All locales that are present on the
 *   runtime.
 */

/** @type {Options} */
const defaultOptions = {
  defaultLocale: 'en-US',
  baseURL: null,
  locales: [
    {
      code: 'en-US',
      file: 'en-US.json',
      importedData: {},
    },
  ],
  localesDir: 'i18n',
}

/**
 * Generator that yields only files with their full paths.
 *
 * @param {string} dirPath Path from which files are yielded.
 * @returns {AsyncGenerator<string, void, boolean | undefined>} Aaa
 */
async function* filesWithin(dirPath) {
  for (const entry of await readdir(dirPath)) {
    if ((await stat(join(dirPath, entry))).isDirectory()) {
      continue
    }
    const yieldResult = yield entry
    if (yieldResult != null && yieldResult) {
      break
    }
  }
}

/** @type {import('@nuxt/types').Module<Options>} */
export default async function (moduleOptions) {
  const options = merge(
    Object.create(null),
    defaultOptions,
    this.options.i18n,
    moduleOptions
  )

  /** Options to be passed to tempate generator. */
  const templateOptions = { options }

  // We need to have all files in the same namespace or else imports will break.
  const templatesDir = join(__dirname, 'templates')
  for await (const fileName of filesWithin(templatesDir)) {
    if (fileName.startsWith('plugin.')) {
      this.addPlugin({
        src: join(templatesDir, fileName),
        fileName: join(customNamespace, fileName),
        options: templateOptions,
      })
    } else {
      this.addTemplate({
        src: join(templatesDir, fileName),
        fileName: join(customNamespace, fileName),
        options: templateOptions,
      })
    }
  }
}
