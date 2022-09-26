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

declare module 'vue/types/vue' {
  interface Vue extends I18nPluginHelpers {}
}
