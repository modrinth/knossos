<template>
  <div
    v-if="organization"
    class="normal-page"
    :class="{ 'alt-layout': $route.name.startsWith('organization-id-settings') }"
  >
    <div v-if="$route.name.startsWith('organization-id-settings')" class="normal-page__sidebar">
      <div class="settings-page__header">
        <Breadcrumbs
          current-title="Settings"
          :link-stack="[
            {
              href: `/organization/${organization.title}`,
              label: organization.title,
              allowTrimming: true,
            },
          ]"
        />
        <div class="settings-header">
          <Avatar
            :src="organization.icon_url"
            :alt="organization.title"
            size="sm"
            class="settings-header__icon"
          />
          <div class="settings-header__text">
            <h1 class="wrap-as-needed">
              {{ organization.title }}
            </h1>
          </div>
        </div>
      </div>
      <h2>Organization settings</h2>
      <NavStack>
        <NavStackItem :link="`/organization/${organization.title}/settings`" label="General">
          <SettingsIcon />
        </NavStackItem>
        <NavStackItem :link="`/organization/${organization.title}/members`" label="Members">
          <UsersIcon />
        </NavStackItem>
        <NavStackItem :link="`/organization/${organization.title}/projects`" label="Projects">
          <ListIcon />
        </NavStackItem>
        <NavStackItem :link="`/organization/${organization.title}/analytics`" label="Analytics">
          <ChartIcon />
        </NavStackItem>
      </NavStack>
    </div>
    <div v-else class="normal-page__sidebar">
      <Card>
        <Avatar :src="organization.icon_url" size="lg" :alt="organization.title" />
        <div class="user-text">
          <div class="title">
            <h2 class="username">
              {{ organization.name }}
            </h2>
          </div>
          <div class="markdown-body">
            <p>
              {{ organization.description }}
            </p>
          </div>
        </div>
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
    />
  </div>
</template>
<script setup>
import { SettingsIcon, UsersIcon, ListIcon, ChartIcon, Avatar, Breadcrumbs, Card } from 'omorphia'
import NavStack from '~/components/ui/NavStack.vue'
import NavStackItem from '~/components/ui/NavStackItem.vue'

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

const patchOrganization = async (resData, quiet = false) => {
  let result = false
  startLoading()
  try {
    await useBaseFetch(`organization/${organization.value.id}`, {
      method: 'PATCH',
      body: resData,
      apiVersion: 3,
    })
    await resetOrganization()
    result = true
    if (!quiet) {
      addNotification({
        group: 'main',
        title: 'Organization updated',
        text: 'Your organization has been updated.',
        type: 'success',
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  } catch (err) {
    addNotification({
      group: 'main',
      title: 'An error occurred',
      text: err,
      type: 'error',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  stopLoading()
  return result
}

const resetOrganization = async () => {
  organization.value = await useBaseFetch(`organization/${organization.value.id}`, {
    apiVersion: 3,
  })
  /*
  projects.value = await useBaseFetch(
    `projects?ids=[${organization.value.projects.map((p) => `"${p}"`).join(',')}]`
  )
   */
}
</script>
<style scoped lang="scss">
.settings-header {
  display: flex;
  flex-direction: row;
  gap: var(--gap-sm);
  align-items: center;
  margin-bottom: var(--gap-md);
  .settings-header__icon {
    flex-shrink: 0;
  }
  .settings-header__text {
    h1 {
      font-size: var(--font-size-md);
      margin-top: 0;
      margin-bottom: var(--spacing-card-sm);
    }
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
