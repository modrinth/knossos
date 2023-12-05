<template>
  <div class="settings-page">
    <aside class="settings-page__sidebar">
      <h1>Settings</h1>
      <div class="vertical-navbar">
        <NuxtLink to="/settings"> <PaintBrushIcon /> Appearance </NuxtLink>
        <NuxtLink to="/settings/language"> <LanguagesIcon /> Language </NuxtLink>
        <template v-if="auth.user">
          <h3>User settings</h3>
          <NuxtLink to="/settings/account">
            <UserIcon />
            Account
          </NuxtLink>
          <NuxtLink to="/settings/sessions">
            <ShieldIcon />
            {{ formatMessage(messages.sessionsTitle) }}
          </NuxtLink>
          <NuxtLink to="/settings/authorizations">
            <UsersIcon />
          </NuxtLink>
          <h3>Developer</h3>
          <NuxtLink to="/settings/pats">
            <KeyIcon />
            Personal Access Tokens
          </NuxtLink>
          <NuxtLink to="/settings/applications">
            <ServerIcon />
            Applications
          </NuxtLink>
          <h3>Manage</h3>
          <NuxtLink to="/settings/projects">
            <ListIcon />
            Projects
          </NuxtLink>
          <NuxtLink to="/settings/reports">
            <ReportIcon />
            Reports
          </NuxtLink>
          <NuxtLink to="/settings/follows">
            <HeartIcon />
            Follows
          </NuxtLink>
        </template>
      </div>
    </aside>
    <div class="settings-page__content">
      <NuxtPage :route="route" />
    </div>
  </div>
</template>
<script setup>
import {
  PaintBrushIcon,
  UserIcon,
  ShieldIcon,
  KeyIcon,
  LanguagesIcon,
  ReportIcon,
  ListIcon,
  HeartIcon,
  UsersIcon,
  ServerIcon,
} from 'omorphia'

const { formatMessage } = useVIntl()

const messages = defineMessages({
  sessionsTitle: {
    id: 'settings.sessions.title',
    defaultMessage: 'Sessions',
  },
})

const route = useRoute()
const auth = await useAuth()
</script>
<style lang="scss" scoped>
h1 {
  margin-block: var(--gap-sm) var(--gap-lg);
  font-size: 2em;
  line-height: 1em;
}
</style>
