<template>
  <div class="normal-page">
    <div class="normal-page__sidebar">
      <aside class="universal-card">
        <h1>Moderation</h1>
        <NavStack>
          <NavStackItem link="/moderation" label="Overview">
            <ModrinthIcon />
          </NavStackItem>
          <NavStackItem link="/moderation/review" label="Review projects">
            <ScaleIcon />
          </NavStackItem>
          <NavStackItem link="/moderation/messages" label="Messages">
            <MessageIcon />
          </NavStackItem>
          <NavStackItem link="/moderation/reports" label="Reports">
            <ReportIcon />
          </NavStackItem>
        </NavStack>
      </aside>
    </div>
    <div class="normal-page__content">
      <NuxtPage />
    </div>
  </div>
</template>
<script setup>
import { MessageIcon, ModrinthIcon, ReportIcon, ScaleIcon } from 'omorphia'
import NavStack from '~/components/ui/NavStack.vue'
import NavStackItem from '~/components/ui/NavStackItem.vue'

definePageMeta({
  middleware: 'auth',
})
</script>
