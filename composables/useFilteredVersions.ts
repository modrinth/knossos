import { Ref } from 'vue'

interface Version {
  game_versions: any[]
  loaders: any[]
  version_type: any
}

export default (unfilteredVersions: Ref<Version[]> | Version[], onQueryChange: () => void) => {
  const route = useRoute()

  watch(
    () => `${route.query.g}, ${route.query.l}, ${route.query.c}`,
    (_) => onQueryChange()
  )

  return computed((): Version[] => {
    let filteredVersions = unref(unfilteredVersions)

    const selectedGameVersions = arrayFromQuery(route.query.g)
    if (selectedGameVersions.length > 0) {
      filteredVersions = filteredVersions.filter(v => intersection(selectedGameVersions, v.game_versions).length > 0)
    }

    const selectedLoaders = arrayFromQuery(route.query.l)
    if (selectedLoaders.length > 0) {
      filteredVersions = filteredVersions.filter((v) => intersection(selectedLoaders, v.loaders).length > 0)
    }

    const selectedVersionTypes = arrayFromQuery(route.query.c)
    if (selectedVersionTypes.length > 0) {
      filteredVersions = filteredVersions.filter((v) => selectedVersionTypes.includes(v.version_type))
    }

    return filteredVersions
  })
}
