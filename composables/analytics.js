import { unix } from 'dayjs'
import { all } from 'iso-3166-1'

const countries = all()
  .map((entry) => ({
    [entry.alpha2]: entry.country,
  }))
  .reduce((acc, cur) => ({ ...acc, ...cur }), {})

export const countryCodeToName = (code) => {
  if (code === 'TW') return 'Taiwan'
  if (code === 'XX') return 'Unknown'
  if (countries[code]) {
    return countries[code]
  }
  return code
}

export const formatTimestamp = (timestamp) => {
  return unix(timestamp).format()
}

export const formatPercent = (value, sum) => {
  return `${((value / sum) * 100).toFixed(2)}%`
}

export const processAnalytics = (category, projectId, labelFn, sortFn, mapFn, chartName) => {
  const projectData = category?.[projectId]
  if (!projectData) {
    return null
  }

  const entries = Object.entries(projectData)
  const sortedEntries = sortFn ? entries.sort(sortFn) : entries

  const mappedEntries = mapFn ? sortedEntries.map(mapFn) : sortedEntries

  return {
    sum: mappedEntries.reduce((acc, cur) => acc + cur[1], 0),
    len: mappedEntries.length,
    chart: {
      labels: mappedEntries.map(([ts]) => labelFn(ts)),
      data: [
        {
          name: chartName,
          data: mappedEntries.map(([_, value]) => value),
        },
      ],
    },
  }
}

export const processAnalyticsByCountry = (category, projectId, sortFn) => {
  const projectData = category?.[projectId]
  if (!projectData) {
    return null
  }

  const entries = Object.entries(projectData).sort(sortFn)

  return {
    sum: entries.reduce((acc, cur) => acc + cur[1], 0),
    len: entries.length,
    data: entries,
  }
}
