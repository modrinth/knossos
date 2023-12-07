<template>
  <div class="full-page">
    <div>
      <h1>Creations</h1>
      <PageBar>
        <nuxt-link :to="`/creations/projects`" class="button-base nav-button">
          <ProjectIcon /> Projects
        </nuxt-link>
        <nuxt-link :to="`/creations/collections`" class="button-base nav-button">
          <CollectionIcon /> Collections
        </nuxt-link>
        <nuxt-link :to="`/creations/organizations`" class="button-base nav-button">
          <OrganizationIcon /> Organizations
        </nuxt-link>
        <nuxt-link :to="`/creations/revenue`" class="button-base nav-button">
          <CurrencyIcon /> Revenue
        </nuxt-link>
      </PageBar>
    </div>
    <NuxtPage />
  </div>
</template>
<script setup>
import { BoxIcon as ProjectIcon, PageBar, CurrencyIcon } from 'omorphia'
import OrganizationIcon from '~/assets/images/utils/organization.svg'
import CollectionIcon from '~/assets/images/utils/collection.svg'
import DashboardIcon from '~/assets/images/utils/layout-dashboard.svg'

definePageMeta({
  middleware: 'auth',
})
</script>
