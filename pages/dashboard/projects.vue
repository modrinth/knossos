<template>
  <div>
    <Modal ref="editLinksModal" header="Edit Links">
      <div class="modal-contents">
        <p>
          Empty inputs will be ignored. You can clear a field using the trash
          can button.
        </p>
        <section class="links">
          <label
            title="A place for users to report bugs, issues, and concerns about your project."
          >
            <span>Issue tracker</span>
            <input
              v-model="editLinks.issues.val"
              :disabled="editLinks.issues.clear"
              type="url"
              placeholder="Enter a valid URL"
              maxlength="2048"
            />
            <button
              class="square-button label-button"
              :data-active="editLinks.issues.clear"
              @click="editLinks.issues.clear = !editLinks.issues.clear"
            >
              <TrashIcon />
            </button>
          </label>
          <label
            title="A page/repository containing the source code for your project"
          >
            <span>Source code</span>
            <input
              v-model="editLinks.source.val"
              :disabled="editLinks.source.clear"
              type="url"
              maxlength="2048"
              placeholder="Enter a valid URL"
            />
            <button
              class="square-button label-button"
              :data-active="editLinks.source.clear"
              @click="editLinks.source.clear = !editLinks.source.clear"
            >
              <TrashIcon />
            </button>
          </label>
          <label
            title="A page containing information, documentation, and help for the project."
          >
            <span>Wiki page</span>
            <input
              v-model="editLinks.wiki.val"
              :disabled="editLinks.wiki.clear"
              type="url"
              maxlength="2048"
              placeholder="Enter a valid URL"
            />
            <button
              class="square-button label-button"
              :data-active="editLinks.wiki.clear"
              @click="editLinks.wiki.clear = !editLinks.wiki.clear"
            >
              <TrashIcon />
            </button>
          </label>
          <label
            class="no-margin"
            title="An invitation link to your Discord server."
          >
            <span>Discord invite</span>
            <input
              v-model="editLinks.discord.val"
              :disabled="editLinks.discord.clear"
              type="url"
              maxlength="2048"
              placeholder="Enter a valid URL"
            />
            <button
              class="square-button label-button"
              :data-active="editLinks.discord.clear"
              @click="editLinks.discord.clear = !editLinks.discord.clear"
            >
              <TrashIcon />
            </button>
          </label>
        </section>
        <p>Changes will be applied to the following projects:</p>
        <ul>
          <li
            v-for="project in selectedProjects.filter(
              (it) => (it.permissions & EDIT_DETAILS) !== EDIT_DETAILS
            )"
            :key="project.id"
          >
            {{ project.title }}
          </li>
        </ul>
        <p>
          If a project you have selected is not in this list - you do not have
          permission to edit it's details.
        </p>
        <div class="button-group">
          <button class="iconified-button" @click="$refs.editLinksModal.hide()">
            <CrossIcon />
            Cancel
          </button>
          <button class="iconified-button" @click="bulkEditLinks()">
            Apply
          </button>
        </div>
      </div>
    </Modal>
    <!-- <ModalConfirm
      ref="deleteBulkModal"
      :title="`Delete project${selectedProjects.length > 1 ? 's' : ''}`"
      :description="`Deleting ${selectedProjects.length} project${
        selectedProjects.length > 1 ? 's' : ''
      }. This action is irreversable. Are you sure you want to continue? Only projects that you are owner of will be deleted.`"
      :has-to-type="true"
      :confirmation-text="$auth.user.username"
      @proceed="bulkDeleteSelected()"
    /> -->
    <ModalCreation ref="modal_creation" />
    <section class="universal-card">
      <div class="title-button-group input-group">
        <h2>Projects</h2>
        <button
          class="iconified-button brand-button"
          @click="$refs.modal_creation.show()"
        >
          <PlusIcon />
          Create a project
        </button>
      </div>

      <div class="metrics">
        <div class="metric">
          <div class="label">Total projects</div>
          <div class="value">
            {{ projects.length }}
          </div>
        </div>
        <div class="metric">
          <div class="label">Versions created</div>
          <div class="value">
            {{ versions.length }}
          </div>
        </div>
      </div>
    </section>
    <section class="universal-card">
      <h2>Management</h2>
      <p>You can bulk edit projects by selecting them in the table.</p>
      <div class="button-group">
        <button
          class="iconified-button"
          :disabled="selectedProjects.length === 0"
          @click="$refs.editLinksModal.show()"
        >
          Edit links
        </button>
        <button
          class="iconified-button"
          :disabled="true"
          @click="$refs.editLinksModal.show()"
        >
          Set License
        </button>
        <!-- <button
          class="iconified-button danger-button"
          :disabled="selectedProjects.length === 0"
          @click="$refs.deleteBulkModal.show()"
        >
          <TrashIcon />Delete
        </button> -->
        <div class="align-row-right">
          <div class="labeled-control-row">
            Sort By
            <Multiselect
              v-model="sortBy"
              :searchable="false"
              class="small-select"
              :options="['Name', 'Status', 'Role', 'Type']"
              :close-on-select="true"
              :show-labels="false"
              :allow-empty="false"
              @input="sortCurrentPage()"
            ></Multiselect>
            Max Per Page
            <Multiselect
              v-model="maxPerPage"
              placeholder="Select one"
              class="small-select"
              :options="[1, 5, 10, 15, 20, 50, 100]"
              :searchable="false"
              :close-on-select="true"
              :show-labels="false"
              :allow-empty="false"
              @input="changeAmountPerPage()"
            />
          </div>
        </div>
      </div>
      <br />
      <div class="table-container">
        <table>
          <tr>
            <th>
              <Checkbox
                :value="selectedProjects === projects"
                @input="
                  selectedProjects === projects
                    ? (selectedProjects = [])
                    : (selectedProjects = projects)
                "
              />
            </th>
            <th>Name</th>
            <th>ID</th>
            <th>Type</th>
            <th>Status</th>
            <th>Role</th>
            <th><!-- Settings Button Column --></th>
          </tr>
          <tr v-for="project in currentSortedTableView" :key="project.id">
            <td>
              <Checkbox
                :disabled="
                  (project.permissions & EDIT_DETAILS) === EDIT_DETAILS
                "
                :value="selectedProjects.includes(project)"
                @input="
                  selectedProjects.includes(project)
                    ? (selectedProjects = selectedProjects.filter(
                        (it) => it !== project
                      ))
                    : selectedProjects.push(project)
                "
              />
            </td>
            <td>
              <div
                v-if="project.moderator_message != null"
                v-tooltip="
                  project.moderator_message != null
                    ? project.moderator_message.message
                    : ''
                "
                class="inline-icon"
              >
                <IssuesIcon color="var(--color-special-orange)" />
              </div>

              <nuxt-link :to="`/${project.project_type}/${project.id}`">
                {{ project.title }}
              </nuxt-link>
            </td>
            <td>{{ project.id }}</td>
            <td>{{ uppercaseString(project.project_type) }}</td>
            <td>
              <Badge
                v-if="project.status && project.status !== 'approved'"
                :type="project.status"
                class="status"
              />
            </td>
            <td>{{ project.role }}</td>
            <td>
              <nuxt-link
                class="square-button"
                :to="`/${project.project_type}/${project.id}/settings`"
                ><SettingsIcon
              /></nuxt-link>
            </td>
          </tr>
        </table>
      </div>
      <Pagination
        :page="currentPage"
        :count="pageCount"
        :link-function="() => '/'"
        @select-page="switchPage"
      ></Pagination>
    </section>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'

import Badge from '~/components/ui/Badge.vue'
import Checkbox from '~/components/ui/Checkbox.vue'
import Modal from '~/components/ui/Modal.vue'
// import ModalConfirm from '~/components/ui/ModalConfirm.vue'
import ModalCreation from '~/components/ui/ModalCreation.vue'
import Pagination from '~/components/ui/Pagination.vue'

import SettingsIcon from '~/assets/images/utils/settings.svg?inline'
import TrashIcon from '~/assets/images/utils/trash.svg?inline'
import IssuesIcon from '~/assets/images/utils/issues.svg?inline'

export default {
  components: {
    Badge,
    SettingsIcon,
    TrashIcon,
    Checkbox,
    IssuesIcon,
    Modal,
    // ModalConfirm,
    ModalCreation,
    Multiselect,
    Pagination,
  },
  async asyncData(data) {
    try {
      const [unprocessedProjects] = (
        await Promise.all([
          data.$axios.get(
            `user/${data.$auth.user.id}/projects`,
            data.$defaultHeaders()
          ),
        ])
      ).map((it) => it.data)

      const projects = []
      const versions = []

      await unprocessedProjects.forEach(async (project) => {
        const teamData = (
          await data.$axios.get(
            `project/${project.id}/members`,
            data.$defaultHeaders()
          )
        ).data
        teamData.forEach((member) => {
          if (member.user.id !== data.$auth.user.id) return
          project.role = member.role
          project.permission = member.permission
          projects.push(project)
        })

        const versionData = (
          await data.$axios.get(
            `project/${project.slug}/version`,
            data.$defaultHeaders()
          )
        ).data
        project.versions = versionData
        versions.push(versionData)
      })

      return {
        projects,
        versions,
      }
    } catch (e) {
      data.error({
        statusCode: 404,
        message: e,
      })
    }
  },
  data() {
    return {
      selectedProjects: [],
      currentSortedTableView: [],
      maxPerPage: 10,
      currentPage: 1,
      pages: [],
      pageCount: 1,
      sortBy: 'Name',
      editLinks: {
        source: {
          val: '',
          clear: false,
        },
        discord: {
          val: '',
          clear: false,
        },
        wiki: {
          val: '',
          clear: false,
        },
        issues: {
          val: '',
          clear: false,
        },
      },
    }
  },
  fetch() {},
  head: {
    title: 'Projects - Modrinth',
  },
  created() {
    this.UPLOAD_VERSION = 1 << 0
    this.DELETE_VERSION = 1 << 1
    this.EDIT_DETAILS = 1 << 2
    this.EDIT_BODY = 1 << 3
    this.MANAGE_INVITES = 1 << 4
    this.REMOVE_MEMBER = 1 << 5
    this.EDIT_MEMBER = 1 << 6
    this.DELETE_PROJECT = 1 << 7
  },
  mounted() {},
  methods: {
    uppercaseString(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    sortCurrentPage() {
      switch (this.sortBy) {
        case 'Name':
          this.currentSortedTableView.sort((a, b) => {
            if (a.title < b.title) {
              return -1
            }
            if (a.title > b.title) {
              return 1
            }
            return 0
          })
          break
        case 'Status':
          this.currentSortedTableView.sort((a, b) => {
            if (a.status < b.status) {
              return -1
            }
            if (a.status > b.status) {
              return 1
            }
            return 0
          })
          break
        case 'Role':
          this.currentSortedTableView.sort((a, b) => {
            if (a.role < b.role) {
              return -1
            }
            if (a.role > b.role) {
              return 1
            }
            return 0
          })
          break
        case 'Type':
          this.currentSortedTableView.sort((a, b) => {
            if (a.project_type < b.project_type) {
              return -1
            }
            if (a.project_type > b.project_type) {
              return 1
            }
            return 0
          })
          break
        default:
          break
      }
    },
    switchPage(index) {
      this.currentSortedTableView = this.pages[index - 1]
      this.sortCurrentPage()
      this.$nextTick()
    },
    changeAmountPerPage() {
      this.pageCount = Math.ceil(this.projects.length / this.maxPerPage)
      for (let index = 0; index < this.pageCount; index++) {
        this.pages[index] = []
      }
      let counter = 0
      let index = 0
      this.projects.forEach((project) => {
        if (counter > this.maxPerPage) {
          counter = 0
          index++
        }

        this.pages[index].push(project)
      })
      this.switchPage(1)
      this.sortCurrentPage()
    },
    bulkDeleteSelected() {
      this.selectedProjects
        .filter(
          (it) => (it.permissions & this.DELETE_PROJECT) !== this.DELETE_PROJECT
        )
        .forEach(async (project) => {
          try {
            await this.$axios.delete(
              `project/${project.id}`,
              this.$defaultHeaders()
            )
            await this.$store.dispatch('user/fetchProjects')
            await this.$router.push(`/dashboard/projects`)
            this.$notify({
              group: 'main',
              title: 'Action Success',
              text: 'Project(s) have been successfully deleted.',
              type: 'success',
            })
          } catch (e) {
            this.$notify({
              group: 'main',
              title: 'Failed to delete ' + project.title,
              text: e,
              type: 'error',
            })
          }
        })
    },
    bulkEditLinks() {
      try {
        const baseData = {
          issues_url:
            !this.editLinks.issues.clear &&
            this.editLinks.issues.val.trim() !== ''
              ? this.editLinks.issues.val
              : null,
          source_url:
            !this.editLinks.source.clear &&
            this.editLinks.source.val.trim() !== ''
              ? this.editLinks.source.val
              : null,
          wiki_url:
            !this.editLinks.wiki.clear && this.editLinks.wiki.val.trim() !== ''
              ? this.editLinks.wiki.val
              : null,
          discord_url:
            !this.editLinks.discord.clear &&
            this.editLinks.discord.val.trim() !== ''
              ? this.editLinks.discord.val
              : null,
        }

        const validProjects = this.selectedProjects.filter(
          (it) => (it.permissions & this.EDIT_DETAILS) !== this.EDIT_DETAILS
        )

        validProjects.forEach(async (project) => {
          await this.$axios.patch(
            `project/${project.id}`,
            baseData,
            this.$defaultHeaders()
          )
        })

        this.$refs.editLinksModal.hide()
        this.$notify({
          group: 'main',
          title: 'Success',
          text: "Bulk edited selected project's links.",
          type: 'success',
        })
        this.selectedProjects = []
      } catch (e) {
        this.$notify({
          group: 'main',
          title: 'An error occurred',
          text: e,
          type: 'error',
        })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.status {
  margin-top: var(--spacing-card-xs);
}

.labeled-control-row {
  flex: 1;
  display: flex;
  font-size: var(--font-size-sm);
  flex-direction: row;
  min-width: 0;
  align-items: center;
  gap: var(--spacing-card-md);
}

.metrics {
  display: grid;
  grid-gap: var(--spacing-card-md);
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));

  .metric {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    justify-content: center;
    background-color: var(--color-bg);
    border-radius: var(--size-rounded-card);
    padding: var(--spacing-card-lg);
    gap: var(--spacing-card-md);

    .label {
      color: var(--color-heading);
      font-weight: bold;
      font-size: 1rem;
    }

    .value {
      color: var(--color-text-dark);
      font-weight: bold;
      font-size: 2rem;
    }
  }
}

.align-row-right {
  margin-left: auto;
  margin-right: 0;
}

.small-select {
  width: -moz-fit-content;
  width: fit-content;
  height: -moz-fit-content;
  height: fit-content;
}

.table-container {
  display: inline-block;
  overflow: scroll;
  width: 100%;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

tr:nth-child(even) {
  background-color: var(--color-table-alternate-row);
}

th {
  background-color: var(--color-bg);
  color: white;
}

table {
  font-size: var(--font-size-sm);
  border-spacing: 0;
  border-radius: var(--size-rounded-sm);
  border-collapse: collapse;
  width: 100%;
}

tr:first-child > :first-child {
  border-top-left-radius: var(--size-rounded-sm);
}
tr:first-child > :last-child {
  border-top-right-radius: var(--size-rounded-sm);
}
tr:last-child > :first-child {
  border-bottom-left-radius: var(--size-rounded-sm);
}
tr:last-child > :last-child {
  border-bottom-right-radius: var(--size-rounded-sm);
}

th,
td {
  padding: var(--spacing-card-md);
  text-align: left;
}

.title-button-group {
  align-items: center;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  row-gap: 0.5rem;
  padding-right: var(--spacing-card-bg);
}

.label-button {
  margin-left: var(--spacing-card-sm);
}

.label-button[data-active='true'] {
  --background-color: var(--color-special-red);
  --text-color: var(--color-brand-inverted);
}

.modal-contents {
  padding: var(--spacing-card-bg);
  display: flex;
  height: auto;
  flex-direction: column;

  .button-group {
    margin-left: auto;
    margin-top: 1.5rem;
  }

  ul {
    margin: var(--spacing-card-sm);
  }

  section.links {
    display: grid;
    grid-area: auto;

    label {
      align-items: center;
      margin-top: var(--spacing-card-sm);

      span {
        flex: 1;
      }
    }
  }
}

.inline-icon {
  vertical-align: middle;
  display: inline-block;
}

label {
  display: flex;

  span {
    flex: 2;
  }

  input,
  .multiselect,
  .legacy-input-group {
    flex: 3;
    height: fit-content;
  }
}
</style>
