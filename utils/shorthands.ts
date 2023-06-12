export function orElse(first: any, otherwise: any) {
  return first ?? otherwise
}

export function formatNumber(number: string | number, abbreviate = true) {
  const x = +number
  if (x >= 1000000 && abbreviate)
    return `${(x / 1000000).toFixed(2).toString()}M`
  else if (x >= 10000 && abbreviate)
    return `${(x / 1000).toFixed(1).toString()}k`
  else
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function formatMoney(number: number, abbreviate = false) {
  number = Math.floor(number * 100) / 100
  const x = +number
  if (x >= 1000000 && abbreviate) {
    return `$${(x / 1000000).toFixed(2).toString()}M`
  }
  else if (x >= 10000 && abbreviate) {
    return `$${(x / 1000).toFixed(2).toString()}k`
  }
  else {
    return (
      `$${
      x
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
    )
  }
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0)
    return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
}

export function capitalizeString(name: string) {
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : name
}

export function formatWallet(name: string) {
  if (name === 'paypal')
    return 'PayPal'

  return capitalizeString(name)
}

export function formatProjectType(name: string) {
  if (name === 'resourcepack')
    return 'Resource Pack'
  else if (name === 'datapack')
    return 'Data Pack'

  return capitalizeString(name)
}

export function formatCategory(name: string) {
  if (name === 'modloader')
    return 'Risugami\'s ModLoader'
  else if (name === 'bungeecord')
    return 'BungeeCord'
  else if (name === 'liteloader')
    return 'LiteLoader'
  else if (name === 'game-mechanics')
    return 'Game Mechanics'
  else if (name === 'worldgen')
    return 'World Generation'
  else if (name === 'core-shaders')
    return 'Core Shaders'
  else if (name === 'gui')
    return 'GUI'
  else if (name === '8x-')
    return '8x or lower'
  else if (name === '512x+')
    return '512x or higher'
  else if (name === 'kitchen-sink')
    return 'Kitchen Sink'
  else if (name === 'path-tracing')
    return 'Path Tracing'
  else if (name === 'pbr')
    return 'PBR'
  else if (name === 'datapack')
    return 'Data Pack'
  else if (name === 'colored-lighting')
    return 'Colored Lighting'
  else if (name === 'optifine')
    return 'OptiFine'

  return capitalizeString(name)
}

export function formatCategoryHeader(name: any) {
  return capitalizeString(name)
}

export function formatProjectStatus(name: string) {
  if (name === 'approved')
    return 'Listed'
  else if (name === 'processing')
    return 'Under review'

  return capitalizeString(name)
}

export function formatVersions(versionArray: string | any[], tag: { gameVersions: any[] }) {
  const allVersions = tag.gameVersions.slice().reverse()
  const allReleases = allVersions.filter((x: { version_type: string }) => x.version_type === 'release')

  const intervals = []
  let currentInterval = 0

  const versions = Array.isArray(versionArray) ? versionArray : [versionArray] // Handle both string and array input

  for (let i = 0; i < versions.length; i++) {
    const index = allVersions.findIndex((x: { version: any }) => x.version === versions[i])
    const releaseIndex = allReleases.findIndex((x: { version: any }) => x.version === versions[i])

    if (i === 0) {
      intervals.push([[versions[i], index, releaseIndex]])
    }
    else {
      const intervalBase = intervals[currentInterval]

      if (
        (index - intervalBase[intervalBase.length - 1][1] === 1
          || releaseIndex - intervalBase[intervalBase.length - 1][2] === 1)
        && (allVersions[intervalBase[0][1]].version_type === 'release'
          || allVersions[index].version_type !== 'release')
      ) {
        intervalBase[1] = [versions[i], index, releaseIndex]
      }
      else {
        currentInterval += 1
        intervals[currentInterval] = [[versions[i], index, releaseIndex]]
      }
    }
  }

  const newIntervals = []
  for (let i = 0; i < intervals.length; i++) {
    const interval = intervals[i]

    if (interval.length === 2 && interval[0][2] !== -1 && interval[1][2] === -1) {
      let lastSnapshot = null
      for (let j = interval[1][1]; j > interval[0][1]; j--) {
        if (allVersions[j].version_type === 'release') {
          newIntervals.push([
            interval[0],
            [
              allVersions[j].version,
              j,
              allReleases.findIndex((x: { version: any }) => x.version === allVersions[j].version),
            ],
          ])

          if (lastSnapshot !== null && lastSnapshot !== j + 1)
            newIntervals.push([[allVersions[lastSnapshot].version, lastSnapshot, -1], interval[1]])
          else
            newIntervals.push([interval[1]])

          break
        }
        else {
          lastSnapshot = j
        }
      }
    }
    else {
      newIntervals.push(interval)
    }
  }

  const output: string[] = []

  for (const interval of newIntervals) {
    if (interval.length === 2)
      output.push(`${interval[0][0]}—${interval[1][0]}`)
    else
      output.push(interval[0][0])
  }

  return (output.length === 0 ? versions : output).join(', ')
}

export function cycleValue(value: any, values: string | any[]) {
  const index = values.indexOf(value) + 1
  return values[index % values.length]
}
