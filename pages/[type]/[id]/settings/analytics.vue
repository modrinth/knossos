<template>
  <div>
    <Modal ref="customTimeModal" header="Define date range and resolution">
      <div class="modal-body universal-body">
        <label for="start-date">
          <span class="label__title">Start date</span>
        </label>
        <input id="start-date" v-model="customStartDate" type="date" />
        <label for="end-date">
          <span class="label__title">End date</span>
        </label>
        <input id="end-date" v-model="customEndDate" type="date" />
        <label for="data-resolution">
          <span class="label__title">Data resolution</span>
          <span class="label__description">
            The amount of minutes each data point represents.
            <span class="label__subdescription">
              60 = 1 hour, 1440 = 1 day, 10080 = 1 week, 43200 = 1 month
            </span>
          </span>
        </label>
        <input id="data-resolution" v-model="customTimeResolution" type="number" />
        <div class="input-group push-right">
          <Button
            color="primary"
            :disabled="!customStartDate || !customTimeResolution || !customEndDate"
            @click="applyCustomModal"
          >
            Apply
          </Button>
        </div>
      </div>
    </Modal>
    <h2>Analytics</h2>
    <div class="markdown-body">
      <p>
        This page shows you the analytics for your project, <strong>{{ project.title }}</strong
        >. You can see the number of downloads, page views and revenue earned for your project, as
        well as the total downloads and page views for {{ project.title }} by country.
      </p>
    </div>
    <PageBar v-if="finishedLoading" class="resolution-header">
      <span class="page-bar__title"><HistoryIcon /> Range</span>
      <div
        class="nav-button button-base"
        :class="{ 'router-link-exact-active': selectedResolution === 'daily' }"
        @click="() => selectResolution('daily')"
      >
        Last month
      </div>
      <div
        class="nav-button button-base"
        :class="{ 'router-link-exact-active': selectedResolution === 'weekly' }"
        @click="() => selectResolution('weekly')"
      >
        Last quarter
      </div>
      <div
        class="nav-button button-base"
        :class="{ 'router-link-exact-active': selectedResolution === 'monthly' }"
        @click="() => selectResolution('monthly')"
      >
        Last year
      </div>
      <template #right>
        <div class="nav-button button-base" @click="refetchData"><UpdatedIcon /> Refresh</div>
        <div
          class="nav-button button-base"
          :class="{ 'router-link-exact-active': selectedResolution === 'custom' }"
          @click="openCustomModal"
        >
          <CalendarClockIcon /> Custom range
        </div>
      </template>
    </PageBar>
    <div v-if="finishedLoading && !markReload" class="spark-data">
      <client-only>
        <CompactChart
          v-if="downloadData.value && downloadData.value.data && downloadData.value.labels"
          :title="`Downloads since ${dayjs(startDate).format('MMM D, YYYY')}`"
          color="var(--color-brand)"
          :value="formatNumber(totalData.downloads, false)"
          :data="downloadData.value.data"
          :labels="downloadData.value.labels"
          suffix="<svg xmlns='http://www.w3.org/2000/svg' class='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' /></svg>"
        />
      </client-only>
      <client-only>
        <CompactChart
          v-if="viewData.value && viewData.value.data && viewData.value.labels"
          :title="`Page views since ${dayjs(startDate).format('MMM D, YYYY')}`"
          color="var(--color-blue)"
          :value="formatNumber(totalData.pageViews, false)"
          :data="viewData.value.data"
          :labels="viewData.value.labels"
          suffix="<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/><circle cx='12' cy='12' r='3'/></svg>"
        />
      </client-only>
      <client-only>
        <CompactChart
          v-if="revenueData.value && revenueData.value.data && revenueData.value.labels"
          :title="`Revenue since ${dayjs(startDate).format('MMM D, YYYY')}`"
          color="var(--color-purple)"
          :value="formatMoney(totalData.revenue, false)"
          :data="revenueData.value.data"
          :labels="revenueData.value.labels"
          is-money
        />
      </client-only>
    </div>
    <div v-if="finishedLoading && !markReload" class="country-data">
      <Card v-if="downloadsByCountry.value" class="country-downloads">
        <label>
          <span class="label__title">Downloads by country</span>
        </label>
        <div class="country-values">
          <div
            v-for="country in downloadsByCountry.value.data"
            :key="country.name"
            class="country-value"
          >
            <img
              :src="`https://flagcdn.com/h240/${country.name.toLowerCase()}.png`"
              :alt="country.name"
            />
            <div class="country-text">
              <span class="country-name">{{ countryCodeToName(country.name.toUpperCase()) }}</span>
              <span class="data-point">{{ formatNumber(country.value) }}</span>
            </div>
            <div
              v-tooltip="
                `${Math.round((country.value / downloadsByCountry.value.total) * 10000) / 100}%`
              "
              class="percentage-bar"
            >
              <span
                :style="{
                  width: `${(country.value / downloadsByCountry.value.total) * 100}%`,
                  backgroundColor: 'var(--color-brand)',
                }"
              ></span>
            </div>
          </div>
        </div>
      </Card>
      <Card v-if="viewsByCountry.value" class="country-downloads">
        <label>
          <span class="label__title">Page views by country</span>
        </label>
        <div class="country-values">
          <div
            v-for="country in viewsByCountry.value.data"
            :key="country.name"
            class="country-value"
          >
            <img
              :src="`https://flagcdn.com/h240/${country.name.toLowerCase()}.png`"
              width="64"
              height="48"
              :alt="country.name"
            />
            <div class="country-text">
              <span class="country-name">{{ countryCodeToName(country.name.toUpperCase()) }}</span>
              <span class="data-point">{{ formatNumber(country.value) }}</span>
            </div>
            <div
              v-tooltip="
                `${Math.round((country.value / viewsByCountry.value.total) * 10000) / 100}%`
              "
              class="percentage-bar"
            >
              <span
                :style="{
                  width: `${(country.value / viewsByCountry.value.total) * 100}%`,
                  backgroundColor: 'var(--color-blue)',
                }"
              ></span>
            </div>
          </div>
        </div>
      </Card>
    </div>
    <AnimatedLogo v-else-if="(!finishedLoading || markReload) && !failedToLoad" />
    <div v-if="failedToLoad" class="markdown-body">
      <p>Failed to load analytics data. Please try again later.</p>
    </div>
  </div>
