<template>
  <ReportView :report-id="route.params.id" />
</template>
<script setup>
import ReportView from '~/components/ui/ReportView.vue'

const route = useRoute()

useHead({
  title: `Report ${route.params.id} - Modrinth`,
})
</script>
