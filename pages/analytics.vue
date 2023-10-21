<script setup>
import { Card, LineChart, PieChart, BarChart, formatMoney, formatNumber } from 'omorphia'

const auth = await useAuth()
const projects = ref(await useBaseFetch(`user/${auth.value.user.id}/projects`))

onMounted(async () => {
  await initUserProjects()
})

const analyticsData = ref({
  downloads: 0,
  pageViews: 0,
  revenue: 0,
})

const selectedDataType = ref('downloads')
const finishedLoading = ref(false)
let downloadData, viewData, revenueData, viewDownloadRatio, countryData

const select = (type) => {
  selectedDataType.value = type
}

const body = `project_ids=${JSON.stringify(projects.value.map((project) => project.id))}`
try {
  ;[
    { data: downloadData },
    { data: viewData },
    { data: revenueData },
    { data: viewDownloadRatio },
    { data: countryData },
  ] = await Promise.all([
    useAsyncData(`analytics/downloads?${body}`, () => useBaseFetch(`analytics/downloads?${body}`), {
      transform: (analytics) => {
        const totalData = new Map()
        const projects = new Set()
        const projectData = new Map()

        for (const [project, trueData] of Object.entries(analytics)) {
          projects.add(project)
          for (const [key, value] of Object.entries(trueData)) {
            if (totalData.has(key)) {
              const retrievedMap = totalData.get(key)
              retrievedMap.set(project, value)
              totalData.set(key, retrievedMap)
            } else {
              totalData.set(key, new Map([[project, value]]))
            }
          }
        }

        totalData.forEach((value, key) => {
          projects.forEach((project) => {
            if (!value.has(project)) {
              value.set(project, 0)
            }
          })
          for (const [project, data] of value.entries()) {
            if (projectData.has(project)) {
              const retrievedMap = projectData.get(project)
              retrievedMap.push(data)
              projectData.set(project, retrievedMap)
            } else {
              projectData.set(project, [data])
            }
          }
        })

        const finalData = {
          labels: [...totalData.keys()],
          data: [],
        }

        for (const project of projects) {
          finalData.data.push({
            title: project,
            color: 0x00af5c,
            data: projectData.get(project), // Convert Map to Object
          })
        }

        return finalData
      },
    }),
    useAsyncData(`analytics/views?${body}`, () => useBaseFetch(`analytics/views?${body}`), {
      transform: (analytics) => {
        const totalData = new Map()
        const projects = new Set()
        const projectData = new Map()

        for (const [project, trueData] of Object.entries(analytics)) {
          projects.add(project)
          for (const [key, value] of Object.entries(trueData)) {
            if (totalData.has(key)) {
              const retrievedMap = totalData.get(key)
              retrievedMap.set(project, value)
              analyticsData.pageViews += value
              totalData.set(key, retrievedMap)
            } else {
              totalData.set(key, new Map([[project, value]]))
            }
          }
        }

        totalData.forEach((value, key) => {
          projects.forEach((project) => {
            if (!value.has(project)) {
              value.set(project, 0)
            }
          })
          for (const [project, data] of value.entries()) {
            if (projectData.has(project)) {
              const retrievedMap = projectData.get(project)
              retrievedMap.push(data)
              projectData.set(project, retrievedMap)
            } else {
              projectData.set(project, [data])
            }
          }
        })

        const finalData = {
          labels: [...totalData.keys()],
          data: [],
        }

        for (const project of projects) {
          finalData.data.push({
            title: project,
            color: 0x00af5c,
            data: projectData.get(project), // Convert Map to Object
          })
        }

        return finalData
      },
    }),
    useAsyncData(`analytics/revenue?${body}`, () => useBaseFetch(`analytics/revenue?${body}`), {
      transform: (analytics) => {
        const totalData = new Map()
        const projects = new Set()
        const projectData = new Map()

        for (const [project, trueData] of Object.entries(analytics)) {
          projects.add(project)
          for (const [key, value] of Object.entries(trueData)) {
            if (totalData.has(key)) {
              const retrievedMap = totalData.get(key)
              retrievedMap.set(project, value)
              analyticsData.revenue = analyticsData.revenue + value
              totalData.set(key, retrievedMap)
            } else {
              totalData.set(key, new Map([[project, value]]))
            }
          }
        }

        totalData.forEach((value, key) => {
          projects.forEach((project) => {
            if (!value.has(project)) {
              value.set(project, 0)
            }
          })
          for (const [project, data] of value.entries()) {
            if (projectData.has(project)) {
              const retrievedMap = projectData.get(project)
              retrievedMap.push(data)
              projectData.set(project, retrievedMap)
            } else {
              projectData.set(project, [data])
            }
          }
        })

        const finalData = {
          labels: [...totalData.keys()],
          data: [],
        }

        for (const project of projects) {
          finalData.data.push({
            title: project,
            color: 0x00af5c,
            data: projectData.get(project), // Convert Map to Object
          })
        }

        return finalData
      },
    }),
    useAsyncData(
      `analytics/countries/views?${body}`,
      () => useBaseFetch(`analytics/countries/views?${body}`),
      {
        transform: (analytics) => {
          const countryMap = new Map()
          for (const rawData of Object.values(analytics)) {
            for (const [key, data] of Object.entries(rawData)) {
              if (countryMap.has(key)) {
                countryMap.set(key, countryMap.get(key) + data)
              } else {
                countryMap.set(key, data)
              }
            }
          }

          return {
            title: 'Downloads',
            data: [...countryMap.entries()].map(([key, data]) => ({
              title: key,
              color: 0x00af5c,
              data,
            })),
          }
        },
      }
    ),
    useAsyncData(
      `analytics/countries/downloads?${body}`,
      () => useBaseFetch(`analytics/countries/downloads?${body}`),
      {
        transform: (analytics) => {
          const countryMap = new Map()
          for (const rawData of Object.values(analytics)) {
            for (const [key, data] of Object.entries(rawData)) {
              if (countryMap.has(key)) {
                countryMap.set(key, countryMap.get(key) + data)
              } else {
                countryMap.set(key, data)
              }
            }
          }

          return {
            title: 'Downloads',
            data: [...countryMap.entries()].map(([key, data]) => ({
              title: key,
              color: 0x00af5c,
              data,
            })),
          }
        },
      }
    ),
  ])
} catch (err) {
  data.$notify({
    group: 'main',
    title: 'An error occurred',
    text: err,
    type: 'error',
  })
} finally {
  finishedLoading.value = true
}
</script>

