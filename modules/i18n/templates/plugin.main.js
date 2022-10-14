// @ts-check

import Vue from 'vue'
import { createInjector, createIntlPlugin } from './i18n'
import { hasOwn } from './utils'
import { localesDefinitions, defaultLocale } from './options'
import { match as matchLocale } from '@formatjs/intl-localematcher'

/** @type {import('cookie-universal-nuxt').SetParams['opts']} */
const cookieDefaults = {
  // Nicely copied from cosmetics.js :P
  maxAge: 60 * 60 * 24 * 365 * 10,
  sameSite: 'strict',
  secure: true,
  httpOnly: false,
  path: '/',
}

/**
 * @typedef {object} LocaleDescriptor
 * @property {string} code BCP47 locale code.
 * @property {unknown} [data] Custom data associated with locale to be used at
 *   runtime.
 */

/**
 * @callback ChangeLocaleFunction
 * @param {'auto' | string} locale Locale to use or `'auto'` to switch locale to
 *   one preferred by the navigator and enable automatic mode.
 * @param {boolean} [save=true] Whether the changes apply must be stored in
 *   persistent storage for later restoration. Default is `true`
 * @returns {Promise<void>} Promise that resolves after successful locale change
 *   and errors if anything went wrong.
 * @throws If provided locale is not present in the imports map.
 */

/**
 * @private
 * @typedef {object} ExtendedIntlControllerImpl
 * @property {boolean} automatic Whether current locale is automatically driven
 *   by the navigator (browser) locale. This property is read-only. Automatic
 *   mode can be enabled by changing locale to `'auto'`, and disabled by
 *   changing it to any available locale.
 * @property {LocaleDescriptor[]} availableLocales List of all available
 *   locales. This property is read-only, however the array that it returns is
 *   mutable; do not change it unless you know what you're doing.
 * @property {ChangeLocaleFunction} changeLocale Function to change locale. This
 *   property is read-only. See {@link ChangeLocaleFunction} for the
 *   documentation of this function.
 * @property {Record<string, any>} data Imported data for the locale, as defined
 *   in the config.
 */

/** @typedef {import('./i18n').IntlController & ExtendedIntlControllerImpl} ExtendedIntlController */

