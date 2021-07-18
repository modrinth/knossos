<template>
  <div>
    <div class="section-header">
      <h3 class="column-grow-1">Projects</h3>
    </div>
    <div v-if="projects.length !== 0">
      <ProjectCard
        v-for="(project, index) in projects"
        :id="project.slug ? project.slug : project.id"
        :key="project.id"
        :author="project.author"
        :author-url="project.author_url"
        :categories="project.categories"
        :created-at="project.published"
        :description="project.description"
        :downloads="project.downloads.toString()"
        :edit-mode="true"
        :icon-url="project.icon_url"
        :is-modrinth="true"
        :latest-version="project.latest_version"
        :name="project.title"
        :page-url="project.page_url"
        :status="project.status"
        :updated-at="project.updated"
      >
        <div class="buttons">
          <button
            class="button column approve"
            @click="changeProjectStatus(project.id, 'approved', index)"
          >
            Approve
          </button>
          <button
            class="button column reject"
            @click="changeProjectStatus(project.id, 'rejected', index)"
          >
            Reject
          </button>
        </div>
      </ProjectCard>
    </div>
    <div v-else class="error">
      <Security class="icon"></Security>
      <br />
      <span class="text">You are up-to-date!</span>
    </div>
    <div class="section-header">
      <h3 class="column-grow-1">Reports</h3>
    </div>
    <div v-if="reports.length !== 0">
      <div v-for="(report, index) in reports" :key="report.id" class="report">
        <div class="header">
          <h5 class="title">
            Report for {{ report.item_type }}
            <nuxt-link
              :to="report.item_type + '/' + report.item_id.replace(/\W/g, '')"
              >{{ report.item_id }}
            </nuxt-link>
          </h5>
          <p
            v-tooltip="
              $dayjs(report.created).format(
                '[Created at] YYYY-MM-DD [at] HH:mm A'
              )
            "
            class="date"
          >
            Created {{ $dayjs(report.created).fromNow() }}
          </p>
          <button class="delete iconified-button" @click="deleteReport(index)">
            Delete
          </button>
        </div>
        <div
          v-compiled-markdown="report.body"
          v-highlightjs
          class="markdown-body"
        ></div>
      </div>
    </div>
    <div v-else class="error">
      <Security class="icon"></Security>
      <br />
      <span class="text">You are up-to-date!</span>
    </div>
  </div>
</template>

<script>
import ProjectCard from '~/components/ui/ProjectCard'
import Security from '~/assets/images/illustrations/security.svg?inline'

export default {
  components: {
    ProjectCard,
    Security,
  },
  async asyncData(data) {
    const [projects, reports] = (
      await Promise.all([
        data.$axios.get(`moderation/projects`, data.$auth.headers),
        data.$axios.get(`report`, data.$auth.headers),
      ])
    ).map((it) => it.data)

    return {
      projects,
      reports,
    }
  },
  methods: {
    async changeProjectStatus(id, status, index) {
      await this.$axios.patch(
        `project/${id}`,
        {
          status,
        },
        this.$auth.headers
      )

      this.projects.splice(index, 1)
    },
    async deleteReport(index) {
      await this.$axios.delete(
        `report/${this.reports[index].id}`,
        this.$auth.headers
      )

      this.reports.splice(index, 1)
    },
  },
}
</script>

<style lang="scss" scoped>
.button {
  margin: 0 5rem 0.5rem auto;
}

.buttons {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.report {
  @extend %card-spaced-b;
  padding: var(--spacing-card-sm) var(--spacing-card-lg);

  .header {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;

    .title {
      font-size: var(--font-size-lg);
      margin: 0 0.5rem 0 0;
    }

    .iconified-button {
      margin-left: auto;
    }
  }
}

.error {
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;

  .icon {
    width: 8rem;
    height: 8rem;
    margin: 1.5rem 0;
  }

  .text {
    margin-bottom: 2rem;
    font-size: 1.25rem;
  }
}
</style>
