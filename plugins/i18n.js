// @ts-check

import { createIntl, createIntlCache } from '@formatjs/intl'
import merge from 'lodash/merge'
import Vue from 'vue'
import defaultMessages from '~/i18n/nuxt/en-US.json'

/**
 * @typedef {Record<string, () => Promise<{ default: Record<string, string> }>>} LocalesImportMap
 */

// The reason we're using a locale import map is because Webpack doesn't like dynamic imports that much,
// and also in case we'd need to polyfill the data for that locale, in which case we can simply modify the function
// and import the locale data too. This unfortunately means that list of supported languages is hardcoded and whenever
// a locale is added, it needs to be added here. Not the worst, but not the best either.
//
// If someone's brave enough, they probably can make a module for Nuxt that will auto-generate chucks for the locales.
// Though, please, make it configurable to also be able to generate polyfill imports, preferably forceful for NumberFormat
// cause I also want to implement fix for compact notation and it needs to be foreful. You can learn more from example
// I did for Svelte Rewrite: https://gist.github.com/Brawaru/46da44060065110746ac29e591f0c9f9.
//
// - @Brawaru
/**
 * @type {LocalesImportMap}
 */
const localeImportMap = Object.assign(Object.create(null), {
  'en-US': () => Promise.resolve({ default: defaultMessages }), // fake import :)
  'ru-RU': () => import(/* webpackMode: "lazy" */ '~/i18n/nuxt/ru-RU.json'),
})

/**
 * @typedef {object} IntlFormatAliases
 * @prop {import('@formatjs/intl').IntlShape<string>['formatDate']} date
 * @prop {import('@formatjs/intl').IntlShape<string>['formatDateTimeRange']} dateTimeRange
 * @prop {import('@formatjs/intl').IntlShape<string>['formatDisplayName']} displayName
 * @prop {import('@formatjs/intl').IntlShape<string>['formatNumber']} number
 * @prop {import('@formatjs/intl').IntlShape<string>['formatPlural']} plural
 * @prop {import('@formatjs/intl').IntlShape<string>['formatRelativeTime']} relativeTime
 * @prop {import('@formatjs/intl').IntlShape<string>['formatTime']} time
 */

/**
 * Checks whether the provided object has the required property.
 * @param {Object} instance Object which property is checked.
 * @param {string | symbol} prop Name of the property to check.
 * @returns {boolean} Whether the object has the required property.
 */
const hasOwn = (instance, prop) =>
  Object.prototype.hasOwnProperty.call(instance, prop)

class IntlController {
  /**
   * @param {LocalesImportMap} importMap HashMap with all locale import functions.
   * @param {string} defaultLocale Locale to use by default, it will be imported on import.
   */
  constructor(importMap, defaultLocale) {
    this._intlCache = createIntlCache()
    this._importMap = importMap
    this._availableLocales = Object.keys(importMap)
    this._defaultLocale = defaultLocale
    /**
     * All reactive properties.
     */
    this._vm = new Vue({
      data() {
        return {
          locales: Object.create(null),
          intl: null,
          formats: null,
        }
      },
    })
  }

  /**
   * Initialises or re-initialises Intl using provided locale and its messages.
   * @param {string} locale Locale which Intl being initialised with.
   * @throws On attempt to initialise (not re-initialise) Intl using non-default locale.
   */
  _initIntl(locale) {
    const locales = this._getLocales()

    if (!hasOwn(locales, this._defaultLocale)) {
      throw new Error(
        `Missing data for the default locale ("${this._defaultLocale}")`
      )
    }

    if (!hasOwn(locales, locale)) {
      throw new Error(`Missing data for locale "${locale}"`)
    }

    const intl = createIntl(
      {
        defaultLocale: this._defaultLocale,
        locale,
        messages:
          locale === this._defaultLocale
            ? locales[locale]
            : merge(
                Object.create(null),
                locales[this._defaultLocale],
                locales[locale]
              ),
      },
      this._intlCache
    )

    this._setIntl(intl)

    const currentFormats = this.formats

    this._setFormats(
      Object.assign(currentFormats != null ? currentFormats : {}, {
        date: intl.formatDate.bind(intl),
        dateTimeRange: intl.formatDateTimeRange.bind(intl),
        displayName: intl.formatDisplayName.bind(intl),
        number: intl.formatNumber.bind(intl),
        plural: intl.formatNumber.bind(intl),
        relativeTime: intl.formatRelativeTime.bind(intl),
        time: intl.formatTime.bind(intl),
      })
    )
  }

