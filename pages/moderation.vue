<template>
  <div class="settings-page">
    <aside class="settings-page__sidebar">
      <h1>Moderation</h1>
      <div class="vertical-navbar">
        <NuxtLink to="/moderation/review"> <ModerationIcon /> Review projects </NuxtLink>
        <NuxtLink to="/moderation/messages"> <MessageIcon /> Messages</NuxtLink>
        <NuxtLink to="/moderation/reports"> <ReportIcon /> Reports </NuxtLink>
        <NuxtLink to="/moderation/stats"> <ChartIcon /> Statistics </NuxtLink>
      </div>
    </aside>
    <div class="settings-page__content">
      <NuxtPage />
    </div>
  </div>
</template>
<script setup>
import {
  ModrinthIcon,
  ScaleIcon as ModerationIcon,
  ReportIcon,
  MessageIcon,
  ChartIcon,
} from 'omorphia'

definePageMeta({
  middleware: 'auth',
})
</script>
