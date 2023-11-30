<template>
  <div>
    <Modal
      ref="editLinksModal"
      header="Edit links"
      :noblur="!(cosmetics.advancedRendering ?? true)"
    >
      <div class="universal-modal links-modal">
        <p>
          Any links you specify below will be overwritten on each of the selected projects. Any you
          leave blank will be ignored. You can clear a link from all selected projects using the
          trash can button.
        </p>
        <section class="links">
          <label
            for="issue-tracker-input"
            title="A place for users to report bugs, issues, and concerns about your project."
          >
            <span class="label__title">Issue tracker</span>
          </label>
          <div class="input-group shrink-first">
            <input
              id="issue-tracker-input"
              v-model="editLinks.issues.val"
              :disabled="editLinks.issues.clear"
              type="url"
              :placeholder="
                editLinks.issues.clear ? 'Existing link will be cleared' : 'Enter a valid URL'
              "
              maxlength="2048"
            />
            <button
              v-tooltip="'Clear link'"
              aria-label="Clear link"
              class="btn icon-only label-button"
              :data-active="editLinks.issues.clear"
              @click="editLinks.issues.clear = !editLinks.issues.clear"
            >
              <TrashIcon />
            </button>
          </div>
          <label
            for="source-code-input"
            title="A page/repository containing the source code for your project"
          >
            <span class="label__title">Source code</span>
          </label>
          <div class="input-group shrink-first">
            <input
              id="source-code-input"
              v-model="editLinks.source.val"
              :disabled="editLinks.source.clear"
              type="url"
              maxlength="2048"
              :placeholder="
                editLinks.source.clear ? 'Existing link will be cleared' : 'Enter a valid URL'
              "
            />
            <button
              v-tooltip="'Clear link'"
              aria-label="Clear link"
              class="btn icon-only label-button"
              :data-active="editLinks.source.clear"
              @click="editLinks.source.clear = !editLinks.source.clear"
            >
              <TrashIcon />
            </button>
          </div>
          <label
            for="wiki-page-input"
            title="A page containing information, documentation, and help for the project."
          >
            <span class="label__title">Wiki page</span>
          </label>
          <div class="input-group shrink-first">
            <input
              id="wiki-page-input"
              v-model="editLinks.wiki.val"
              :disabled="editLinks.wiki.clear"
              type="url"
              maxlength="2048"
              :placeholder="
                editLinks.wiki.clear ? 'Existing link will be cleared' : 'Enter a valid URL'
              "
            />
            <button
              v-tooltip="'Clear link'"
              aria-label="Clear link"
              class="btn icon-only label-button"
              :data-active="editLinks.wiki.clear"
              @click="editLinks.wiki.clear = !editLinks.wiki.clear"
            >
              <TrashIcon />
            </button>
          </div>
          <label for="discord-invite-input" title="An invitation link to your Discord server.">
            <span class="label__title">Discord invite</span>
          </label>
          <div class="input-group shrink-first">
            <input
              id="discord-invite-input"
              v-model="editLinks.discord.val"
              :disabled="editLinks.discord.clear"
              type="url"
              maxlength="2048"
              :placeholder="
                editLinks.discord.clear
                  ? 'Existing link will be cleared'
                  : 'Enter a valid Discord invite URL'
              "
            />
            <button
              v-tooltip="'Clear link'"
              aria-label="Clear link"
              class="btn icon-only label-button"
              :data-active="editLinks.discord.clear"
              @click="editLinks.discord.clear = !editLinks.discord.clear"
            >
              <TrashIcon />
            </button>
          </div>
        </section>
        <p>
          Changes will be applied to
          <strong>{{ selectedProjects.length }}</strong> project{{
            selectedProjects.length > 1 ? 's' : ''
          }}.
        </p>
        <ul>
          <li
            v-for="project in selectedProjects.slice(
              0,
              editLinks.showAffected ? selectedProjects.length : 3
            )"
            :key="project.id"
          >
            {{ project.title }}
          </li>
          <li v-if="!editLinks.showAffected && selectedProjects.length > 3">
            <strong>and {{ selectedProjects.length - 3 }} more...</strong>
          </li>
        </ul>
        <Checkbox
          v-if="selectedProjects.length > 3"
          v-model="editLinks.showAffected"
          :label="editLinks.showAffected ? 'Less' : 'More'"
          description="Show all loaders"
          :border="false"
          :collapsing-toggle-style="true"
        />
        <div class="push-right input-group">
          <button class="btn" @click="$refs.editLinksModal.hide()">
            <XIcon />
            Cancel
          </button>
          <button class="btn btn-primary" @click="bulkEditLinks()">
            <SaveIcon />
            Save changes
          </button>
        </div>
      </div>
    </Modal>
    <ModalCreation ref="modal_creation" />
    <h1>Projects</h1>
    <div class="input-group">
      <button class="btn btn-primary" @click="$refs.modal_creation.show()">
        <PlusIcon />
        Create a project
      </button>
    </div>
    <p v-if="projects.length < 1">
      You don't have any projects yet. Click the green button above to begin.
    </p>
    <template v-else>
      <p>You can edit multiple projects at once by selecting them below.</p>
      <div class="input-group">
        <button
          class="btn"
          :disabled="selectedProjects.length === 0"
          @click="$refs.editLinksModal.show()"
        >
          <EditIcon />
          Edit links
        </button>
        <div class="push-right">
          <div class="labeled-control-row">
            Sort by
            <Multiselect
              v-model="sortBy"
              :searchable="false"
              class="small-select"
              :options="['Name', 'Status', 'Type']"
              :close-on-select="true"
              :show-labels="false"
              :allow-empty="false"
              @update:model-value="projects = updateSort(projects, sortBy, descending)"
            />
            <button
              v-tooltip="descending ? 'Descending' : 'Ascending'"
              class="btn icon-only"
              @click="updateDescending()"
            >
              <SortDescendingIcon v-if="descending" />
              <SortAscendingIcon v-else />
            </button>
          </div>
        </div>
      </div>
      <div class="grid-table card">
        <div class="grid-table__row grid-table__header">
          <div>
            <Checkbox
              :model-value="selectedProjects === projects"
              @update:model-value="
                selectedProjects === projects
                  ? (selectedProjects = [])
                  : (selectedProjects = projects)
              "
            />
          </div>
          <div>Icon</div>
          <div>Name</div>
          <div>ID</div>
          <div>Type</div>
          <div>Status</div>
          <div />
        </div>
        <div v-for="project in projects" :key="`project-${project.id}`" class="grid-table__row">
          <div>
            <Checkbox
              :disabled="(project.permissions & EDIT_DETAILS) === EDIT_DETAILS"
              :model-value="selectedProjects.includes(project)"
              @update:model-value="
                selectedProjects.includes(project)
                  ? (selectedProjects = selectedProjects.filter((it) => it !== project))
                  : selectedProjects.push(project)
              "
            />
          </div>
          <div>
            <nuxt-link
              tabindex="-1"
              :to="`/${getProjectTypeForUrl(project.project_type, project.loaders)}/${
                project.slug ? project.slug : project.id
              }`"
            >
              <Avatar
                :src="project.icon_url"
                aria-hidden="true"
                :alt="'Icon for ' + project.title"
                no-shadow
              />
            </nuxt-link>
          </div>

          <div>
            <span class="project-title">
              <IssuesIcon
                v-if="project.moderator_message"
                aria-label="Project has a message from the moderators. View the project to see more."
              />

              <nuxt-link
                class="hover-link wrap-as-needed"
                :to="`/${getProjectTypeForUrl(project.project_type, project.loaders)}/${
                  project.slug ? project.slug : project.id
                }`"
              >
                {{ project.title }}
              </nuxt-link>
            </span>
          </div>

          <div>
            <CopyCode :text="project.id" />
          </div>

          <div>
            {{ formatProjectType(getProjectTypeForUrl(project.project_type, project.loaders)) }}
          </div>

          <div>
            <Badge v-if="project.status" :type="project.status" class="status" />
          </div>

          <div>
            <nuxt-link
              class="btn icon-only"
              :to="`/${getProjectTypeForUrl(project.project_type, project.loaders)}/${
                project.slug ? project.slug : project.id
              }/settings`"
            >
              <SettingsIcon />
            </nuxt-link>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { Multiselect } from 'vue-multiselect'
import {
  Badge,
  Checkbox,
  Modal,
  Avatar,
  CopyCode,
  SettingsIcon,
  TrashIcon,
  IssuesIcon,
  PlusIcon,
  XIcon,
  EditIcon,
  SaveIcon,
  SortAscendingIcon,
  SortDescendingIcon,
  formatProjectType,
} from 'omorphia'
import { getProjectTypeForUrl } from '~/helpers/projects.js'
import ModalCreation from '~/components/ui/ModalCreation.vue'

useHead({
  title: 'Projects - Modrinth',
})

const cosmetics = useCosmetics()
const user = await useUser()
await initUserProjects()

const editLinksModal = ref()

const EDIT_DETAILS = ref(1 << 2)

const projects = ref(updateSort(user.value.projects, 'Name'))
const selectedProjects = ref([])
const sortBy = ref('Name')
const descending = ref(false)
const editLinks = ref({
  showAffected: false,
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
})

function updateDescending() {
  descending.value = !descending.value
  projects.value = updateSort(projects.value, sortBy.value, descending.value)
}

function updateSort(projects, sort, descending) {
  let sortedArray = projects
  switch (sort) {
    case 'Name':
      sortedArray = projects.slice().sort((a, b) => {
        return a.title.localeCompare(b.title)
      })
      break
    case 'Status':
      sortedArray = projects.slice().sort((a, b) => {
        if (a.status < b.status) {
          return -1
        }
        if (a.status > b.status) {
          return 1
        }
        return 0
      })
      break
    case 'Type':
      sortedArray = projects.slice().sort((a, b) => {
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

  if (descending) {
    sortedArray = sortedArray.reverse()
  }

  return sortedArray
}

async function bulkEditLinks() {
  try {
    const baseData = {
      issues_url: editLinks.value.issues.clear ? null : editLinks.value.issues.val.trim(),
      source_url: editLinks.value.source.clear ? null : editLinks.value.source.val.trim(),
      wiki_url: editLinks.value.wiki.clear ? null : editLinks.value.wiki.val.trim(),
      discord_url: editLinks.value.discord.clear ? null : editLinks.value.discord.val.trim(),
    }

    if (!baseData.issues_url?.length ?? 1 > 0) {
      delete baseData.issues_url
    }

    if (!baseData.source_url?.length ?? 1 > 0) {
      delete baseData.source_url
    }

    if (!baseData.wiki_url?.length ?? 1 > 0) {
      delete baseData.wiki_url
    }

    if (!baseData.discord_url?.length ?? 1 > 0) {
      delete baseData.discord_url
    }

    await useBaseFetch(`projects?ids=${JSON.stringify(selectedProjects.value.map((x) => x.id))}`, {
      method: 'PATCH',
      body: baseData,
    })

    editLinksModal.value.hide()
    addNotification({
      group: 'main',
      title: 'Success',
      text: "Bulk edited selected project's links.",
      type: 'success',
    })
    selectedProjects.value = []

    editLinks.value.issues.val = ''
    editLinks.value.source.val = ''
    editLinks.value.wiki.val = ''
    editLinks.value.discord.val = ''
    editLinks.value.issues.clear = false
    editLinks.value.source.clear = false
    editLinks.value.wiki.clear = false
    editLinks.value.discord.clear = false
  } catch (e) {
    addNotification({
      group: 'main',
      title: 'An error occurred',
      text: e,
      type: 'error',
    })
  }
}
</script>
<style lang="scss" scoped>
.grid-table {
  display: grid;
  grid-template-columns:
    min-content min-content minmax(min-content, 2fr)
    minmax(min-content, 1fr) minmax(min-content, 1fr) minmax(min-content, 1fr) min-content;
  border-radius: var(--radius-sm);
  overflow: hidden;
  margin-top: var(--gap-md);

  .grid-table__row {
    display: contents;

    > div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: var(--gap-sm);

      // Left edge of table
      &:first-child {
        padding-left: var(--gap-lg);
      }

      // Right edge of table
      &:last-child {
        padding-right: var(--gap-lg);
      }
    }

    &:nth-child(2n + 1) > div {
      background-color: var(--color-alt-bg);
    }

    &.grid-table__header > div {
      background-color: var(--color-bg);
      font-weight: bold;
      color: var(--color-contrast);
      padding-top: var(--gap-lg);
      padding-bottom: var(--gap-lg);
    }
  }

  @media screen and (max-width: 750px) {
    display: flex;
    flex-direction: column;

    .grid-table__row {
      display: grid;
      grid-template: 'checkbox icon name type settings' 'checkbox icon id status settings';
      grid-template-columns:
        min-content min-content minmax(min-content, 2fr)
        minmax(min-content, 1fr) min-content;

      :nth-child(1) {
        grid-area: checkbox;
      }

      :nth-child(2) {
        grid-area: icon;
      }

      :nth-child(3) {
        grid-area: name;
      }

      :nth-child(4) {
        grid-area: id;
        padding-top: 0;
      }

      :nth-child(5) {
        grid-area: type;
      }

      :nth-child(6) {
        grid-area: status;
        padding-top: 0;
      }

      :nth-child(7) {
        grid-area: settings;
      }
    }

    .grid-table__header {
      grid-template: 'checkbox settings';
      grid-template-columns: min-content minmax(min-content, 1fr);

      :nth-child(2),
      :nth-child(3),
      :nth-child(4),
      :nth-child(5),
      :nth-child(6) {
        display: none;
      }
    }
  }

  @media screen and (max-width: 560px) {
    .grid-table__row {
      display: grid;
      grid-template: 'checkbox icon name settings' 'checkbox icon id settings' 'checkbox icon type settings' 'checkbox icon status settings';
      grid-template-columns: min-content min-content minmax(min-content, 1fr) min-content;

      :nth-child(5) {
        padding-top: 0;
      }
    }

    .grid-table__header {
      grid-template: 'checkbox settings';
      grid-template-columns: min-content minmax(min-content, 1fr);
    }
  }
}

.project-title {
  display: flex;
  flex-direction: row;
  gap: var(--gap-xs);

  svg {
    color: var(--color-orange);
  }
}

.status {
  margin-top: var(--gap-xs);
}

.hover-link:hover {
  text-decoration: underline;
}

.labeled-control-row {
  flex: 1;
  display: flex;
  flex-direction: row;
  min-width: 0;
  align-items: center;
  gap: var(--gap-md);
  white-space: nowrap;
}

.small-select {
  width: -moz-fit-content;
  width: fit-content;
}

.label-button[data-active='true'] {
  --background-color: var(--color-red);
  --text-color: var(--color-accent-contrast);
}

.links-modal {
  .links {
    display: grid;
    gap: var(--gap-sm);
    grid-template-columns: 1fr 2fr;

    .input-group {
      flex-wrap: nowrap;
    }

    @media screen and (max-width: 530px) {
      grid-template-columns: 1fr;
      .input-group {
        flex-wrap: wrap;
      }
    }
  }

  ul {
    margin: 0 0 var(--gap-sm) 0;
  }
}

h1 {
  margin-block: var(--gap-sm) var(--gap-lg);
  font-size: 2em;
  line-height: 1em;
}

.card {
  padding: 0;
}
</style>
