import dayjs from 'dayjs'

export const getProjectTypeForUrl = (type, categories, overrideTags) => {
  const tags = overrideTags ?? useTags().value

  if (type === 'mod') {
    const isMod = categories.some((category) => {
      return tags.loaderData.modLoaders.includes(category)
    })

    const isPlugin = categories.some((category) => {
      return tags.loaderData.allPluginLoaders.includes(category)
    })

    const isDataPack = categories.some((category) => {
      return tags.loaderData.dataPackLoaders.includes(category)
    })

    if (isDataPack) {
      return 'datapack'
    } else if (isPlugin) {
      return 'plugin'
    } else if (isMod) {
      return 'mod'
    } else {
      return 'mod'
    }
  } else {
    return type
  }
}

export const getProjectTypeForDisplay = (type, categories, overrideTags) => {
  const tags = overrideTags ?? useTags().value

  if (type === 'mod') {
    const isPlugin = categories.some((category) => {
      return tags.loaderData.allPluginLoaders.includes(category)
    })
    const isMod = categories.some((category) => {
      return tags.loaderData.modLoaders.includes(category)
    })
    const isDataPack = categories.some((category) => {
      return tags.loaderData.dataPackLoaders.includes(category)
    })

    if (isMod && isPlugin && isDataPack) {
      return 'mod, plugin, and data pack'
    } else if (isMod && isPlugin) {
      return 'mod and plugin'
    } else if (isMod && isDataPack) {
      return 'mod and data pack'
    } else if (isPlugin && isDataPack) {
      return 'plugin and data pack'
    } else if (isDataPack) {
      return 'data pack'
    } else if (isPlugin) {
      return 'plugin'
    }
  }

  return type
}

/*
  Only use on the complete list of versions for a project, partial lists will generate
  the wrong version slugs
*/
export const computeVersions = (versions, members) => {
  const visitedVersions = []
  const returnVersions = []

  const authorMembers = {}

  for (const version of versions.sort(
    (a, b) => dayjs(a.date_published) - dayjs(b.date_published)
  )) {
    if (visitedVersions.includes(version.version_number)) {
      visitedVersions.push(version.version_number)
      version.displayUrlEnding = version.id
    } else {
      visitedVersions.push(version.version_number)
      version.displayUrlEnding = version.version_number
    }
    version.primaryFile = version.files.find((file) => file.primary) ?? version.files[0]

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
      version.author = members.find((x) => x.user.id === version.author_id)
      authorMembers[version.author_id] = version.author
    }

    returnVersions.push(version)
  }

  return returnVersions
    .reverse()
    .map((version, index) => {
      const nextVersion = returnVersions[index + 1]
      if (nextVersion && version.changelog && nextVersion.changelog === version.changelog) {
        return { duplicate: true, ...version }
      } else {
        return { duplicate: false, ...version }
      }
    })
    .sort((a, b) => dayjs(b.date_published) - dayjs(a.date_published))
}
