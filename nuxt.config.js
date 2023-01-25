import { promises as fs } from 'fs'
import svgLoader from 'vite-svg-loader'
import eslintPlugin from 'vite-plugin-eslint'
import { resolve } from 'pathe'
import { defineNuxtConfig } from 'nuxt/config'
import { $fetch } from 'ofetch'

const STAGING_API_URL = 'https://staging-api.modrinth.com/v2/'
// const STAGING_ARIADNE_URL = 'https://staging-ariadne.modrinth.com/v1/'

export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: 'Modrinth',
      meta: [
        {
          name: 'description',
          content:
            'Download Minecraft mods, plugins, datapacks, shaders, resourcepacks, and modpacks on Modrinth. Discover and publish projects on Modrinth with a modern, easy to use interface and API.',
        },
        {
          name: 'publisher',
          content: 'Rinth, Inc.',
        },
        {
          name: 'og:title',
          content: 'Modrinth',
        },
        {
          name: 'apple-mobile-web-app-title',
          content: 'Modrinth',
        },
        {
          name: 'theme-color',
          content: '#1bd96a',
        },
        {
          name: 'color-scheme',
          content: 'light dark',
        },
        {
          name: 'og:site_name',
          content: 'Modrinth',
        },
        {
          name: 'og:description',
          content: 'An open source modding platform',
        },
        {
          name: 'og:type',
          content: 'website',
        },
        {
          name: 'og:url',
          content: 'https://modrinth.com',
        },
        {
          name: 'og:image',
          content: 'https://cdn.modrinth.com/modrinth-new.png?',
        },
        {
          name: 'twitter:card',
          content: 'summary',
        },
        {
          name: 'twitter:site',
          content: '@modrinth',
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon-light.ico',
          media: '(prefers-color-scheme:no-preference)',
        },
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
          media: '(prefers-color-scheme:dark)',
        },
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon-light.ico',
          media: '(prefers-color-scheme:light)',
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
      ],
    },
  },
  css: ['~/assets/styles/global.scss'],
  modules: ['@nuxtjs/color-mode'],
  vite: { plugins: [svgLoader({ svgo: false }), eslintPlugin()] },
  dayjs: {
    locales: ['en'],
    defaultLocale: 'en',
    plugins: ['relativeTime'],
  },
  hooks: {
    async 'build:before' () {
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

      const API_URL = getApiUrl()

      if (
        // Skip regeneration if within TTL...
        state.lastGenerated &&
        new Date(state.lastGenerated).getTime() + TTL >
        new Date().getTime() &&
        // ...but only if the API URL is the same
        state.apiUrl &&
        state.apiUrl === API_URL
      ) {
        return
      }

      console.log('Generating tags...')

      state.lastGenerated = new Date().toISOString()

      state.apiUrl = API_URL

      const headers = {
        headers: {
          'user-agent': 'Knossos generator (support@modrinth.com)',
        },
      }

      const [
        categories,
        loaders,
        gameVersions,
        donationPlatforms,
        reportTypes,
      ] = (
        await Promise.all([
          $fetch(`${API_URL}tag/category`, headers),
          $fetch(`${API_URL}tag/loader`, headers),
          $fetch(`${API_URL}tag/game_version`, headers),
          $fetch(`${API_URL}tag/donation_platform`, headers),
          $fetch(`${API_URL}tag/report_type`, headers),
        ])
      )

      state.categories = categories
      state.loaders = loaders
      state.gameVersions = gameVersions
      state.donationPlatforms = donationPlatforms
      state.reportTypes = reportTypes

      await fs.writeFile('./generated/state.json', JSON.stringify(state))

      console.log('Tags generated!')
    },
    'pages:extend' (routes) {
      routes.splice(
        routes.findIndex(x => x.name === 'search'),
        1
      )

      routes.push({
        name: 'search',
        path: '/search',
        file: resolve(__dirname, 'pages/search.vue'),
        children: [
          {
            name: 'mods',
            path: '/mods',
            file: resolve(__dirname, 'pages/search/mods.vue'),
            children: [],
          },
          {
            name: 'modpacks',
            path: '/modpacks',
            file: resolve(__dirname, 'pages/search/modpacks.vue'),
            children: [],
          },
          {
            name: 'plugins',
            path: '/plugins',
            file: resolve(__dirname, 'pages/search/plugins.vue'),
            children: [],
          },
          {
            name: 'resourcepacks',
            path: '/resourcepacks',
            file: resolve(__dirname, 'pages/search/resourcepacks.vue'),
            children: [],
          },
          {
            name: 'shaders',
            path: '/shaders',
            file: resolve(__dirname, 'pages/search/shaders.vue'),
            children: [],
          },
          {
            name: 'datapacks',
            path: '/datapacks',
            file: resolve(__dirname, 'pages/search/datapacks.vue'),
            children: [],
          },
        ],
      })
    }
  }
})

function getApiUrl () {
  return process.env.BROWSER_BASE_URL ?? STAGING_API_URL
}

// function getDomain () {
//   if (process.env.NODE_ENV === 'production') {
//     if (process.env.SITE_URL) {
//       return process.env.SITE_URL
//     } else if (process.env.HEROKU_APP_NAME) {
//       return `https://${process.env.HEROKU_APP_NAME}.herokuapp.com`
//     } else if (process.env.VERCEL_URL) {
//       return `https://${process.env.VERCEL_URL}`
//     } else if (getApiUrl() === STAGING_API_URL) {
//       return 'https://staging.modrinth.com'
//     } else {
//       return 'https://modrinth.com'
//     }
//   } else {
//     return 'http://localhost:3000'
//   }
// }

// Checklist
// Add auth redirects
// Global loading bar style
// Figure out app config (env variables and stuff) and fix authUrl
// Analytics on nuxt hooks + middleware
// Fix perf issues on changelog/version page (maybe use functional components)
// Migrate search to asyncData/SSR
// Possibly make auth + userdata fetch not block rendering
// Move fileutils out of a nuxt plugin
// Create new notif system
// Figure out tooltip styling
// Fix 404 page
