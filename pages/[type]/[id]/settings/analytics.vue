<template>
  <div>
    <h2>Analytics</h2>

    <div class="markdown-body">
      <p>
        This page shows you the analytics for your project, <strong>{{ project.title }}</strong
        >. You can see the number of downloads, page views and revenue earned for your project, as
        well as the total downloads and page views for {{ project.title }} by country.
      </p>
    </div>

    <div v-if="analyticsData.error.value">
      <div>{{ analyticsData.error }}</div>
    </div>

    <div v-else>
      <div class="graphs">
        <div class="graphs__vertical-bar">
          <client-only>
            <CompactChart
              v-if="analyticsData.formattedData.value.downloads"
              ref="tinyDownloadChart"
              :title="`Downloads since ${dayjs(startDate).format('MMM D, YYYY')}`"
              color="var(--color-brand)"
              :value="formatNumber(analyticsData.formattedData.value.downloads.sum, false)"
              :data="analyticsData.formattedData.value.downloads.chart.data"
              :labels="analyticsData.formattedData.value.downloads.chart.labels"
              suffix="<svg xmlns='http://www.w3.org/2000/svg' class='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' /></svg>"
              :class="`clickable button-base ${
                selectedChart === 'downloads' ? 'button-base__selected' : ''
              }`"
              :onclick="() => (selectedChart = 'downloads')"
              role="button"
            />
          </client-only>
          <client-only>
            <CompactChart
              v-if="analyticsData.formattedData.value.views"
              ref="tinyViewChart"
              :title="`Page views since ${dayjs(startDate).format('MMM D, YYYY')}`"
              color="var(--color-blue)"
              :value="formatNumber(analyticsData.formattedData.value.views.sum, false)"
              :data="analyticsData.formattedData.value.views.chart.data"
              :labels="analyticsData.formattedData.value.views.chart.labels"
              suffix="<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/><circle cx='12' cy='12' r='3'/></svg>"
              :class="`clickable button-base ${
                selectedChart === 'views' ? 'button-base__selected' : ''
              }`"
              :onclick="() => (selectedChart = 'views')"
              role="button"
            />
          </client-only>
          <client-only>
            <CompactChart
              v-if="analyticsData.formattedData.value.revenue"
              ref="tinyRevenueChart"
              :title="`Revenue since ${dayjs(startDate).format('MMM D, YYYY')}`"
              color="var(--color-purple)"
              :value="formatMoney(analyticsData.formattedData.value.revenue.sum, false)"
              :data="analyticsData.formattedData.value.revenue.chart.data"
              :labels="analyticsData.formattedData.value.revenue.chart.labels"
              is-money
              :class="`clickable button-base ${
                selectedChart === 'revenue' ? 'button-base__selected' : ''
              }`"
              :onclick="() => (selectedChart = 'revenue')"
              role="button"
            />
          </client-only>
        </div>
        <div class="graphs__main-graph">
          <Card>
            <div class="graphs__main-graph-control">
              <DropdownSelect
                v-model="selectedRange"
                :options="[
                  { label: 'Last 30 minutes', value: 30, selectedRes: 5 },
                  { label: 'Last hour', value: 60, selectedRes: 5 },
                  { label: 'Last 12 hours', value: 720, selectedRes: 30 },
                  { label: 'Last day', value: 1440, selectedRes: 60 },
                  { label: 'Last week', value: 10080, selectedRes: 720 },
                  { label: 'Last month', value: 43200, selectedRes: 1440 },
                  { label: 'Last quarter', value: 129600, selectedRes: 10080 },
                  { label: 'Last year', value: 525600, selectedRes: 10080 },
                ]"
                :display-name="(o) => o.label"
              />
              <DropdownSelect
                v-model="selectedResolution"
                :options="[
                  { label: '5 minutes', value: 5 },
                  { label: '30 minutes', value: 30 },
                  { label: 'An hour', value: 60 },
                  { label: '12 hours', value: 720 },
                  { label: 'A day', value: 1440 },
                  { label: 'A week', value: 10080 },
                ]"
                :display-name="(o) => o.label"
              />
            </div>
            <client-only>
              <Chart
                v-if="analyticsData.formattedData.value.downloads && selectedChart === 'downloads'"
                ref="downloadsChart"
                type="line"
                name="Download data"
                :data="analyticsData.formattedData.value.downloads.chart.data"
                :labels="analyticsData.formattedData.value.downloads.chart.labels"
                :colors="['var(--color-brand)']"
                suffix="<svg xmlns='http://www.w3.org/2000/svg' class='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' /></svg>"
                legend-position="right"
              >
                <h2>Downloads</h2>
              </Chart>
              <Chart
                v-if="analyticsData.formattedData.value.views && selectedChart === 'views'"
                ref="viewsChart"
                type="line"
                name="View data"
                :data="analyticsData.formattedData.value.views.chart.data"
                :labels="analyticsData.formattedData.value.views.chart.labels"
                :colors="['var(--color-blue)']"
                suffix="<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/><circle cx='12' cy='12' r='3'/></svg>"
                legend-position="right"
              >
                <h2 class="">Views</h2>
              </Chart>
              <Chart
                v-if="analyticsData.formattedData.value.revenue && selectedChart === 'revenue'"
                ref="revenueChart"
                type="line"
                name="Revenue data"
                :data="analyticsData.formattedData.value.revenue.chart.data"
                :labels="analyticsData.formattedData.value.revenue.chart.labels"
                :colors="['var(--color-purple)']"
                suffix="<svg xmlns='http://www.w3.org/2000/svg' class='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' /></svg>"
                legend-position="right"
              >
                <h2 class="">Revenue</h2>
              </Chart>
            </client-only>
          </Card>
          <div class="country-data">
            <Card
              v-if="
                analyticsData.formattedData.value?.downloadsByCountry &&
                selectedChart === 'downloads'
              "
              class="country-downloads"
            >
              <label>
                <span class="label__title">Downloads by country</span>
              </label>
              <div class="country-values">
                <div
                  v-for="[name, count] in analyticsData.formattedData.value.downloadsByCountry.data"
                  :key="name"
                  class="country-value"
                >
                  <div class="country-flag-container">
                    <img
                      :src="`https://flagcdn.com/h240/${name.toLowerCase()}.png`"
                      :alt="name"
                      class="country-flag"
                    />
                  </div>
                  <div class="country-text">
                    <strong class="country-name">{{ countryCodeToName(name) }}</strong>
                    <span class="data-point">{{ formatNumber(count) }}</span>
                  </div>
                  <div
                    v-tooltip="
                      formatPercent(count, analyticsData.formattedData.value.downloadsByCountry.sum)
                    "
                    class="percentage-bar"
                  >
                    <span
                      :style="{
                        width: formatPercent(
                          count,
                          analyticsData.formattedData.value.downloadsByCountry.sum
                        ),
                        backgroundColor: 'var(--color-brand)',
                      }"
                    ></span>
                  </div>
                </div>
              </div>
            </Card>
            <Card
              v-if="analyticsData.formattedData.value?.viewsByCountry && selectedChart === 'views'"
              class="country-downloads"
            >
              <label>
                <span class="label__title">Page views by country</span>
              </label>
              <div class="country-values">
                <div
                  v-for="[name, count] in analyticsData.formattedData.value.viewsByCountry.data"
                  :key="name"
                  class="country-value"
                >
                  <div class="country-flag-container">
                    <img
                      :src="`https://flagcdn.com/h240/${name.toLowerCase()}.png`"
                      :alt="name"
                      class="country-flag"
                    />
                  </div>

                  <div class="country-text">
                    <strong class="country-name">{{ countryCodeToName(name) }}</strong>
                    <span class="data-point">{{ formatNumber(count) }}</span>
                  </div>
                  <div
                    v-tooltip="
                      `${
                        Math.round(
                          (count / analyticsData.formattedData.value.viewsByCountry.sum) * 10000
                        ) / 100
                      }%`
                    "
                    class="percentage-bar"
                  >
                    <span
                      :style="{
                        width: `${
                          (count / analyticsData.formattedData.value.viewsByCountry.sum) * 100
                        }%`,
                        backgroundColor: 'var(--color-blue)',
                      }"
                    ></span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
    <div>
      <pre><code>{{ analyticsData }}</code></pre>
    </div>
  </div>
