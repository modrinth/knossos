<script setup>
import { Card, formatMoney, formatNumber } from 'omorphia'
import Chart from "~/components/ui/charts/Chart.vue";
import CompactChart from "~/components/ui/charts/CompactChart.vue";
import dayjs from "dayjs";

const props = defineProps({
  project: {
    type: Object,
    default() {
      return {}
    },
  },
})

const totalData = ref({
  downloads: 0,
  pageViews: 0,
  revenue: 0,
})

const sparkData = new Map()
const labels = ref([])
const downloadData = ref({})
const viewData = ref({})
const revenueData = ref({})
let monthlyRevenue

const selectedDataType = ref('downloads')
const finishedLoading = ref(false)
const body = `project_ids=["${props.project.id}"]`

onMounted(async () => {
  try {
    await Promise.all([
      useAsyncData(`analytics/downloads?${body}`, () => useBaseFetch(`analytics/downloads?${body}&start_date=${new Date(new Date() - 30 * 24 * 60 * 60 * 1000).toISOString()}`), {
        transform: (analytics) => {
          for (const trueData of Object.values(analytics)) {
            for (const [key, value] of Object.entries(trueData)) {
              const parsedData = Math.round(parseFloat(value) * 100) / 100
              totalData.value.downloads = totalData.value.downloads + parsedData
              if (sparkData.has(key)) {
                sparkData.get(key).downloads = parsedData
              } else {
                sparkData.set(key, { views: 0, revenue: 0, downloads: parsedData })
              }
            }
          }
        },
      }),
      useAsyncData(`analytics/views?${body}`, () => useBaseFetch(`analytics/views?${body}&start_date=${new Date(new Date() - 30 * 24 * 60 * 60 * 1000).toISOString()}`), {
        transform: (analytics) => {
          for (const trueData of Object.values(analytics)) {
            for (const [key, value] of Object.entries(trueData)) {
              const parsedData = parseInt(value)
              totalData.value.pageViews = totalData.value.pageViews + parsedData
              if (sparkData.has(key)) {
                sparkData.get(key).views = parsedData
              } else {
                sparkData.set(key, { views: parsedData, revenue: 0, downloads: 0 })
              }
            }
          }
        },
      }),
      useAsyncData(`analytics/revenue?${body}`, () => useBaseFetch(`analytics/revenue?${body}&start_date=${new Date(new Date() - 30 * 24 * 60 * 60 * 1000).toISOString()}`), {
        transform: (analytics) => {
          for (const trueData of Object.values(analytics)) {
            for (const [key, value] of Object.entries(trueData)) {
              const parsedData = Math.round(parseFloat(value) * 100) / 100
              totalData.value.revenue = totalData.value.revenue + parsedData
              if (sparkData.has(key)) {
                sparkData.get(key).revenue = parsedData
              } else {
                sparkData.set(key, { views: 0, revenue: parsedData, downloads: 0 })
              }
            }
          }
        },
      }),
    ])
    const monthlyLink = `analytics/revenue?${body}&resolution_minutes=43200&start_date=${new Date(new Date() - 2 * 180 * 24 * 60 * 60 * 1000).toISOString()}`
    ;[{ data: monthlyRevenue }] = await Promise.all([
      useAsyncData(monthlyLink, () => useBaseFetch(monthlyLink), {
        transform: (analytics) => {
          const labels = []
          const revData = []
          for (const trueData of Object.values(analytics)) {
            for (const [key, value] of Object.entries(trueData)) {
              const parsedData = Math.round(parseFloat(value) * 100) / 100
              labels.push(dayjs.unix(key).format('YYYY-MM-DD'))
              revData.push(parsedData)
            }
          }
          return {
            labels,
            data: [{
              name: 'Revenue',
              data: revData,
            }]
          }
        },
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
    const sortedSparkData = new Map([...sparkData.entries()].sort((a, b) => a[0] - b[0]));

    labels.value = [...sortedSparkData.keys()].map((key) => dayjs.unix(key).format('YYYY-MM-DD'));

    downloadData.value = {
      name: 'Downloads',
      data: [...sortedSparkData.values()].map((data) => data.downloads)
    };

    viewData.value = {
      name: 'Page views',
      data: [...sortedSparkData.values()].map((data) => data.views)
    };

    revenueData.value = {
      name: 'Revenue',
      data: [...sortedSparkData.values()].map((data) => data.revenue)
    };

    finishedLoading.value = true
  }
})

const select = (type) => {
  selectedDataType.value = type
}
</script>

<template>
  <div v-if="finishedLoading" class="spark-data">
    <client-only>
      <CompactChart
        v-if="finishedLoading"
        title="Biweekly Downloads"
        color="var(--color-brand)"
        :value="formatNumber(totalData.downloads, false)"
        :data="[downloadData]"
        :labels="labels"
        suffix="<svg xmlns='http://www.w3.org/2000/svg' class='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' /></svg>"
      />
    </client-only>
    <client-only>
      <CompactChart
        v-if="finishedLoading"
        title="Biweekly Page Views"
        color="var(--color-blue)"
        :value="formatNumber(totalData.pageViews, false)"
        :data="[viewData]"
        :labels="labels"
        suffix="<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/><circle cx='12' cy='12' r='3'/></svg>"
      />
    </client-only>
    <client-only>
      <CompactChart
        v-if="finishedLoading"
        title="Biweekly Revenue"
        color="var(--color-purple)"
        :value="formatMoney(totalData.revenue, false)"
        :data="[revenueData]"
        :labels="labels"
        is-money
      />
    </client-only>
  </div>
  <Card v-if="finishedLoading">
    <client-only>
      <Chart
        type="bar"
        name="Project data"
        :data="[downloadData, revenueData, viewData]"
        :labels="labels"
        :colors="['var(--color-brand)', 'var(--color-purple)', 'var(--color-blue)']"
        hide-total
      >
        <h2 class="sidebar-card-header">Daily analytics</h2>
      </Chart>
    </client-only>
  </Card>
  <Card v-if="finishedLoading">
    <client-only>
      <Chart
          type="area"
          name="Project revenue"
          :data="monthlyRevenue.data"
          :labels="monthlyRevenue.labels"
          :format-labels="(date) => dayjs(date).format('MMM YYYY')"
          :colors="['var(--color-purple)']"
          is-money
          hide-total
          hide-legend
          percent-stacked
          disable-animations
      >
        <h2 class="sidebar-card-header">Monthly revenue</h2>
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

.line-chart {
  width: 100%;
  background-color: var(--color-bg);
  padding: var(--gap-xl);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
}

.bar-graph {
  width: 100%;
  background-color: var(--color-bg);
  padding: var(--gap-xl);
  border-radius: var(--radius-lg);
}

.spark-data {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--gap-md);
}
</style>
