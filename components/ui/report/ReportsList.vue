<template>
  <p v-if="error !== null" class="known-errors">Failed to load reports.</p>
  <template v-else>
    <Chips v-if="false" v-model="viewMode" :items="['open', 'archived']" />
    <ReportInfo
      v-for="report in reports.filter(
        (x) =>
          (moderation || x.reporter.id === $auth.user.id) &&
          (viewMode === 'open' ? x.open : !x.open)
      )"
      :key="report.id"
      :report="report"
      :thread="report.thread"
      :moderation="moderation"
      raised
      class="universal-card recessed"
    />
  </template>
</template>
<script setup>
import Chips from '~/components/ui/Chips.vue'
import ReportInfo from '~/components/ui/report/ReportInfo.vue'

defineProps({
  moderation: {
    type: Boolean,
    default: false,
  },
})

const app = useNuxtApp()

const error = ref(null)

const options = app.$defaultHeaders()
options.data = []
let rawReports = await useBaseFetch(`report`, options).catch((err) => {
  error.value = err.data ? err.data.description : err
  app.$notify({
    group: 'main',
    title: 'Error loading reports',
    text: error.value,
    type: 'error',
  })
})

rawReports = rawReports.map((report) => {
  report.item_id = report.item_id.replace(/"/g, '')
  return report
})

const reporterUsers = rawReports.map((report) => report.reporter)
const reportedUsers = rawReports
  .filter((report) => report.item_type === 'user')
  .map((report) => report.item_id)
const versionReports = rawReports.filter((report) => report.item_type === 'version')

const versionIds = [...new Set(versionReports.map((report) => report.item_id))]
const userIds = [...new Set(reporterUsers.concat(reportedUsers))]
const threadIds = [
  ...new Set(
    rawReports.filter((report) => report.thread_id !== null).map((report) => report.thread_id)
  ),
]

const [users, versions, rawThreads] = await Promise.all([
  useBaseFetch(`users?ids=${JSON.stringify(userIds)}`, app.$defaultHeaders()),
  useBaseFetch(`versions?ids=${JSON.stringify(versionIds)}`, app.$defaultHeaders()),
  useBaseFetch(`threads?ids=${JSON.stringify(threadIds)}`, app.$defaultHeaders()),
])

const reportedProjects = rawReports
  .filter((report) => report.item_type === 'project')
  .map((report) => report.item_id)
const versionProjects = versions.map((version) => version.project_id)
const projectIds = [...new Set(reportedProjects.concat(versionProjects))]

const [projects] = await Promise.all([
  useBaseFetch(`projects?ids=${JSON.stringify(projectIds)}`, app.$defaultHeaders()),
])

const reportData = rawReports.map((report) => {
  report.reporter = users.find((user) => user.id === report.reporter)
  if (report.item_type === 'user') {
    report.user = users.find((user) => user.id === report.item_id)
  } else if (report.item_type === 'project') {
    report.project = projects.find((project) => project.id === report.item_id)
  } else if (report.item_type === 'version') {
    report.version = versions.find((version) => version.id === report.item_id)
    report.project = projects.find((project) => project.id === report.version.project_id)
  }
  if (report.thread_id) {
    report.thread = app.$threadWithReportMessage(
      rawThreads.find((thread) => report.thread_id === thread.id),
      report
    )
  }
  report.open = true
  return report
})

const reports = ref(reportData)
const viewMode = ref('open')
</script>
