import 'vue/types/vue'
import '@nuxt/types'

type Shorthands = import('./shorthands-ts').DefinedHelpers

declare module 'vue/types/vue' {
  interface Vue extends Shorthands {}
}

declare module '@nuxt/types' {
  interface Context extends Shorthands {}
}
