import { promises as fs } from 'fs'
import { pathToFileURL } from 'node:url'
import svgLoader from 'vite-svg-loader'
import { resolve, basename } from 'pathe'
import { defineNuxtConfig } from 'nuxt/config'
import { globIterate } from 'glob'
import { match as matchLocale } from '@formatjs/intl-localematcher'

const STAGING_API_URL = 'https://staging-api.modrinth.com/v2/'

const preloadedFonts = [
  'inter/Inter-Regular.woff2',
  'inter/Inter-Medium.woff2',
  'inter/Inter-SemiBold.woff2',
  'inter/Inter-Bold.woff2',
]

const favicons = {
  '(prefers-color-scheme:no-preference)': '/favicon-light.ico',
  '(prefers-color-scheme:light)': '/favicon-light.ico',
  '(prefers-color-scheme:dark)': '/favicon.ico',
}

/**
 * Tags of locales that are auto-discovered besides the default locale.
 *
 * Preferably only the locales that reach a certain threshold of complete
 * translations would be included in this array.
 */
const enabledLocales: string[] = []

/**
 * Overrides for the categories of the certain locales.
 */
const localesCategoriesOverrides: Partial<Record<string, 'fun' | 'experimental'>> = {
  'en-x-pirate': 'fun',
  'en-x-updown': 'fun',
  'en-x-lolcat': 'fun',
  'en-x-uwu': 'fun',
  'ru-x-bandit': 'fun',
  ar: 'experimental',
  he: 'experimental',
  pes: 'experimental',
}

