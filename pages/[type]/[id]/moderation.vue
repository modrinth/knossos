<template>
  <div>
    <section v-if="false" class="universal-body">
      <h2>Project status</h2>
      <span class="status-message"
        >Your project is currently <Badge :type="project.status" />
        <span v-if="$tag.approvedStatuses.includes(project.status)"
          >, meaning your project has been approved by the moderators
          <span v-if="['approved', 'archived'].includes(project.status)">
            and it is listed both in search results and on your user profile.
            <span v-if="project.status === 'archived'">
              A banner is shown above your project indicating that it is archived and will not
              receive any further updates.</span
            >
          </span>
          <span v-else-if="project.status === 'unlisted'">
            and it is only accessible by direct link due to your project's visibility
            settings.</span
          >
          <span v-else-if="project.status === 'private'">
            and it can only be accessed by logged-in members of the project due to your project's
            visibility settings.</span
          >
        </span>
        <span v-else-if="project.status === 'processing'"
          >. The moderators will review your project within 48 hours and they will leave a message
          below if they have any questions or concerns for you.</span
        >
        <span v-else-if="$tag.rejectedStatuses.includes(project.status)"
          >, meaning the project does not currently meet Modrinth's
          <nuxt-link to="/legal/rules" class="text-link" target="_blank">content rules</nuxt-link>
          and the moderators have requested you make changes before it can be approved. Your project
          is not listed in search results or on your user profile,
          <span v-if="project.status === 'rejected'"
            >and it cannot be accessed via direct link.</span
          >
          <span v-else-if="project.status === 'withheld'"
            >but it can be accessed via direct link. A banner is shown above your project indicating
            that it is in violation of the content rules.</span
          >
        </span>
      </span>
    </section>
    <section id="messages" class="universal-body">
      <h2>Messages</h2>
      <p>
        This is a private conversation thread with the Modrinth moderators. They will message you
        for issues concerning your project on Modrinth, and you are welcome to message them about
        things concerning your project.
      </p>
      <template v-if="thread">
        <ConversationThread
          v-if="thread"
          :thread="thread"
          :update-thread="(newThread) => (thread = newThread)"
          :project="project"
          :set-status="setStatus"
        />
      </template>
      <div v-else class="known-errors unavailable-error">
        <WarningIcon /> Messages are currently not available on this project.
        <span v-if="config.public.apiBaseUrl.startsWith('https://staging-api.modrinth.com')">
          This is expected on staging because the database has not been fully migrated, please make
          a new project to try message threads.
        </span>
        <span v-else>
          If you're seeing this, please report this as an issue including your project's ID:
          <CopyCode :text="project.id" />
        </span>
      </div>
    </section>
  </div>
</template>
<script setup>
import ConversationThread from '~/components/ui/thread/ConversationThread.vue'
import Badge from '~/components/ui/Badge.vue'
import CopyCode from '~/components/ui/CopyCode.vue'
import WarningIcon from '~/assets/images/utils/issues.svg'

const props = defineProps({
  project: {
    type: Object,
    default() {
      return {}
    },
  },
})

const emit = defineEmits(['update:project'])

const app = useNuxtApp()
const config = useRuntimeConfig()

// let [rawReports] = await Promise.all([useBaseFetch(`report`, app.$defaultHeaders())])
//
// rawReports = rawReports.map((report) => {
//   report.item_id = report.item_id.replace(/"/g, '')
//   return report
// })
//
// const reporterUsers = rawReports.map((report) => report.reporter)
// const reportedUsers = rawReports
//   .filter((report) => report.item_type === 'user')
//   .map((report) => report.item_id)
// const versionReports = rawReports.filter((report) => report.item_type === 'version')
//
// const versionIds = [...new Set(versionReports.map((report) => report.item_id))]
// const userIds = [...new Set(reporterUsers.concat(reportedUsers))]
//
// const [users, versions] = await Promise.all([
//   useBaseFetch(`users?ids=${JSON.stringify(userIds)}`, app.$defaultHeaders()),
//   useBaseFetch(`versions?ids=${JSON.stringify(versionIds)}`, app.$defaultHeaders()),
// ])
//
// const reportedProjects = rawReports
//   .filter((report) => report.item_type === 'project')
//   .map((report) => report.item_id)
// const versionProjects = versions.map((version) => version.project_id)
// const projectIds = [...new Set(reportedProjects.concat(versionProjects))]
//
// const [projects] = await Promise.all([
//   useBaseFetch(`projects?ids=${JSON.stringify(projectIds)}`, app.$defaultHeaders()),
// ])
//
// const reportData = rawReports[2]
//
// reportData.reporter = users.find((user) => user.id === reportData.reporter)
// if (reportData.item_type === 'user') {
//   reportData.user = users.find((user) => user.id === reportData.item_id)
// } else if (reportData.item_type === 'project') {
//   reportData.project = projects.find((project) => project.id === reportData.item_id)
// } else if (reportData.item_type === 'version') {
//   reportData.version = versions.find((version) => version.id === reportData.item_id)
//   reportData.project = projects.find((project) => project.id === reportData.version.project_id)
// }

let rawThread = null

if (props.project.thread_id) {
  rawThread = await useBaseFetch(`thread/${props.project.thread_id}`, app.$defaultHeaders())
}

const thread = ref(rawThread)

async function setStatus(status) {
  startLoading()

  try {
    const data = {}
    data.status = status
    await useBaseFetch(`project/${props.project.id}`, {
      method: 'PATCH',
      body: data,
      ...app.$defaultHeaders(),
    })
    const project = props.project
    project.status = status
    emit('update:project', project)
    thread.value = await useBaseFetch(`thread/${thread.value.id}`, app.$defaultHeaders())
  } catch (err) {
    app.$notify({
      group: 'main',
      title: 'An error occurred',
      text: err.data ? err.data.description : err,
      type: 'error',
    })
  }

  stopLoading()
}
</script>
<style lang="scss" scoped>
.stacked {
  display: flex;
  flex-direction: column;
}

.status-message {
  :deep(.badge) {
    display: contents;

    svg {
      vertical-align: top;
      margin: 0;
    }
  }
}

.unavailable-error {
  .code {
    margin-top: var(--spacing-card-sm);
  }

  svg {
    vertical-align: top;
  }
}
</style>
