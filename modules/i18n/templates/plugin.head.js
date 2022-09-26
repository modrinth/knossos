// @ts-check

import Vue from 'vue'
import { baseURL } from './options'

/**
 * Describes a function that generates head elements related to localisation.
 *
 * @callback I18nHeadFunction
 * @returns {Pick<import('vue-meta').MetaInfo, 'htmlAttrs' | 'link'>}
 * @this {Vue}
 */

/**
 * @type {I18nHeadFunction}
 * @this {Vue}
 */
function i18nHead() {
  const { $i18n, $route } = this

  /** @type {import('vue-meta').LinkPropertyHref[]} */
  const links = []

  const currentLocale = new Intl.Locale($i18n.locale)

  /** @type {import('vue-meta').MetaInfo} */
  const head = {
    htmlAttrs: {
      lang: currentLocale.baseName,
    },
  }

  if (baseURL === null || baseURL === '') {
    return head
  }

  let currentURL = baseURL

  if (currentURL.endsWith('/')) {
    currentURL = currentURL.slice(0, -1)
  }

  currentURL += $route.fullPath

  for (const locale of $i18n.availableLocales) {
    const intlLocale = new Intl.Locale(locale.code)

    // this should weed out custom locales:
    if (intlLocale.baseName === locale.code) {
      const href = new URL(currentURL)

      href.searchParams.set('hl', locale.code)

      links.push({
        rel: 'alternate',
        href: href.toString(),
        hreflang: intlLocale.baseName,
        hid: `i18n-hreflang-${locale.code}`,
      })
    }
  }

  head.link = links

  return head
}

/** @type {import('@nuxt/types').Plugin} */
export default async function () {
  Vue.use((vue) => {
    Object.defineProperty(vue.prototype, '$i18nHead', {
      configurable: true,
      value: i18nHead,
    })
  })
}
