<template>
  <div class="page-container">
    <Modal ref="modal" :header="$t('moderation.form.title')">
      <div v-if="currentProject !== null" class="moderation-modal">
        <p>
          {{ $t('moderation.form.description') }}
        </p>
        <div class="status">
          <i18n-formatted message-id="moderation.form.new-status">
            <span v-i18n:value="'status'">
              <Badge
                v-if="currentProject.newStatus === 'approved'"
                color="green"
                :type="$t('project-status.approved')"
              />
              <Badge
                v-else-if="
                  currentProject.newStatus === 'processing' ||
                  currentProject.newStatus === 'unlisted' ||
                  currentProject.newStatus === 'archived'
                "
                color="yellow"
                :type="$t(`project-status.${currentProject.newStatus}`)"
              />
              <Badge
                v-else-if="currentProject.newStatus === 'rejected'"
                color="red"
                :type="$t('project.status.rejected')"
              />
              <Badge
                v-else
                color="gray"
                :type="$t(`project-status.${currentProject.newStatus}`)"
              />
            </span>
          </i18n-formatted>
        </div>
        <input
          v-model="currentProject.moderation_message"
          type="text"
          :placeholder="$t('moderation.form.field.message.placeholder')"
        />
        <h3>{{ $t('moderation.form.body.header') }}</h3>
        <div class="textarea-wrapper">
          <Chips
            v-model="bodyViewMode"
            class="separator"
            :items="['source', 'preview']"
          />
          <textarea
            v-if="bodyViewMode === 'source'"
            id="body"
            v-model="currentProject.moderation_message_body"
          />
          <div
            v-else
            v-highlightjs
            class="markdown-body preview"
            v-html="$xss($md.render(currentProject.moderation_message_body))"
          ></div>
        </div>
        <div class="buttons">
          <button
            class="iconified-button"
            @click="
              $refs.modal.hide()
              currentProject = null
            "
          >
            <CrossIcon /> {{ $t('moderation.form.action.cancel') }}
          </button>
          <button class="iconified-button brand-button" @click="saveProject">
            <CheckIcon /> {{ $t('moderation.form.action.confirm') }}
          </button>
        </div>
      </div>
    </Modal>
    <div class="page-contents">
      <div class="content">
        <h1>{{ $t('moderation.title') }}</h1>
        <NavRow
          class="card"
          query="type"
          :links="[
            {
              label: $t('moderation.filter.all'),
              href: '',
            },
            ...moderationTypes.map((x) => {
              return {
                label: $t(`moderation.filter.${x}`),
                href: x,
              }
            }),
          ]"
        />
        <div class="projects">
          <ProjectCard
            v-for="project in $route.query.type !== undefined
              ? projects.filter((x) => x.project_type === $route.query.type)
              : projects"
            :id="project.slug || project.id"
            :key="project.id"
            :name="project.title"
            :description="project.description"
            :created-at="project.published"
            :updated-at="project.updated"
            :icon-url="project.icon_url"
            :categories="project.categories"
            :client-side="project.client_side"
            :server-side="project.server_side"
            :type="project.project_type"
            :moderation="true"
          >
            <button
              class="iconified-button"
              @click="setProjectStatus(project, 'approved')"
            >
              <CheckIcon /> {{ $t('moderation.project.action.approve') }}
            </button>
            <button
              class="iconified-button"
              @click="setProjectStatus(project, 'unlisted')"
            >
              <UnlistIcon /> {{ $t('moderation.project.action.unlist') }}
            </button>
            <button
              class="iconified-button"
              @click="setProjectStatus(project, 'rejected')"
            >
              <CrossIcon /> {{ $t('moderation.project.action.reject') }}
            </button>
          </ProjectCard>
        </div>
        <div
          v-if="
            $route.query.type === 'report' || $route.query.type === undefined
          "
          class="reports"
        >
          <div
            v-for="(item, index) in reports"
            :key="index"
            class="card report"
          >
            <div class="info">
              <div class="title">
                <i18n-formatted message-id="moderation.report.title">
                  <h3 v-i18n:value="'item'">
                    {{ item.item_type }}
                    <a :href="item.url">{{ item.item_id }}</a>
                  </h3>
                  <a
                    v-i18n:value="'reporter'"
                    :href="`/user/${item.reporter}`"
                    >{{ item.reporter }}</a
                  >
                </i18n-formatted>
              </div>
              <div
                v-highlightjs
                class="markdown-body"
                v-html="$xss($md.render(item.body))"
              />
              <Badge :type="`Marked as ${item.report_type}`" color="yellow" />
            </div>
            <div class="actions">
              <button class="iconified-button" @click="deleteReport(index)">
                <TrashIcon /> {{ $t('moderation.report.action.delete') }}
              </button>
              <span
                v-tooltip="
                  $fmt.date(item.created, {
                    dateStyle: 'long',
                    timeStyle: 'long',
                  })
                "
                class="stat"
              >
                <CalendarIcon />
                {{
                  $t('moderation.report.created', {
                    ago: $fmt.timeDifference(item.created),
                  })
                }}
              </span>
            </div>
          </div>
        </div>
        <div v-if="reports.length === 0 && projects.length === 0" class="error">
          <Security class="icon"></Security>
          <br />
          <span class="text">{{ $t('moderation.no-reports') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chips from '~/components/ui/Chips'
import ProjectCard from '~/components/ui/ProjectCard'
import Modal from '~/components/ui/Modal'
import Badge from '~/components/ui/Badge'

import CheckIcon from '~/assets/images/utils/check.svg?inline'
import UnlistIcon from '~/assets/images/utils/eye-off.svg?inline'
import CrossIcon from '~/assets/images/utils/x.svg?inline'
import TrashIcon from '~/assets/images/utils/trash.svg?inline'
import CalendarIcon from '~/assets/images/utils/calendar.svg?inline'
import Security from '~/assets/images/illustrations/security.svg?inline'
import NavRow from '~/components/ui/NavRow'

export default {
  name: 'Moderation',
  components: {
    NavRow,
    Chips,
    ProjectCard,
    CheckIcon,
    CrossIcon,
    UnlistIcon,
    Modal,
    Badge,
    Security,
    TrashIcon,
    CalendarIcon,
  },
  async asyncData(data) {
    const [projects, reports] = (
      await Promise.all([
        data.$axios.get(`moderation/projects`, data.$defaultHeaders()),
        data.$axios.get(`report`, data.$defaultHeaders()),
      ])
    ).map((it) => it.data)

    const newReports = await Promise.all(
      reports.map(async (report) => {
        report.item_id = report.item_id?.replace
          ? report.item_id.replace(/"/g, '')
          : report.item_id
        let url = ''

        if (report.item_type === 'user') {
          const user = (
            await data.$axios.get(
              `user/${report.item_id}`,
              data.$defaultHeaders()
            )
          ).data
          url = `/user/${user.username}`
          report.item_id = user.username
        } else if (report.item_type === 'project') {
          const project = (
            await data.$axios.get(
              `project/${report.item_id}`,
              data.$defaultHeaders()
            )
          ).data
          report.item_id = project.slug || report.item_id
          url = `/${project.project_type}/${report.item_id}`
        } else if (report.item_type === 'version') {
          const version = (
            await data.$axios.get(
              `version/${report.item_id}`,
              data.$defaultHeaders()
            )
          ).data
          const project = (
            await data.$axios.get(
              `project/${version.project_id}`,
              data.$defaultHeaders()
            )
          ).data
          report.item_id = version.version_number || report.item_id
          url = `/${project.project_type}/${
            project.slug || project.id
          }/version/${report.item_id}`
        }

        report.reporter = (
          await data.$axios.get(
            `user/${report.reporter}`,
            data.$defaultHeaders()
          )
        ).data.username

        return {
          ...report,
          moderation_type: 'report',
          url,
        }
      })
    )

    return {
      projects,
      reports: newReports,
    }
  },
  data() {
    return {
      bodyViewMode: 'source',
      currentProject: null,
    }
  },
  head() {
    return {
      title: this.$t('meta.title-format', {
        title: this.$t('moderation.title'),
      }),
    }
  },
  computed: {
    moderationTypes() {
      const obj = {}

      for (const project of this.projects) {
        obj[project.project_type] = true
      }

      if (this.reports.length > 0) {
        obj.report = true
      }

      return Object.keys(obj)
    },
  },
  methods: {
    setProjectStatus(project, status) {
      project.moderation_message = ''
      project.moderation_message_body = ''
      project.newStatus = status

      this.currentProject = project
      this.$refs.modal.show()
    },
    async saveProject() {
      this.$nuxt.$loading.start()

      try {
        await this.$axios.patch(
          `project/${this.currentProject.id}`,
          {
            moderation_message: this.currentProject.moderation_message
              ? this.currentProject.moderation_message
              : null,
            moderation_message_body: this.currentProject.moderation_message_body
              ? this.currentProject.moderation_message_body
              : null,
            status: this.currentProject.newStatus,
          },
          this.$defaultHeaders()
        )

        this.projects.splice(
          this.projects.findIndex((x) => this.currentProject.id === x.id),
          1
        )
        this.currentProject = null
        this.$refs.modal.hide()
      } catch (err) {
        this.$notify({
          group: 'main',
          title: this.$t('error.generic'),
          text: err.response.data.description,
          type: 'error',
        })
      }

      this.$nuxt.$loading.finish()
    },
    async deleteReport(index) {
      this.$nuxt.$loading.start()

      try {
        await this.$axios.delete(
          `report/${this.reports[index].id}`,
          this.$defaultHeaders()
        )

        this.reports.splice(index, 1)
      } catch (err) {
        this.$notify({
          group: 'main',
          title: this.$t('error.generic'),
          text: err.response.data.description,
          type: 'error',
        })
      }

      this.$nuxt.$loading.finish()
    },
  },
}
</script>

<style lang="scss" scoped>
.moderation-modal {
  width: auto;
  padding: var(--spacing-card-md) var(--spacing-card-lg);

  .status {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;

    span {
      margin-left: 0.5rem;
    }
  }

  .textarea-wrapper {
    margin-top: 0.5rem;
    height: 15rem;

    .preview {
      overflow-y: auto;
    }
  }

  .separator {
    margin: var(--spacing-card-sm) 0;
  }

  .buttons {
    display: flex;
    margin-top: 0.5rem;

    :first-child {
      margin-left: auto;
    }
  }
}

h1 {
  color: var(--color-text-dark);
}

.report {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;

  > div {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .info {
    display: flex;
    flex-wrap: wrap;

    .title {
      display: flex;
      align-items: baseline;
      gap: 0.25rem;
      flex-wrap: wrap;

      h3 {
        margin: 0;
        text-transform: capitalize;

        a {
          text-transform: none;
        }
      }

      a {
        text-decoration: underline;
      }
    }
  }

  .actions {
    min-width: fit-content;

    .iconified-button {
      margin-left: auto;
      width: fit-content;
    }

    .stat {
      margin-top: auto;
      display: flex;
      align-items: center;
      grid-gap: 0.5rem;

      svg {
        width: 1em;
      }
    }
  }
}

@media screen and (min-width: 1024px) {
  .page-contents {
    max-width: 800px;
  }
}
</style>
