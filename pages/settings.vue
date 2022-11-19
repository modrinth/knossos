<template>
  <div class="normal-page">
    <div class="normal-page__sidebar">
      <aside class="universal-card">
        <h1>Settings</h1>
        <NavStack>
          <NavStackItem link="/settings" label="Appearance">
            <PaintbrushIcon aria-hidden="true" />
          </NavStackItem>
          <template v-if="$auth.user">
            <h3>User settings</h3>
            <NavStackItem link="/settings/account" label="Account">
              <UserIcon aria-hidden="true" />
            </NavStackItem>
            <NavStackItem link="/settings/follows" label="Followed projects">
              <HeartIcon aria-hidden="true" />
            </NavStackItem>
            <NavStackItem
              link="/settings/monetization"
              label="Monetization"
              beta
            >
              <CurrencyIcon aria-hidden="true" />
            </NavStackItem>
          </template>
        </NavStack>
      </aside>
    </div>
    <div class="normal-page__content">
      <NuxtChild />
    </div>
  </div>
</template>

<script>
import {
  Paintbrush as PaintbrushIcon,
  User as UserIcon,
  Heart as HeartIcon,
  Banknote as CurrencyIcon,
} from 'lucide-vue'

import NavStack from '~/components/ui/NavStack'
import NavStackItem from '~/components/ui/NavStackItem'

export default {
  name: 'Settings',
  components: {
    NavStack,
    NavStackItem,
    PaintbrushIcon,
    UserIcon,
    HeartIcon,
    CurrencyIcon,
  },
}
</script>

<style lang="scss" scoped></style>
