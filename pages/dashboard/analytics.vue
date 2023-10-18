<script setup>
import { Card, LineChart, PieChart, BarChart, formatMoney, formatNumber } from 'omorphia'

const project = ref({
  downloads: formatNumber(1000),
  pageViews: formatNumber(1000),
  revenue: formatMoney(100),
  followers: formatNumber(1000),
})

const selectedDataType = ref('downloads')

const downloadData = ref({
  labels: [
    '2022-01-10',
    '2022-01-11',
    '2022-01-12',
    '2022-01-13',
    '2022-01-14',
    '2022-01-15',
    '2022-01-16',
    '2022-01-17',
    '2022-01-18',
    '2022-01-19',
    '2022-01-20',
    '2022-01-21',
    '2022-01-22',
    '2022-01-23',
    '2022-01-24',
    '2022-01-25',
  ],
  data: [
    {
      title: 'Downloads',
      color: 0x00af5c,
      data: [65, 59, 80, 81, 56, 55, 12, 32, 45, 76, 25, 99, 90, 112, 12, 134],
    },
  ],
})

const viewData = ref({
  labels: [
    '2022-01-10',
    '2022-01-11',
    '2022-01-12',
    '2022-01-13',
    '2022-01-14',
    '2022-01-15',
    '2022-01-16',
    '2022-01-17',
    '2022-01-18',
    '2022-01-19',
    '2022-01-20',
    '2022-01-21',
    '2022-01-22',
    '2022-01-23',
    '2022-01-24',
    '2022-01-25',
  ],
  data: [
    {
      title: 'Page views',
      color: 0x00af5c,
      data: [65, 59, 80, 81, 56, 55, 12, 32, 45, 76, 25, 99, 90, 112, 12, 134],
    },
  ],
})

const revenueData = ref({
  labels: [
    '2022-01-10',
    '2022-01-11',
    '2022-01-12',
    '2022-01-13',
    '2022-01-14',
    '2022-01-15',
    '2022-01-16',
    '2022-01-17',
    '2022-01-18',
    '2022-01-19',
    '2022-01-20',
    '2022-01-21',
    '2022-01-22',
    '2022-01-23',
    '2022-01-24',
    '2022-01-25',
  ],
  data: [
    {
      title: 'Revenue',
      color: 0x00af5c,
      data: [65, 59, 80, 81, 56, 55, 12, 32, 45, 76, 25, 99, 90, 112, 12, 134],
    },
  ],
})

const followersData = ref({
  labels: [
    '2022-01-10',
    '2022-01-11',
    '2022-01-12',
    '2022-01-13',
    '2022-01-14',
    '2022-01-15',
    '2022-01-16',
    '2022-01-17',
    '2022-01-18',
    '2022-01-19',
    '2022-01-20',
    '2022-01-21',
    '2022-01-22',
    '2022-01-23',
    '2022-01-24',
    '2022-01-25',
  ],
  data: [
    {
      title: 'Followers',
      color: 0x00af5c,
      data: [65, 59, 80, 81, 56, 55, 12, 32, 45, 76, 25, 99, 90, 112, 12, 134],
    },
  ],
})

const select = (type) => {
  selectedDataType.value = type
}

const viewDownloadRatio = ref({
  title: 'View to download ratio',
  data: [
    {
      title: 'Downloads',
      color: 0x00af5c,
      data: 120,
    },
    {
      title: 'Page Views',
      color: 0x00af5c,
      data: 100,
    },
  ],
})

const countryData = ref({
  title: 'Countries',
  data: [
    {
      title: 'United States',
      color: 0x00af5c,
      data: 120,
    },
    {
      title: 'United Kingdom',
      color: 0x00af5c,
      data: 100,
    },
    {
      title: 'Germany',
      color: 0x00af5c,
      data: 80,
    },
    {
      title: 'France',
      color: 0x00af5c,
      data: 60,
    },
    {
      title: 'Canada',
      color: 0x00af5c,
      data: 40,
    },
    {
      title: 'Australia',
      color: 0x00af5c,
      data: 20,
    },
  ],
})
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
          {{ project.downloads }}
        </div>
      </div>
      <div
        class="data-point button-base"
        :class="{ selected: selectedDataType === 'pageViews' }"
        @click="select('pageViews')"
      >
        <div class="data-point__title">Total page views</div>
        <div class="data-point__value">
          {{ project.pageViews }}
        </div>
      </div>
      <div
        class="data-point button-base"
        :class="{ selected: selectedDataType === 'revenue' }"
        @click="select('revenue')"
      >
        <div class="data-point__title">Total revenue</div>
        <div class="data-point__value">
          {{ project.revenue }}
        </div>
      </div>
      <div
        class="data-point button-base"
        :class="{ selected: selectedDataType === 'followers' }"
        @click="select('followers')"
      >
        <div class="data-point__title">Total followers</div>
        <div class="data-point__value">
          {{ project.followers }}
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
