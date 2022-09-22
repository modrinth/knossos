// @ts-check

import { NumberFormat } from '@formatjs/intl-numberformat'
import { toLocaleString as _toLocaleString } from '@formatjs/intl-numberformat/src/to_locale_string'
import { defineProperty } from '@formatjs/ecma402-abstract'

/**
 * @param {Parameters<typeof _toLocaleString>[1]} locales
 * @param {Parameters<typeof _toLocaleString>[2]} options
 * @returns {string}
 * @this {number}
 */
function toLocaleString(locales, options) {
  return _toLocaleString(this, locales, options)
}

/**
 * List of all global sites that may or many not contain the `Intl` object, or
 * on which they will be defined.
 *
 * It tries the following sites: `global`, `globalThis`, `window`. If any of
 * those is missing then `null` value will be on its place.
 */
const injectionSites = [
  (() => {
    try {
      return global
    } catch {
      return null
    }
  })(),
  (() => {
    try {
      return globalThis
    } catch {
      return null
    }
  })(),
  (() => {
    try {
      return window
    } catch {
      return null
    }
  })(),
]

for (const target of injectionSites) {
  if (target == null) continue

  if (/** @type {any} */ ((target.Intl ?? {}).NumberFormat) !== NumberFormat) {
    defineProperty(
      target.Intl ?? (target.Intl = /** @type {any} */ ({})),
      'NumberFormat',
      {
        value: NumberFormat,
      }
    )
  }

  if (target.Number.prototype.toLocaleString !== toLocaleString) {
    defineProperty(target.Number.prototype, 'toLocaleString', {
      value: toLocaleString,
    })
  }
}

require('@formatjs/intl-numberformat/locale-data/en')
