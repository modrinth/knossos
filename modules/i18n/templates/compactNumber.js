// @ts-check

// This code contains many portions of code from @formatjs/intl and relative modules that cannot be imported easily.
// Those portions are licensed under MIT licences, which are available at:
// - https://github.com/formatjs/formatjs/blob/main/packages/intl/LICENSE.md
// - https://github.com/formatjs/formatjs/blob/main/packages/intl-numberformat/LICENSE.md

import { IntlError, IntlErrorCode } from '@formatjs/intl'

import '~/modules/i18n/forceNumberFormatPolyfill'

import { getFormatter } from '@formatjs/intl/src/number'

import {
  ComputeExponent,
  FormatNumericToString,
} from '@formatjs/ecma402-abstract'

import getInternalSlots from '@formatjs/intl-numberformat/src/get_internal_slots'

/**
 * @private
 * @typedef {object} FormatNumberConfig
 * @property {string} locale
 * @property {import('@formatjs/intl').CustomFormats} formats
 * @property {import('@formatjs/intl').OnErrorFn} onError
 */

/**
 * @param {Intl.NumberFormat} nf
 * @param {number} value
 */
function calculateRounded(nf, value) {
  const [exponent] = ComputeExponent(nf, value, {
    getInternalSlots,
  })

  const numeric =
    exponent < 0
      ? value * Math.pow(10, -exponent)
      : value / Math.pow(10, exponent)

  const { roundedNumber } = FormatNumericToString(getInternalSlots(nf), numeric)

  return roundedNumber * Math.pow(10, exponent)
}

/**
 * @private
 * @template T
 * @typedef {T extends undefined ? never : T} NonUndefined
 */

/**
 * @private
 * @typedef {import('@formatjs/intl').Formatters['getNumberFormat']} Formatter
 */

/**
 * @param {FormatNumberConfig} config
 * @param {Formatter} getNumberFormat
 * @param {number} value
 * @param {Omit<NonUndefined<Parameters<Formatter>[1]>, 'notation'>} [options]
 * @returns {[formattedNumber: string, roundedNumber: number]}
 */
export function formatCompactNumber(config, getNumberFormat, value, options) {
  if (options == null) {
    options = {}
  }

  try {
    const nf = getFormatter(config, getNumberFormat, {
      ...options,
      notation: 'compact',
    })

    return [nf.format(value), calculateRounded(nf, value)]
  } catch (e) {
    config.onError(
      new IntlError(
        IntlErrorCode.FORMAT_ERROR,
        'Error formatting compact number.',
        e
      )
    )
  }

  return [String(value), value]
}

/**
 * @param {FormatNumberConfig} config
 * @param {Formatter} getNumberFormat
 * @param {number} value
 * @param {Omit<NonUndefined<Parameters<Formatter>[1]>, 'notation'>} [options]
 * @returns {[formatParts: Intl.NumberFormatPart[], roundedNumber: number]}
 */
export function formatCompactNumberToParts(
  config,
  getNumberFormat,
  value,
  options
) {
  if (options == null) {
    options = {}
  }

  try {
    const nf = getFormatter(config, getNumberFormat, {
      ...options,
      notation: 'compact',
    })

    return [nf.formatToParts(value), calculateRounded(nf, value)]
  } catch (e) {
    config.onError(
      new IntlError(
        IntlErrorCode.FORMAT_ERROR,
        'Error formatting compact number.',
        e
      )
    )
  }

  return [[], value]
}

/**
 * @callback FormatCompactNumberFormatter
 * @param {number} value
 * @param {Omit<NonUndefined<Parameters<Formatter>[1]>, 'notation'>} [options]
 * @returns {[formattedNumber: string, roundedNumber: number]}
 */
