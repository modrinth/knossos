<script setup>
import {
  Card,
  formatMoney,
  formatNumber,
  Modal,
  HistoryIcon,
  Button,
  UpdatedIcon,
  PageBar,
  AnimatedLogo,
} from 'omorphia'
import dayjs from 'dayjs'
import Chart from '~/components/ui/charts/Chart.vue'
import CompactChart from '~/components/ui/charts/CompactChart.vue'
import CalendarClockIcon from '~/assets/images/utils/calendar-clock.svg'
import { addNotification } from '~/composables/notifs'

useHead({
  title: 'Analytics - Modrinth',
})

const auth = await useAuth()
const route = useRoute()
const projects = ref(await useBaseFetch(`user/${auth.value.user.id}/projects`))

const analyticsData = ref({
  downloads: 0,
  pageViews: 0,
  revenue: 0,
})

const finishedLoading = ref(false)
const markReload = ref(false)
const failedToLoad = ref(false)
const selectedTab = ref('downloads')
const selectedResolution = ref('daily')
const startDate = ref(new Date(route.params.start_date ?? new Date() - 30 * 24 * 60 * 60 * 1000))
const customStartDate = ref(null)
const endDate = ref(new Date(route.params.end_date ?? new Date() - 24 * 60 * 60 * 1000))
const customEndDate = ref(null)
const timeResolution = ref(route.params.resolution ?? 1440)
const customTimeResolution = ref(null)
let downloadData
let viewData
let revenueData
let squashedDownloads
let squashedViews
let squashedRevenue = {
  labels: [],
  data: [],
  colors: [],
}

const customTimeModal = ref(null)

onMounted(() => {
  setTimeout(async () => {
    try {
      await fetchNewData()
      if (downloadData.value && viewData.value && revenueData.value) {
        finishedLoading.value = true
      } else {
        failedToLoad.value = true
      }
    } catch (err) {
      failedToLoad.value = true
    }
  }, 1000)
})

const RGBToHSL = (r, g, b) => {
  r /= 255
  g /= 255
  b /= 255
  const l = Math.max(r, g, b)
  const s = l - Math.min(r, g, b)
  const h = s ? (l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s) : 0
  return [60 * h < 0 ? 60 * h + 360 : 60 * h, 100, 50]
}

const HSLToRGB = (h, s, l) => {
  s /= 100
  l /= 100
  const k = (n) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return [255 * f(0), 255 * f(8), 255 * f(4)]
}

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
    data: [
      {
        name: `Total ${descriptor}`,
        data: [...sortedSquashedData.values()],
      },
    ],
  })

  if (ignoreNormal) {
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
    colors: [],
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
      timeResolution.value = customTimeResolution.value
      endDate.value = new Date(customEndDate.value)
    }
    await fetchNewData()
  }
}

const fetchNewData = async () => {
  markReload.value = true
  const body = `start_date=${startDate.value.toISOString()}&end_date=${endDate.value.toISOString()}&resolution_minutes=${
    timeResolution.value
  }`
  analyticsData.value = {
    downloads: 0,
    pageViews: 0,
    revenue: 0,
  }
  try {
    ;[{ data: downloadData }, { data: viewData }, { data: revenueData }] = await Promise.all([
      useAsyncData(
        `analytics/downloads?${body}`,
        () => useBaseFetch(`analytics/downloads?${body}`),
        {
          transform: (data) =>
            processData(
              data,
              (value) => (analyticsData.value.downloads += value),
              (value) => (squashedDownloads = value),
              'downloads'
            ),
        }
      ),
      useAsyncData(`analytics/views?${body}`, () => useBaseFetch(`analytics/views?${body}`), {
        transform: (data) =>
          processData(
            data,
            (value) => (analyticsData.value.pageViews += value),
            (value) => (squashedViews = value),
            'views'
          ),
      }),
      useAsyncData(`analytics/revenue?${body}`, () => useBaseFetch(`analytics/revenue?${body}`), {
        transform: (data) =>
          processData(
            data,
            (value) => (analyticsData.value.revenue += value),
            (value) => (squashedRevenue = value),
            'revenue'
          ),
      }),
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
    <div class="normal-page alt-layout">
      <div class="normal-page__header">
        <h1>Analytics</h1>
        <div v-if="failedToLoad" class="markdown-body">
          <p>Failed to load analytics data</p>
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
            <div class="nav-button button-base" @click="fetchNewData"><UpdatedIcon /> Refresh</div>
            <div
              class="nav-button button-base always-click"
              :class="{ 'router-link-exact-active': selectedResolution === 'custom' }"
              @click="openCustomModal"
            >
              <CalendarClockIcon /> Custom
            </div>
          </template>
        </PageBar>
      </div>
      <div class="normal-page__sidebar">
        <template v-if="finishedLoading && !markReload">
          <client-only>
            <CompactChart
              :title="`Downloads since ${dayjs(startDate).format('MMMM D, YYYY')}`"
              color="var(--color-brand)"
              class="button-base downloads"
              :class="{ selected: selectedTab === 'downloads' }"
              :value="formatNumber(analyticsData.downloads, false)"
              :data="squashedDownloads.data"
              :labels="squashedDownloads.labels"
              @click="() => (selectedTab = 'downloads')"
            />
          </client-only>
          <client-only>
            <CompactChart
              :title="`Page views since ${dayjs(startDate).format('MMMM D, YYYY')}`"
              color="var(--color-blue)"
              class="button-base views"
              :class="{ selected: selectedTab === 'views' }"
              :value="formatNumber(analyticsData.pageViews, false)"
              :data="squashedViews.data"
              :labels="squashedViews.labels"
              @click="() => (selectedTab = 'views')"
            />
          </client-only>
          <client-only>
            <CompactChart
              :title="`Revenue since ${dayjs(startDate).format('MMMM D, YYYY')}`"
              color="var(--color-purple)"
              class="button-base revenue"
              :class="{ selected: selectedTab === 'revenue' }"
              :value="formatMoney(analyticsData.revenue, false)"
              :data="squashedRevenue.data"
              :labels="squashedRevenue.labels"
              is-money
              @click="() => (selectedTab = 'revenue')"
            />
          </client-only>
        </template>
      </div>
      <div class="normal-page__content">
        <Card v-if="finishedLoading && !markReload && selectedTab === 'downloads'" class="main">
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
              <h2 class="sidebar-card-header">Downloads</h2>
            </Chart>
          </client-only>
        </Card>
        <Card v-if="finishedLoading && !markReload && selectedTab === 'views'" class="main">
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
              <h2 class="sidebar-card-header">Page views</h2>
            </Chart>
          </client-only>
        </Card>
        <Card v-if="finishedLoading && !markReload && selectedTab === 'revenue'" class="main">
          <client-only>
            <Chart
              type="line"
              name="Revenue data"
              :data="revenueData.data"
              :labels="revenueData.labels"
              :colors="revenueData.colors"
              is-money
            >
              <h2 class="sidebar-card-header">Revenue</h2>
            </Chart>
          </client-only>
        </Card>
      </div>
    </div>
    <AnimatedLogo v-if="(!finishedLoading || markReload) && !failedToLoad" />
  </div>
</template>

<style scoped lang="scss">
.modal-body {
  display: flex;
  flex-direction: column;
  padding: var(--gap-lg);
}

h1 {
  margin-bottom: var(--gap-sm);
}
</style>
