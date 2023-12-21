<template>
  <div>
    <div class="input-group navigation-space">
      <nuxt-link class="btn" :to="`/organization/${organization.id}`">
        <LeftArrowIcon />Return
      </nuxt-link>
    </div>
    <Card class="nav-spacing">
      <NavRow :links="links" />
    </Card>
    <NuxtPage />
  </div>
</template>

<script setup>
import { Card, NavRow, LeftArrowIcon } from 'omorphia'

const { organization } = inject('organizationContext')

const links = [
  { label: 'settings', href: `/organization/${organization.value.id}/settings` },
  { label: 'members', href: `/organization/${organization.value.id}/settings/members` },
  { label: 'projects', href: `/organization/${organization.value.id}/settings/projects` },
]
</script>

<style lang="scss" scoped>
.navigation-space {
  margin-bottom: var(--gap-md);
}

.nav-spacing {
  align-items: center;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  row-gap: 0.5rem;
  min-height: 3.75rem;
}
</style>
