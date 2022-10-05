// @ts-check

import { createIntl, createIntlCache } from '@formatjs/intl'
import merge from 'lodash/merge'
import Vue from 'vue'
import { formatCompactNumber } from './compactNumber'
import { formatCustomMessage } from './customMessage'
import { formatTimeDifference } from './timeDifferenceFormatter'
import { hasOwn } from './utils'
import { isVNode, createTextNode } from './vueUtils'

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

  /** @returns {Record<string, Record<string, string>>} */
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
 * @private
 * @typedef {import('@formatjs/intl').IntlFormatters['formatMessage']} MessageFormatter
 */

/**
 * Represents a function that accepts translation ID, as well as values for the
 * placeholders inside the translation (if there are any).
 *
 * @callback TranslateFunction
 * @param {string} descriptor String ID or message descriptor.
 * @param {Parameters<MessageFormatter>[1]} [values] Values for the placeholders
 *   inside the translations.
 * @param {Parameters<MessageFormatter>[2]} [opts]
 * @returns {any} Either formatted string (if all elements were strings) or
 *   array of formatted elements.
 */

/**
 * @callback InjectionFunction
 * @param {'i18n' | 't' | 'fmt'} property
 * @param {unknown} value
 */

/**
 * Creates an injector for any object instance to which Intl helpers need to be
 * injected. All injected properties will be prefixed with dollar sign (`$`),
 * they are added using `Object.defineProperty` and marked as configurable, thus
 * can be re-defined, but not modified.
 *
 * @param {object} target Target to which properties will be injected.
 * @returns {InjectionFunction}
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
        descriptor.value = /** @type {TranslateFunction} */ (value)
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

/**
 * @typedef {object} IntlPlugin
 * @property {() => InstanceType<typeof IntlController>} getOrCreateController
 *   This method returns existing controller or initalizes a new one and returns
 *   it.
 * @property {(f: InjectionFunction) => void} inject Calls the callback to
 *   inject all of the helpers. The function will be called for every property:
 *   `i18n` with {@link IntlController}, `t` with {@link TranslateFunction}, `fmt`
 *   with function that returns actual {@link IntlFormatAliases} of
 *   {@link IntlController}.
 */

/** @returns {import('vue').PluginObject<never> & IntlPlugin} */
export function createIntlPlugin() {
  /** @type {InstanceType<typeof IntlController> | null} */
  let controllerInstance = null

  return {
    getOrCreateController() {
      if (controllerInstance == null) {
        controllerInstance = new IntlController()
      }
      return controllerInstance
    },
    inject(inject) {
      const controller = this.getOrCreateController()

      /** @type {TranslateFunction} */
      function translate(id, values, opts) {
        return controller.intl.formatMessage({ id }, values, opts)
      }

      function formats$getter() {
        return controller.formats
      }

      inject('i18n', controller)
      inject('t', translate)
      inject('fmt', formats$getter)
    },
    install(vue) {
      const controller = this.getOrCreateController()

      this.inject(createInjector(vue.prototype))

      vue.component('IntlFormatted', {
        name: 'IntlFormatted',

        functional: true,

        props: {
          messageId: {
            type: String,
            required: false,
            default: null,
          },
          message: {
            required: false,
            default: null,
            validator(value) {
              return typeof value === 'string' || Array.isArray(value)
            },
          },
          values: {
            type: Object,
            default() {
              return {}
            },
          },
          tags: {
            type: Array,
            required: false,
            default() {
              return []
            },
            validator(value) {
              return value.every((x) => typeof x === 'string')
            },
          },
        },

        render(createElement, context) {
          if (
            context.props.messageId == null &&
            context.props.message == null
          ) {
            throw new Error(
              'IntlFormatted cannot be rendered without "message-id" or "message" properties'
            )
          }

          /**
           * @private
           * @typedef {string | number | import('vue').VNode[] | undefined} _Values
           */

          /**
           * @private
           * @typedef {(chunks: _Values[]) => _Values} _Instantinator
           */

          /**
           * Initial values are passed to the slots.
           *
           * @type {Record<string, unknown>}
           */
          const initialValues = Object.create(null)

          /**
           * Provided values are values that were automatically provided by the
           * IntlFormatted component. They are also used to format the message.
           *
           * Initial values are to be merged before assigning provided values.
           *
           * @type {Record<string, _Values | _Instantinator>}
           */
          const values = Object.create(null)

          if (context.props.values != null) {
            Object.assign(initialValues, context.props.values)
            Object.assign(values, initialValues)
          }

          if (Array.isArray(context.props.tags)) {
            for (const tag of context.props.tags) {
              /** @type {string} */
              let key

              /** @type {import('vue').Component | string} */
              let component

              if (Array.isArray(tag)) {
                key = tag[0]
                component = tag[1]
              } else {
                if (typeof tag !== 'string') {
                  throw new Error(
                    'Custom components must be provided as array of [name, component]'
                  )
                }

                key = tag
                component = tag
              }

              values[key] = (children) => {
                const newChildren = []

                for (const child of children) {
                  if (Array.isArray(child)) {
                    newChildren.push(...child)
                  } else {
                    newChildren.push(
                      isVNode(child) ? child : createTextNode(child)
                    )
                  }
                }

                return [createElement(component, newChildren)]
              }
            }
          } else if (context.props.tags != null) {
            throw new Error(
              'Property "tags" of IntlFormatted needs to be of array type or null / undefined'
            )
          }

          for (const [name, slot] of Object.entries(context.scopedSlots)) {
            if (name.startsWith('~')) {
              values[name.slice(1)] = slot({
                values: initialValues,
              })
            } else {
              values[name] = (children) =>
                slot({
                  children,
                  values: initialValues,
                })
            }
          }

          /**
           * @private
           * @typedef {import('vue').VNode | string} _FormattedValue
           */

          /** @type {_FormattedValue | _FormattedValue[]} */
          let formatted

          if (context.props.message != null) {
            formatted = controller.formats.customMessage(
              context.props.message,
              values
            )
          } else {
            formatted = controller.intl.formatMessage(
              {
                id: context.props.messageId,
              },
              values
            )
          }

          if (!Array.isArray(formatted)) {
            formatted = [formatted]
          }

          return formatted.flat().map((child) => {
            return isVNode(child) ? child : createTextNode(child)
          })
        },
      })
    },
  }
}
