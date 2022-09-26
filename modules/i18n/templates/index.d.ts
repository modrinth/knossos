import { IntlFormatAliases, TranslateFunction } from './i18n'
import { ExtendedIntlController } from './plugin.main'

interface I18nPluginHelpers {
  $i18n: ExtendedIntlController
  $t: TranslateFunction
  $fmt: IntlFormatAliases
}

interface I18nPluginVueHelpers {
  $i18nHead: import('./plugin.head').I18nHeadFunction
}

declare module '@nuxt/types' {
  interface Context extends I18nPluginHelpers {}
}

declare module 'vue/types/vue' {
  interface Vue extends I18nPluginHelper, I18nPluginVueHelpers {}
}
