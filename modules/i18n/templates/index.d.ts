// @ts-check

import { IntlFormatAliases, TranslateFunction } from './i18n'
import { ExtendedIntlController } from './plugin.main'

interface I18nPluginHelpers {
  $i18n: ExtendedIntlController
  $t: TranslateFunction
  $fmt: IntlFormatAliases
}

declare module '@nuxt/types' {
  interface Context extends I18nPluginHelpers {}
}

type I18nPluginVueHelpers = I18nPluginHelpers & {
  $i18nHead: import('./plugin.head').I18nHeadFunction
}

declare module 'vue/types/vue' {
  interface Vue extends I18nPluginVueHelpers {}
}
