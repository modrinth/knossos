import tags from '~/generated/state.json'

export const useTags = () =>
  useState('tags', () => ({
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
      pluginLoaders: ['bukkit', 'spigot', 'paper', 'purpur', 'sponge', 'folia'],
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
        'folia',
      ],
      dataPackLoaders: ['datapack'],
      modLoaders: ['forge', 'fabric', 'quilt', 'liteloader', 'modloader', 'rift', 'neoforge'],
    },
    projectViewModes: ['list', 'grid', 'gallery'],
    approvedStatuses: ['approved', 'archived', 'unlisted', 'private'],
    rejectedStatuses: ['rejected', 'withheld'],
    staffRoles: ['moderator', 'admin'],
  }))

export const sortedCategories = () => {
  const tagStore = useTags()

  return tagStore.value.categories.slice().sort((a, b) => {
    const headerCompare = a.header.localeCompare(b.header)
    if (headerCompare !== 0) {
      return headerCompare
    }
    if (a.header === 'resolutions' && b.header === 'resolutions') {
      return a.name.replace(/\D/g, '') - b.name.replace(/\D/g, '')
    } else if (a.header === 'performance impact' && b.header === 'performance impact') {
      const x = ['potato', 'low', 'medium', 'high', 'screenshot']

      return x.indexOf(a.name) - x.indexOf(b.name)
    }
    return 0
  })
}
