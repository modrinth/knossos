<script setup>
import { Card, LineChart, PieChart, BarChart, formatMoney, formatNumber } from 'omorphia'

const props = defineProps({
  project: {
    type: Object,
    default() {
      return {}
    },
  },
})

const totalData = ref({
  downloads: formatNumber(props.project.downloads),
  pageViews: 0,
  revenue: 0,
})

const selectedDataType = ref('downloads')
const finishedLoading = ref(false)
let downloadData, viewData, revenueData, viewDownloadRatio, countryData
const body = `project_ids=["${props.project.id}"]`
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
        const labels = []
        const data = []
        for (const trueData of Object.values(analytics)) {
          for (const [key, value] of Object.entries(trueData)) {
            labels.push(key)
            data.push(value)
          }
        }
        return {
          labels,
          data: [
            {
              title: 'Downloads',
              color: 0x00af5c,
              data,
            },
          ],
        }
      },
    }),
    useAsyncData(`analytics/views?${body}`, () => useBaseFetch(`analytics/views?${body}`), {
      transform: (analytics) => {
        const labels = []
        const data = []
        for (const trueData of Object.values(analytics)) {
          for (const [key, value] of Object.entries(trueData)) {
            labels.push(key)
            data.push(value)
            totalData.value.pageViews = totalData.value.pageViews + value
          }
        }
        return {
          labels,
          data: [
            {
              title: 'Page Views',
              color: 0x00af5c,
              data,
            },
          ],
        }
      },
    }),
    useAsyncData(`analytics/revenue?${body}`, () => useBaseFetch(`analytics/revenue?${body}`), {
      transform: (analytics) => {
        const labels = []
        const data = []
        for (const trueData of Object.values(analytics)) {
          for (const [key, value] of Object.entries(trueData)) {
            labels.push(key)
            data.push(value)
            totalData.value.revenue = totalData.value.revenue + value
          }
        }
        return {
          labels,
          data: [
            {
              title: 'Revenue',
              color: 0x00af5c,
              data,
            },
          ],
        }
      },
    }),
    useAsyncData(
      `analytics/countries/views?${body}`,
      () => useBaseFetch(`analytics/countries/views?${body}`),
      {
        transform: (analytics) => {
          const finalData = {
            title: 'Views',
            data: [],
          }
          for (const rawData of Object.values(analytics)) {
            for (const [key, data] of Object.entries(rawData)) {
              finalData.data.push({
                title: key,
                color: 0x00af5c,
                data,
              })
            }
          }

          return finalData
        },
      }
    ),
    useAsyncData(
      `analytics/countries/downloads?${body}`,
      () => useBaseFetch(`analytics/countries/downloads?${body}`),
      {
        transform: (analytics) => {
          const finalData = {
            title: 'Views',
            data: [],
          }
          for (const rawData of Object.values(analytics)) {
            for (const [key, data] of Object.entries(rawData)) {
              finalData.data.push({
                title: key,
                color: 0x00af5c,
                data,
              })
            }
          }

          return finalData
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


const select = (type) => {
  selectedDataType.value = type
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
          {{ totalData.downloads }}
        </div>
      </div>
      <div
        class="data-point button-base"
        :class="{ selected: selectedDataType === 'pageViews' }"
        @click="select('pageViews')"
      >
        <div class="data-point__title">Total page views</div>
        <div class="data-point__value">
          {{ formatNumber(totalData.pageViews) }}
        </div>
      </div>
      <div
        class="data-point button-base"
        :class="{ selected: selectedDataType === 'revenue' }"
        @click="select('revenue')"
      >
        <div class="data-point__title">Total revenue</div>
        <div class="data-point__value">
          {{ formatNumber(totalData.revenue) }}
        </div>
      </div>
    </div>
    <div v-if="finishedLoading" class="line-chart">
      <client-only>
        <LineChart v-if="selectedDataType === 'downloads'" :data="downloadData" />
      </client-only>
      <client-only>
        <LineChart v-if="selectedDataType === 'pageViews'" :data="viewData" />
      </client-only>
      <client-only>
        <LineChart v-if="selectedDataType === 'revenue'" :data="revenueData" />
      </client-only>
    </div>
  </Card>
  <Card v-if="finishedLoading" class="pie-charts">
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
  }

  .title {
    color: var(--color-heading);
    font-weight: bold;
    font-size: var(--font-size-lg);
  }
}

.bar-graph {
  width: 100%;
  background-color: var(--color-bg);
  padding: var(--gap-xl);
  border-radius: var(--radius-lg);
}
</style>
