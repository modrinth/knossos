<template>
  <div class="normal-page">
    <div class="normal-page__sidebar">
      <aside class="card">
        <h1>Moderation</h1>
        <NavStack>
          <NavStackItem link="/moderation" label="Overview">
            <ModrinthIcon />
          </NavStackItem>
          <NavStackItem link="/moderation/review" label="Review projects">
            <ModerationIcon />
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
import {
  NavStack,
  NavItem as NavStackItem,
  ModrinthIcon,
  ScaleIcon as ModerationIcon,
  ReportIcon,
  MessageIcon,
} from 'omorphia'

definePageMeta({
  middleware: 'auth',
})
</script>
