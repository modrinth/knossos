import { defineStore } from 'pinia'

export const useCosmeticsStore = defineStore('cosmetics', {
  state: () => ({
    searchLayout: false,
    projectLayout: false,
    modpacksAlphaNotice: true,
    advancedRendering: true,
    externalLinksNewTab: true,
    searchDisplayMode: {
      mod: 'list',
      plugin: 'list',
      resourcepack: 'gallery',
      modpack: 'list',
      shader: 'gallery',
      datapack: 'list',
      user: 'list',
    },
  }),
  actions: {
    fetchCosmetics(cookies) {
      // commit(
      //     'SET_PROJECT_LAYOUT',
      //     $cookies.get('project-layout') ?? defaults.projectLayout
      // )
      // commit(
      //     'SET_SEARCH_LAYOUT',
      //     $cookies.get('search-layout') ?? defaults.searchLayout
      // )
      // commit(
      //     'SET_MODPACKS_ALPHA_NOTICE',
      //     $cookies.get('modpacks-alpha-notice') ?? defaults.modpacksAlphaNotice
      // )
      // commit(
      //     'SET_ADVANCED_RENDERING',
      //     $cookies.get('advanced-rendering') ?? defaults.advancedRendering
      // )
      // commit(
      //     'SET_EXTERNAL_LINKS_NEW_TAB',
      //     $cookies.get('external-links-new-tab') ?? defaults.externalLinksNewTab
      // )
      // Object.keys(defaults.searchDisplayMode).forEach((projectType) => {
      //   commit('SET_SEARCH_DISPLAY_MODE', {
      //     projectType,
      //     mode:
      //         $cookies.get('search-display-mode-' + projectType) ??
      //         defaults.searchDisplayMode[projectType],
      //   })
      // })
    },
    save(
      projectLayout,
      searchLayout,
      modpacksAlphaNotice,
      advancedRendering,
      externalLinksNewTab
    ) {
      this.searchLayout = searchLayout
      this.projectLayout = projectLayout
      this.modpacksAlphaNotice = modpacksAlphaNotice
      this.advancedRendering = advancedRendering
      this.externalLinksNewTab = externalLinksNewTab

      // $cookies.set('project-layout', projectLayout, parameters)
      // $cookies.set('search-layout', searchLayout, parameters)
      // $cookies.set('modpacks-alpha-notice', modpacksAlphaNotice, parameters)
      // $cookies.set('advanced-rendering', advancedRendering, parameters)
      // $cookies.set('external-links-new-tab', externalLinksNewTab, parameters)
    },
    saveSearchDisplayMode(projectType, mode) {
      this.searchDisplayMode[projectType] = mode

      //$cookies.set('search-display-mode-' + projectType, mode, parameters)
    },
  },
})
