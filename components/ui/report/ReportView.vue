<template>
  <div>
    <section class="universal-card">
      <Breadcrumbs
        v-if="breadcrumbsStack"
        :current-title="`Report ${reportId}`"
        :link-stack="breadcrumbsStack"
      />
      <h2>Report details</h2>
      <ReportInfo :report="report" :show-thread="false" :show-message="false" />
    </section>
    <section class="universal-card">
      <h2>Messages</h2>
      <ConversationThread :thread="thread" :report="report" :update-thread="updateThread" />
    </section>
  </div>
</template>
<script setup>
import Breadcrumbs from '~/components/ui/Breadcrumbs.vue'
import ConversationThread from '~/components/ui/thread/ConversationThread.vue'
import ReportInfo from '~/components/ui/report/ReportInfo.vue'
import { addReportMessage } from '~/helpers/threads.js'

const props = defineProps({
  reportId: {
    type: String,
    required: true,
  },
  breadcrumbsStack: {
    type: Array,
    default: null,
  },
})

const report = ref(null)
const rawThread = ref(null)
const thread = computed(() => addReportMessage(rawThread.value, report.value))

await fetchReport().then((result) => {
  report.value = result
})

await useBaseFetch(`thread/${report.value.thread_id}`).then((result) => {
  rawThread.value = result
})

async function updateThread(newThread) {
  rawThread.value = newThread
  report.value = await fetchReport()
}

async function fetchReport() {
  const rawReport = await useBaseFetch(`report/${props.reportId}`)
  rawReport.item_id = rawReport.item_id.replace(/"/g, '')

  const userIds = []
  userIds.push(rawReport.reporter)
  if (rawReport.item_type === 'user') {
    userIds.push(rawReport.item_id)
  }

  const versionId = rawReport.item_type === 'version' ? rawReport.item_id : null

  const users = await useBaseFetch(`users?ids=${JSON.stringify(userIds)}`)

  let version = null
  if (versionId) {
    version = await useBaseFetch(`version/${versionId}`)
  }

  const projectId = version
    ? version.project_id
    : rawReport.item_type === 'project'
    ? rawReport.item_id
    : null

  let project = null
  if (projectId) {
    project = await useBaseFetch(`project/${projectId}`)
  }

  const reportData = rawReport
  reportData.project = project
  reportData.version = version
  reportData.reporter = users.find((user) => user.id === rawReport.reporter)
  if (rawReport.item_type === 'user') {
    reportData.user = users.find((user) => user.id === rawReport.item_id)
  }
  return reportData
}
</script>
<style lang="scss" scoped>
.stacked {
  display: flex;
  flex-direction: column;
}
</style>
