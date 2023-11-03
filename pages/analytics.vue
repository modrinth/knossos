<script setup>
import { Card, formatMoney, formatNumber } from 'omorphia'
import Chart from "~/components/ui/charts/Chart.vue";
import CompactChart from "~/components/ui/charts/CompactChart.vue";
import dayjs from "dayjs";
import {countries} from "country-data";

const auth = await useAuth()
const projects = ref(await useBaseFetch(`user/${auth.value.user.id}/projects`))

const analyticsData = ref({
  downloads: 0,
  pageViews: 0,
  revenue: 0,
  longTermDownloads: 0,
  longTermPageViews: 0,
  longTermRevenue: 0,
})

const finishedLoading = ref(false)
let downloadData, viewData, revenueData, squashedDownloads, squashedViews, squashedRevenue, monthlyRevenue, squashedLongTermRevenue, squashedLongTermDownloads, squashedLongTermViews, viewCountryData, downloadCountryData

onMounted(async () => {
  await initUserProjects()
  const body = `start_date=${new Date(new Date() - 30 * 24 * 60 * 60 * 1000).toISOString()}`
  const longTerm = `start_date=${new Date(new Date().getFullYear(), 0, 1).toISOString()}&resolution_minutes=43200`

  try {
    ;[
      { data: downloadData },
      { data: viewData },
      { data: revenueData },
      { data: monthlyRevenue },
      { data: viewCountryData },
      { data: downloadCountryData },
    ] = await Promise.all([
      useAsyncData(`analytics/downloads?${body}`, () => useBaseFetch(`analytics/downloads?${body}`), {
        transform: (data) => processData(data, (value) => analyticsData.value.downloads += value, (value) => squashedDownloads = value, 'downloads'),
      }),
      useAsyncData(`analytics/views?${body}`, () => useBaseFetch(`analytics/views?${body}`), {
        transform: (data) => processData(data, (value) => analyticsData.value.pageViews += value, (value) => squashedViews = value, 'views'),
      }),
      useAsyncData(`analytics/revenue?${body}`, () => useBaseFetch(`analytics/revenue?${body}`), {
        transform: (data) => processData(data, (value) => analyticsData.value.revenue += value, (value) => squashedRevenue = value, 'revenue'),
      }),
      useAsyncData(`analytics/revenue?${longTerm}`, () => useBaseFetch(`analytics/revenue?${longTerm}`), {
        transform: (data) => processData(data, (value) => analyticsData.value.longTermRevenue += value, (value) => squashedLongTermRevenue = value, 'revenue'),
      }),
      useAsyncData(
          `analytics/countries/views?${body}`,
          () => useBaseFetch(`analytics/countries/views?${body}`),
          {
            transform: (analytics) => processRegionData(analytics),
          }
      ),
      useAsyncData(
          `analytics/countries/downloads?${body}`,
          () => useBaseFetch(`analytics/countries/downloads?${body}`),
          {
            transform: (analytics) => processRegionData(analytics),
          }
      ),
      useAsyncData(`analytics/downloads?${longTerm}`, () => useBaseFetch(`analytics/downloads?${longTerm}`), {
        transform: (data) => processData(data, (value) => analyticsData.value.longTermDownloads += value, (value) => squashedLongTermDownloads = value, 'downloads'),
      }),
      useAsyncData(`analytics/views?${longTerm}`, () => useBaseFetch(`analytics/views?${longTerm}`), {
        transform: (data) => processData(data, (value) => analyticsData.value.longTermPageViews += value, (value) => squashedLongTermViews = value, 'views'),
      }),
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
})

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

const processData = (analytics, accumulate, squashFunction, descriptor, ignoreNormal = false) => {
  const totalData = new Map()
  const squashedData = new Map()
  const projectSet = new Set()
  const projectData = new Map()

  for (const [project, trueData] of Object.entries(analytics)) {
    projectSet.add(project)
    for (const [date, value] of Object.entries(trueData)) {
      const parsedData = Math.round(parseFloat(value) * 100) / 100
      if (totalData.has(date) && !ignoreNormal) {
        const retrievedMap = totalData.get(date)
        retrievedMap.set(project, parsedData)
        totalData.set(date, retrievedMap)
      } else {
        totalData.set(date, new Map([[project, parsedData]]))
      }

      if (squashedData.has(date)) {
        squashedData.set(date, squashedData.get(date) + parsedData)
      } else {
        squashedData.set(date, parsedData)
      }
    }
  }

  const sortedSquashedData = new Map([...squashedData.entries()].sort((a, b) => a[0] - b[0]))

  squashFunction({
    labels: [...sortedSquashedData.keys()].map((key) => dayjs.unix(key).format('YYYY-MM-DD')),
    data: [{
      name: `Total ${descriptor}`,
      data: [...sortedSquashedData.values()],
    }]
  })

  if(ignoreNormal) {
    return
  }

  const sortedData = new Map([...totalData.entries()].sort((a, b) => a[0] - b[0]))

  sortedData.forEach((value) => {
    projectSet.forEach((project) => {
      if (!value.has(project)) {
        value.set(project, 0)
      }
    })
    for (const [project, data] of value.entries()) {
      accumulate(data)
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

const countryColors = new Map()

const processRegionData = (analytics) => {
  const totalData = new Map()
  const projectSet = new Set()
  const projectData = new Map()

  for (const [project, trueData] of Object.entries(analytics)) {
    projectSet.add(project)
    for (const [country, value] of Object.entries(trueData)) {
      if (totalData.has(country)) {
        const retrievedMap = totalData.get(country)
        retrievedMap.set(project, value)
        totalData.set(country, retrievedMap)
      } else {
        totalData.set(country, new Map([[project, value]]))
      }
    }
  }

  totalData.forEach((value) => {
    projectSet.forEach((project) => {
      if (!value.has(project)) {
        value.set(project, 0)
      }
    })
    for (const [project, data] of value.entries()) {
      const parsedData = Math.round(parseFloat(data) * 100) / 100
      if (projectData.has(project)) {
        const retrievedMap = projectData.get(project)
        retrievedMap.push(parsedData)
        projectData.set(project, retrievedMap)
      } else {
        projectData.set(project, [parsedData])
      }
    }
  })

  totalData.forEach((value, key) => {
    if (!countryColors.has(key)) {
      countryColors.set(key, `hsl(${Math.random() * 360}, ${Math.random() * 30 + 70}%, ${Math.random() * 20 + 40}%)`)
    }
  })

  const finalData = {
    labels: Array.from(projectSet).map(project => projects.value.find(proj => proj.id === project).title),
    data: [],
    colors: Array.from(totalData.keys()).map(project => countryColors.get(project))
  }

  totalData.forEach((value, key) => {
    const metricData = {
      name: countries[key].name ?? key,
      data: []
    }

    finalData.labels.forEach((label, index) => {
      const project = [...projectSet][index]
      metricData.data.push(value.get(project))
    })

    finalData.data.push(metricData)
  })

  return finalData
}

</script>

<template>
  <h1>Analytics</h1>
  <div v-if="finishedLoading" class="chart-dashboard">
    <client-only>
      <CompactChart
        title="Downloads in the last 30 days"
        color="var(--color-brand)"
        :value="formatNumber(analyticsData.downloads, false)"
        :data="squashedDownloads.data"
        :labels="squashedDownloads.labels"
      />
    </client-only>
    <client-only>
      <CompactChart
        title="Page views in the last 30 days"
        color="var(--color-blue)"
        :value="formatNumber(analyticsData.pageViews, false)"
        :data="squashedViews.data"
        :labels="squashedViews.labels"
      />
    </client-only>
    <client-only>
      <CompactChart
        title="Revenue in the last 30 days"
        color="var(--color-purple)"
        :value="formatMoney(analyticsData.revenue, false)"
        :data="squashedRevenue.data"
        :labels="squashedRevenue.labels"
        is-money
      />
    </client-only>
    <client-only>
      <CompactChart
          title="Downloads since the start of the year"
          color="var(--color-brand)"
          :value="formatNumber(analyticsData.longTermDownloads, false)"
          :data="squashedLongTermDownloads.data"
          :labels="squashedLongTermDownloads.labels"
      />
    </client-only>
    <client-only>
      <CompactChart
          title="Page views since the start of the year"
          color="var(--color-blue)"
          :value="formatNumber(analyticsData.longTermPageViews, false)"
          :data="squashedLongTermViews.data"
          :labels="squashedLongTermViews.labels"
      />
    </client-only>
    <client-only>
      <CompactChart
        title="Revenue since the start of the year"
        color="var(--color-purple)"
        :value="formatMoney(analyticsData.longTermRevenue, false)"
        :data="squashedLongTermRevenue.data"
        :labels="squashedLongTermRevenue.labels"
        is-money
      />
    </client-only>
  </div>
  <Card v-if="finishedLoading">
    <client-only>
      <Chart
        type="line"
        name="Download data"
        :data="downloadData.data"
        :labels="downloadData.labels"
        :colors="downloadData.colors"
        suffix="<svg xmlns='http://www.w3.org/2000/svg' class='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' /></svg>"
        legend-position="right"
      >
        <h2 class="sidebar-card-header">Daily downloads</h2>
      </Chart>
    </client-only>
  </Card>
  <Card v-if="finishedLoading">
    <client-only>
      <Chart
        type="line"
        name="View data"
        :data="viewData.data"
        :labels="viewData.labels"
        :colors="viewData.colors"
        suffix="<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/><circle cx='12' cy='12' r='3'/></svg>"
        legend-position="right"
      >
        <h2 class="sidebar-card-header">Daily page views</h2>
      </Chart>
    </client-only>
  </Card>
  <Card v-if="finishedLoading">
    <client-only>
      <Chart
          type="line"
          name="Revenue data"
          :data="revenueData.data"
          :labels="revenueData.labels"
          :colors="revenueData.colors"
          is-money
      >
        <h2 class="sidebar-card-header">Daily revenue</h2>
      </Chart>
    </client-only>
  </Card>
  <Card v-if="finishedLoading">
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
      >
        <h2 class="sidebar-card-header">Monthly revenue</h2>
      </Chart>
    </client-only>
  </Card>
  <Card v-if="finishedLoading">
    <client-only>
      <Chart
          type="bar"
          name="Download data by country"
          :format-labels="(name) => name"
          :data="downloadCountryData.data"
          :labels="downloadCountryData.labels"
          :colors="downloadCountryData.colors"
          x-axis-type="category"
          percent-stacked
          stacked
          horizontal-bar
      >
        <h2 class="sidebar-card-header">Downloads by country</h2>
      </Chart>
    </client-only>
  </Card>
  <Card v-if="finishedLoading">
    <client-only>
      <Chart
          type="bar"
          name="View data by country"
          :format-labels="(name) => name"
          :data="viewCountryData.data"
          :labels="viewCountryData.labels"
          :colors="viewCountryData.colors"
          x-axis-type="category"
          percent-stacked
          stacked
          horizontal-bar
      >
        <h2 class="sidebar-card-header">Page views by country</h2>
      </Chart>
    </client-only>
  </Card>
  <BrandLogoAnimated v-else />
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

.chart-dashboard {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: var(--gap-lg);
  width: 100%;
}
</style>
