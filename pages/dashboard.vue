<template>
  <div class="normal-page">
    <div class="normal-page__sidebar">
      <aside class="universal-card">
        <h1>Dashboard</h1>
        <NavStack>
          <NavStackItem link="/dashboard" label="Overview">
            <DashboardIcon />
          </NavStackItem>
          <NavStackItem link="/dashboard/notifications" label="Notifications">
            <BellIcon />
          </NavStackItem>
          <NavStackItem link="/dashboard/follows" label="Followed projects">
            <HeartIcon />
          </NavStackItem>
          <NavStackItem link="/dashboard/reports" label="Active reports">
            <ReportIcon />
          </NavStackItem>

          <h3>Manage</h3>
          <NavStackItem v-if="true" link="/dashboard/projects" label="Projects">
            <ListIcon />
          </NavStackItem>
          <NavStackItem link="/dashboard/revenue" label="Revenue">
            <CurrencyIcon />
          </NavStackItem>
        </NavStack>
      </aside>
    </div>
    <div class="normal-page__content">
      <NuxtPage :route="route" />
    </div>
  </div>
</template>
<script setup>
import { BellIcon, CurrencyIcon, DashboardIcon, HeartIcon, ListIcon, ReportIcon } from 'omorphia'

import NavStack from '~/components/ui/NavStack.vue'
import NavStackItem from '~/components/ui/NavStackItem.vue'

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
</script>
