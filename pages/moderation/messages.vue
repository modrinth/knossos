<template>
  <div>
    <section class="universal-card">
      <h2>Messages</h2>
      <ThreadSummary
        v-for="thread in inbox"
        :key="thread.id"
        :thread="thread"
        :link="getLink(thread)"
      />
    </section>
  </div>
</template>
<script setup>
import ThreadSummary from '~/components/ui/thread/ThreadSummary.vue'

useHead({
  title: 'Moderation inbox - Modrinth',
})

const app = useNuxtApp()

const [rawInbox] = await Promise.all([useBaseFetch('thread/inbox', app.$defaultHeaders())])
//
const inbox = ref(rawInbox)

function getLink(thread) {
  return '#'
}
</script>
<style lang="scss" scoped>
.thread-summary:not(:last-child) {
  margin-bottom: var(--spacing-card-md);
}
</style>
