<script setup lang="ts">
</script>

<template>
  <NuxtLoadingIndicator color="repeating-linear-gradient(to right, var(--color-brand-green) 0%, var(--landing-green-label) 100%)" :height="3" :throttle="50" :duration="500" />
  <NuxtLayout>
    <UiNotifications />
    <NuxtPage />
  </NuxtLayout>
</template>
