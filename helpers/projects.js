export const getProjectTypeForUrl = (type, categories) => {
  return getProjectTypeForUrlShorthand(type, categories)
}

export const getProjectTypeForUrlShorthand = (type, categories, overrideTags) => {
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