<template>
  <Card class="data-card">
    <div class="tabs">
      <div
        class="data-point button-base"
        :class="{ selected: selectedDataType === 'downloads' }"
        @click="select('downloads')"
      >
        <div class="data-point__title">Total downloads</div>
        <div class="data-point__value">
          {{ analyticsData.downloads }}
        </div>
      </div>
      <div
        class="data-point button-base"
        :class="{ selected: selectedDataType === 'pageViews' }"
        @click="select('pageViews')"
      >
        <div class="data-point__title">Total page views</div>
        <div class="data-point__value">
          {{ formatNumber(analyticsData.pageViews) }}
        </div>
      </div>
      <div
        class="data-point button-base"
        :class="{ selected: selectedDataType === 'revenue' }"
        @click="select('revenue')"
      >
        <div class="data-point__title">Total revenue</div>
        <div class="data-point__value">
          {{ formatMoney(analyticsData.revenue) }}
        </div>
      </div>
    </div>
    <div class="line-chart">
      <client-only>
        <LineChart v-if="selectedDataType === 'downloads'" :data="downloadData" />
      </client-only>
      <client-only>
        <LineChart v-if="selectedDataType === 'pageViews'" :data="viewData" />
      </client-only>
      <client-only>
        <LineChart v-if="selectedDataType === 'revenue'" :data="revenueData" />
      </client-only>
      <client-only>
        <LineChart v-if="selectedDataType === 'followers'" :data="followersData" />
      </client-only>
    </div>
  </Card>
  <Card class="pie-charts">
    <div class="relative-chart">
      <div class="title">View to download ratio</div>
      <client-only>
        <PieChart class="chart" :data="viewDownloadRatio" />
      </client-only>
    </div>
    <div class="relative-chart">
      <div class="title">Country data</div>
      <client-only>
        <PieChart class="chart" :data="countryData" />
      </client-only>
    </div>
  </Card>
  <Card class="download-data">
    <div class="title">Monthly downloads</div>
    <client-only>
      <BarChart class="bar-graph" :data="downloadData" />
    </client-only>
  </Card>
</template>

<style scoped lang="scss">
.data-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: var(--color-raised-bg);
  width: 100%;
  padding: var(--gap-lg);
}

.tabs {
  display: flex;
  flex-direction: row;
  width: 100%;
  overflow: hidden;
}

.data-point {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem;
  width: 100%;
  background-color: var(--color-raised-bg);
  gap: var(--gap-sm);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;

  &__title {
    color: var(--color-heading);
    font-weight: bold;
    font-size: 1rem;
  }

  &__value {
    color: var(--color-text-dark);
    font-weight: bold;
    font-size: 2rem;
  }

  &:first-child {
    border-top-left-radius: var(--radius-lg);
  }

  &:last-child {
    border-top-right-radius: var(--radius-lg);
  }

  &.selected {
    box-shadow: inset 0 -3px 0 0 var(--color-brand);
    background-color: var(--color-bg);
  }
}

.line-chart {
  width: 100%;
  background-color: var(--color-bg);
  padding: var(--gap-xl);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
}

.pie-charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--gap-lg);
  width: 100%;
  padding: var(--gap-xl);

  .chart {
    width: 100% !important;
    height: calc(100% - 8rem) !important;
    border-radius: var(--radius-lg);
    background-color: var(--color-bg);
    padding: var(--gap-xl);
    object-fit: cover;
  }

  .relative-chart {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--gap-md);
    margin: -3rem 0;
  }

  .title {
    color: var(--color-heading);
    font-weight: bold;
    font-size: var(--font-size-lg);
  }
}

.bar-graph {
  width: 100%;
  padding: var(--gap-xl);
  background-color: var(--color-bg);
  border-radius: var(--radius-lg);
}

.download-data {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: var(--gap-xl);
  gap: var(--gap-lg);

  .title {
    color: var(--color-heading);
    font-weight: bold;
    font-size: var(--font-size-lg);
  }
}
</style>
