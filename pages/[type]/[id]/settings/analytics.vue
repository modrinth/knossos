<template>
  <div>
    <h2>Analytics</h2>

    <div class="markdown-body">
      <p>
        This page shows you the analytics for your project, <strong>{{ project.title }}</strong
        >. You can see the number of downloads, page views and revenue earned for your project, as
        well as the total downloads and page views for {{ project.title }} by country.
      </p>
    </div>

    <ChartDisplay :project-ids="[props.project.id]" />
  </div>
</template>

<script setup>
import ChartDisplay from '~/components/ui/charts/ChartDisplay.vue'

const props = defineProps({
  project: {
    type: Object,
    default() {
      return {}
    },
  },
})
</script>

<style scoped lang="scss">
.markdown-body {
  margin-bottom: var(--gap-md);
}
</style>
