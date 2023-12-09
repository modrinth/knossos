<template>
  <div class="settings-page">
    <div class="settings-page__header">
      <h1>Settings</h1>
    </div>
    <aside class="settings-page__sidebar">
      <div class="vertical-navbar">
        <h3>{{ formatMessage(messages.displayHeading) }}</h3>
        <NuxtLink to="/settings">
          <PaintBrushIcon /> {{ formatMessage(messages.appearanceSettings) }}
        </NuxtLink>
        <NuxtLink to="/settings/language">
          <LanguagesIcon /> {{ formatMessage(messages.languageSettings) }}
        </NuxtLink>
        <template v-if="auth.user">
          <h3>{{ formatMessage(messages.accountHeading) }}</h3>
          <NuxtLink to="/settings/profile">
            <UserIcon />
            {{ formatMessage(messages.profileTitle) }}
          </NuxtLink>
          <NuxtLink to="/settings/account">
            <ShieldIcon />
            {{ formatMessage(messages.accountTitle) }}
          </NuxtLink>
          <NuxtLink to="/settings/sessions">
            <MonitorSmartphoneIcon />
            {{ formatMessage(messages.sessionsTitle) }}
          </NuxtLink>
          <NuxtLink to="/settings/revenue">
            <CurrencyIcon />
            {{ formatMessage(messages.revenueTitle) }}
          </NuxtLink>
          <NuxtLink to="/settings/authorizations">
            <GridIcon />
            {{ formatMessage(messages.authorizationsTitle) }}
          </NuxtLink>
          <h3>{{ formatMessage(messages.developerHeading) }}</h3>
          <NuxtLink to="/settings/pats">
            <KeyIcon />
            {{ formatMessage(messages.patsTitle) }}
          </NuxtLink>
          <NuxtLink to="/settings/applications">
            <ServerIcon />
            {{ formatMessage(messages.applicationsTitle) }}
          </NuxtLink>
          <h3>
            {{ formatMessage(messages.manageHeading) }}
          </h3>
          <NuxtLink to="/settings/revenue">
            <CurrencyIcon />
            {{ formatMessage(messages.revenueTitle) }}
          </NuxtLink>
          <NuxtLink to="/settings/collections">
            <CollectionIcon />
            {{ formatMessage(messages.collectionsTitle) }}
          </NuxtLink>
          <NuxtLink to="/settings/projects">
            <ListIcon />
            {{ formatMessage(messages.projectsTitle) }}
          </NuxtLink>
          <NuxtLink to="/settings/reports">
            <ReportIcon />
            {{ formatMessage(messages.reportsTitle) }}
          </NuxtLink>
          <NuxtLink to="/settings/follows">
            <HeartIcon />
            {{ formatMessage(messages.followsTitle) }}
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
  GridIcon,
  ServerIcon,
  CurrencyIcon,
} from 'omorphia'
import CollectionIcon from '~/assets/images/utils/collection.svg'
import MonitorSmartphoneIcon from '~/assets/images/utils/monitor-smartphone.svg'

const { formatMessage } = useVIntl()

const messages = defineMessages({
  displayHeading: {
    id: 'settings.heading.display',
    defaultMessage: 'Display',
  },
  accountHeading: {
    id: 'settings.heading.account',
    defaultMessage: 'Account',
  },
  developerHeading: {
    id: 'settings.heading.developer',
    defaultMessage: 'Developer',
  },
  manageHeading: {
    id: 'settings.heading.manage',
    defaultMessage: 'Manage',
  },
  appearanceSettings: {
    id: 'settings.appearance.title',
    defaultMessage: 'Appearance',
  },
  languageSettings: {
    id: 'settings.language.title',
    defaultMessage: 'Language',
  },
  profileTitle: {
    id: 'settings.account.title',
    defaultMessage: 'Public profile',
  },
  accountTitle: {
    id: 'settings.account.title',
    defaultMessage: 'Account and security',
  },
  revenueTitle: {
    id: 'settings.revenue.title',
    defaultMessage: 'Revenue',
  },
  sessionsTitle: {
    id: 'settings.sessions.title',
    defaultMessage: 'Sessions',
  },
  authorizationsTitle: {
    id: 'settings.authorizations.title',
    defaultMessage: 'Authorized apps',
  },
  patsTitle: {
    id: 'settings.pats.title',
    defaultMessage: 'Personal access tokens',
  },
  applicationsTitle: {
    id: 'settings.applications.title',
    defaultMessage: 'Your applications',
  },
  collectionsTitle: {
    id: 'settings.collections.title',
    defaultMessage: 'Collections',
  },
  projectsTitle: {
    id: 'settings.projects.title',
    defaultMessage: 'Projects',
  },
  reportsTitle: {
    id: 'settings.reports.title',
    defaultMessage: 'Reports',
  },
  followsTitle: {
    id: 'settings.follows.title',
    defaultMessage: 'Follows',
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
