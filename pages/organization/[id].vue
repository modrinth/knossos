<template>
  <div v-if="organization" class="normal-page">
    <div class="normal-page__sidebar">
      <Card>
        <div class="card__overlay input-group">
          <!-- If the user is able to edit org -->
          <template v-if="hasPermission && !routeHasSettings">
            <nuxt-link :to="`/organization/${organization.id}/settings`" class="btn">
              <EditIcon />
              Edit
            </nuxt-link>
          </template>
        </div>

        <div class="page-header__icon">
          <Avatar size="md" :src="organization.icon_url" />
        </div>

        <div class="page-header__text">
          <h1 class="title">{{ organization.name }}</h1>

          <div class="collection-info">
            <div class="metadata-item markdown-body collection-description">
              <p>{{ organization.description }}</p>
            </div>

            <hr class="card-divider" />

            <div class="primary-stat">
              <UserIcon class="primary-stat__icon" aria-hidden="true" />
              <div class="primary-stat__text">
                <span class="primary-stat__counter">
                  {{ $formatNumber(acceptedMembers?.length || 0) }}
                </span>
                member<span v-if="acceptedMembers?.length !== 1">s</span>
              </div>
            </div>

            <div class="primary-stat">
              <BoxIcon class="primary-stat__icon" aria-hidden="true" />
              <div class="primary-stat__text">
                <span class="primary-stat__counter">
                  {{ $formatNumber(projects?.length || 0) }}
                </span>
                project<span v-if="organization.projects?.length !== 1">s</span>
              </div>
            </div>

            <hr class="card-divider" />

            <div class="stats-block__item secondary-stat">
              <OrganizationIcon class="secondary-stat__icon" aria-hidden="true" />
              <span class="secondary-stat__text">
                Org ID:
                <CopyCode :text="organization.id" />
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card class="creator-list">
        <div class="title-and-link">
          <h3>Members</h3>
        </div>
        <template v-for="member in acceptedMembers" :key="member.user.id">
          <nuxt-link class="creator button-base" :to="`/user/${member.user.username}`">
            <Avatar :src="member.user.avatar_url" circle />
            <p class="name">{{ member.user.username }}</p>
            <p class="role">{{ member.role }}</p>
          </nuxt-link>
        </template>
      </Card>
    </div>
    <NuxtPage />
  </div>
</template>

<script setup>
import { Avatar, Card, CopyCode, EditIcon, BoxIcon, UserIcon } from 'omorphia'

import OrganizationIcon from '~/assets/images/utils/organization.svg'

const auth = await useAuth()
const route = useRoute()
const tags = useTags()

const orgId = useRouteId()

// hacky way to show the edit button on the corner of the card.
const routeHasSettings = computed(() => route.path.includes('settings'))

const [
  { data: organization, refresh: refreshOrganization },
  { data: projects, refresh: refreshProjects },
] = await Promise.all([
  useAsyncData(`organization/${orgId}`, () =>
    useBaseFetch(`organization/${orgId}`, { apiVersion: 3 })
  ),
  useAsyncData(`organization/${orgId}/projects`, () =>
    useBaseFetch(`organization/${orgId}/projects`, { apiVersion: 3 })
  ),
])

const refresh = async () => {
  await Promise.all([refreshOrganization(), refreshProjects()])
}

if (!organization.value) {
  throw createError({
    fatal: true,
    statusCode: 404,
    message: 'Organization not found',
  })
}

const acceptedMembers = computed(() => organization.value.members.filter((x) => x.accepted))

const currentMember = computed(() => {
  if (auth.value.user && organization.value) {
    const member = organization.value.members.find((x) => x.user.id === auth.value.user.id)

    if (member) {
      return member
    }

    if (tags.value.staffRoles.includes(auth.value.user.role)) {
      return {
        user: auth.value.user,
        role: auth.value.user.role,
        permissions: auth.value.user.role === 'admin' ? 1023 : 12,
        accepted: true,
        payouts_split: 0,
        avatar_url: auth.value.user.avatar_url,
        name: auth.value.user.username,
      }
    }
  }

  return null
})

const hasPermission = computed(() => {
  const EDIT_DETAILS = 1 << 2
  return currentMember.value && (currentMember.value.permissions & EDIT_DETAILS) === EDIT_DETAILS
})

const patchIcon = async (icon) => {
  const ext = icon.name.split('.').pop()
  await useBaseFetch(`organization/${organization.value.id}/icon`, {
    method: 'PATCH',
    body: icon,
    query: { ext },
    apiVersion: 3,
  })
}

const deleteIcon = async () => {
  await useBaseFetch(`organization/${organization.value.id}/icon`, {
    method: 'DELETE',
    apiVersion: 3,
  })
}

const patchOrganization = async (orgId, newData) => {
  await useBaseFetch(`organization/${orgId}`, {
    method: 'PATCH',
    body: newData,
    apiVersion: 3,
  })
}

provide('organizationContext', {
  organization,
  projects,
  refresh,
  currentMember,
  hasPermission,
  patchIcon,
  deleteIcon,
  patchOrganization,
})
</script>
<style scoped lang="scss">
.card {
  padding: var(--spacing-card-lg);
  overflow: hidden;

  .page-header__icon {
    margin-block: 0;
  }

  .card__overlay {
    top: var(--spacing-card-lg);
    right: var(--spacing-card-lg);
  }

  h1 {
    margin-bottom: var(--gap-md);
  }
}

.creator-list {
  display: flex;
  flex-direction: column;
  padding: var(--gap-xl);
  h3 {
    margin: 0 0 var(--gap-sm);
  }
  .creator {
    display: grid;
    gap: var(--gap-xs);
    background-color: var(--color-raised-bg);
    padding: var(--gap-sm);
    margin-left: -0.5rem;
    border-radius: var(--radius-lg);
    grid-template:
      'avatar name' auto
      'avatar role' auto
      / auto 1fr;
    p {
      margin: 0;
    }
    .name {
      grid-area: name;
      align-self: flex-end;
      margin-left: var(--gap-xs);
      font-weight: bold;
    }
    .role {
      grid-area: role;
      align-self: flex-start;
      margin-left: var(--gap-xs);
    }
    .avatar {
      grid-area: avatar;
    }
  }
}

.secondary-stat {
  align-items: center;
  display: flex;
  margin-bottom: 0.8rem;
}

.secondary-stat__icon {
  height: 1rem;
  width: 1rem;
}

.secondary-stat__text {
  margin-left: 0.4rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
