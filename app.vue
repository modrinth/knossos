<template>
  <NuxtLayout>
    <ModrinthLoadingIndicator />
    <Notifications />
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup>
// For some reason, this file cannot be TypeScript. Why?
import ModrinthLoadingIndicator from '~/components/ui/modrinth-loading-indicator'
import Notifications from '~/components/ui/Notifications'
</script>
