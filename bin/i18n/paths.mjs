// @ts-check

import path from 'node:path'
import posixPath from 'node:path/posix'

/**
 * Converts provided path to POSIX path.
 *
 * @param {string} p Path to convert.
 */
export function toPOSIX(p) {
  return p.split(path.sep).join(posixPath.sep)
}

/**
 * Finalizes path to a file into an import.
 *
 * Finalization means that absolute path is being converted to valid import path
 * in the project that uses `~` as alias for the project source directory.
 *
 * @param {string} p Path to finalize.
 * @param {string} [src] Path where to expect the file to be located.
 * @returns {string} Path that can be used to import the file.
 */
export function finalizePath(p, src) {
  if (src == null) return p
  return `~/${toPOSIX(path.relative(src, p))}`
}
