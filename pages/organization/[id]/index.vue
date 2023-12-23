<script setup>
import { CheckIcon, XIcon, Promotion, ProjectCard } from 'omorphia'
import { acceptTeamInvite, removeTeamMember } from '~/helpers/teams.js'

import UpToDate from '~/assets/images/illustrations/up_to_date.svg'

const cosmetics = useCosmetics()
const tags = useTags()
const auth = await useAuth()
const user = await useUser()

const {
  organization,
  refresh: refreshOrganization,
  projects,
  currentMember,
} = inject('organizationContext')

const isInvited = computed(() => {
  return currentMember.value?.accepted === false
})

const selectedFilters = ref([])
selectedFilters.value.push(
  ...projects.value.map((p) => p.project_type).filter((v, i, a) => a.indexOf(v) === i)
)

const onAcceptInvite = useClientTry(async () => {
  await acceptTeamInvite(organization.value.team_id)
  await refreshOrganization()
})

const onDeclineInvite = useClientTry(async () => {
  await removeTeamMember(organization.value.team_id, auth.value?.user.id)
  await refreshOrganization()
})
</script>

<template>
  <div class="normal-page__content">
    <div v-if="isInvited" class="universal-card information invited">
      <h2>Invitation to join {{ organization.name }}</h2>
      <p>You have been invited to join {{ organization.name }}.</p>
      <div class="input-group">
        <button class="iconified-button brand-button" @click="onAcceptInvite">
          <CheckIcon />Accept
        </button>
        <button class="iconified-button danger-button" @click="onDeclineInvite">
          <XIcon />Decline
        </button>
      </div>
    </div>
    <Promotion />
    <template v-if="projects?.length > 0">
      <div class="project-list display-mode--list">
        <ProjectCard
          v-for="project in projects"
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
        This organization doesn't have any projects yet.
        <template v-if="isPermission(currentMember?.organization_permissions, 1 << 4)">
          Would you like to <nuxt-link class="link" to="/project/create">Create one</nuxt-link>?
        </template>
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
