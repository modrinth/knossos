import { promises as fs } from 'fs'
import { sortRoutes } from '@nuxt/utils'
import path from 'path'
import { match as localeMatch } from '@formatjs/intl-localematcher'
import axios from 'axios'
import glob from 'glob'

/** @type {import('@nuxt/types').Configuration} */
export default {
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /**
   * Headers of the page See https://nuxtjs.org/api/configuration-head
   *
   * @this {import('vue/types/vue').Vue}
   */
  head() {
    const i18nHead = this.$i18nHead()

    return {
      htmlAttrs: {
        ...i18nHead.htmlAttrs,
      },
      title: 'Modrinth',
      meta: [
        {
          charset: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('meta.description'),
        },
        {
          hid: 'publisher',
          name: 'publisher',
          content: 'Rinth, Inc.',
        },
        {
          hid: 'apple-mobile-web-app-title',
          name: 'apple-mobile-web-app-title',
          content: 'Modrinth',
        },
        {
          hid: 'theme-color',
          name: 'theme-color',
          content: '#1bd96a',
        },
        {
          hid: 'color-scheme',
          name: 'color-scheme',
          content: 'light dark',
        },

        {
          hid: 'og:site_name',
          name: 'og:site_name',
          content: 'Modrinth',
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.$t('meta.og-description'),
        },
        {
          hid: 'og:type',
          name: 'og:type',
          content: 'website',
        },
        {
          hid: 'og:url',
          name: 'og:url',
          content: 'https://modrinth.com',
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: 'https://cdn.modrinth.com/modrinth-new.png',
        },
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          content: 'summary',
        },
        {
          hid: 'twitter:site',
          name: 'twitter:site',
          content: '@modrinth',
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
        },
        {
          rel: 'stylesheet',
          href: 'https://cdn-raw.modrinth.com/fonts/inter/inter.css',
        },
        {
          rel: 'search',
          type: 'application/opensearchdescription+xml',
          href: '/opensearch.xml',
          title: 'Modrinth mods',
        },
        ...i18nHead.link,
      ],
    }
  },

  vue: {
    config: {
      devtools: true,
    },
  },
  router: {
    extendRoutes(routes, resolve) {
      routes.splice(
        routes.findIndex((x) => x.name === 'search'),
        1
      )

      routes.push({
        path: '/search',
        component: resolve(__dirname, 'pages/search.vue'),
        name: 'search',
        chunkName: 'pages/search',
        children: [
          {
            path: '/mods',
            component: resolve(__dirname, 'pages/search/mods.vue'),
            name: 'mods',
          },
          {
            path: '/modpacks',
            component: resolve(__dirname, 'pages/search/modpacks.vue'),
            name: 'modpacks',
          },
          {
            path: '/plugins',
            component: resolve(__dirname, 'pages/search/plugins.vue'),
            name: 'plugins',
          },
          {
            path: '/resourcepacks',
            component: resolve(__dirname, 'pages/search/resourcepacks.vue'),
            name: 'resourcepacks',
          },
        ],
      })

      sortRoutes(routes)
    },
    middleware: ['auth', 'analytics'],
  },
  /*
   ** Global CSS
   */
  css: ['~assets/styles/global.scss'],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    '~/plugins/vue-tooltip.js',
    '~/plugins/vue-notification.js',
    '~/plugins/xss.js',
    '~/plugins/vue-syntax.js',
    '~/plugins/shorthands.js',
    '~/plugins/shorthands-ts.js',
    '~/plugins/i18n-helpers.js',
    '~/plugins/markdown.js',
    '~/plugins/vue-fragment.js',
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/svg',
    '@nuxtjs/color-mode',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '~/modules/i18n',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/dayjs',
    '@nuxtjs/axios',
    '@nuxtjs/robots',
    '@nuxtjs/style-resources',
    'cookie-universal-nuxt',
  ],
  ads: {
    // Module options
    ghostMode: true,
    geoEdgeId: '',
  },
  robots: {
    Sitemap: 'https://modrinth.com/sitemap.xml',
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: 'https://staging-api.modrinth.com/v2/',
    headers: {
      common: {
        Accept: 'application/json',
      },
    },
  },
  dayjs: {
    locales: ['en'],
    defaultLocale: 'en',
    plugins: ['relativeTime'],
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    transpile: ['vue-tooltip', 'vue-notification'],
    html: {
      minify: {
        collapseWhitespace: true, // as @dario30186 mentioned
        removeComments: true, // 👈 add this line
      },
    },
    babel: {
      plugins: [
        [
          '@babel/plugin-proposal-private-methods',
          {
            loose: true,
          },
        ],
      ],
    },
    /** @param {import('webpack').Configuration} config */
    extend(config) {
      const translationsLoader = path.resolve(
        __dirname,
        'loaders/translationsLoader.js'
      )

      const messageLoader = path.resolve(__dirname, 'loaders/messageLoader.js')

      config.module.rules.push({
        test: /\.toml$/,
        include: path.resolve(__dirname, 'i18n'),
        loader: translationsLoader,
        type: 'javascript/auto',
      })

      config.module.rules.push({
        test: /\.md$/,
        include: path.resolve(__dirname, 'i18n'),
        loader: messageLoader,
      })

      config.module.rules.push({
        test: /\.html$/,
        include: path.resolve(__dirname, 'i18n'),
        loader: messageLoader,
      })
    },
  },
  loading: {
    color: '#1bd96a',
    height: '2px',
  },
  env: {
    owner: process.env.VERCEL_GIT_REPO_OWNER || 'modrinth',
    slug: process.env.VERCEL_GIT_REPO_SLUG || 'knossos',
    branch: process.env.VERCEL_GIT_COMMIT_REF || 'master',
    hash: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
    domain: getDomain(),
    authURLBase:
      process.env.BROWSER_BASE_URL || 'https://staging-api.modrinth.com/v2/',
  },
  publicRuntimeConfig: {
    axios: {
      browserBaseURL: process.env.BROWSER_BASE_URL,
    },
    ads: {
      ethicalAds: process.env.ETHICAL_ADS,
    },
    analytics: {
      base_url:
        process.env.BROWSER_ARIADNE_URL ||
        'https://staging-ariadne.modrinth.com/v1/',
    },
  },
  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.BASE_URL,
      headers: {
        common: {
          'x-ratelimit-key': process.env.RATE_LIMIT_IGNORE_KEY || '',
        },
      },
    },
  },
  hooks: {
    build: {
      async before(nuxt, buildOptions) {
        // 30 minutes
        const TTL = 30 * 60 * 1000

        let state = {}
        try {
          state = JSON.parse(
            await fs.readFile('./generated/state.json', 'utf8')
          )
        } catch {
          // File doesn't exist, create folder
          await fs.mkdir('./generated', { recursive: true })
        }

        if (
          state.lastGenerated &&
          new Date(state.lastGenerated).getTime() + TTL > new Date().getTime()
        ) {
          return
        }

        console.log('Generating tags...')

        state.lastGenerated = new Date().toISOString()

        const API_URL =
          process.env.BROWSER_BASE_URL ?? 'https://staging-api.modrinth.com/v2/'

        const headers = {
          headers: {
            'user-agent': `Knossos generator (admin@modrinth.com)`,
          },
        }

        const [
          categories,
          loaders,
          gameVersions,
          licenses,
          donationPlatforms,
          reportTypes,
        ] = (
          await Promise.all([
            axios.get(`${API_URL}tag/category`, headers),
            axios.get(`${API_URL}tag/loader`, headers),
            axios.get(`${API_URL}tag/game_version`, headers),
            axios.get(`${API_URL}tag/license`),
            axios.get(`${API_URL}tag/donation_platform`),
            axios.get(`${API_URL}tag/report_type`),
          ])
        ).map((it) => it.data)

        state.categories = categories
        state.loaders = loaders
        state.gameVersions = gameVersions
        state.licenses = licenses
        state.donationPlatforms = donationPlatforms
        state.reportTypes = reportTypes

        await fs.writeFile('./generated/state.json', JSON.stringify(state))

        console.log('Tags generated!')
      },
    },
    render: {
      routeDone(url, result, context) {
        setTimeout(() => {
          axios
            .post(
              `${
                process.env.ARIADNE_URL ||
                'https://staging-ariadne.modrinth.com/v1/'
              }view`,
              {
                url: getDomain() + url,
              },
              {
                headers: {
                  'Modrinth-Admin': process.env.ARIADNE_ADMIN_KEY || 'feedbeef',
                  'User-Agent':
                    context.req.rawHeaders[
                      context.req.rawHeaders.findIndex(
                        (x) => x === 'User-Agent'
                      ) + 1
                    ],
                },
              }
            )
            .then(() => {})
            .catch((e) => {
              console.error(
                'An error occurred while registering the visit: ',
                e
              )
            })
        })
      },
    },
  },
  /** @type {import('modules/i18n/index').Options} */
  i18n: (() => {
    const defaultLocale = 'en-US'
    const localesDir = 'i18n'

    // #region Automatic locales gathering

    /** @type {import('modules/i18n/index').LocaleDescriptor[]} */
    const locales = []

    const availableNFLocales = glob
      .sync('node_modules/@formatjs/intl-numberformat/locale-data/*.js', {
        nodir: true,
      })
      .map((it) => path.basename(it, '.js'))

    for (const localeDir of glob.sync(`${localesDir}/*/`)) {
      const code = path.basename(localeDir)

      /**
       * Relative to {@link localesDir} path to locale source file.
       *
       * If `null` after iterating through the resources, then an exception must
       * be thrown.
       *
       * @type {string | null}
       */
      let file = null

      /**
       * All additional imports to add with this locale.
       *
       * @type {string[] | undefined}
       */
      let additionalImports

      /**
       * Represents custom data associated with the locale.
       *
       * @private
       * @typedef {object} LocaleData
       * @property {string} [customLocaleName] Custom name for the locale.
       */

      /**
       * Custom data associated with the locale.
       *
       * @type {LocaleData}
       */
      let data = Object.create(null)

      /** @type {import('modules/i18n/index').LocaleDescriptor['importedData']} */
      let importedData = Object.create(null)

      for (const resourcePath of glob.sync(`${localeDir}/*`)) {
        const resourceName = path.basename(resourcePath)
        const resourceBaseName = path.basename(
          resourcePath,
          path.extname(resourcePath)
        )
        const importPath = require.resolve(path.join(__dirname, resourcePath))

        // All files named 'index' are considered source files.
        // There must be only one to avoid prioritisation issues.
        if (resourceBaseName === 'index') {
          if (file != null) {
            throw new Error(`Duplicate source file: ${resourcePath}`)
          }

          file = path.relative(localesDir, resourcePath)

          continue
        }

        // meta.json is a special file in format similar to Chrome messages
        // format, but without any placeholders. This file is used to extract
        // some of the data variables for the locale.
        if (resourceName === 'meta.json') {
          /**
           * @private
           * @typedef {object} Message
           * @property {string} message Contents of the message.
           * @property {string} [comment] Comment for the message.
           */

          /** @typedef {Record<string, Message | undefined>} MetaFile */

          delete require.cache[importPath] // Clear previous meta on every build.

          const meta = /** @type {MetaFile} */ (require(importPath))

          if (meta.name) {
            data.customLocaleName = meta.name.message
          }

          continue
        }

        importedData[resourceName] = importPath
      }

      if (file == null) {
        throw new Error(`Locale directory missing source file: ${localeDir}`)
      }

      {
        const nfLocaleMatch = localeMatch(
          [code],
          availableNFLocales,
          'en-US-x-placeholder'
        )

        if (nfLocaleMatch !== 'en-US-x-placeholder') {
          ;(additionalImports ?? (additionalImports = [])).push(
            require.resolve(
              `@formatjs/intl-numberformat/locale-data/${nfLocaleMatch}.js`
            )
          )
        }
      }

      locales.push({
        code,
        file,
        additionalImports,
        data,
        importedData,
      })
    }

    return {
      defaultLocale,
      locales,
      localesDir,
      baseURL: getDomain(),
    }

    // #endregion
  })(),
}

function getDomain() {
  if (process.env.NODE_ENV === 'production') {
    if (process.env.SITE_URL) {
      return process.env.SITE_URL
    } else if (process.env.HEROKU_APP_NAME) {
      return `https://${process.env.HEROKU_APP_NAME}.herokuapp.com`
    } else if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`
    } else {
      return 'https://modrinth.com'
    }
  } else {
    return 'http://localhost:3000'
  }
}
