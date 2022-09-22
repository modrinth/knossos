// @ts-check

import { createIntl, createIntlCache } from '@formatjs/intl'
import merge from 'lodash/merge'
import Vue from 'vue'
import { formatCompactNumber } from './compactNumber'
import { formatTimeDifference } from './timeDifferenceFormatter'
import { hasOwn } from './utils'
import { isVNode, createTextNode, cloneVNode } from './vueUtils'

/**
 * @typedef {object} IntlFormatAliases
 * @property {import('@formatjs/intl').IntlShape['formatDate']} date
 * @property {import('@formatjs/intl').IntlShape['formatDateTimeRange']} dateTimeRange
 * @property {import('@formatjs/intl').IntlShape['formatDisplayName']} displayName
 * @property {import('@formatjs/intl').IntlShape['formatNumber']} number
 * @property {import('@formatjs/intl').IntlShape['formatPlural']} plural
 * @property {import('@formatjs/intl').IntlShape['formatRelativeTime']} relativeTime
 * @property {import('@formatjs/intl').IntlShape['formatTime']} time
 * @property {import('./compactNumber').FormatCompactNumberFormatter} compactNumber
 * @property {import('./timeDifferenceFormatter').FormatTimeDifferenceFormatter} timeDifference
 */

export class IntlController {
  /**
   * @param {string} defaultLocale Locale to use by default, it will be imported
   *   on import.
   */
  constructor(defaultLocale = 'en-US') {
    this._intlCache = createIntlCache()
    this._defaultLocale = defaultLocale
    /** All reactive properties. */
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
   *
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
      Object.assign(
        currentFormats != null ? currentFormats : {},
        /** @type {IntlFormatAliases} */ ({
          date: intl.formatDate.bind(intl),
          dateTimeRange: intl.formatDateTimeRange.bind(intl),
          displayName: intl.formatDisplayName.bind(intl),
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
        })
      )
    )
  }

  get defaultLocale() {
    return this._defaultLocale
  }

  get locale() {
    return this.intl.locale
  }

  /** @returns {Record<string, Record<string, string>>} */
  _getLocales() {
    return this._vm.$data.locales
  }

  /** @param {Record<string, Record<string, string>>} value */
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
   * @param {IntlFormatAliases} value New formats.
   */
  _setFormats(value) {
    this._vm.$data.formats = value
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
 * Represents a function that accepts translation ID, as well as values for the
 * placeholders inside the translation (if there are any).
 *
 * @callback TranslateFunction
 * @param {string} id String ID.
 * @param {Record<string, any>} [values] Values for the placeholders inside the
 *   translations.
 * @returns {any} Either formatted string (if all elements were strings) or
 *   array of formatted elements.
 */

/**
 * @param {import('vue').VueConstructor} vue Vue instance.
 * @param {Ref<InstanceType<typeof IntlController> | null>} intlRef Reference to
 *   Intl object.
 */
function initVueHelpers(vue, intlRef) {
  function getControllerOrThrow() {
    if (intlRef.current == null) {
      throw new Error('Intl Controller has not been initialised')
    }
    return intlRef.current
  }

  /** @type {TranslateFunction} */
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
    return getControllerOrThrow().intl.formatMessage({ id }, values)
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
        return getControllerOrThrow().formats
      },
    },
  })
}

/** @returns {import('vue').PluginObject<never>} */
export function createIntlPlugin() {
  let installed = false

  /** @type {Ref<IntlController | null>} */
  const controllerRef = createRef(null)

  return {
    install(vue) {
      if (installed) {
        return
      }

      installed = true

      const controller = new IntlController()

      controllerRef.current = controller

      initVueHelpers(vue, controllerRef)

      vue.directive('i18n', {}) // doesn't actually do anything

      vue.component('i18n-formatted', {
        name: 'i18n-formatted',

        functional: true,

        props: {
          messageId: {
            type: String,
            required: true,
          },
          values: {
            type: Object,
          },
        },

        render(_createElement, context) {
          /** @type {Record<string, any>} */
          const values = Object.create(null)

          if (context.props.values != null) {
            if (typeof context.props.values !== 'object') {
              throw new TypeError('"values" property only accepts objects')
            }

            merge(values, context.props.values)
          }

          let unkeyed = 0

          for (const child of context.children ?? []) {
            /** @type {string | null} */
            let key = null

            /**
             * @type {| string
             *   | import('vue').VNode
             *   | import('intl-messageformat').FormatXMLElementFn<
             *       import('vue').VNode
             *     >
             *   | null}
             */
            let value = null

            for (const directive of child.data?.directives ?? []) {
              if (directive.name === 'i18n') {
                if (directive.arg === 'value') {
                  if (typeof directive.value !== 'string') {
                    throw new TypeError(
                      'Value for directive "v-i18n:value" is not a string'
                    )
                  }

                  key = directive.value
                  value = child
                } else if (directive.arg === 'wrap') {
                  if (typeof directive.value !== 'string') {
                    throw new TypeError(
                      'Value for directive "v-i18n:wrap" is not a string'
                    )
                  }

                  key = directive.value

                  value = (parts) => {
                    let cloned = cloneVNode(child)

                    cloned.children = parts.map((part) =>
                      isVNode(part) ? part : createTextNode(part)
                    )

                    return cloned
                  }
                }
              }
            }

            if (value == null) {
              value = child
            }

            if (key == null) {
              key = String(unkeyed)
              unkeyed += 1
            }

            values[key] = value
          }

          /** @type {string | (string | import('vue').VNode)[]} */
          let formatted = controller.intl.formatMessage(
            { id: context.props.messageId },
            values
          )

          if (!Array.isArray(formatted)) {
            formatted = [formatted]
          }

          return formatted.map((it) => (isVNode(it) ? it : createTextNode(it)))
        },
      })
    },
  }
}
