import tags from '~/generated/state.json'
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('tag', {
    categories: tags.categories,
    loaders: tags.loaders,
    gameVersions: tags.gameVersions,
    donationPlatforms: tags.donationPlatforms,
    reportTypes: tags.reportTypes,
    projectTypes: [
      {
        actual: 'mod',
        id: 'mod',
        display: 'mod',
      },
      {
        actual: 'mod',
        id: 'plugin',
        display: 'plugin',
      },
      {
        actual: 'mod',
        id: 'datapack',
        display: 'data pack',
      },
      {
        actual: 'shader',
        id: 'shader',
        display: 'shader',
      },
      {
        actual: 'resourcepack',
        id: 'resourcepack',
        display: 'resource pack',
      },
      {
        actual: 'modpack',
        id: 'modpack',
        display: 'modpack',
      },
    ],
    loaderData: {
      pluginLoaders: ['bukkit', 'spigot', 'paper', 'purpur', 'sponge'],
      pluginPlatformLoaders: ['bungeecord', 'waterfall', 'velocity'],
      allPluginLoaders: [
        'bukkit',
        'spigot',
        'paper',
        'purpur',
        'sponge',
        'bungeecord',
        'waterfall',
        'velocity',
      ],
      dataPackLoaders: ['datapack'],
      modLoaders: [
        'forge',
        'fabric',
        'quilt',
        'liteloader',
        'modloader',
        'rift',
      ],
    },
    projectViewModes: ['list', 'grid', 'gallery'],
    approvedStatuses: ['approved', 'archived', 'unlisted', 'private'],
  })

  nuxtApp.provide('cosmetics', {
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
  })
})
