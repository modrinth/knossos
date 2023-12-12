import dayjs, { unix } from 'dayjs'
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
    return {
      sum: 0,
      len: 0,
      chart: {
        labels: [],
        data: [
          {
            name: chartName,
            data: [],
          },
        ],
      },
    }
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

const sortCount = ([_a, a], [_b, b]) => b - a
const sortTimestamp = ([a], [b]) => a - b
const roundValue = ([ts, value]) => [ts, Math.round(parseFloat(value) * 100) / 100]

const processCountryAnalytics = (c, pid) => processAnalyticsByCountry(c, pid, sortCount)
const processDownloadAnalytics = (c, pid) =>
  processAnalytics(c, pid, formatTimestamp, sortTimestamp, null, 'Downloads')
const processRevAnalytics = (c, pid) =>
  processAnalytics(c, pid, formatTimestamp, sortTimestamp, roundValue, 'Revenue')

const useFetchAnalytics = (
  url,
  baseOptions = {
    apiVersion: 2,
  }
) => {
  return useBaseFetch(url, baseOptions)
}

/**
 * @param {string[] | undefined} projectIds
 * @param {undefined | () => any} onDataRefresh
 */
export const useFetchAllAnalytics = (onDataRefresh, projectIds = undefined) => {
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
    downloads: processDownloadAnalytics(downloadData.value, projectIds),
    views: processDownloadAnalytics(viewData.value, projectIds),
    revenue: processRevAnalytics(revenueData.value, projectIds),
    downloadsByCountry: processCountryAnalytics(downloadsByCountry.value, projectIds),
    viewsByCountry: processCountryAnalytics(viewsByCountry.value, projectIds),
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
    [() => startDate.value, () => endDate.value, () => timeResolution.value, () => projectIds],
    async () => {
      await fetchData({
        project_ids: JSON.stringify(projectIds?.length ? [...projectIds] : undefined),
        start_date: dayjs(startDate.value).toISOString(),
        end_date: dayjs(endDate.value).toISOString(),
        resolution_minutes: timeResolution.value,
      })

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