</template>

<script setup>
import {
  Button,
  Card,
  formatMoney,
  formatNumber,
  HistoryIcon,
  Modal,
  UpdatedIcon,
  PageBar,
  AnimatedLogo,
} from 'omorphia'
import dayjs from 'dayjs'
import { all } from 'iso-3166-1'
import CalendarClockIcon from 'assets/images/utils/calendar-clock.svg'
import CompactChart from '~/components/ui/charts/CompactChart.vue'

onMounted(() => {
  setTimeout(async () => {
    try {
      await refetchData()
      if (
        downloadData.value &&
        viewData.value &&
        revenueData.value &&
        downloadsByCountry.value &&
        viewsByCountry.value
      ) {
        finishedLoading.value = true
      } else {
        failedToLoad.value = true
      }
    } catch (err) {
      failedToLoad.value = true
    }
  }, 1000)
})

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

const countries = all()
  .map((entry) => ({
    [entry.alpha2]: entry.country,
  }))
  .reduce((acc, cur) => ({ ...acc, ...cur }), {})

const countryCodeToName = (code) => {
  if (countries[code]) {
    return countries[code]
  }
  return code
}

const finishedLoading = ref(false)
const selectedResolution = ref('daily')
const startDate = ref(new Date(new Date() - 30 * 24 * 60 * 60 * 1000))
const customStartDate = ref(null)
const endDate = ref(new Date(new Date() - 24 * 60 * 60 * 1000))
const customEndDate = ref(null)
const markReload = ref(false)
const timeResolution = ref(1440)
const customTimeResolution = ref(null)
const customTimeModal = ref(null)
const failedToLoad = ref(false)
const downloadData = ref(null)
const viewData = ref(null)
const revenueData = ref(null)
const downloadsByCountry = ref(null)
const viewsByCountry = ref(null)
const processAnalytics = (analytics, accumulateData) => {
  const labels = []
  const revData = []
  for (const trueData of Object.values(analytics)) {
    for (const [key, value] of Object.entries(trueData)) {
      const parsedData = Math.round(parseFloat(value) * 100) / 100
      accumulateData(parsedData)
      labels.push(dayjs.unix(key).format('YYYY-MM-DD'))
      revData.push(parsedData)
    }
  }
  return {
    labels,
    data: [
      {
        name: 'Downloads',
        data: revData,
      },
    ],
  }
}