  get defaultLocale() {
    return this._defaultLocale
  }

  get locale() {
    return this.intl.locale
  }

  get availableLocales() {
    return this._availableLocales
  }

  /**
   * @returns {Record<string, Record<string, string>>}
   */
  _getLocales() {
    return this._vm.$data.locales
  }

  /**
   * @param {Record<string, Record<string, string>>} value
   */
  _setLocales(value) {
    this._vm.$data.locales = value
  }

  /**
   * @type {import('@formatjs/intl').IntlShape}
   */
  get intl() {
    return this._vm.$data.intl
  }

  /**
   * Changes Intl value.
   * @param {import('@formatjs/intl').IntlShape} value New value.
   */
  _setIntl(value) {
    this._vm.$data.intl = value
  }

  /**
   * @type {IntlFormatAliases}
   */
  get formats() {
    return this._vm.$data.formats
  }

  /**
   * Changes formatters.
   * @param {IntlFormatAliases} value New formats.
   */
  _setFormats(value) {
    this._vm.$data.formats = value
  }

  /**
   * Imports messages for the provided locale and stores them in memory for later use.
   * @param {string} locale Locale which messages need to be imported.
   */
  async _loadLocaleData(locale) {
    if (!hasOwn(this._importMap, locale)) {
      throw new Error(
        `Locale "${locale}" is not defined in the locales import map`
      )
    }

    this.addLocaleData(locale, (await this._importMap[locale]()).default)
  }

  /**
   * Loads locale data.
   * @param {string} locale Locale which messages need to be added.
   * @param {Record<string, string>} messages Locale messages.
   */
  addLocaleData(locale, messages) {
    this._getLocales()[locale] = messages
  }

  /**
   * Changes the locale and reinitialises intl.
   * @param {string} locale New locale.
   * @returns {Promise<void>} Promise that resolves on successful change.
   */
  async changeLocale(locale) {
    await this._loadLocaleData(locale)
    this._initIntl(locale)
  }

  /**
   * Initialises the controller with the provided default messages.
   * @param {Record<string, string>} defaultMessages Messages for the default locale.
   */
  initWith(defaultMessages) {
    if (this.intl != null) {
      throw new Error('Cannot initialise already initialised controller')
    }

    this.addLocaleData(this._defaultLocale, defaultMessages)
    this._initIntl(this._defaultLocale)
  }
}

/**
 * @typedef {object} Ref
 * @prop {T} current Currently held reference.
 * @template T Type of the reference.
 */

/**
 * @template T Type of the reference.
 * @param {T} initialValue Initial reference.
 * @returns {Ref<T>} Reference object.
 */
function createRef(initialValue) {
  return {
    current: initialValue,
  }
}

/**
 * @param {import('vue').VueConstructor} vue Vue instance.
 * @param {Ref<InstanceType<typeof IntlController>>} intlRef Reference to Intl object.
 */
function initVueHelpers(vue, intlRef) {
  /**
   * @param {import('@formatjs/intl').MessageDescriptor['id']!} id String identifier.
   * @param {Record<string, any>} values Values to replace.
   */
  function translate(id, values) {
    // In React you can pass components in values to create fluid layout and avoid HTML injects.
    // e.g. "Hi there, {name}!" => "Привет, {name}!" and then you throw
    // `{ name: <b>{name}</b> }` and it results in, speaking HTML:
    // "Hi there, <b>world</b>!" and "Привет, <b>world</b>".
    //
    // So, yea, I wonder how do you do this with Vue, because I think there
    // will be moments where that would be necessary. Needs research...
    //
    // - @Brawaru
    return intlRef.current.intl.formatMessage({ id }, values)
  }

  Object.defineProperties(vue.prototype, {
    $i18n: {
      configurable: true,
      get() {
        return intlRef.current
      },
    },
    $t: {
      configurable: true,
      value: translate,
    },
    // TODO: test if this shortcut works (a-la `{{ $fmt.date(new Date()) }}`)
    $fmt: {
      configurable: true,
      get() {
        return intlRef.current.formats
      },
    },
  })
}

/**
 * @returns {import('vue').PluginObject<unknown>}
 */
function createIntlPlugin() {
  let installed = false

  const controller = new IntlController(localeImportMap, 'en-US')
  controller.initWith(defaultMessages)

  const controllerRef = createRef(controller)

  return {
    install(vue, _options) {
      if (installed) {
        return
      }

      installed = true

      initVueHelpers(vue, controllerRef)
    },
  }
}

Vue.use(createIntlPlugin())
