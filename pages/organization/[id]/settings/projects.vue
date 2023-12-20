<template>
  <div class="normal-page__content">
    <Modal ref="editLinksModal" header="Edit links">
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
            <Button
              v-tooltip="'Clear link'"
              aria-label="Clear link"
              class="square-button label-button"
              :data-active="editLinks.issues.clear"
              icon-only
              @click="editLinks.issues.clear = !editLinks.issues.clear"
            >
              <TrashIcon />
            </Button>
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
            <Button
              v-tooltip="'Clear link'"
              aria-label="Clear link"
              :data-active="editLinks.source.clear"
              icon-only
              @click="editLinks.source.clear = !editLinks.source.clear"
            >
              <TrashIcon />
            </Button>
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
            <Button
              v-tooltip="'Clear link'"
              aria-label="Clear link"
              :data-active="editLinks.wiki.clear"
              icon-only
              @click="editLinks.wiki.clear = !editLinks.wiki.clear"
            >
              <TrashIcon />
            </Button>
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
            <Button
              v-tooltip="'Clear link'"
              aria-label="Clear link"
              :data-active="editLinks.discord.clear"
              icon-only
              @click="editLinks.discord.clear = !editLinks.discord.clear"
            >
              <TrashIcon />
            </Button>
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
            {{ project.name }}
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
          <Button @click="$refs.editLinksModal.hide()">
            <XIcon />
            Cancel
          </Button>
          <Button color="primary" @click="bulkEditLinks()">
            <SaveIcon />
            Save changes
          </Button>
        </div>
      </div>
    </Modal>
    <ModalCreation ref="modal_creation" :organization="organization" />
    <Card>
      <h2>Projects</h2>
      <div class="input-group">
        <Button color="primary" @click="$refs.modal_creation.show()">
          <PlusIcon />
          Create a project
        </Button>
      </div>
      <p v-if="sortedProjects.length < 1">
        You don't have any projects yet. Click the green button above to begin.
      </p>
      <template v-else>
        <p>You can edit multiple projects at once by selecting them below.</p>
        <div class="input-group">
          <Button :disabled="selectedProjects.length === 0" @click="$refs.editLinksModal.show()">
            <EditIcon />
            Edit links
          </Button>
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
                @update:model-value="
                  sortedProjects = updateSort(sortedProjects, sortBy, descending)
                "
              />
              <Button
                v-tooltip="descending ? 'Descending' : 'Ascending'"
                class="square-button"
                icon-only
                @click="updateDescending()"
              >
                <SortDescendingIcon v-if="descending" />
                <SortAscendingIcon v-else />
              </Button>
            </div>
          </div>
        </div>
        <div class="table">
          <div class="table-row table-head">
            <div class="table-cell check-cell">
              <Checkbox
                :model-value="selectedProjects === sortedProjects"
                @update:model-value="
                  selectedProjects === sortedProjects
                    ? (selectedProjects = [])
                    : (selectedProjects = sortedProjects)
                "
              />
            </div>
            <div class="table-cell">Icon</div>
            <div class="table-cell">Name</div>
            <div class="table-cell">ID</div>
            <div class="table-cell">Type</div>
            <div class="table-cell">Status</div>
            <div class="table-cell" />
          </div>
          <div v-for="project in sortedProjects" :key="`project-${project.id}`" class="table-row">
            <div class="table-cell check-cell">
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
            <div class="table-cell">
              <nuxt-link
                tabindex="-1"
                :to="`/${getProjectTypeForUrl(project.project_type, project.loaders)}/${
                  project.slug ? project.slug : project.id
                }`"
              >
                <Avatar
                  :src="project.icon_url"
                  aria-hidden="true"
                  :alt="'Icon for ' + project.name"
                  no-shadow
                />
              </nuxt-link>
            </div>

            <div class="table-cell">
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
                  {{ project.name }}
                </nuxt-link>
              </span>
            </div>

            <div class="table-cell">
              <CopyCode :text="project.id" />
            </div>

            <div class="table-cell">
              {{ formatProjectType(getProjectTypeForUrl(project.project_type, project.loaders)) }}
            </div>

            <div class="table-cell">
              <Badge v-if="project.status" :type="project.status" class="status" />
            </div>

            <div class="table-cell">
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
    </Card>
  </div>
</template>

<script setup>
import { Multiselect } from 'vue-multiselect'
import {
  Badge,
  Checkbox,
  Modal,
  Avatar,
  Card,
  CopyCode,
  SettingsIcon,
  TrashIcon,
  IssuesIcon,
  PlusIcon,
  XIcon,
  EditIcon,
  SaveIcon,
  Button,
  SortAscendingIcon,
  SortDescendingIcon,
  formatProjectType,
} from 'omorphia'

import { getProjectTypeForUrl } from '~/helpers/projects.js'
import ModalCreation from '~/components/ui/ModalCreation.vue'

const props = defineProps({
  organization: {
    type: Object,
    default() {
      return {}
    },
  },
  projects: {
    type: Array,
    default() {
      return []
    },
  },
})

const EDIT_DETAILS = shallowRef(1 << 2)

const updateSort = (inputProjects, sort, descending) => {
  let sortedArray = inputProjects
  switch (sort) {
    case 'Name':
      sortedArray = inputProjects.slice().sort((a, b) => {
        return a.name.localeCompare(b.name)
      })
      break
    case 'Status':
      sortedArray = inputProjects.slice().sort((a, b) => {
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
      sortedArray = inputProjects.slice().sort((a, b) => {
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

const sortedProjects = ref(updateSort(props.projects, 'Name'))
const selectedProjects = ref([])
const sortBy = ref('Name')
const descending = ref(false)
const editLinksModal = ref(null)
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

const updateDescending = () => {
  descending.value = !descending.value
  sortedProjects.value = updateSort(sortedProjects.value, sortBy.value, descending.value)
}

const bulkEditLinks = async () => {
  try {
    const baseData = {
      issues_url: editLinks.issues.clear ? null : editLinks.issues.val.trim(),
      source_url: editLinks.source.clear ? null : editLinks.source.val.trim(),
      wiki_url: editLinks.wiki.clear ? null : editLinks.wiki.val.trim(),
      discord_url: editLinks.discord.clear ? null : editLinks.discord.val.trim(),
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
    $notify({
      group: 'main',
      title: 'Success',
      text: "Bulk edited selected project's links.",
      type: 'success',
    })
    selectedProjects.value = []

    editLinks.issues.val = ''
    editLinks.source.val = ''
    editLinks.wiki.val = ''
    editLinks.discord.val = ''
    editLinks.issues.clear = false
    editLinks.source.clear = false
    editLinks.wiki.clear = false
    editLinks.discord.clear = false
  } catch (e) {
    $notify({
      group: 'main',
      title: 'An error occurred',
      text: e,
      type: 'error',
    })
  }
}
</script>
<style lang="scss" scoped>
.table {
  display: grid;
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-top: var(--gap-md);
  border: 1px solid var(--color-button-bg);
  background-color: var(--color-raised-bg);

  .table-row {
    grid-template-columns: 2.75rem 3.75rem 2fr 1fr 1fr 1fr 3.5rem;
  }

  .table-cell {
    display: flex;
    align-items: center;
    padding: var(--gap-md);
    padding-left: 0;
  }

  .check-cell {
    padding-left: var(--gap-md);
  }

  @media screen and (max-width: 750px) {
    display: flex;
    flex-direction: column;

    .table-row {
      display: grid;
      grid-template: 'checkbox icon name type settings' 'checkbox icon id status settings';
      grid-template-columns:
        min-content min-content minmax(min-content, 2fr)
        minmax(min-content, 1fr) min-content;

      :nth-child(1) {
        grid-area: checkbox;
        padding-right: 0;
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

    .table-head {
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
    .table-row {
      display: grid;
      grid-template: 'checkbox icon name settings' 'checkbox icon id settings' 'checkbox icon type settings' 'checkbox icon status settings';
      grid-template-columns: min-content min-content minmax(min-content, 1fr) min-content;

      :nth-child(5) {
        padding-top: 0;
      }
    }

    .table-head {
      grid-template: 'checkbox settings';
      grid-template-columns: min-content minmax(min-content, 1fr);
    }
  }
}

.project-title {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-card-xs);

  svg {
    color: var(--color-special-orange);
  }
}

.status {
  margin-top: var(--spacing-card-xs);
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
  gap: var(--gap-sm);
  white-space: nowrap;
}

.small-select {
  width: fit-content;
  width: -moz-fit-content;
}

.label-button[data-active='true'] {
  --background-color: var(--color-special-red);
  --text-color: var(--color-brand-inverted);
}

.links-modal {
  .links {
    display: grid;
    gap: var(--spacing-card-sm);
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
    margin: 0 0 var(--spacing-card-sm) 0;
  }
}

h1 {
  margin-block: var(--gap-sm) var(--gap-lg);
  font-size: 2em;
  line-height: 1em;
}

:deep(.checkbox-outer) {
  button.checkbox {
    border: none;
  }
}
</style>