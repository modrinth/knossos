<template>
  <NuxtLayout>
    <ModrinthLoadingIndicator />
    <Notifications />
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup>
import { Notifications } from 'omorphia'
import ModrinthLoadingIndicator from '~/components/modrinth-loading-indicator.ts'
</script>
