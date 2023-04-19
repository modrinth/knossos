<template>
  <div>
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
      <p v-if="projectType !== 'all'" class="project-count">
        Showing
        {{
          projects.filter(
            (x) =>
              projectType === 'all' ||
              app.$getProjectTypeForUrl(x.project_type, x.loaders) === projectType
          ).length
        }}
        {{ ($formatProjectType(projectType) + 's').toLowerCase() }}
        of {{ projects.length }} total projects in the queue.
      </p>
      <p v-else class="project-count">There are {{ projects.length }} projects in the queue.</p>
      <p class="warning project-count">
        <WarningIcon />
        {{
          projectsOver24Hours.filter(
            (x) =>
              projectType === 'all' ||
              app.$getProjectTypeForUrl(x.project_type, x.loaders) === projectType
          ).length
        }}
        {{
          projectType === 'all' ? 'projects' : ($formatProjectType(projectType) + 's').toLowerCase()
        }}
        have been in the queue for over 24 hours.
      </p>
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
          <Badge :type="project.requested_status ? project.requested_status : 'approved'" />
        </div>
        <div class="input-group">
          <nuxt-link
            :to="`/${project.inferred_project_type}/${project.slug}`"
            class="iconified-button raised-button"
            ><EyeIcon /> View project</nuxt-link
          >
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
import EyeIcon from '~/assets/images/utils/eye.svg'
import SortAscIcon from '~/assets/images/utils/sort-asc.svg'
import SortDescIcon from '~/assets/images/utils/sort-desc.svg'
import WarningIcon from '~/assets/images/utils/issues.svg'
import Badge from '~/components/ui/Badge.vue'

useHead({
  title: 'Review projects - Modrinth',
})

const app = useNuxtApp()

const [rawProjects] = await Promise.all([
  useBaseFetch('moderation/projects?count=1000', app.$defaultHeaders()),
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

const projectsOver24Hours = computed(() => rawProjects.filter((project) => project.age > time24h))

const projects = ref(rawProjects)
const projectType = ref('all')
const oldestFirst = ref(true)
</script>
<style lang="scss" scoped>
.project {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-card-sm);
  @media screen and (min-width: 650px) {
    display: grid;
    grid-template: 'title action' 'date action';
    grid-template-columns: 1fr auto;
  }
}
.project-title {
  gap: var(--spacing-card-sm);
  margin-right: var(--spacing-card-xs);
  grid-area: title;
}
.submitter-info {
  margin: 0;
  grid-area: date;

  svg {
    vertical-align: top;
  }
}

.warning {
  color: var(--color-special-orange);
}

.danger {
  color: var(--color-special-red);
  font-weight: bold;
}

.project-count {
  margin-block: var(--spacing-card-md);

  svg {
    vertical-align: top;
  }
}

.input-group {
  grid-area: action;
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