const processCountryData = (analytics) => {
  const data = {
    total: 0,
    data: [],
  }
  const countryData = Object.values(analytics)
  for (const [key, value] of Object.entries(countryData[0])) {
    const parsedData = Math.round(parseFloat(value) * 100) / 100
    data.total = data.total + parsedData
    data.data.push({
      name: key,
      value: parsedData,
    })
  }
  data.data.sort((a, b) => b.value - a.value)
  return data
}

const refetchData = async () => {
  const body = `project_ids=["${
    props.project.id
  }"]&start_date=${startDate.value.toISOString()}&end_date=${endDate.value.toISOString()}&resolution_minutes=${
    timeResolution.value
  }`
  totalData.value = {
    downloads: 0,
    pageViews: 0,
    revenue: 0,
  }
  markReload.value = true
  try {
    ;[
      { data: downloadData.value },
      { data: viewData.value },
      { data: revenueData.value },
      { data: downloadsByCountry.value },
      { data: viewsByCountry.value },
    ] = await Promise.all([
      useAsyncData(
        `analytics/downloads?${body}`,
        () => useBaseFetch(`analytics/downloads?${body}`, { apiVersion: 2 }),
        {
          transform: (analytics) =>
            processAnalytics(
              analytics,
              (parsedData) => (totalData.value.downloads = totalData.value.downloads + parsedData)
            ),
        }
      ),
      useAsyncData(
        `analytics/views?${body}`,
        () => useBaseFetch(`analytics/views?${body}`, { apiVersion: 2 }),
        {
          transform: (analytics) =>
            processAnalytics(
              analytics,
              (parsedData) => (totalData.value.pageViews = totalData.value.pageViews + parsedData)
            ),
        }
      ),
      useAsyncData(
        `analytics/revenue?${body}`,
        () => useBaseFetch(`analytics/revenue?${body}`, { apiVersion: 2 }),
        {
          transform: (analytics) =>
            processAnalytics(
              analytics,
              (parsedData) => (totalData.value.revenue = totalData.value.revenue + parsedData)
            ),
        }
      ),
      useAsyncData(
        `analytics/countries/downloads?${body}`,
        () => useBaseFetch(`analytics/countries/downloads?${body}`, { apiVersion: 2 }),
        {
          transform: (analytics) => processCountryData(analytics),
        }
      ),
      useAsyncData(
        `analytics/countries/views?${body}`,
        () => useBaseFetch(`analytics/countries/views?${body}`, { apiVersion: 2 }),
        {
          transform: (analytics) => processCountryData(analytics),
        }
      ),
    ])
  } catch (err) {
    addNotification({
      group: 'main',
      title: 'An error occurred',
      text: err,
      type: 'error',
    })
  } finally {
    markReload.value = false
  }
}

const selectResolution = async (resolution) => {
  if (selectedResolution.value !== resolution) {
    selectedResolution.value = resolution
    if (resolution === 'daily') {
      startDate.value = new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
      timeResolution.value = 1440
      endDate.value = new Date(new Date() - 24 * 60 * 60 * 1000)
    } else if (resolution === 'weekly') {
      startDate.value = new Date(new Date() - 3 * 30 * 24 * 60 * 60 * 1000)
      timeResolution.value = 10800
      endDate.value = new Date(new Date() - 24 * 60 * 60 * 1000)
    } else if (resolution === 'monthly') {
      startDate.value = new Date(new Date().getFullYear(), 0, 1)
      timeResolution.value = 43200
      endDate.value = new Date(new Date() - 24 * 60 * 60 * 1000)
    } else if (resolution === 'custom') {
      startDate.value = new Date(customStartDate.value)
    }
    markReload.value = true
    await refetchData()
  }
}

const openCustomModal = () => {
  customStartDate.value = null
  customEndDate.value = null
  customTimeResolution.value = 1440
  customTimeModal.value.show()
}

const applyCustomModal = async () => {
  if (customStartDate.value && timeResolution.value) {
    customTimeModal.value.hide()
    await selectResolution('custom')
  }
}
</script>

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
.country-data {
  display: grid;
  grid-template-columns: 1fr 1fr;
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
  grid-template-columns: auto 10rem 1fr;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: var(--gap-sm);
  img {
    grid-area: flag;
    object-fit: fill;
    width: 4rem;
    height: 2.4rem;
  }
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
.markdown-body {
  margin-bottom: var(--gap-md);
}
</style>
