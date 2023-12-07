<template>
  <div v-if="route.name === 'reports' || true">
    <div class="full-page">
      <h2>Reports</h2>
      <ReportsList :auth="auth" />
    </div>
  </div>
  <div v-else class="settings-page">
    <div class="settings-page__header">
      <h2>Reports</h2>
    </div>
    <div class="settings-page__sidebar">
      <ReportsList :auth="auth" compact />
    </div>
    <div class="settings-page__content">
      <NuxtPage />
    </div>
  </div>
</template>
<script setup>
import ReportsList from '~/components/ui/report/ReportsList.vue'

definePageMeta({
  middleware: 'auth',
})

const auth = await useAuth()
const route = useRoute()
useHead({
  title: 'Active reports - Modrinth',
})
</script>
