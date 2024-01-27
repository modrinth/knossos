import type { NitroFetchOptions } from 'nitropack'

export default defineNuxtPlugin(async () => {
  const runtimeConfig = useRuntimeConfig()

  const requestOptions: NitroFetchOptions<any, 'get'> = {
    baseURL: runtimeConfig.public.apiBaseUrl,
  }

  if (import.meta.server) {
    requestOptions.headers = {
      'User-Agent': 'Knossos Server (support@modrinth.com)',
      'X-Ratelimit-Key': runtimeConfig.rateLimitKey,
    }
  }

  const { data: tags } = await useAsyncData('tags', async () => {
    const [categories, loaders, gameVersions, donationPlatforms, reportTypes] = await Promise.all([
      $fetch(`tag/category`, requestOptions),
      $fetch(`tag/loader`, requestOptions),
      $fetch(`tag/game_version`, requestOptions),
      $fetch(`tag/donation_platform`, requestOptions),
      $fetch(`tag/report_type`, requestOptions),
    ])

    return {
      categories,
      loaders,
      gameVersions,
      donationPlatforms,
      reportTypes,
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
    }
  })

  return {
    provide: {
      tags,
    },
  }
})