</template>

<script setup>
import { Card, formatMoney, formatNumber, DropdownSelect } from 'omorphia'
import dayjs from 'dayjs'
import { countryCodeToName, formatPercent, useFetchAllAnalytics } from '~/composables/analytics'

import Chart from '~/components/ui/charts/Chart.vue'
import CompactChart from '~/components/ui/charts/CompactChart.vue'

const props = defineProps({
  project: {
    type: Object,
    default() {
      return {}
    },
  },
})

const selectedChart = ref('downloads')

const downloadsChart = ref(null)
const viewsChart = ref(null)
const revenueChart = ref(null)

const tinyDownloadChart = ref(null)
const tinyViewChart = ref(null)
const tinyRevenueChart = ref(null)

const remountCharts = () => {
  // On reset we need to reset the charts bc they don't remount properly
  downloadsChart.value?.resetChart()
  viewsChart.value?.resetChart()
  revenueChart.value?.resetChart()

  tinyDownloadChart.value?.resetChart()
  tinyViewChart.value?.resetChart()
  tinyRevenueChart.value?.resetChart()
}

const analyticsData = useFetchAllAnalytics(remountCharts, [props.project.id])
const { startDate, endDate, timeRange, timeResolution } = analyticsData

const selectedResolution = computed({
  get: () => {
    const item = [
      { label: '5 minutes', value: 5 },
      { label: '30 minutes', value: 30 },
      { label: 'An hour', value: 60 },
      { label: '12 hours', value: 720 },
      { label: 'A day', value: 1440 },
      { label: 'A week', value: 10080 },
    ].find((option) => option.value === timeResolution.value)
    return item || { label: 'Custom', value: timeResolution.value }
  },
  set: (newRes) => (timeResolution.value = newRes.value),
})

