<template>
  <Chips v-if="false" v-model="viewMode" :items="['open', 'archived']" />
  <ReportInfo
    v-for="report in reports.filter(
      (x) =>
        (moderation || x.reporter.id === auth.user.id) && (viewMode === 'open' ? x.open : !x.open)
    )"
    :key="report.id"
    :report="report"
    :thread="report.thread"
    :moderation="moderation"
    raised
    class="universal-card recessed"
  />
</template>
<script setup>
import Chips from '~/components/ui/Chips.vue'
import ReportInfo from '~/components/ui/report/ReportInfo.vue'
import { addReportMessage } from '~/helpers/threads.js'

defineProps({
  moderation: {
    type: Boolean,
    default: false,
  },
})

const auth = await useAuth()

const viewMode = ref('open')
const reports = ref([])

const rawReports = await useBaseFetch(`report`).then((result) =>
  result.map((report) => {
    report.item_id = report.item_id.replace(/"/g, '')
    return report
  })
)

const reporterUsers = rawReports.map((report) => report.reporter)
const reportedUsers = rawReports
  .filter((report) => report.item_type === 'user')
  .map((report) => report.item_id)
const versionReports = rawReports.filter((report) => report.item_type === 'version')
const versionIds = [...new Set(versionReports.map((report) => report.item_id))]
const userIds = [...new Set(reporterUsers.concat(reportedUsers))]
const threadIds = [
  ...new Set(rawReports.filter((report) => report.thread_id).map((report) => report.thread_id)),
]

const [users, versions, threads] = await Promise.all([
  useBaseFetch(`users?ids=${JSON.stringify(userIds)}`),
  useBaseFetch(`versions?ids=${JSON.stringify(versionIds)}`),
  useBaseFetch(`threads?ids=${JSON.stringify(threadIds)}`),
])

const reportedProjects = rawReports
  .filter((report) => report.item_type === 'project')
  .map((report) => report.item_id)
const versionProjects = versions.map((version) => version.project_id)
const projectIds = [...new Set(reportedProjects.concat(versionProjects))]

const projects = await useBaseFetch(`projects?ids=${JSON.stringify(projectIds)}`)

reports.value = rawReports.map((report) => {
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
    report.thread = addReportMessage(
      threads.find((thread) => report.thread_id === thread.id),
      report
    )
  }
  report.open = true
  return report
})
</script>
