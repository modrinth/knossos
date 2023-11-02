<script setup>
import { Card, CompactChart, formatMoney, formatNumber } from 'omorphia'
import Chart from "~/components/ui/charts/Chart.vue";
import dayjs from "dayjs";
import Chips from "~/components/ui/Chips.vue";

const auth = await useAuth()
const projects = ref(await useBaseFetch(`user/${auth.value.user.id}/projects`))

onMounted(async () => {
  await initUserProjects()
})

const analyticsData = ref({
  downloads: projects.value.reduce((acc, project) => acc + project.downloads, 0),
  pageViews: 0,
  revenue: 0,
})

const selectedDataType = ref('Downloads')
const finishedLoading = ref(false)
const chart = ref(null)
let downloadData, viewData, revenueData, monthlyRevenue, viewDownloadRatio, countryData

const RGBToHSL = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const l = Math.max(r, g, b);
  const s = l - Math.min(r, g, b);
  const h = s
      ? l === r
          ? (g - b) / s
          : l === g
              ? 2 + (b - r) / s
              : 4 + (r - g) / s
      : 0;
  return [
    60 * h < 0 ? 60 * h + 360 : 60 * h,
    100,
    50,
  ];
};

const HSLToRGB = (h, s, l) => {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [255 * f(0), 255 * f(8), 255 * f(4)];
};

const intToRgba = (int) => {
  const r = (int >> 16) & 255
  const g = (int >> 8) & 255
  const b = int & 255

  const vibrant = RGBToHSL(r, g, b)
  const final = HSLToRGB(vibrant[0], vibrant[1], vibrant[2])

  return `rgba(${final[0]}, ${final[1]}, ${final[2]}, 1)`
}

const processData = (analytics, accumulate) => {
  const totalData = new Map()
  const projectSet = new Set()
  const projectData = new Map()

  for (const [project, trueData] of Object.entries(analytics)) {
    projectSet.add(project)
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

  const sortedData = new Map([...totalData.entries()].sort((a, b) => a[0] - b[0]))

  sortedData.forEach((value) => {
    projectSet.forEach((project) => {
      if (!value.has(project)) {
        value.set(project, 0)
      }
    })
    for (const [project, data] of value.entries()) {
      const parsedData = Math.round(parseFloat(data) * 100) / 100
        accumulate(parsedData)
      if (projectData.has(project)) {
        const retrievedMap = projectData.get(project)
        retrievedMap.push(parsedData)
        projectData.set(project, retrievedMap)
      } else {
        projectData.set(project, [parsedData])
      }
    }
  })

  const finalData = {
    labels: [...sortedData.keys()].map((key) => dayjs.unix(key).format('YYYY-MM-DD')),
    data: [],
    colors: []
  }

  for (const project of projectSet) {
    finalData.data.push({
      name: projects.value.find((proj) => proj.id === project).title,
      data: projectData.get(project),
    })

    finalData.colors.push(intToRgba(projects.value.find((proj) => proj.id === project).color))
  }

  return finalData
}

const body = `start_date=${new Date(new Date() - 90 * 24 * 60 * 60 * 1000).toISOString()}`
try {
  ;[
    { data: downloadData },
    { data: viewData },
    { data: revenueData },
    { data: monthlyRevenue },
    { data: viewDownloadRatio },
    { data: countryData },
  ] = await Promise.all([
    useAsyncData(`analytics/downloads?${body}`, () => useBaseFetch(`analytics/downloads?${body}`), {
      transform: (data) => processData(data, (value) => value),
    }),
    useAsyncData(`analytics/views?${body}`, () => useBaseFetch(`analytics/views?${body}`), {
      transform: (data) => processData(data, (value) => analyticsData.value.pageViews += value),
    }),
    useAsyncData(`analytics/revenue?${body}`, () => useBaseFetch(`analytics/revenue?${body}`), {
      transform: (data) => processData(data, (value) => analyticsData.value.revenue += value),
    }),
    useAsyncData(`analytics/revenue?${body}`, () => useBaseFetch(`analytics/revenue?start_date=${new Date(new Date() - 2 * 180 * 24 * 60 * 60 * 1000).toISOString()}&resolution_minutes=43200`), {
      transform: (data) => processData(data, (value) => {}),
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
              name: key,
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
              name: key,
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

watch(selectedDataType.value, () => {
  chart.value.resetChart()
})
</script>

<template>
  <div class="spark-charts">

  </div>
  <Card v-if="finishedLoading" class="line-charts">
    <client-only>
      <Chart
        ref="chart"
        type="line"
        name="Download data"
        :data="selectedDataType === 'Downloads' ? downloadData.data : selectedDataType === 'Page views' ? viewData.data : revenueData.data"
        :labels="selectedDataType === 'Downloads' ? downloadData.labels : selectedDataType === 'Page views' ? viewData.labels : revenueData.labels"
        :colors="selectedDataType === 'Downloads' ? downloadData.colors : selectedDataType === 'Page views' ? viewData.colors : revenueData.colors"
        :suffix=" selectedDataType === 'Page views' ?
        `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/><circle cx='12' cy='12' r='3'/></svg>`
        : selectedDataType === 'Downloads' ? `<svg xmlns='http://www.w3.org/2000/svg' class='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' /></svg>`
        : ''
        "
        :is-money="selectedDataType === 'Revenue'"
      >
          <Chips :items="['Downloads', 'Page views', 'Revenue']" v-model="selectedDataType" class="chart-chips"/>
      </Chart>
    </client-only>
  </Card>
  <BrandLogoAnimated v-else />
  <Card>
    <client-only>
      <Chart
        type="bar"
        name="Monthly revenue"
        :format-labels="(date) => dayjs(date).format('MMM YYYY')"
        :data="monthlyRevenue.data"
        :labels="monthlyRevenue.labels"
        :colors="monthlyRevenue.colors"
        stacked
        is-money
      />
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
