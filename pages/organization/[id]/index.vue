<script setup>
import { CheckIcon, XIcon, Promotion, ProjectCard } from 'omorphia'
import { acceptTeamInvite, removeTeamMember } from '~/helpers/teams.js'

import UpToDate from '~/assets/images/illustrations/up_to_date.svg'

const cosmetics = useCosmetics()
const tags = useTags()
const auth = await useAuth()
const user = await useUser()

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
  typeFilter: {
    type: String,
    default: '',
  },
  resetOrganization: {
    type: Function,
    default: () => {},
  },
  currentMember: {
    type: Object,
    default: () => ({}),
  },
})

const selectedFilters = ref([])

selectedFilters.value.push(
  ...props.projects.map((p) => p.project_type).filter((v, i, a) => a.indexOf(v) === i)
)

const protectedRequest = async (r) => {
  startLoading()

  try {
    await r()
    await props.resetOrganization()
  } catch (error) {
    addNotification({
      group: 'main',
      title: 'An error occurred',
      text: error?.data?.description || error.message || error || 'Unknown error',
      type: 'error',
    })
  }

  stopLoading()
}

const acceptInvite = async () => {
  await protectedRequest(async () => await acceptTeamInvite(props.organization.team_id))
}

const declineInvite = async () => {
  await protectedRequest(
    async () => await removeTeamMember(props.organization.team_id, auth.value?.user.id)
  )
}
</script>

<template>
  <div class="normal-page__content">
    <div v-if="props.currentMember?.accepted === false" class="universal-card information invited">
      <h2>Invitation to join {{ organization.name }}</h2>
      <p>You have been invited to join {{ organization.name }}.</p>
      <div class="input-group">
        <button class="iconified-button brand-button" @click="acceptInvite()">
          <CheckIcon />Accept
        </button>
        <button class="iconified-button danger-button" @click="declineInvite()">
          <XIcon />Decline
        </button>
      </div>
    </div>
    <Promotion />
    <template v-if="props.projects?.length > 0">
      <div class="project-list display-mode--list">
        <ProjectCard
          v-for="project in props.projects"
          :id="project.slug || project.id"
          :key="project.id"
          :name="project.name"
          :display="cosmetics.searchDisplayMode.user"
          :featured-image="
            project.gallery
              .slice()
              .sort((a, b) => b.featured - a.featured)
              .map((x) => x.url)[0]
          "
          project-type-url="project"
          :description="project.summary"
          :created-at="project.published"
          :updated-at="project.updated"
          :downloads="project.downloads.toString()"
          :follows="project.followers.toString()"
          :icon-url="project.icon_url"
          :categories="project.categories"
          :client-side="project.client_side"
          :server-side="project.server_side"
          :status="
            auth.user && (auth.user.id === user.id || tags.staffRoles.includes(auth.user.role))
              ? project.status
              : null
          "
          :type="project.project_type"
          :color="project.color"
        />
      </div>
    </template>

    <div v-else-if="true" class="error">
      <UpToDate class="icon" /><br />
      <span class="preserve-lines text">
        This organization doesn't have any projects yet. Would you like to
        <nuxt-link :to="`/organization/${organization.id}/settings/projects`" class="url"
          >create one?</nuxt-link
        >?
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.title-and-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  h3 {
    margin: 0;
  }
  a {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    color: var(--color-blue);
  }
}
.project-overview {
  gap: var(--gap-md);
  padding: var(--gap-xl);
  .project-card {
    padding: 0;
    border-radius: 0;
    background-color: transparent;
    box-shadow: none;
    :deep(.title) {
      font-size: var(--font-size-nm) !important;
    }
  }
}
.popout-heading {
  padding: var(--gap-sm) var(--gap-md);
  margin: 0;
  font-size: var(--font-size-md);
  color: var(--color-text);
}
.popout-checkbox {
  padding: var(--gap-sm) var(--gap-md);
}
</style>
