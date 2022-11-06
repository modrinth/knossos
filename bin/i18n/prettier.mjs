// @ts-check

import prettier from 'prettier'

/**
 * Represents a Prettier formatter function that takes file contents, formats it
 * and returns it back.
 *
 * @callback PrettierFormatter
 * @param {string} contents Source file contents.
 * @returns {string} Formatted file contents.
 */

/**
 * Dummy formatter that simply returns passed content back.
 *
 * @param {string} contents Content to return back.
 * @returns {string} Contents that were passed to the function.
 */
function dummyFormatter(contents) {
  return contents
}

/**
 * Creates a Prettier formatter funcntion for the file contents.
 *
 * It does not perform any I/O operations with the file itself: the path is only
 * used to resolve Prettier configuration for the file. That configuration is
 * what used to format the file. If configuration cannot be resolved (because
 * Pretties is configured incorrectly or the file is ignored), then 'dummy'
 * formatter is returned that does nothing but returns passed content back
 * unchanged.
 *
 * @param {string} filePath Destination of the file for which the formatter is
 *   created.
 * @returns {Promise<PrettierFormatter>} A promise that resolves to a formatter
 *   function.
 */
export async function formatterFor(filePath) {
  const fileInfo = await prettier.getFileInfo(filePath, {
    resolveConfig: true,
  })

  if (fileInfo.ignored || fileInfo.inferredParser == null) {
    return dummyFormatter
  }

  const config = await prettier.resolveConfig(filePath)

  if (config == null) return dummyFormatter

  return function formatter(contents) {
    return prettier.format(contents, {
      ...config,
      filepath: filePath,
    })
  }
}
