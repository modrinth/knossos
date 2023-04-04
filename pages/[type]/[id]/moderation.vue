<template>
  <div>
    <section class="universal-card">
      <h2>Project status</h2>
      <span class="status-message">Your project is currently <Badge :type="project.status"/>
        <span v-if="$tag.approvedStatuses.includes(project.status)">, meaning your project has been approved by the moderators
          <span v-if="['approved', 'archived'].includes(project.status)"> and it is listed both in search results and on your user profile.
            <span v-if="project.status === 'archived'"> A banner is shown above your project indicating that it is archived and will not receive any further updates.</span>
          </span>
          <span v-else-if="project.status === 'unlisted'"> and it is only accessible by direct link due to your project's visibility settings.</span>
          <span v-else-if="project.status === 'private'"> and it can only be accessed by logged-in members of the project due to your project's visibility settings.</span>
        </span>
        <span v-else-if="project.status === 'processing'">. The moderators will review your project within 48 hours and they will leave a message below if they have any questions or concerns for you.</span>
        <span v-else-if="$tag.rejectedStatuses.includes(project.status)">, meaning the project does not currently meet Modrinth's <nuxt-link to="/legal/rules" class="text-link" target="_blank">content rules</nuxt-link> and the moderators have requested you make changes before it can be approved. Your project is not listed in search results or on your user profile,
          <span v-if="project.status === 'rejected'">and it cannot be accessed via direct link.</span>
          <span v-else-if="project.status === 'withheld'">but it can be accessed via direct link. A banner is shown above your project indicating that it is in violation of the content rules.</span>
        </span>
      </span>
    </section>
    <section class="universal-card">
      <h2>Messages</h2>
      <p>This is a private conversation thread with the Modrinth moderators. They will message you for issues concerning your project on Modrinth, and you are welcome to message them about things concerning your project.</p>
      <ConversationThread :thread="thread" :report="report" />
    </section>
  </div>
</template>
<script setup>
import ConversationThread from "~/components/ui/thread/ConversationThread.vue";
import Badge from "~/components/ui/Badge.vue";

defineProps({
  project: {
    type: Object,
    default() {
      return {}
    },
  },
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

const reportData = rawReports[2]

reportData.reporter = users.find((user) => user.id === reportData.reporter)
if (reportData.item_type === 'user') {
  reportData.user = users.find((user) => user.id === reportData.item_id);
} else if (reportData.item_type === 'project') {
  reportData.project = projects.find((project) => project.id === reportData.item_id);
} else if (reportData.item_type === 'version') {
  reportData.version = versions.find((version) => version.id === reportData.item_id);
  reportData.project = projects.find((project) => project.id === reportData.version.project_id);
}

const report = ref(reportData)

const thread = {
  id: 'qC2Sd2k5',
  type: 'project',
  messages: [
    {
      id: 'u2Vn6tXa',
      author_id: '5XoMa0C4',
      body: {
        type: 'text',
        body: "I don't like this project"
      },
      created: '2023-04-02T21:01:13.320Z'
    },
    {
      id: 'u2Vn6tXa',
      author_id: 'zOuSm8q9',
      body: {
        type: 'text',
        body: 'reasonable'
      },
      created: '2023-04-02T21:01:13.320Z'
    },
    {
      id: 'u2Vn6tXa',
      body: {
        type: 'text',
        body: 'I am anonymous'
      },
      created: '2023-04-02T21:01:13.320Z'
    },
    {
      id: 'lcTs62M0',
      author_id: 'zOuSm8q9',
      body: {
        type: 'status_change',
        new_status: 'rejected'
      },
      created: '2023-04-02T21:01:13.320Z'
    },
    {
      id: 'lcTs62M0',
      author_id: 'zOuSm8q9',
      body: {
        type: 'deleted'
      },
      created: '2023-04-02T21:01:13.320Z'
    }
  ],
  members: [
    {
      "id": "eKKLuHEP",
      "github_id": 42325132,
      "username": "Devin",
      "name": "UltraStorm",
      "email": null,
      "avatar_url": "https://staging-cdn.modrinth.com/user/eKKLuHEP/bca3080566f07ebd871026b3309691ff5f5265ff.png",
      "bio": "When I get bored I make stuff",
      "created": "2023-01-02T22:21:23.808760Z",
      "role": "developer",
      "badges": 0,
      "payout_data": null,
      "has_flame_anvil_key": null
    }
  ]
}

thread.members.push(reportData.reporter)
thread.messages.unshift({
  id: 'initial-report-message',
  author_id: reportData.reporter.id,
  body: {
    type: 'text',
    body: reportData.body
  },
  created: reportData.created
})
</script>
<style lang="scss" scoped>
.stacked {
  display: flex;
  flex-direction: column;
}

.status-message {
  :deep(.version-badge) {
    display: contents;

    svg {
      vertical-align: top;
      margin: 0;
    }
  }
}
</style>
