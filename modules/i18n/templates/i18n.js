// @ts-check

// TODO(Brawaru): backport and refresh this module

import { createIntl, createIntlCache } from '@formatjs/intl'
import Vue from 'vue'
import { formatCompactNumber } from './compactNumber'
import { formatCustomMessage } from './customMessage'
import { createIntlFormattedComponent } from './IntlFormatted'
import { formatTimeDifference } from './timeDifferenceFormatter'
import { hasOwn } from './utils'

/**
 * @typedef {object} IntlFormatAliases
 * @property {import('@formatjs/intl').IntlShape['formatDate']} date
 * @property {import('@formatjs/intl').IntlShape['formatDateTimeRange']} dateTimeRange
 * @property {import('@formatjs/intl').IntlShape['formatDisplayName']} displayName
 * @property {import('@formatjs/intl').IntlShape['formatList']} list
 * @property {import('@formatjs/intl').IntlShape['formatNumber']} number
 * @property {import('@formatjs/intl').IntlShape['formatPlural']} plural
 * @property {import('@formatjs/intl').IntlShape['formatRelativeTime']} relativeTime
 * @property {import('@formatjs/intl').IntlShape['formatTime']} time
 * @property {import('./compactNumber').FormatCompactNumberFormatter} compactNumber
 * @property {import('./timeDifferenceFormatter').FormatTimeDifferenceFormatter} timeDifference
 * @property {import('./customMessage').CustomMessageFormatter} customMessage
 */

/**
 * @private
 * @typedef {import('@formatjs/intl').IntlShape<import('vue').VNode>} IntlShape
 */

export class IntlController {
  /**
   * @param {string} defaultLocale Locale to use by default, it will be imported
   *   on import.
   */
  constructor(defaultLocale = 'en-US') {
    /**
     * Intl cache used to avoid memory leakage and performance.
     *
     * @private
     */
    this._intlCache = createIntlCache()

    /**
     * Default locale used by this controller.
     *
     * @private
     */
    this._defaultLocale = defaultLocale

    /**
     * All reactive properties.
     *
     * @private
     */
    this._vm = new Vue({
      // TODO: switch to using composition api after upgrading to Vue 2.7
      props: {},
      data() {
        return {
          /**
           * @type {Partial<
           *   Record<string, import('./i18n.types').MessagesMap>
           * >}
           */
          locales: Object.create(null),

          /** @type {IntlShape | null} */
          intl: null,

          /** @type {IntlFormatAliases | null} */
          formats: null,

          /** @type {Intl.Locale | null} */
          intlLocale: null,
        }
      },
    })
  }

  /**
   * Initialises or re-initialises Intl using provided locale and its messages.
   *
   * @private
   * @param {string} locale Locale which Intl being initialised with.
   * @throws On attempt to initialise (not re-initialise) Intl using non-default
   *   locale.
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
            : Object.assign(
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
      Object.assign(
        currentFormats != null ? currentFormats : {},
        /** @type {IntlFormatAliases} */ ({
          date: intl.formatDate.bind(intl),
          dateTimeRange: intl.formatDateTimeRange.bind(intl),
          displayName: intl.formatDisplayName.bind(intl),
          list: intl.formatList,
          number: intl.formatNumber.bind(intl),
          plural: intl.formatPlural.bind(intl),
          relativeTime: intl.formatRelativeTime.bind(intl),
          time: intl.formatTime.bind(intl),
          compactNumber: formatCompactNumber.bind(
            null,
            intl,
            intl.formatters.getNumberFormat
          ),
          timeDifference: formatTimeDifference.bind(
            null,
            intl.formatRelativeTime
          ),
          customMessage: formatCustomMessage.bind(null, intl),
        })
      )
    )

    this._setIntlLocale(new Intl.Locale(locale))
  }

  get defaultLocale() {
    return this._defaultLocale
  }

  get locale() {
    return this.intl.locale
  }

  /**
   * @private
   * @returns {Record<string, Record<string, string>>}
   */
  _getLocales() {
    return this._vm.$data.locales
  }

  /**
   * @private
   * @param {Record<string, Record<string, string>>} value
   */
  _setLocales(value) {
    this._vm.$data.locales = value
  }

  /** @type {import('@formatjs/intl').IntlShape} */
  get intl() {
    return this._vm.$data.intl
  }

  /**
   * Changes Intl value.
   *
   * @private
   * @param {import('@formatjs/intl').IntlShape} value New value.
   */
  _setIntl(value) {
    this._vm.$data.intl = value
  }

  /** @type {IntlFormatAliases} */
  get formats() {
    return this._vm.$data.formats
  }

  /**
   * Changes formatters.
   *
   * @private
   * @param {IntlFormatAliases} value New formats.
   */
  _setFormats(value) {
    this._vm.$data.formats = value
  }

  /** @type {Intl.Locale} */
  get intlLocale() {
    return this._vm.$data.intlLocale
  }

  /**
   * Changes current Intl Locale.
   *
   * @private
   * @param {Intl.Locale} value New {@link Intl.Locale}.
   */
  _setIntlLocale(value) {
    this._vm.$data.intlLocale = value
  }

  /**
   * Loads locale data.
   *
   * @param {string} locale Locale which messages need to be added.
   * @param {Record<string, string>} messages Locale messages.
   */
  addLocaleData(locale, messages) {
    this._getLocales()[locale] = messages
  }

  /**
   * (Re-)initialises the controller with the provided locale and messages.
   *
   * @param {string} locale BCP47 locale code to best as used locale.
   * @param {Record<string, string>} messages Messages for the provided locale.
   */
  initWith(locale, messages) {
    this.addLocaleData(locale, messages)
    this._initIntl(locale)
  }
}

