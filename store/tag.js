import tags from '~/generated/state.json'

export const state = () => ({
  categories: tags.categories,
  loaders: tags.loaders,
  gameVersions: tags.gameVersions,
  licenses: tags.licenses,
  donationPlatforms: tags.donationPlatforms,
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
    modLoaders: ['forge', 'fabric', 'quilt', 'liteloader', 'modloader', 'rift'],
  },
})
