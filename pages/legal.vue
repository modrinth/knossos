<template>
  <div class="normal-page">
    <div class="normal-page__sidebar">
      <aside class="universal-card">
        <h1>Legal</h1>
        <NavStack>
          <NavStackItem link="/legal/terms" label="Terms and Conditions">
            <IconHeartHandshake />
          </NavStackItem>
          <NavStackItem link="/legal/privacy" label="Privacy Policy">
            <IconLock />
          </NavStackItem>
          <NavStackItem link="/legal/rules" label="Content Rules">
            <IconScales />
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
export default {
  name: 'Settings',
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
