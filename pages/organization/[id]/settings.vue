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
    <NuxtPage
      :organization="props.organization"
      :projects="props.projects"
      :current-member="props.currentMember"
      :patch-organization="props.patchOrganization"
      :reset-organization="props.resetOrganization"
      :patch-icon="props.patchIcon"
      :delete-icon="props.deleteIcon"
    />
  </div>
</template>

<script setup>
import { Card, NavRow, LeftArrowIcon } from 'omorphia'

const props = defineProps({
  organization: {
    type: Object,
    default() {
      return {}
    },
  },
  projects: {
    type: Array,
    default() {
      return []
    },
  },
  typeFilter: {
    type: String,
    default: '',
  },
  resetOrganization: {
    type: Function,
    default: () => {},
  },
  currentMember: {
    type: Object,
    default: () => ({}),
  },
})

const links = [
  { label: 'settings', href: `/organization/${props.organization.id}/settings` },
  { label: 'members', href: `/organization/${props.organization.id}/settings/members` },
  { label: 'projects', href: `/organization/${props.organization.id}/settings/projects` },
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
