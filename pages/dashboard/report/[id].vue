<template>
  <ReportView
    :report-id="route.params.id"
    :breadcrumbs-stack="[{ href: '/dashboard/reports', label: 'Report history' }]"
  />
</template>
<script setup>
import ReportView from '~/components/ui/report/ReportView.vue'

const route = useRoute()

useHead({
  title: `Report ${route.params.id} - Modrinth`,
})
</script>