export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: 'Modrinth',
      link: [
        // The type is necessary because the linter can't always compare this very nested/complex type on itself
        ...preloadedFonts.map((font): object => {
          return {
            rel: 'preload',
            href: `https://cdn-raw.modrinth.com/fonts/${font}?v=3.19`,
            as: 'font',
            type: 'font/woff2',
            crossorigin: 'anonymous',
          }
        }),
        ...Object.entries(favicons).map(([media, href]): object => {
          return { rel: 'icon', type: 'image/x-icon', href, media }
        }),
        {
          rel: 'search',
          type: 'application/opensearchdescription+xml',
          href: '/opensearch.xml',
          title: 'Modrinth mods',
        },
      ],
    },
  },
  vite: {
    plugins: [
      svgLoader({
        svgoConfig: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false,
                },
              },
            },
          ],
        },
      }),
    ],
  },
  hooks: {
    'pages:extend'(routes) {
      routes.splice(
        routes.findIndex((x) => x.name === 'search-searchProjectType'),
        1
      )

      const types = ['mods', 'modpacks', 'plugins', 'resourcepacks', 'shaders', 'datapacks']

      types.forEach((type) =>
        routes.push({
          name: `search-${type}`,
          path: `/${type}`,
          file: resolve(__dirname, 'pages/search/[searchProjectType].vue'),
          children: [],
        })
      )
    },
    async 'vintl:extendOptions'(opts) {
      opts.locales ??= []

      const isProduction = getDomain() === 'https://modrinth.com'

      const resolveCompactNumberDataImport = await (async () => {
        const compactNumberLocales: string[] = []
        const resolvedImports = new Map<string, string>()

        for await (const localeFile of globIterate(
          'node_modules/@vintl/compact-number/dist/locale-data/*.mjs',
          { ignore: '**/*.data.mjs' }
        )) {
          const tag = basename(localeFile, '.mjs')
          compactNumberLocales.push(tag)
          resolvedImports.set(tag, String(pathToFileURL(resolve(localeFile))))
        }

        function resolveImport(tag: string) {
          const matchedTag = matchLocale([tag], compactNumberLocales, 'en-x-placeholder')
          return matchedTag === 'en-x-placeholder'
            ? undefined
            : `@vintl/compact-number/locale-data/${matchedTag}`
        }

        return resolveImport
      })()

      for await (const localeDir of globIterate('locales/*/', { posix: true })) {
        const tag = basename(localeDir)
        if (isProduction && !enabledLocales.includes(tag) && opts.defaultLocale !== tag) continue

        const locale =
          opts.locales.find((locale) => locale.tag === tag) ??
          opts.locales[opts.locales.push({ tag }) - 1]

        for await (const localeFile of globIterate(`${localeDir}/*`, { posix: true })) {
          const fileName = basename(localeFile)
          if (fileName === 'index.json') {
            if (locale.file == null) {
              locale.file = {
                from: `./${localeFile}`,
                format: 'crowdin',
              }
            } else {
              ;(locale.files ??= []).push({
                from: `./${localeFile}`,
                format: 'crowdin',
              })
            }
          } else if (fileName === 'meta.json') {
            const meta: Record<string, { message: string }> = await fs
              .readFile(localeFile, 'utf8')
              .then((date) => JSON.parse(date))
            locale.meta ??= {}
            for (const key in meta) {
              locale.meta[key] = meta[key].message
            }
          } else {
            ;(locale.resources ??= {})[fileName] = `./${localeFile}`
          }
        }

        const categoryOverride = localesCategoriesOverrides[tag]
        if (categoryOverride != null) {
          ;(locale.meta ??= {}).category = categoryOverride
        }

        const cnDataImport = resolveCompactNumberDataImport(tag)
        if (cnDataImport != null) {
          ;(locale.additionalImports ??= []).push({
            from: cnDataImport,
            resolve: false,
          })
        }
      }
    },
  },
  runtimeConfig: {
    // @ts-ignore
    apiBaseUrl: process.env.BASE_URL ?? globalThis.BASE_URL ?? getApiUrl(),
    // @ts-ignore
    rateLimitKey: process.env.RATE_LIMIT_IGNORE_KEY ?? globalThis.RATE_LIMIT_IGNORE_KEY,
    public: {
      apiBaseUrl: getApiUrl(),
      siteUrl: getDomain(),

      owner: process.env.VERCEL_GIT_REPO_OWNER || 'modrinth',
      slug: process.env.VERCEL_GIT_REPO_SLUG || 'knossos',
      branch:
        process.env.VERCEL_GIT_COMMIT_REF ||
        process.env.CF_PAGES_BRANCH ||
        // @ts-ignore
        globalThis.CF_PAGES_BRANCH ||
        'master',
      hash:
        process.env.VERCEL_GIT_COMMIT_SHA ||
        process.env.CF_PAGES_COMMIT_SHA ||
        // @ts-ignore
        globalThis.CF_PAGES_COMMIT_SHA ||
        'unknown',
    },
  },
  typescript: {
    shim: false,
    strict: true,
    typeCheck: true,
    tsConfig: {
      compilerOptions: {
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
      },
    },
  },
  modules: ['@vintl/nuxt', '@nuxtjs/turnstile'],
  vintl: {
    defaultLocale: 'en-US',
    locales: [
      {
        tag: 'en-US',
        meta: {
          static: {
            iso: 'en',
          },
        },
      },
    ],
    storage: 'cookie',
    parserless: 'only-prod',
    seo: {
      defaultLocaleHasParameter: false,
    },
  },
  turnstile: {
    siteKey: '0x4AAAAAAAHWfmKCm7cUG869',
  },
  nitro: {
    moduleSideEffects: ['@vintl/compact-number/locale-data'],
  },
  devtools: {
    enabled: true,
  },
})

function getApiUrl() {
  // @ts-ignore
  return process.env.BROWSER_BASE_URL ?? globalThis.BROWSER_BASE_URL ?? STAGING_API_URL
}

function getDomain() {
  if (process.env.NODE_ENV === 'production') {
    if (process.env.SITE_URL) {
      return process.env.SITE_URL
    }
    // @ts-ignore
    else if (process.env.CF_PAGES_URL || globalThis.CF_PAGES_URL) {
      // @ts-ignore
      return process.env.CF_PAGES_URL ?? globalThis.CF_PAGES_URL
    } else if (process.env.HEROKU_APP_NAME) {
      return `https://${process.env.HEROKU_APP_NAME}.herokuapp.com`
    } else if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`
    } else if (getApiUrl() === STAGING_API_URL) {
      return 'https://staging.modrinth.com'
    } else {
      return 'https://modrinth.com'
    }
  } else {
    return 'http://localhost:3000'
  }
}
