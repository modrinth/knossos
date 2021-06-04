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
    middleware: ['auth', 'analytics'],
    async extendRoutes(routes, resolve) {
      const newRoutes = await generateProjectRoutes(resolve)
      newRoutes.forEach((newRoute) => routes.push(newRoute))
    },
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
    '~/plugins/user.js',
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
    // The analytics module is disabled, as we are using our own solution embedded in the middleware.
    // '~/modules/analytics',
  ],
  ads: {
    // Module options
    ghostMode: true,
    geoEdgeId: '',
  },
  robots: {
    Sitemap: 'https://modrinth.com/sitemap.xml',
  },
  sitemap: {
    exclude: ['/dashboard/**', '/dashboard', '/create/**'],
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
      plugins: [['@babel/plugin-proposal-private-methods', { loose: true }]],
    },
  },
  styleResources: {
    scss: './assets/styles/injected.scss',
  },
  loading: {
    color: 'green',
    height: '2px',
  },
  env: {
    version: process.env.VERSION_ID || 'unknown',
    domain: getDomain(),
  },
  publicRuntimeConfig: {
    axios: {
      browserBaseURL: process.env.BROWSER_BASE_URL,
    },
    ads: {
      ghostMode: process.env.ENABLE_ADS == null,
      GeoEdgeId: process.env.GEOEDGE_ID,
      networkCode: process.env.GAM_ID,
      ethicalAds: process.env.ETHICAL_ADS,
    },
    analytics: {
      base_url: process.env.ARIADNE_URL,
    },
  },
  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.BASE_URL,
    },
  },
}

function getDomain() {
  if (process.env.NODE_ENV === 'production') {
    if (process.env.HEROKU_APP_NAME) {
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

async function generateProjectRoutes(resolve) {
  const generatedRoutes = []

  const routeData = await import('./static/projectRoutes.json')
  routeData.forEach((projectType) => {
    // Create search routes
    generatedRoutes.push({
      name: projectType.search.name,
      path: '/' + projectType.search.path,
      component: resolve(__dirname, 'components/pages/search.vue'),
      props: {
        projectType: projectType.search.type,
        path: projectType.search.path,
        filters: projectType.search.filters,
      },
    })
    // Create project routes
    generatedRoutes.push({
      path: '/' + projectType.project.path + '/:id',
      component: resolve(__dirname, 'components/pages/project.vue'),
      children: [
        {
          path: 'edit',
          component: resolve(__dirname, 'components/pages/project/edit.vue'),
        },
        {
          path: 'newversion',
          component: resolve(
            __dirname,
            'components/pages/project/newversion.vue'
          ),
        },
        {
          path: 'settings',
          component: resolve(
            __dirname,
            'components/pages/project/settings.vue'
          ),
        },
        {
          path: 'version/:version',
          component: resolve(
            __dirname,
            'components/pages/project/version/_version/index.vue'
          ),
        },
        {
          path: 'version/:version/edit',
          component: resolve(
            __dirname,
            'components/pages/project/version/_version/edit.vue'
          ),
        },
        {
          path: 'versions',
          component: resolve(
            __dirname,
            'components/pages/project/versions.vue'
          ),
        },
        {
          path: '',
          component: resolve(__dirname, 'components/pages/project/index.vue'),
        },
      ],
    })
  })

  return generatedRoutes
}
