export default ({ store }, inject) => {
  inject('user', store.state.user)
  inject('tag', store.state.tag)
  inject('auth', store.state.auth)
  inject('defaultHeaders', () => {
    const obj = { headers: {} }

    if (process.server && process.env.RATE_LIMIT_IGNORE_KEY) {
      obj.headers['x-ratelimit-key'] = process.env.RATE_LIMIT_IGNORE_KEY || ''
    }

    if (store.state.auth.user) {
      obj.headers.Authorization = store.state.auth.token
    }

    return obj
  })
  inject('formatNumber', formatNumber)
  inject('formatVersion', (versionArray) => {
    const allVersions = store.state.tag.gameVersions.slice().reverse()
    const allReleases = allVersions.filter((x) => x.version_type === 'release')

    const intervals = []
    let currentInterval = 0

    for (let i = 0; i < versionArray.length; i++) {
      const index = allVersions.findIndex((x) => x.version === versionArray[i])
      const releaseIndex = allReleases.findIndex(
        (x) => x.version === versionArray[i]
      )

      if (i === 0) {
        intervals.push([[versionArray[i], index, releaseIndex]])
      } else {
        const intervalBase = intervals[currentInterval]

        if (
          (index - intervalBase[intervalBase.length - 1][1] === 1 ||
            releaseIndex - intervalBase[intervalBase.length - 1][2] === 1) &&
          (allVersions[intervalBase[0][1]].version_type === 'release' ||
            allVersions[index].version_type !== 'release')
        ) {
          intervalBase[1] = [versionArray[i], index, releaseIndex]
        } else {
          currentInterval += 1
          intervals[currentInterval] = [[versionArray[i], index, releaseIndex]]
        }
      }
    }

    const newIntervals = []
    for (let i = 0; i < intervals.length; i++) {
      const interval = intervals[i]

      if (
        interval.length === 2 &&
        interval[0][2] !== -1 &&
        interval[1][2] === -1
      ) {
        let lastSnapshot = null
        for (let j = interval[1][1]; j > interval[0][1]; j--) {
          if (allVersions[j].version_type === 'release') {
            newIntervals.push([
              interval[0],
              [
                allVersions[j].version,
                j,
                allReleases.findIndex(
                  (x) => x.version === allVersions[j].version
                ),
              ],
            ])

            if (lastSnapshot !== null && lastSnapshot !== j + 1) {
              newIntervals.push([
                [allVersions[lastSnapshot].version, lastSnapshot, -1],
                interval[1],
              ])
            } else {
              newIntervals.push([interval[1]])
            }

            break
          } else {
            lastSnapshot = j
          }
        }
      } else {
        newIntervals.push(interval)
      }
    }

    const output = []

    for (const interval of newIntervals) {
      if (interval.length === 2) {
        output.push(`${interval[0][0]}—${interval[1][0]}`)
      } else {
        output.push(interval[0][0])
      }
    }

    return output.join(', ')
  })
  inject('formatBytes', formatBytes)
  inject('formatCategory', formatCategory)
  inject('formatCategoryHeader', formatCategoryHeader)
  inject('getProjectTypeForDisplay', (type, categories) => {
    if (type === 'mod') {
      const isPlugin = categories.some((category) => {
        return store.state.tag.loaderData.allPluginLoaders.includes(category)
      })
      const isMod = categories.some((category) => {
        return store.state.tag.loaderData.modLoaders.includes(category)
      })
      return isPlugin && isMod ? 'mod/plugin' : isPlugin ? 'plugin' : 'mod'
    } else {
      return type
    }
  })
}

export const formatNumber = (number) => {
  const x = +number
  if (x >= 1000000) {
    return (x / 1000000).toFixed(2).toString() + 'M'
  } else if (x >= 10000) {
    return (x / 1000).toFixed(1).toString() + 'K'
  } else {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
}

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const formatCategory = (name) => {
  if (name === 'modloader') {
    return "Risugami's ModLoader"
  } else if (name === 'bungeecord') {
    return 'BungeeCord'
  } else if (name === 'liteloader') {
    return 'LiteLoader'
  } else if (name === 'game-mechanics') {
    return 'Game Mechanics'
  } else if (name === 'worldgen') {
    return 'World Generation'
  } else if (name === 'core-shaders') {
    return 'Core Shaders'
  } else if (name === 'gui') {
    return 'GUI'
  } else if (name === '8x-') {
    return '8x or lower'
  } else if (name === '512x+') {
    return '512x or higher'
  } else if (name === 'kitchen-sink') {
    return 'Kitchen Sink'
  }
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export const formatCategoryHeader = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1)
}
