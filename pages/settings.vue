<template>
  <div class="settings-page">
    <div class="settings-page__sidebar">
      <h1>Settings</h1>
      <div class="new-navbar">
        <NuxtLink to="/settings"> <PaintBrushIcon /> Appearance </NuxtLink>
        <NuxtLink to="/settings/language"> <LanguagesIcon /> Language </NuxtLink>
        <template v-if="auth.user">
          <span class="card-divider" />
          <NuxtLink to="/settings/account">
            <UserIcon />
            Account
          </NuxtLink>
          <NuxtLink to="/settings/pats">
            <KeyIcon />
            Personal Access Tokens
          </NuxtLink>
          <NuxtLink to="/settings/sessions">
            <ShieldIcon />
            {{ formatMessage(messages.sessionsTitle) }}
          </NuxtLink>
          <NuxtLink to="/settings/monetization">
            <CurrencyIcon />
            Monetization
          </NuxtLink>
        </template>
      </div>
    </div>
    <div class="settings-page__content">
      <MessageBanner
        v-if="cosmetics.developerMode"
        message-type="warning"
        class="developer-message"
      >
        <CodeIcon /> <strong>Developer mode</strong> is active. This will allow you to view the
        internal IDs of various things throughout Modrinth that may be helpful if you're a developer
        using the Modrinth API. Click on the Modrinth logo at the bottom of the page 5 times to
        toggle developer mode.
        <Button :action="() => disableDeveloperMode()"> Deactivate developer mode </Button>
      </MessageBanner>
      <NuxtPage :route="route" />
    </div>
  </div>
</template>
<script setup>
import {
  Button,
  CodeIcon,
  PaintBrushIcon,
  UserIcon,
  CurrencyIcon,
  ShieldIcon,
  KeyIcon,
  LanguagesIcon,
} from 'omorphia'
import MessageBanner from '~/components/ui/MessageBanner.vue'

const { formatMessage } = useVIntl()

const messages = defineMessages({
  sessionsTitle: {
    id: 'settings.sessions.title',
    defaultMessage: 'Sessions',
  },
})

const app = useNuxtApp()
const route = useRoute()
const auth = await useAuth()
const cosmetics = useCosmetics()

function disableDeveloperMode() {
  cosmetics.value.developerMode = !cosmetics.value.developerMode
  saveCosmetics()
  app.$notify({
    group: 'main',
    title: 'Developer mode deactivated',
    text: 'Developer mode has been disabled',
    type: 'success',
  })
}
</script>
<style lang="scss" scoped>
h1 {
  margin-block: var(--gap-sm) var(--gap-lg);
  font-size: 2em;
  line-height: 1em;
}

.new-navbar {
  display: flex;
  flex-direction: column;
  gap: var(--gap-xs);
  margin-bottom: var(--gap-lg);
  padding-inline: calc(var(--gap-xl) - 1.1rem - 0.5rem);
  flex-wrap: wrap;

  a {
    display: flex;
    align-items: center;
    padding: var(--gap-sm) var(--gap-md);
    border-radius: var(--radius-md);
    font-weight: 500;

    svg {
      margin-right: 0.5rem;
    }

    &.router-link-exact-active {
      background-color: var(--color-button-bg);
      color: var(--color-contrast);
    }
  }
}

.settings-page__content {
  margin-top: calc(2em + var(--gap-lg) + var(--gap-sm));
}

.developer-message {
  svg {
    vertical-align: middle;
    margin-bottom: 2px;
  }

  .btn {
    margin-top: var(--gap-sm);
  }
}
</style>
