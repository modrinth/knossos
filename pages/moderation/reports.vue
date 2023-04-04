<template>
  <div>
    <section class="universal-card">
      <h2>Reports</h2>
      <Chips v-model="viewMode" :items="['open', 'archived']" />
      <ReportInfo v-for="report in reports.filter((x) => viewMode === 'open' ? x.open : !x.open)" :key="report.id" :report="report" raised class="universal-card recessed"/>
    </section>
  </div>
</template>
<script setup>
import Chips from "~/components/ui/Chips.vue";
import ReportInfo from "~/components/ui/ReportInfo.vue";

useHead({
  title: 'Reports - Modrinth',
})

const app = useNuxtApp()

let [rawReports] = await Promise.all([
  useBaseFetch(`report`, app.$defaultHeaders()),
])

rawReports = rawReports.map((report) => {
  report.item_id = report.item_id.replace(/"/g, '')
  return report
})

const reporterUsers = rawReports.map((report) => report.reporter)
const reportedUsers = rawReports.filter((report) => report.item_type === 'user').map((report) => report.item_id)
const versionReports = rawReports.filter((report) => report.item_type === 'version');

const versionIds = [...new Set(versionReports.map((report) => report.item_id))]
const userIds = [...new Set(reporterUsers.concat(reportedUsers))]

const [users, versions] = await Promise.all([
  useBaseFetch(`users?ids=${JSON.stringify(userIds)}`, app.$defaultHeaders()),
  useBaseFetch(`versions?ids=${JSON.stringify(versionIds)}`, app.$defaultHeaders())
])

const reportedProjects = rawReports.filter((report) => report.item_type === 'project').map((report) => report.item_id)
const versionProjects = versions.map((version) => version.project_id)
const projectIds = [...new Set(reportedProjects.concat(versionProjects))]

const [projects] = await Promise.all([
  useBaseFetch(`projects?ids=${JSON.stringify(projectIds)}`, app.$defaultHeaders()),
])

const reportData = rawReports.map((report) => {
    report.reporter = users.find((user) => user.id === report.reporter)
    if (report.item_type === 'user') {
      report.user = users.find((user) => user.id === report.item_id);
    } else if (report.item_type === 'project') {
      report.project = projects.find((project) => project.id === report.item_id);
    } else if (report.item_type === 'version') {
      report.version = versions.find((version) => version.id === report.item_id);
      report.project = projects.find((project) => project.id === report.version.project_id);
    }
    report.open = true;
    return report
  }
)

const reports = ref(reportData)
const viewMode = ref('open')
</script>
<style lang="scss" scoped>
</style>
