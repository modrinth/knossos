export const getProjectTypeForUrl = (type, categories) => {
  const app = useNuxtApp()
  return getProjectTypeForUrlShorthand(app, type, categories)
}

export const getProjectTypeForUrlShorthand = (app, type, categories) => {
  if (type === 'mod') {
    const isMod = categories.some((category) => {
      return app.$tag.loaderData.modLoaders.includes(category)
    })

    const isPlugin = categories.some((category) => {
      return app.$tag.loaderData.allPluginLoaders.includes(category)
    })

    const isDataPack = categories.some((category) => {
      return app.$tag.loaderData.dataPackLoaders.includes(category)
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

export const getProjectLink = (project) => {
  return `/${getProjectTypeForUrl(project.project_type, project.loaders)}/${
    project.slug ? project.slug : project.id
  }`
}

export const getVersionLink = (project, version) => {
  return getProjectLink(project) + '/version/' + version.id
}
