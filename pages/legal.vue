<template>
  <div class="normal-page">
    <div class="normal-page__sidebar">
      <aside class="universal-card">
        <h1>Legal</h1>
        <NavStack>
          <NavStackItem link="/legal/terms" label="Terms and Conditions">
            <TermsIcon aria-hidden="true" />
          </NavStackItem>
          <NavStackItem link="/legal/privacy" label="Privacy Policy">
            <PrivacyIcon aria-hidden="true" />
          </NavStackItem>
          <NavStackItem link="/legal/rules" label="Content Rules">
            <RulesIcon aria-hidden="true" />
          </NavStackItem>
        </NavStack>
      </aside>
    </div>
    <div class="normal-page__content">
      <NuxtChild class="universal-card" />
    </div>
  </div>
</template>

<script>
import {
  HeartHandshake as TermsIcon,
  Lock as PrivacyIcon,
  Scale as RulesIcon,
} from 'lucide-vue'

import NavStack from '~/components/ui/NavStack'
import NavStackItem from '~/components/ui/NavStackItem'

export default {
  name: 'Settings',
  components: {
    NavStack,
    NavStackItem,
    TermsIcon,
    PrivacyIcon,
    RulesIcon,
  },
}
</script>

<style lang="scss" scoped>
.normal-page__content ::v-deep a {
  color: var(--color-link);
  text-decoration: underline;

  &:focus-visible,
  &:hover {
    color: var(--color-link-hover);
  }

  &:active {
    color: var(--color-link-active);
  }
}
</style>
