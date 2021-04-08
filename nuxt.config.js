export default {
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    htmlAttrs: {
      lang: 'en',
    },
    title: 'Modrinth',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Modrinth is a mod distribution platform. Modrinth is modern, easy to use, and built for modders. Modrinth currently supports Minecraft, including Forge and Fabric mod loaders.',
      },

      { hid: 'publisher', name: 'publisher', content: 'Guavy LLC' },
      {
        hid: 'apple-mobile-web-app-title',
        name: 'apple-mobile-web-app-title',
        content: 'Modrinth',
      },
      { hid: 'theme-color', name: 'theme-color', content: '#4d9227' },
      { hid: 'color-scheme', name: 'color-scheme', content: 'light dark' },

      { hid: 'og:site_name', name: 'og:site_name', content: 'Modrinth' },
      {
        hid: 'og:description',
        name: 'og:description',
        content: 'An open source modding platform',
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content: 'Modrinth',
      },
      { hid: 'og:type', name: 'og:type', content: 'website' },
      { hid: 'og:url', name: 'og:url', content: 'https://www.modrinth.com' },
      {
        hid: 'og:image',
        name: 'og:image',
        content: 'https://cdn.modrinth.com/modrinth.png',
      },
      { hid: 'twitter:card', name: 'twitter:card', content: 'summary' },
      { hid: 'twitter:site', name: 'twitter:site', content: '@modrinth' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap',
      },
    ],
    script: [],
  },

  vue: {
    config: {
      productionTip: false,
      devtools: true,
    },
  },
  router: {
    middleware: ['auth', 'ads_tracking'],
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
    '~/plugins/compiled-markdown-directive.js',
    '~/plugins/vue-syntax.js',
    '~/plugins/auth.js',
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
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/dayjs',
    '@nuxtjs/axios',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@nuxtjs/style-resources',
    'cookie-universal-nuxt',
    '~/modules/gpt-ads',
    '~/modules/analytics',
  ],
  gptAds: {
    // Module options
    networkCode: process.env.GAM_ID,
    debug: false,
    ghostMode: process.env.ENABLE_ADS === undefined,
    geoEdgeId: process.env.GEOEDGE_ID,
  },
  analytics: {
    enabled: true,
    script_url: 'https://analytics.modrinth.com/umami.js',
    tracking_code: 'c37613de-245d-4767-90e7-ba7980a4f1a2',
  },
  robots: {
    Sitemap: 'https://modrinth.com/sitemap.xml',
  },
  sitemap: {
    exclude: ['/dashboard/**', '/dashboard', '/mod/create'],
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
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
    styleResources: {
      scss: './assets/styles/injected.scss',
    },
    html: {
      minify: {
        collapseWhitespace: true, // as @dario30186 mentioned
        removeComments: true, // 👈 add this line
      },
    },
  },
  loading: {
    color: 'green',
    height: '2px',
  },
  env: {
    version: process.env.VERSION_ID || 'unknown',
    ads: process.env.ENABLE_ADS,
    networkId: process.env.GAM_ID,
    geoEdgeId: process.env.GEOEDGE_ID,
  },
}
