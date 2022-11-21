<template>
  <div class="normal-page">
    <div class="normal-page__sidebar">
      <aside class="universal-card">
        <h1>Settings</h1>
        <NavStack>
          <NavStackItem link="/settings" label="Appearance">
            <IconPaintbrush />
          </NavStackItem>
          <template v-if="$auth.user">
            <h3>User settings</h3>
            <NavStackItem link="/settings/account" label="Account">
              <IconUser />
            </NavStackItem>
            <NavStackItem link="/settings/follows" label="Followed projects">
              <IconHeart />
            </NavStackItem>
            <NavStackItem
              link="/settings/monetization"
              label="Monetization"
              beta
            >
              <IconCurrency />
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
export default {
  name: 'Settings',
}
</script>

<style lang="scss" scoped></style>
