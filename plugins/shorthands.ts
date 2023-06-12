export default defineNuxtPlugin(async (nuxtApp) => {
  const { tags } = useTag()
  const { user, token } = useAuth()

  return {
    provide: {
      defaultHeaders: () => {
        const obj: { headers: { [key: string]: string } } = { headers: {} }

        if (process.server) {
          const config = useRuntimeConfig()
          if (config.rateLimitKey)
            obj.headers['x-ratelimit-key'] = config.rateLimitKey || ''
        }

        if (user)
          obj.headers.Authorization = token

        return obj
      },
      formatVersions: (versionsArray: string | any[]) => formatVersions(versionsArray, tags),
      external: () => {
        const cosmeticsStore = useCosmetics().value

        return cosmeticsStore.externalLinksNewTab ? '_blank' : ''
      },
      computeVersions: (versions: any[], members: any[]) => {
        const visitedVersions: any[] = []
        const returnVersions: any[] = []

        const authorMembers = {}
        const sortedVersions = versions.sort(
          (a: { date_published: any }, b: { date_published: any }) => dayjs(a.date_published).valueOf() - dayjs(b.date_published).valueOf(),
        )

        if (!sortedVersions || sortedVersions.length === 0)
          return []

        for (const version of sortedVersions) {
          if (visitedVersions.includes(version.version_number)) {
            visitedVersions.push(version.version_number)
            version.displayUrlEnding = version.id
          }
          else {
            visitedVersions.push(version.version_number)
            version.displayUrlEnding = version.version_number
          }
          version.primaryFile = version.files.find((file: { primary: any }) => file.primary) ?? version.files[0]

          if (!version.primaryFile) {
            version.primaryFile = {
              hashes: {
                sha1: '',
                sha512: '',
              },
              url: '#',
              filename: 'unknown',
              primary: false,
              size: 0,
              file_type: null,
            }
          }

          version.author = authorMembers[version.author_id]
          if (!version.author) {
            version.author = members.find((x: { user: { id: any } }) => x.user.id === version.author_id)
            authorMembers[version.author_id] = version.author
          }

          returnVersions.push(version)
        }

        return returnVersions
          .reverse()
          .map((version, index) => {
            const nextVersion = returnVersions[index + 1]
            if (nextVersion && version.changelog && nextVersion.changelog === version.changelog)
              return { duplicate: true, ...version }
            else
              return { duplicate: false, ...version }
          })
          .sort((a, b) => dayjs(b.date_published) - dayjs(a.date_published))
      },
      getProjectTypeForDisplay: (type: string, categories: any[]) => {
        if (type === 'mod') {
          const isPlugin = categories.some((category: any) => {
            return tags.loaderData.allPluginLoaders.includes(category)
          })
          const isMod = categories.some((category: any) => {
            return tags.loaderData.modLoaders.includes(category)
          })
          const isDataPack = categories.some((category: any) => {
            return tags.loaderData.dataPackLoaders.includes(category)
          })

          if (isMod && isPlugin && isDataPack)
            return 'mod, plugin, and data pack'
          else if (isMod && isPlugin)
            return 'mod and plugin'
          else if (isMod && isDataPack)
            return 'mod and datapack'
        }

        return type
      },
      getProjectTypeForUrl: (type: string, categories: any[]) => {
        if (type === 'mod') {
          const isMod = categories.some((category: any) => {
            return tags.loaderData.modLoaders.includes(category)
          })

          const isPlugin = categories.some((category: any) => {
            return tags.loaderData.allPluginLoaders.includes(category)
          })

          const isDataPack = categories.some((category: any) => {
            return tags.loaderData.dataPackLoaders.includes(category)
          })

          if (isDataPack)
            return 'datapack'
          else if (isPlugin)
            return 'plugin'
          else if (isMod)
            return 'mod'
          else
            return 'mod'
        }
        else {
          return type
        }
      },
      sortedCategories: () => {
        /*
    Only use on the complete list of versions for a project, partial lists will generate
    the wrong version slugs
  */

        if (!tags || !tags.categories || tags.categories.length === 0)
          return []

        return tags.categories.slice().sort((a: { header: string; name: string }, b: { header: string; name: string }) => {
          const headerCompare = a.header.localeCompare(b.header)
          if (headerCompare !== 0)
            return headerCompare

          if (a.header === 'resolutions' && b.header === 'resolutions') {
            return Number(a.name.replace(/\D/g, '')) - Number(b.name.replace(/\D/g, ''))
          }
          else if (a.header === 'performance impact' && b.header === 'performance impact') {
            const x = ['potato', 'low', 'medium', 'high', 'screenshot']

            return x.indexOf(a.name) - x.indexOf(b.name)
          }
          return 0
        })
      },
    },
  }
})
