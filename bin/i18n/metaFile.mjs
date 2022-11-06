// @ts-check

import fs from 'node:fs/promises'
import { formatterFor } from './prettier.mjs'

class MetaFile {
  /** @param {string} filePath Path to the locale meta file. */
  constructor(filePath) {
    /**
     * Path to the locale meta file.
     *
     * @private
     * @type {string}
     */
    this._filePath = filePath

    /**
     * Source data for meta file.
     *
     * @private
     * @type {import('./metaFile.types').ChromeifiedMetaSource | null}
     */
    this._source = null

    /**
     * @private
     * @type {import('./prettier.mjs').PrettierFormatter | null}
     */
    this._prettierFormatter = null
  }

  async read() {
    const contents = await fs.readFile(this._filePath, { encoding: 'utf8' })
    this._source = JSON.parse(contents)
    // add zod on top of that and it's going to be lit
  }

  async write() {
    if (this._source == null) {
      throw new Error(`Cannot write empty MetaFile to "${this._filePath}"`)
    }

    const contents = await formatterFor(this._filePath).then((format) =>
      format(JSON.stringify(this._source))
    )

    await fs.writeFile(this._filePath, contents, { encoding: 'utf8' })
  }

  /**
   * @private
   * @returns {import('./metaFile.types').ChromeifiedMetaSource}
   */
  _initializedSource() {
    if (this._source == null) {
      throw new Error(
        'Cannot modify or access properties of not yet initialized MetaFile'
      )
    }

    return this._source
  }

  /** @returns {Partial<import('./metaFile.types').MetaFileSource>} */
  getContents() {
    const mappedEntries = Object.entries(this._initializedSource()).map(
      ([key, value]) => {
        return [key, value.message]
      }
    )

    return Object.fromEntries(mappedEntries)
  }
}

/**
 * Creates MetaFile for the provided path.
 *
 * @param {any} filePath Path to read meta file from.
 * @returns MetaFile object used to manipulate meta file.
 */
export async function readMetaFile(filePath) {
  const metaFile = new MetaFile(filePath)
  await metaFile.read()
  return metaFile
}
