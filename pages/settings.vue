<template>
  <div class="normal-page">
    <div class="normal-page__sidebar">
      <aside class="universal-card">
        <h1>Settings</h1>
        <NavStack>
          <NavStackItem link="/settings" label="Appearance">
            <PaintBrushIcon />
          </NavStackItem>
          <NavStackItem v-if="isStaging" link="/settings/language" label="Language">
            <LanguagesIcon />
          </NavStackItem>
          <template v-if="auth.user">
            <h3>User settings</h3>
            <NavStackItem link="/settings/account" label="Account">
              <UserIcon />
            </NavStackItem>
            <NavStackItem link="/settings/pats" label="PATs">
              <KeyIcon />
            </NavStackItem>
            <NavStackItem link="/settings/sessions" :label="formatMessage(messages.sessionsTitle)">
              <ShieldIcon />
            </NavStackItem>
            <NavStackItem link="/settings/monetization" label="Monetization">
              <CurrencyIcon />
            </NavStackItem>
          </template>
        </NavStack>
      </aside>
    </div>
    <div class="normal-page__content">
      <NuxtPage :route="route" />
    </div>
  </div>
</template>
<script setup>
import {
  CurrencyIcon,
  LanguagesIcon,
  KeyIcon,
  PaintBrushIcon,
  ShieldIcon,
  UserIcon,
} from 'omorphia'
import NavStack from '~/components/ui/NavStack.vue'
import NavStackItem from '~/components/ui/NavStackItem.vue'

const { formatMessage } = useVIntl()

const messages = defineMessages({
  sessionsTitle: {
    id: 'settings.sessions.title',
    defaultMessage: 'Sessions',
  },
})

const route = useRoute()
const auth = await useAuth()
const isStaging = useRuntimeConfig().public.siteUrl !== 'https://modrinth.com'
</script>
