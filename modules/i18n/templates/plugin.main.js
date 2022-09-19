// @ts-check

import Vue from 'vue'
import { createIntlPlugin } from './i18n'
import { hasOwn } from './utils'
import { localesDefinitions, defaultLocale } from './options'

Vue.use(createIntlPlugin())

/**
 * @typedef {object} LocaleDescriptor
 * @property {string} code BCP47 locale code.
 * @property {unknown} [data] Custom data associated with locale to be used at
 *   runtime.
 */

/** @type {import('@nuxt/types').Plugin} */
export default async function (_context) {
  /**
   * All tracked registrations of locale imports to know at runtime.
   *
   * @type {LocaleDescriptor[]}
   */
  const availableLocales = []

  {
    for (const code in localesDefinitions) {
      availableLocales.push({
        code,
        data: localesDefinitions[code].data,
      })
    }
  }

  /**
   * @param {string} locale BCP47 locale code of new locale.
   * @this {InstanceType<typeof import('./i18n').IntlController>}
   */
  async function changeLocale(locale) {
    if (!hasOwn(localesDefinitions, locale)) {
      throw new Error(`Unknown locale "${locale}"`)
    }

    this.initWith(
      locale,
      (await localesDefinitions[locale].importFunction()).default
    )
  }

  /**
   * Extends Intl Controller to provide functionality of the Nuxt module.
   *
   * @param {InstanceType<typeof import('./i18n').IntlController>} controller
   *   Controller to extend.
   */
  function extendController(controller) {
    const boundChangeLocale = changeLocale.bind(controller)

    Object.defineProperties(controller, {
      availableLocales: {
        configurable: true,
        get() {
          return availableLocales
        },
      },
      changeLocale: {
        configurable: true,
        get() {
          return boundChangeLocale
        },
      },
    })
  }

  extendController(Vue.prototype.$i18n)

  // TODO: restore user preferred locale, or try to guess locale based on Accept-Languages request or navigator.languages
  await Vue.prototype.$i18n.changeLocale(defaultLocale)
}
