// @ts-check

import _glob from 'glob'
import path from 'node:path'
import { promisify } from 'node:util'
import { readMetaFile } from './metaFile.mjs'

const glob = promisify(_glob)

/**
 * LocaleDirectory is used to perform scan of a single locale directory and
 * index the files that it contains as well as access contents for some of the
 * files.
 */
export class LocaleDirectory {
  /**
   * @param {string} dir Directory where the root is created.
   * @internal
   */
  constructor(dir) {
    /**
     * @private
     * @type {string}
     */
    this._dir = dir

    /**
     * Path to the meta file.
     *
     * @private
     * @type {string | null}
     */

    this._metaFile = null

    /**
     * Path to the index file.
     *
     * @private
     * @type {string | null}
     */
    this._indexFile = null

    /**
     * Imported file.
     *
     * @private
     * @type {Record<string, string>}
     */
    this._additionalResources = Object.create(null)
  }

  /** Scans the locale directory for source and other files. */
  async scan() {
    for (const file of await glob('*', { cwd: this._dir })) {
      this._scanFile(file)
    }
  }

  /**
   * Indexes the file associated with the locale.
   *
   * @private
   * @param {string} _resourcePathBase Path to the file.
   */
  _scanFile(_resourcePathBase) {
    const resourcePath = path.join(this._dir, _resourcePathBase)
    const resourceName = path.basename(resourcePath)
    const resourceBaseName = path.basename(
      resourcePath,
      path.extname(resourcePath)
    )

    // All files named 'index' are considered source files.
    // There must be only one to avoid prioritisation issues.
    if (resourceBaseName === 'index') {
      if (this._indexFile != null && this._indexFile != resourcePath) {
        throw new Error(
          `Duplicate source file detected: "${resourcePath}". Currently known source file is "${this._indexFile}"`
        )
      }

      this._indexFile = resourcePath

      return
    }

    // meta.json is a special file in format similar to Chrome messages
    // format, but without any placeholders. This file is used to extract
    // some of the data variables for the locale.
    if (resourceName === 'meta.json') {
      this._metaFile = resourcePath

      return
    }

    this._additionalResources[resourceName] = resourcePath
  }

  get path() {
    return this._dir
  }

  get sourceFile() {
    return this._indexFile
  }

  get metaFile() {
    return this._metaFile
  }

  /**
   * Reads meta file present in the directory.
   *
   * @returns {ReturnType<typeof readMetaFile>} Meta file object used to access
   *   various meta properties of the locale.
   * @throws If no meta file exists for the directory or directory was not yet
   *   scanned to find one.
   */
  async parseMetaFile() {
    if (this._metaFile == null) {
      throw new Error(`Cannot find meta file for "${this._dir}"`)
    }

    return readMetaFile(this._metaFile)
  }

  /** An object of additional resources contained within the locale directory. */
  get additionalResources() {
    return /** @type {Readonly<Record<string, string>>} */ (
      this._additionalResources
    )
  }
}

/** @param {string} dir Locale directory to create root in. */
export async function scanLocaleDirectory(dir) {
  const root = new LocaleDirectory(dir)
  await root.scan()
  return root
}
