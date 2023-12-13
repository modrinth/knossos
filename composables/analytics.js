import dayjs from 'dayjs'
import { all } from 'iso-3166-1'

const { unix } = dayjs

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

const RGBToHSL = (r, g, b) => {
  r /= 255
  g /= 255
  b /= 255
  const l = Math.max(r, g, b)
  const s = l - Math.min(r, g, b)
  const h = s ? (l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s) : 0
  return [60 * h < 0 ? 60 * h + 360 : 60 * h, 60, 50]
}

const HSLToRGB = (h, s, l) => {
  s /= 100
  l /= 100
  const k = (n) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return [255 * f(0), 255 * f(8), 255 * f(4)]
}

const stringToHash = (string) => {
  let hash = 0
  for (let i = 0; i < string.length; i++) {
    const char = string.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

const adjustHue = (hue, amount) => {
  return (hue + amount) % 360
}

const intToRgba = (int, pid = 'Unknown') => {
  const r = (int >> 16) & 255
  const g = (int >> 8) & 255
  const b = int & 255

  const vibrant = RGBToHSL(r, g, b)
  const hash = stringToHash(pid)
  const adjustedHue = adjustHue(vibrant[0], hash % 45)

  const final = HSLToRGB(adjustedHue, vibrant[1], vibrant[2])
  return `rgba(${final[0]}, ${final[1]}, ${final[2]}, 1)`
}

const emptyAnalytics = {
  sum: 0,
  len: 0,
  chart: {
    labels: [],
    data: [],
    sumData: [
      {
        name: '',
        data: [],
      },
    ],
    colors: [],
  },
}

export const processAnalytics = (category, projects, labelFn, sortFn, mapFn, chartName) => {
  if (!category || !projects) {
    return emptyAnalytics
  }

  // Get an intersection of category keys and project ids
  const projectIds = projects.map((p) => p.id)
  const loadedProjectIds = Object.keys(category).filter((id) => projectIds.includes(id))

  if (!loadedProjectIds?.length) {
    return emptyAnalytics
  }

  const loadedProjectData = loadedProjectIds.map((id) => category[id])

  // Convert each project's data into a list of [unix_ts_str, number] pairs
  // Sort, label&map
  const projectData = loadedProjectData
    .map((data) => Object.entries(data))
    .map((data) => data.sort(sortFn))
    .map((data) => (mapFn ? data.map(mapFn) : data))

  // Each project may not include the same timestamps, so we should use the union of all timestamps
  const timestamps = Array.from(
    new Set(projectData.flatMap((data) => data.map(([ts]) => ts)))
  ).sort()

  return {
    // The total count of all the values across all projects
    sum: projectData.reduce((acc, cur) => acc + cur.reduce((a, c) => a + c[1], 0), 0),
    len: timestamps.length,
    chart: {
      labels: timestamps.map(labelFn),
      data: projectData.map((data, i) => {
        const project = projects.find((p) => p.id === loadedProjectIds[i])
        if (!project) {
          throw new Error(`Project ${loadedProjectIds[i]} not found`)
        }

        return {
          name: `${project.title}`,
          data: timestamps.map((ts) => {
            const entry = data.find(([ets]) => ets === ts)
            return entry ? entry[1] : 0
          }),
        }
      }),
      sumData: [
        {
          name: chartName,
          data: timestamps.map((ts) => {
            const entries = projectData.flat().filter(([ets]) => ets === ts)
            return entries.reduce((acc, cur) => acc + cur[1], 0)
          }),
        },
      ],
      colors: projectData.map((_, i) => {
        const project = projects.find((p) => p.id === loadedProjectIds[i])
        if (!project) {
          throw new Error(`Project ${loadedProjectIds[i]} not found`)
        }

        return project.color ? intToRgba(project.color, project.id) : '--color-brand'
      }),
    },
  }
}

export const processAnalyticsByCountry = (category, projects, sortFn) => {
  if (!category || !projects) {
    return {
      sum: 0,
      len: 0,
      data: [],
    }
  }

  // Get an intersection of category keys and project ids
  const projectIds = projects.map((p) => p.id)
  const loadedProjectIds = Object.keys(category).filter((id) => projectIds.includes(id))

  if (!loadedProjectIds?.length) {
    return {
      sum: 0,
      len: 0,
      data: [],
    }
  }

  const loadedProjectData = loadedProjectIds.map((id) => category[id])

  // Convert each project's data into a list of [countrycode, number] pairs
  // Fold into a single list with summed values for each country over all projects

  const countrySums = new Map()

  loadedProjectData.forEach((data) => {
    Object.entries(data).forEach(([country, value]) => {
      const current = countrySums.get(country) || 0
      countrySums.set(country, current + value)
    })
  })

  const entries = Array.from(countrySums.entries())

  return {
    sum: entries.reduce((acc, cur) => acc + cur[1], 0),
    len: entries.length,
    data: entries.sort(sortFn),
  }
}

const sortCount = ([_a, a], [_b, b]) => b - a
const sortTimestamp = ([a], [b]) => a - b
const roundValue = ([ts, value]) => [ts, Math.round(parseFloat(value) * 100) / 100]

const processCountryAnalytics = (c, projects) => processAnalyticsByCountry(c, projects, sortCount)
const processNumberAnalytics = (c, projects) =>
  processAnalytics(c, projects, formatTimestamp, sortTimestamp, null, 'Downloads')
const processRevAnalytics = (c, projects) =>
  processAnalytics(c, projects, formatTimestamp, sortTimestamp, roundValue, 'Revenue')

const useFetchAnalytics = (
  url,
  baseOptions = {
    apiVersion: 3,
  }
) => {
  return useBaseFetch(url, baseOptions)
}

/**
 * @param {any} projects
 * @param {undefined | () => any} onDataRefresh
 */
export const useFetchAllAnalytics = (onDataRefresh, projects = undefined) => {
  const timeResolution = ref(1440) // 1 day
  const timeRange = ref(43200) // 30 days

  const startDate = ref(Date.now() - timeRange.value * 60 * 1000)
  const endDate = ref(Date.now())

  const downloadData = ref(null)
  const viewData = ref(null)
  const revenueData = ref(null)
  const downloadsByCountry = ref(null)
  const viewsByCountry = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const formattedData = computed(() => ({
    downloads: processNumberAnalytics(downloadData.value, projects),
    views: processNumberAnalytics(viewData.value, projects),
    revenue: processRevAnalytics(revenueData.value, projects),
    downloadsByCountry: processCountryAnalytics(downloadsByCountry.value, projects),
    viewsByCountry: processCountryAnalytics(viewsByCountry.value, projects),
  }))

  const fetchData = async (query) => {
    const normalQuery = new URLSearchParams(query)

    const revQuery = new URLSearchParams(query)
    revQuery.delete('resolution_minutes')

    const qs = normalQuery.toString()
    const revQs = revQuery.toString()

    try {
      loading.value = true
      error.value = null

      const responses = await Promise.all([
        useFetchAnalytics(`analytics/downloads?${qs}`),
        useFetchAnalytics(`analytics/views?${qs}`),
        useFetchAnalytics(`analytics/revenue?${revQs}`),
        useFetchAnalytics(`analytics/countries/downloads?${qs}`),
        useFetchAnalytics(`analytics/countries/views?${qs}`),
      ])

      downloadData.value = responses[0] || {}
      viewData.value = responses[1] || {}
      revenueData.value = responses[2] || {}
      downloadsByCountry.value = responses[3] || {}
      viewsByCountry.value = responses[4] || {}
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  watch(
    [() => startDate.value, () => endDate.value, () => timeResolution.value, () => projects],
    async () => {
      const q = {
        start_date: dayjs(startDate.value).toISOString(),
        end_date: dayjs(endDate.value).toISOString(),
        resolution_minutes: timeResolution.value,
      }

      if (projects?.length) {
        q.project_ids = JSON.stringify(projects.map((p) => p.id))
      }

      await fetchData(q)

      if (onDataRefresh) {
        onDataRefresh()
      }
    },
    {
      immediate: true,
    }
  )

  return {
    // Configuration
    timeResolution,
    timeRange,

    startDate,
    endDate,

    // Data
    downloadData,
    viewData,
    revenueData,
    downloadsByCountry,
    viewsByCountry,

    // Computed state
    formattedData,
    loading,
    error,
  }
}
