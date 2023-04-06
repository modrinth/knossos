<template>
  <div>
    <ModalModeration
      ref="modal"
      :project="currentProject"
      :status="currentStatus"
      :on-close="onModalClose"
    />
    <section class="universal-card">
      <h2>Project queue</h2>
      <div class="input-group">
        <Chips
          v-model="projectType"
          :items="projectTypes"
          :format-label="(x) => (x === 'all' ? 'All' : $formatProjectType(x) + 's')"
        />
        <button v-if="oldestFirst" class="iconified-button push-right" @click="oldestFirst = false">
          <SortDescIcon />Sorting by oldest
        </button>
        <button v-else class="iconified-button push-right" @click="oldestFirst = true">
          <SortAscIcon />Sorting by newest
        </button>
      </div>
      <div
        v-for="project in projects
          .sort((a, b) => {
            if (oldestFirst) {
              return b.age - a.age
            } else {
              return a.age - b.age
            }
          })
          .filter(
            (x) =>
              projectType === 'all' ||
              app.$getProjectTypeForUrl(x.project_type, x.loaders) === projectType
          )"
        :key="`project-${project.id}`"
        class="universal-card recessed project"
      >
        <div class="title-row">
          <nuxt-link
            :to="`/${project.inferred_project_type}/${project.slug}`"
            class="iconified-stacked-link project-title"
          >
            <Avatar :src="project.icon_url" size="xs" no-shadow raised />
            <span class="stacked">
              <span class="title">{{ project.title }}</span>
              <span>{{ $formatProjectType(project.inferred_project_type) }}</span>
            </span>
          </nuxt-link>
          by
          <nuxt-link :to="`/user/${project.owner.username}`" class="iconified-link">
            <Avatar :src="project.owner.avatar_url" circle size="xxs" raised />
            <span>{{ project.owner.username }}</span>
          </nuxt-link>
          is requesting to be
          <Badge :type="project.requested_status" />
        </div>
        <div class="input-group">
          <nuxt-link
            :to="`/${project.inferred_project_type}/${project.slug}`"
            class="iconified-button raised-button"
            ><EyeIcon /> View project</nuxt-link
          >
          <button
            class="iconified-button brand-button"
            @click="
              setProjectStatus(
                project,
                project.requested_status ? project.requested_status : 'approved'
              )
            "
          >
            <CheckIcon /> Approve
          </button>
          <button
            class="iconified-button danger-button"
            @click="setProjectStatus(project, 'withheld')"
          >
            <EyeOffIcon /> Withhold
          </button>
          <button
            class="iconified-button danger-button"
            @click="setProjectStatus(project, 'rejected')"
          >
            <CrossIcon /> Reject
          </button>
        </div>
        <span v-if="project.queued" :class="`submitter-info ${project.age_warning}`">
          <WarningIcon v-if="project.age_warning" />
          Submitted for review
          <span v-tooltip="$dayjs(project.queued).format('MMMM D, YYYY [at] h:mm A')">{{
            fromNow(project.queued)
          }}</span>
        </span>
        <span v-else class="submitter-info"><UnknownIcon /> Unknown queue date</span>
      </div>
    </section>
  </div>
</template>
<script setup>
import Chips from '~/components/ui/Chips.vue'
import Avatar from '~/components/ui/Avatar.vue'
import UnknownIcon from '~/assets/images/utils/unknown.svg'
import CheckIcon from '~/assets/images/utils/check.svg'
import EyeOffIcon from '~/assets/images/utils/eye-off.svg'
import CrossIcon from '~/assets/images/utils/x.svg'
import EyeIcon from '~/assets/images/utils/eye.svg'
import SortAscIcon from '~/assets/images/utils/sort-asc.svg'
import SortDescIcon from '~/assets/images/utils/sort-desc.svg'
import WarningIcon from '~/assets/images/utils/issues.svg'
import Badge from '~/components/ui/Badge.vue'
import ModalModeration from '~/components/ui/ModalModeration'

useHead({
  title: 'Review projects - Modrinth',
})

const app = useNuxtApp()

const [rawProjects] = await Promise.all([
  useBaseFetch('moderation/projects', app.$defaultHeaders()),
])

const teamIds = rawProjects.map((x) => x.team)

const [rawMembers] = await Promise.all([
  useBaseFetch('teams?ids=' + JSON.stringify(teamIds), app.$defaultHeaders()),
])

const now = app.$dayjs()
const time24h = 86400000

rawProjects.map((project) => {
  project.owner = rawMembers
    .flat()
    .find((x) => x.team_id === project.team && x.role === 'Owner').user
  project.age = project.queued ? now - app.$dayjs(project.queued) : Number.MAX_VALUE
  project.age_warning = ''
  if (project.age > time24h * 2) {
    project.age_warning = 'danger'
  } else if (project.age > time24h) {
    project.age_warning = 'warning'
  }
  project.inferred_project_type = app.$getProjectTypeForUrl(project.project_type, project.loaders)
  return project
})

const projectTypes = computed(() => {
  const set = new Set()
  set.add('all')

  for (const project of rawProjects) {
    set.add(project.inferred_project_type)
  }

  return [...set]
})

const projects = ref(rawProjects)
const projectType = ref('all')
const oldestFirst = ref(true)

const currentProject = ref(null)
const currentStatus = ref(null)

const modal = ref(null)

function setProjectStatus(project, status) {
  this.currentProject = project
  this.currentStatus = status

  modal.value.show()
}

function onModalClose() {
  this.projects.splice(
    this.projects.findIndex((x) => this.currentProject.id === x.id),
    1
  )
  this.currentProject = null
}
</script>
<style lang="scss" scoped>
.project {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-card-sm);
}
.project-title {
  gap: var(--spacing-card-sm);
  margin-right: var(--spacing-card-xs);
}
.submitter-info {
  margin: 0;

  svg {
    vertical-align: top;
  }

  &.warning {
    color: var(--color-special-orange);
  }

  &.danger {
    color: var(--color-special-red);
    font-weight: bold;
  }
}

.title-row {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-card-xs);
  align-items: center;
  flex-wrap: wrap;
}

:deep(.avatar) {
  flex-shrink: 0;
}
</style>
