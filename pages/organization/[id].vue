<template>
  <div
    v-if="organization"
    class="normal-page"
    :class="{ 'alt-layout': $route.name.startsWith('organization-id-settings') }"
  >
    <div>
      <strong> TODO: remove debug </strong>
      <div>
        {{ organization }}
      </div>
    </div>
    <div class="normal-page__sidebar">
      <Card>
        <div class="card__overlay input-group">
          <!-- If the user is able to edit org -->
          <template v-if="hasPermission">
            <nuxt-link :to="`/organization/${organization.id}/settings`" class="btn">
              <EditIcon />
              Edit
            </nuxt-link>
          </template>
        </div>
        <!-- Content -->
        <template v-if="true">
          <div class="page-header__icon">
            <Avatar size="md" :src="organization.icon_url" />
          </div>
          <div class="page-header__text">
            <div class="title">
              <h1>{{ organization.name }}</h1>
            </div>

            <div class="collection-info">
              <div class="metadata-item markdown-body collection-description">
                <p>{{ organization.description }}</p>
              </div>

              <hr class="card-divider" />

              <div class="primary-stat">
                <UserIcon class="primary-stat__icon" aria-hidden="true" />
                <div class="primary-stat__text">
                  <span class="primary-stat__counter">
                    {{ $formatNumber(organization.members?.length || 0) }}
                  </span>
                  member<span v-if="organization.members?.length !== 1">s</span>
                </div>
              </div>

              <div class="primary-stat">
                <BoxIcon class="primary-stat__icon" aria-hidden="true" />
                <div class="primary-stat__text">
                  <span class="primary-stat__counter">
                    {{ $formatNumber(organization.projects?.length || 0) }}
                  </span>
                  project<span v-if="organization.projects?.length !== 1">s</span>
                </div>
              </div>
            </div>

            <div class="metadata-item">
              <div class="date">
                <CalendarIcon />
                <label>
                  Created
                  {{ fromNow(organization.updated) }}
                </label>
              </div>
            </div>
          </div>
        </template>
      </Card>
      <Card class="creator-list">
        <div class="title-and-link">
          <h3>Creators</h3>
        </div>
        <div
          v-for="member in organization.members"
          :key="member.user.id"
          class="creator button-base"
          @click="$router.push(`/user/${member.user.username}`)"
        >
          <Avatar :src="member.user.avatar_url" circle />
          <p class="name">{{ member.user.username }}</p>
          <p class="role">{{ member.role }}</p>
        </div>
      </Card>
    </div>

    <NuxtPage
      v-model:organization="organization"
      v-model:projects="projects"
      :current-member="currentMember"
      :patch-organization="patchOrganization"
      :reset-organization="resetOrganization"
      :patch-icon="patchIcon"
      :delete-icon="deleteIcon"
    />
  </div>
</template>
<script setup>
import { Avatar, Card, EditIcon, BoxIcon, CalendarIcon, UserIcon } from 'omorphia'

const auth = await useAuth()
const route = useRoute()
const tags = useTags()

const [{ data: organization }, { data: projects }] = await Promise.all([
  useAsyncData(`organization/${route.params.id}`, () =>
    useBaseFetch(`organization/${route.params.id}`, { apiVersion: 3 })
  ),
  useAsyncData(`organization/${route.params.id}/projects`, () =>
    useBaseFetch(`organization/${route.params.id}/projects`, { apiVersion: 3 })
  ),
])

if (!organization.value) {
  throw createError({
    fatal: true,
    statusCode: 404,
    message: 'Organization not found',
  })
}

const currentMember = ref(
  auth.value.user && organization.value
    ? organization.value.members.find((x) => x.user.id === auth.value.user.id)
    : null
)

if (
  !currentMember.value &&
  auth.value.user &&
  tags.value.staffRoles.includes(auth.value.user.role)
) {
  currentMember.value = {
    user: auth.value.user,
    role: auth.value.role,
    permissions: auth.value.user.role === 'admin' ? 1023 : 12,
    accepted: true,
    payouts_split: 0,
    avatar_url: auth.value.user.avatar_url,
    name: auth.value.user.username,
  }
}

const hasPermission = computed(() => {
  const EDIT_DETAILS = 1 << 2
  return currentMember.value && (currentMember.value.permissions & EDIT_DETAILS) === EDIT_DETAILS
})

const patchOrganization = async (resData) => {
  let result = false
  await useBaseFetch(`organization/${organization.value.id}`, {
    method: 'PATCH',
    body: resData,
    apiVersion: 3,
  })
  result = true
  return result
}

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

const resetOrganization = async () => {
  organization.value = await useBaseFetch(`organization/${organization.value.id}`, {
    apiVersion: 3,
  })
}
</script>
<style scoped lang="scss">
.card {
  padding: var(--spacing-card-lg);

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
</style>
