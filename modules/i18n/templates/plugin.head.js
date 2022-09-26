// @ts-check

/** @type {import('@nuxt/types').Plugin} */
export default async function (context, inject) {
  if (context.app.$i18n == null) {
    throw new Error('i18n is not available in context')
  }

  const { $i18n } = context

  const currentURL = `${process.env.domain}${context.route.fullPath}`

  inject('i18nHead', () => {
    /** @type {import('vue-meta').MetaPropertyProperty[]} */
    const metaLocales = []

    /** @type {import('vue-meta').LinkPropertyHref[]} */
    const links = []

    for (const locale of $i18n.availableLocales) {
      const intlLocale = new Intl.Locale(locale.code)

      // this should weed out custom locales:
      if (intlLocale.baseName === locale.code) {
        metaLocales.push({
          property: 'og:locale:alternate',
          content: `${intlLocale.language}_${
            intlLocale.region?.toUpperCase() ?? 'US'
          }`,
          hid: `i18n-og-locale-${locale.code}`,
        })

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

    const currentLocale = new Intl.Locale($i18n.locale)

    metaLocales.push({
      property: 'og:locale',
      content: `${currentLocale.language}_${
        currentLocale.region?.toUpperCase() ?? 'US'
      }`,
      hid: 'i18n-og-current-locale',
    })

    /** @type {import('vue-meta').MetaInfo} */
    const head = {
      htmlAttrs: {
        lang: currentLocale.baseName,
      },
      link: links,
      meta: metaLocales,
    }

    return head
  })
}
