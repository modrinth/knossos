<template>
  <ReportView
    :auth="auth"
    :report-id="route.params.id"
    :breadcrumbs-stack="[{ href: '/settings/reports', label: 'Active reports' }]"
  />
</template>
<script setup>
import ReportView from '~/components/ui/report/ReportView.vue'

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const auth = await useAuth()

useHead({
  title: `Report ${route.params.id} - Modrinth`,
})
</script>