const selectedRange = computed({
  get: () => {
    const item = [
      { label: 'Last 30 minutes', value: 30 },
      { label: 'Last hour', value: 60 },
      { label: 'Last 12 hours', value: 720 },
      { label: 'Last day', value: 1440 },
      { label: 'Last week', value: 10080 },
      { label: 'Last month', value: 43200 },
      { label: 'Last quarter', value: 129600 },
      { label: 'Last year', value: 525600 },
    ].find((option) => option.value === timeRange.value)
    return item || { label: 'Custom', value: timeRange.value }
  },
  set: (newRange) => {
    timeRange.value = newRange.value
    startDate.value = Date.now() - timeRange.value * 60 * 1000
    endDate.value = Date.now()
    selectedResolution.value = {
      value: newRange.selectedRes,
    }
  },
})
</script>

<style scoped lang="scss">
.button-base__selected {
  overflow: hidden;
  color: var(--color-contrast);
  background-color: var(--color-brand-highlight);
  box-shadow: inset 0 0 0 transparent, 0 0 0 2px var(--color-brand);

  &:hover {
    background-color: var(--color-brand-highlight);
  }
}

.graphs {
  // Pages clip so we need to add a margin
  margin-left: 0.25rem;

  display: flex;
  flex-direction: row;
  gap: var(--gap-md);

  .graphs__vertical-bar {
    // Take up 1/3 of the width
    flex-grow: 0;
    flex-shrink: 0;
    max-width: 16rem;

    display: flex;
    flex-direction: column;
  }

  .graphs__main-graph {
    // Take up the rest of the width
    flex-grow: 1;

    display: grid;
    grid-template-columns: 1fr;

    .graphs__main-graph-control {
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      justify-content: end;
      margin-bottom: var(--gap-md);
      gap: var(--gap-md);

      .animated-dropdown {
        width: auto;
      }
    }
  }
}

// Mobile
@media (max-width: 768px) {
  .graphs {
    flex-direction: column;
    gap: var(--gap-md);

    .graphs__vertical-bar {
      display: block;

      width: 100%;
      max-width: none;
    }

    .graphs__main-graph {
      display: block;
      overflow: hidden;
    }
  }
}

.country-flag-container {
  width: 40px;
  height: 27px;

  display: flex;
  justify-content: center;
  align-items: center;

  overflow: hidden;

  border: 1px solid var(--color-divider);
  border-radius: var(--radius-xs);
}

.country-flag {
  object-fit: cover;

  min-width: 100%;
  min-height: 100%;
}

.spark-data {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--gap-md);
}

.country-data {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--gap-md);
}

.country-values {
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-button-bg);
  gap: var(--gap-md);
  padding: var(--gap-md);
  margin-top: var(--gap-md);
  overflow-y: auto;
  max-height: 24rem;
}

.country-value {
  display: grid;
  grid-template-areas: 'flag text bar';
  grid-template-columns: auto 1fr 10rem;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: var(--gap-sm);

  .country-text {
    grid-area: text;
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }
  .percentage-bar {
    grid-area: bar;
    width: 100%;
    height: 1rem;
    background-color: var(--color-raised-bg);
    border: 1px solid var(--color-button-bg);
    border-radius: var(--radius-sm);
    overflow: hidden;
    span {
      display: block;
      height: 100%;
    }
  }
}

@media (max-width: 768px) {
  .country-data {
    display: block;
  }

  .country-value {
    grid-template-columns: auto 1fr 5rem;
  }
}

.markdown-body {
  margin-bottom: var(--gap-md);
}
</style>
