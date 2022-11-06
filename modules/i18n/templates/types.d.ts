// @ts-check

import { IntlController } from './i18n'

export interface LocaleData {}

/**
 * @typedef {object} LocaleDescriptor
 * @property {string} code BCP47 locale code.
 * @property {import('./types').LocaleData} [data] Custom data associated with
 *   locale to be used at runtime.
 */

/**
 * @private
 * @typedef {object} ExtendedIntlControllerImpl
 * @property {boolean} automatic
 * @property {LocaleDescriptor[]} availableLocales
 * @property {ChangeLocaleFunction} changeLocale Function to change locale. This
 *   property is read-only. See {@link ChangeLocaleFunction} for the
 *   documentation of this function.
 * @property {Record<string, any>} data Imported data for the locale, as defined
 *   in the config.
 */

export interface LocaleDescriptor {
  /** BCP 47 locale code. */
  code: string

  /** Associated data with the locale. */
  data?: LocaleData
}

export interface LocaleImportedData {}

export interface ExtendedIntlController extends IntlController {
  /**
   * Indentifier of available locale that is preferred by the browser or can be
   * used in place of preferred locale. If no locale is available to meet the
   * browser's preference, this will be the default locale used by controller.
   */
  get browserLocale(): string

  /**
   * Whether current locale is automatically driven by the navigator (browser)
   * locale. This property is read-only. Automatic mode can be enabled by
   * changing locale to `'auto'`, and disabled by changing it to any available
   * locale.
   */
  get automatic(): boolean

  /**
   * List of all available locales. This property is read-only, however the
   * array that it returns is mutable; do not change it unless you know what
   * you're doing.
   */
  get availableLocales(): readonly LocaleDescriptor[]

  /**
   * Switches to a different locale.
   *
   * @param locale Locale to use or `'auto'` to switch locale to one preferred
   *   by the navigator and enable automatic mode.
   * @param save Whether the changes apply must be stored in persistent storage
   *   for later restoration. Default is `true`
   * @returns Promise that resolves after successful locale change and errors if
   *   anything went wrong.
   * @throws If provided locale is not present in the imports map.
   */
  changeLocale(locale: string | 'auto', save: boolean = true): Promise<void>

  /** Imported data for the locale, as defined in the config. */
  data: LocaleImportedData
}
