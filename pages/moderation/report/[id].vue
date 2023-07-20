<template>
  <ReportView
<<<<<<< HEAD
    :auth="auth"
=======
>>>>>>> master
    :report-id="route.params.id"
    :breadcrumbs-stack="[{ href: '/moderation/reports', label: 'Reports' }]"
  />
</template>
<script setup>
import ReportView from '~/components/ui/report/ReportView.vue'

<<<<<<< HEAD
const auth = await useAuth()
=======
>>>>>>> master
const route = useRoute()

useHead({
  title: `Report ${route.params.id} - Modrinth`,
})
</script>
