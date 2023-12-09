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
    <PageBar class="resolution-header">
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
        <div class="nav-button button-base" @click="() => null"><UpdatedIcon /> Refresh</div>
        <div
          class="nav-button button-base"
          :class="{ 'router-link-exact-active': selectedResolution === 'custom' }"
          @click="openCustomModal"
        >
          <CalendarClockIcon /> Custom range
        </div>
      </template>
    </PageBar>
    <div v-if="analyticsData.error.value">
      <div>{{ analyticsData.error }}</div>
    </div>
    <div v-else-if="analyticsData.loading.value">
      <AnimatedLogo />
    </div>
    <div v-else>
      <div class="spark-data">
        <client-only>
          <CompactChart
            v-if="analyticsData.formattedData.value.downloads"
            :title="`Downloads since ${dayjs(startDate).format('MMM D, YYYY')}`"
            color="var(--color-brand)"
            :value="formatNumber(analyticsData.formattedData.value.downloads.sum, false)"
            :data="analyticsData.formattedData.value.downloads.chart.data"
            :labels="analyticsData.formattedData.value.downloads.chart.labels"
            suffix="<svg xmlns='http://www.w3.org/2000/svg' class='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' /></svg>"
          />
        </client-only>
        <client-only>
          <CompactChart
            v-if="analyticsData.formattedData.value.views"
            :title="`Page views since ${dayjs(startDate).format('MMM D, YYYY')}`"
            color="var(--color-blue)"
            :value="formatNumber(analyticsData.formattedData.value.views.sum, false)"
            :data="analyticsData.formattedData.value.views.chart.data"
            :labels="analyticsData.formattedData.value.views.chart.labels"
            suffix="<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/><circle cx='12' cy='12' r='3'/></svg>"
          />
        </client-only>
        <client-only>
          <CompactChart
            v-if="analyticsData.formattedData.value.revenue"
            :title="`Revenue since ${dayjs(startDate).format('MMM D, YYYY')}`"
            color="var(--color-purple)"
            :value="formatMoney(analyticsData.formattedData.value.revenue.sum, false)"
            :data="analyticsData.formattedData.value.revenue.chart.data"
            :labels="analyticsData.formattedData.value.revenue.chart.labels"
            is-money
          />
        </client-only>
      </div>
      <div class="country-data">
        <Card
          v-if="analyticsData.formattedData.value?.downloadsByCountry"
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
        <Card v-if="analyticsData.formattedData.value?.viewsByCountry" class="country-downloads">
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
import {
  countryCodeToName,
  formatTimestamp,
  formatPercent,
  processAnalytics,
  processAnalyticsByCountry,
} from '~/composables/analytics'
import CalendarClockIcon from 'assets/images/utils/calendar-clock.svg'
import CompactChart from '~/components/ui/charts/CompactChart.vue'

const props = defineProps({
  project: {
    type: Object,
    default() {
      return {}
    },
  },
})

const selectedResolution = ref('daily')
const startDate = ref(new Date(new Date() - 30 * 24 * 60 * 60 * 1000))
const customStartDate = ref(null)
const endDate = ref(new Date(new Date() - 24 * 60 * 60 * 1000))
const customEndDate = ref(null)
const timeResolution = ref(1440)
const customTimeResolution = ref(null)
const customTimeModal = ref(null)

const sortCount = ([_a, a], [_b, b]) => b - a
const sortTimestamp = ([a], [b]) => a - b
const roundValue = ([ts, value]) => [ts, Math.round(parseFloat(value) * 100) / 100]

const processCountryAnalytics = (c, pid) => processAnalyticsByCountry(c, pid, sortCount)

const processDownloadAnalytics = (c, pid) =>
  processAnalytics(c, pid, formatTimestamp, sortTimestamp, null, 'Downloads')

const processRevAnalytics = (c, pid) =>
  processAnalytics(c, pid, formatTimestamp, sortTimestamp, roundValue, 'Revenue')

const useAsyncFetchAnalytics = async (
  url,
  baseOptions = {},
  options = {
    apiVersion: 3,
  }
) => {
  return useAsyncData(url, () => useBaseFetch(url, baseOptions), options)
}

const useFetchAllAnalytics = () => {
  const downloadData = ref(null)
  const viewData = ref(null)
  const revenueData = ref(null)
  const downloadsByCountry = ref(null)
  const viewsByCountry = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const qs = ref(null)

  const formattedData = computed(() => {
    return {
      downloads: processDownloadAnalytics(downloadData.value, props.project.id),
      views: processDownloadAnalytics(viewData.value, props.project.id),
      revenue: processRevAnalytics(revenueData.value, props.project.id),
      downloadsByCountry: processCountryAnalytics(downloadsByCountry.value, props.project.id),
      viewsByCountry: processCountryAnalytics(viewsByCountry.value, props.project.id),
    }
  })

  const fetchData = async () => {
    try {
      loading.value = true
      error.value = null

      const responses = await Promise.all([
        useAsyncFetchAnalytics(`analytics/downloads?${qs.value}`),
        useAsyncFetchAnalytics(`analytics/views?${qs.value}`),
        useAsyncFetchAnalytics(`analytics/revenue?${qs.value}`),
        useAsyncFetchAnalytics(`analytics/countries/downloads?${qs.value}`),
        useAsyncFetchAnalytics(`analytics/countries/views?${qs.value}`),
      ])

      downloadData.value = responses[0]?.data?.value || null
      viewData.value = responses[1]?.data?.value || null
      revenueData.value = responses[2]?.data?.value || null
      downloadsByCountry.value = responses[3]?.data?.value || null
      viewsByCountry.value = responses[4]?.data?.value || null
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  watchEffect(() => {
    const query = new URLSearchParams()

    query.append('project_ids', JSON.stringify([props.project.id]))
    query.append('start_date', startDate.value.toISOString())
    query.append('end_date', endDate.value.toISOString())
    query.append('resolution_minutes', timeResolution.value)

    qs.value = query.toString()

    fetchData()
  })

  // Invoke the fetch operation
  fetchData()

  return {
    downloadData,
    viewData,
    revenueData,
    downloadsByCountry,
    viewsByCountry,
    formattedData,
    loading,
    error,
  }
}

const analyticsData = useFetchAllAnalytics()

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