/** @type {import('@nuxt/types').Plugin} */
export default async function (context) {
  const { app } = context

  /**
   * @private
   * @typedef {Record<string, any>} ImportData
   */

  /**
   * @typedef {object} Settings
   * @property {LocaleDescriptor[]} availableLocales An array of available
   *   locales.
   * @property {boolean} isAuto Whether the current locale is driven by the
   *   browser's preferences.
   * @property {ImportData} importData Import data for the current locale.
   * @property {ImportData} defaultImportData Import data for the default
   *   locale.
   */

  const settings = new Vue({
    /** @returns {Settings} */
    data() {
      return {
        availableLocales: [],
        isAuto: false,
        defaultImportData: Object.create(null),
        importData: Object.create(null),
      }
    },
    computed: {
      /** @returns {ImportData} */
      mergedImportData() {
        return Object.assign(
          Object.create(null),
          this.defaultImportData,
          this.importData
        )
      },
    },
  })

  {
    for (const code in localesDefinitions) {
      settings.availableLocales.push({
        code,
        data: localesDefinitions[code].data,
      })
    }
  }

  /**
   * @param {string} locale Locale which messages need to be loaded and
   *   returned.
   * @returns {Promise<import('./options').LocaleImport>} Locale messages.
   * @throws If locale is not found in the import map or import fails.
   */
  async function loadLocaleMessages(locale) {
    if (!hasOwn(localesDefinitions, locale)) {
      throw new Error(
        `Locale "${locale}" is not present in the definitions map`
      )
    }

    return localesDefinitions[locale].importFunction()
  }

  /**
   * Retrieves preferred locale from the cookies.
   *
   * @returns {string | null} Locale that was previously saved or `null` if none
   *   is saved.
   */
  function getLocaleCookie() {
    let value = app.$cookies.get('locale') ?? null
    if (value === '') value = null
    return value
  }

  /**
   * Retrieves preferred locale from the cookies.
   *
   * @param {string | null} locale Locale code to set or `null` if it needs to
   *   be removed.
   */
  function setLocaleCookie(locale) {
    if (locale == null) {
      app.$cookies.remove('locale', cookieDefaults)
    } else {
      app.$cookies.set('locale', locale, cookieDefaults)
    }
  }

  /**
   * Retries preferred locale from the localStorage.
   *
   * @returns {string | null} Locale saved in localStorage or `null` if value is
   *   missing or the function is called from the server context.
   */
  function getLocaleFromLocalStorage() {
    if (process.client) {
      return localStorage.getItem('locale') ?? null
    }
    return null
  }

  /**
   * Saves preferred locale to the localStorage for later retrieval.
   *
   * @param {string | null} locale Locale code to save or `null` if it needs to
   *   be removed.
   */
  function saveLocaleToLocalStorage(locale) {
    if (process.client) {
      try {
        if (locale == null) {
          localStorage.removeItem('locale')
        } else {
          localStorage.setItem('locale', locale)
        }
      } catch (err) {
        console.error('Failed to save locale to the localStorage', err)
      }
    }
  }

  /**
   * Parses `Accept-Language` header value and returns locale sorted by their
   * qualities.
   *
   * @param {string} header Accept-Language header value.
   * @returns {[locale: string, quality: number][]} List of requested locales
   *   with their qualities, sorted by their quality
   */
  function parseAcceptLanguageHeader(header) {
    // given: en-GB;q=1,en-US;q=0.9;ru-RU

    /** @type {[locale: string, quality: number][]} */
    let locales = []

    const values = header.split(',').map((it) => it.trim())

    for (const value of values) {
      const [locale, ...configurations] = value.split(';')

      let quality = 1.0

      for (const configuration of configurations) {
        let [key, value] = configuration.split('=')
        key = key.trim()
        value = value?.trim() ?? null

        if (value == null || value == '') continue

        if (key === 'q') {
          const floatValue = parseFloat(value)
          if (!isNaN(floatValue)) {
            quality = floatValue
          }
        }
      }

      locales.push([locale, quality])
    }

    return locales.sort((a, b) => b[1] - a[1])
  }

  /**
   * Retreives list of locales that navigator (browser) prefers, either through
   * `Accept-Language` header (on the server side) or via `navigator.language`
   * API (on client, and only if present).
   *
   * @returns {string[]} Array of prefered languages by the navigator, can be
   *   empty.
   */
  function getNavigatorLocales() {
    if (process.server) {
      const locales = context.req.headers['accept-language']

      if (locales != null) {
        return parseAcceptLanguageHeader(locales).map((it) => it[0])
      }

      return []
    } else {
      if ('languages' in navigator) {
        return [...navigator.languages]
      } else if ('language' in navigator) {
        return [navigator.language]
      }

      return []
    }
  }

  /** @typedef {'default' | 'override' | 'storage' | 'navigator'} DetectionSource */

  /**
   * @private
   * @typedef {object} DetectedLocale
   * @property {string} locale Detected preferred locale.
   * @property {DetectionSource} source Source where locale comes from.
   */

  /**
   * Detects locale to use in app.
   *
   * @param {boolean} [restore=true] Whether the locale can be restored from the
   *   means of storage (cookies, localStorage). Default is `true`
   * @returns {DetectedLocale} Detected locale to use.
   */
  function detectLocale(restore = true) {
    const { availableLocales } = settings
    const availableLocaleCodes = availableLocales.map((it) => it.code)

    /** @type {null | string | (string | null)[]} */
    let hostLanguage = context.query?.hl ?? null

    if (Array.isArray(hostLanguage)) {
      if (hostLanguage.length < 1) {
        hostLanguage = null
      } else {
        hostLanguage = [hostLanguage[0]] ?? null
      }
    }

    if (hostLanguage === '') {
      hostLanguage = null
    }

    if (hostLanguage != null) {
      return {
        locale: matchLocale(
          [/** @type {string} */ (hostLanguage)],
          availableLocaleCodes,
          defaultLocale
        ),
        source: 'override',
      }
    }

    if (restore) {
      /** @type {string | null} */
      let restored = null

      restored = getLocaleCookie()

      if (restored == null) {
        restored = getLocaleFromLocalStorage()
      }

      if (restored != null) {
        const availableRestoredLocale = matchLocale(
          [restored],
          availableLocaleCodes,
          'en-x-placeholder'
        )

        if (availableRestoredLocale !== 'en-x-placeholder') {
          return {
            locale: availableRestoredLocale,
            source: 'storage',
          }
        }
      }
    }

    const navigatorLocale = matchLocale(
      getNavigatorLocales(),
      availableLocaleCodes,
      'en-x-placeholder'
    )

    if (navigatorLocale === 'en-x-placeholder') {
      return {
        locale: defaultLocale,
        source: 'navigator',
      }
    } else {
      return {
        locale: navigatorLocale,
        source: 'navigator',
      }
    }
  }

  /**
   * @param {string} locale BCP47 locale code of new locale or `'auto'` to use
   *   browser locale.
   * @param {boolean} save Whether to save the locale to all means of storage
   *   (cookies, localStorage) to restore on the next reload.
   * @this {InstanceType<typeof import('./i18n').IntlController>}
   */
  async function changeLocale(locale, save = true) {
    let normalizedLocale = locale // we don't want to mutate args and also want yeet locale from saves

    // Special case.
    if (normalizedLocale === 'auto') {
      const { locale: detectedLocale } = detectLocale(false)
      normalizedLocale = detectedLocale
    }

    const localeImport = await loadLocaleMessages(normalizedLocale)

    this.initWith(normalizedLocale, localeImport.messages)

    settings.importData = localeImport.importedData

    const isAuto = locale === 'auto'
    settings.isAuto = isAuto

    if (save) {
      setLocaleCookie(isAuto ? null : locale)
      saveLocaleToLocalStorage(isAuto ? null : locale)
    }
  }

  /** @typedef {import('./i18n').IntlController} */

  /**
   * Extends Intl Controller to provide functionality of the Nuxt module.
   *
   * @param {InstanceType<typeof import('./i18n').IntlController>} controller
   *   Controller to extend.
   * @returns {ExtendedIntlController} The same controller but with changed
   *   type.
   */
  function extendController(controller) {
    const boundChangeLocale = changeLocale.bind(controller)

    Object.defineProperties(controller, {
      availableLocales: {
        configurable: true,
        get() {
          return settings.availableLocales
        },
      },
      changeLocale: {
        configurable: true,
        get() {
          return boundChangeLocale
        },
      },
      automatic: {
        configurable: true,
        get() {
          return settings.isAuto
        },
      },
      data: {
        configurable: true,
        get() {
          return settings.mergedImportData
        },
      },
    })

    return /** @type {ExtendedIntlController} */ (controller)
  }

  const plugin = createIntlPlugin()

  const controller = extendController(plugin.getOrCreateController())

  Vue.use(plugin)

  plugin.inject(createInjector(context))
  plugin.inject(createInjector(app))
  if (app.store != null) {
    plugin.inject(createInjector(app.store))
  }

  if (process.client) {
    window.addEventListener('languagechange', () => {
      if (settings.isAuto) {
        controller.changeLocale('auto').then(
          () => {},
          (err) => {
            console.error(
              '[knossos-i18n] cannot change language to match browser settings.\n',
              err
            )
          }
        )
      }
    })
  }

  {
    // Load default locale data.

    const localeImport = await loadLocaleMessages(defaultLocale)

    controller.addLocaleData(defaultLocale, localeImport.messages)

    settings.defaultImportData = localeImport.importedData
  }

  {
    const { locale: detectedLocale, source: detectionSource } = detectLocale()
    await controller.changeLocale(detectedLocale, false)

    const isAuto =
      detectionSource === 'navigator' || detectionSource === 'default'

    settings.isAuto = isAuto

    if (context.isDev) {
      console.log('[knossos-i18n] setup completed', {
        detectedLocale,
        detectionSource,
        isAuto,
      })
    }
  }
}