/**
 * @template T Type of the reference.
 * @typedef {object} Ref
 * @property {T} current Currently held reference.
 */

/**
 * @template T Type of the reference.
 * @param {T} initialValue Initial reference.
 * @returns {Ref<T>} Reference object.
 */
export function createRef(initialValue) {
  return {
    current: initialValue,
  }
}

/**
 * Creates an injector for any object instance to which Intl helpers need to be
 * injected. All injected properties will be prefixed with dollar sign (`$`),
 * they are added using `Object.defineProperty` and marked as configurable, thus
 * can be re-defined, but not modified.
 *
 * @param {object} target Target to which properties will be injected.
 * @returns {import('~/modules/i18n/templates/i18n.types').InjectionFunction}
 */
export function createInjector(target) {
  return (property, value) => {
    /** @type {PropertyDescriptor} */
    const descriptor = { configurable: true }

    switch (property) {
      case 'fmt': {
        descriptor.get = /** @type {() => IntlFormatAliases} */ (value)
        break
      }
      case 'i18n': {
        descriptor.value = /** @type {IntlController} */ (value)
        break
      }
      case 't': {
        descriptor.value =
          /** @type {import('~/modules/i18n/templates/i18n.types').TranslateFunction} */ (
            value
          )
        break
      }
    }

    Object.defineProperty(target, `$${property}`, descriptor)
  }
}

/**
 * @private
 * @typedef {| string
 *   | import('vue').VNode
 *   | import('intl-messageformat').FormatXMLElementFn<import('vue').VNode>
 *   | null} Value
 */

function createIntlPluginBase() {
  /** @type {InstanceType<typeof IntlController> | null} */
  let controllerInstance = null

  return {
    /** @returns Existing controller or just initialized one. */
    getOrCreateController() {
      if (controllerInstance == null) {
        controllerInstance = new IntlController()
      }
      return controllerInstance
    },
    /**
     * Calls the callback to inject all of the helpers. The function will be
     * called for every property: `i18n` with {@link IntlController}, `t` with
     * {@link TranslateFunction}, `fmt` with function that returns actual
     * {@link IntlFormatAliases} of {@link IntlController}.
     *
     * @param {import('./i18n.types').InjectionFunction} inject Injection
     *   function.
     */
    inject(inject) {
      const controller = this.getOrCreateController()

      /** @type {import('./i18n.types').TranslateFunction} */
      function translate(descriptor, values, opts) {
        if (typeof descriptor === 'string') {
          return controller.intl.formatMessage({ id: descriptor }, values, opts)
        } else {
          return controller.intl.formatMessage(descriptor, values, opts)
        }
      }

      function formats$getter() {
        return controller.formats
      }

      inject('i18n', controller)
      inject('t', translate)
      inject('fmt', formats$getter)
    },
  }
}

/**
 * @returns {import('vue').PluginObject<never> &
 *   ReturnType<typeof createIntlPluginBase>}
 */
export function createIntlPlugin() {
  const base = createIntlPluginBase()

  /** @type {import('vue').PluginObject<never>} */
  const vuePlugin = {
    install(vue) {
      const controller = this.getOrCreateController()

      this.inject(createInjector(vue.prototype))

      vue.component('IntlFormatted', createIntlFormattedComponent(controller))
    },
  }

  return Object.assign({}, base, vuePlugin)
}
