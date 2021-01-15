export default {
  head: {
    title: 'knossos',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  css: ['./assets/styles/global.scss'],

  plugins: [],

  components: true,

  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/color-mode',
    '@nuxtjs/stylelint-module',
    '@nuxtjs/style-resources',
    '@nuxtjs/svg',
  ],

  modules: [],

  build: {},

  styleResources: {
    scss: './assets/styles/dev/*.scss',
  },
}
