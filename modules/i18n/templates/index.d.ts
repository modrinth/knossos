// @ts-check

import { Import } from '@babel/types'
import { FunctionalComponentOptions } from 'vue'
import { IntlFormatAliases } from './i18n'
import { ExtendedIntlController } from './types'

interface I18nPluginHelpers {
  $i18n: ExtendedIntlController
  /** Represent a translation function. See {@link TranslateFunction} for details. */
  $t: import('./i18n.types').TranslateFunction
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
