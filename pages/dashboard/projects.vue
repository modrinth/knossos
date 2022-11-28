<template>
  <div>
    <Modal header="Edit Links" ref="modal">
      <div class="modal-contents">
        <p>
          Empty inputs will be ignored and not updated across the selected
          projects.
        </p>
        <section class="links">
          <label
            title="A place for users to report bugs, issues, and concerns about your project."
          >
            <span>Issue tracker</span>
            <input
              v-model="bulkEdit.issues_url"
              type="url"
              placeholder="Enter a valid URL"
              maxlength="2048"
            />
          </label>
          <label
            title="A page/repository containing the source code for your project"
          >
            <span>Source code</span>
            <input
              v-model="bulkEdit.source_url"
              type="url"
              maxlength="2048"
              placeholder="Enter a valid URL"
            />
          </label>
          <label
            title="A page containing information, documentation, and help for the project."
          >
            <span>Wiki page</span>
            <input
              v-model="bulkEdit.wiki_url"
              type="url"
              maxlength="2048"
              placeholder="Enter a valid URL"
            />
          </label>
          <label
            class="no-margin"
            title="An invitation link to your Discord server."
          >
            <span>Discord invite</span>
            <input
              v-model="bulkEdit.discord_url"
              type="url"
              maxlength="2048"
              placeholder="Enter a valid URL"
            />
          </label>
        </section>
        <p>Changes will be applied to the following projects:</p>
        <ul>
          <li
            v-for="project in selectedProjects.filter(
              (it) => (it.permissions & EDIT_DETAILS) !== EDIT_DETAILS
            )"
            v-bind:key="project.id"
          >
            {{ project.title }}
          </li>
        </ul>
        <p>
          If a project you have selected is not in this list - you do not have
          permission to edit it's details.
        </p>
        <div class="button-group">
          <button class="iconified-button" @click="$refs.modal.hide()">
            <CrossIcon />
            Cancel
          </button>
          <button
            class="iconified-button success-button"
            @click="$refs.modal.hide()"
          >
            Apply
          </button>
        </div>
      </div>
    </Modal>
    <section class="universal-card">
      <h2>Projects</h2>
      <div class="metrics">
        <div class="metric">
          <div class="label">Total Projects</div>
          <div class="value">
            {{ projects.length }}
          </div>
        </div>
        <div class="metric">
          <div class="label">Versions Released</div>
          <div class="value">
            {{ versions.length }}
          </div>
        </div>
      </div>
    </section>
    <section class="universal-card">
      <h2>Management</h2>
      <p>You can bulk edit projects by selecting them on the table.</p>
      <button
        class="iconified-button"
        @click="$refs.modal.show()"
        :disabled="selectedProjects.length === 0"
      >
        Edit Links
      </button>
      <br />
      <div class="table-container">
        <table>
          <tr>
            <th>
              <Checkbox
                @input="
                  selectedProjects === projects
                    ? (selectedProjects = [])
                    : selectAllProjects()
                "
                :value="selectedProjects === projects"
              />
            </th>
            <th>Name</th>
            <th>ID</th>
            <th>Type</th>
            <th>Status</th>
            <th>Role</th>
            <th></th>
          </tr>
          <tr v-for="project in projects" :key="project.id">
            <td>
              <Checkbox
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
            <td>{{ project.title }}</td>
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
    </section>
  </div>
</template>

<script>
import Badge from '~/components/ui/Badge.vue'
import Checkbox from '~/components/ui/Checkbox.vue'
import Modal from '~/components/ui/Modal.vue'

import SettingsIcon from '~/assets/images/utils/settings.svg?inline'

export default {
  components: {
    Badge,
    SettingsIcon,
    Checkbox,
    Modal,
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
  data() {
    return {
      selectedProjects: [],
      bulkEditSelection: '',
      bulkEdit: {
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
      showBulkEditModal: false,
    }
  },
  methods: {
    selectAllProjects() {
      this.selectedProjects = this.projects
    },
    uppercaseString(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
  },
  fetch() {},
  head: {
    title: 'Projects - Modrinth',
  },
}
</script>
<style lang="scss" scoped>
.status {
  margin-top: var(--spacing-card-xs);
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
