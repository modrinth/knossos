import tagsJson from '~/generated/state.json'

export default () => {
  const tags = useState('tags', () => ({
    categories: tagsJson.categories,
    loaders: tagsJson.loaders,
    gameVersions: tagsJson.gameVersions,
    donationPlatforms: tagsJson.donationPlatforms,
    reportTypes: tagsJson.reportTypes,
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
      modLoaders: ['forge', 'fabric', 'quilt', 'liteloader', 'modloader', 'rift'],
    },
    projectViewModes: ['list', 'grid', 'gallery'],
    approvedStatuses: ['approved', 'archived', 'unlisted', 'private'],
    rejectedStatuses: ['rejected', 'withheld'],
    staffRoles: ['moderator', 'admin'],
  }))

  return {
    tags: tags.value,
  }
}
