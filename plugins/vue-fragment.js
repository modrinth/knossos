// @ts-check
/* eslint-disable vue/require-prop-types */

import Vue from 'vue'

Vue.use({
  install(vue) {
    vue.component('Fragment', {
      functional: true,
      props: {
        of: {
          default: undefined,
          required: false,
        },
      },
      render(_, { props, children }) {
        return props.of ?? children ?? []
      },
    })
  },
})
