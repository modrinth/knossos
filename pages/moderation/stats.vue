<template>
  <div>
    <h2>Statistics</h2>
    <div class="grid-display">
      <div class="grid-display__item card">
        <div class="label">Projects</div>
        <div class="value">
          {{ formatNumber(stats.projects, false) }}
        </div>
      </div>
      <div class="grid-display__item card">
        <div class="label">Versions</div>
        <div class="value">
          {{ formatNumber(stats.versions, false) }}
        </div>
      </div>
      <div class="grid-display__item card">
        <div class="label">Files</div>
        <div class="value">
          {{ formatNumber(stats.files, false) }}
        </div>
      </div>
      <div class="grid-display__item card">
        <div class="label">Authors</div>
        <div class="value">
          {{ formatNumber(stats.authors, false) }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { formatNumber } from 'omorphia'

definePageMeta({
  middleware: 'auth',
})

useHead({
  title: 'Staff overview - Modrinth',
})

const { data: stats } = await useAsyncData('statistics', () => useBaseFetch('statistics'))
</script>
<style lang="scss" scoped>
.grid-display__item {
  background-color: var(--color-raised-bg);
}
</style>
