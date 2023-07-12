<template>
  <div>
    <section class="universal-card">
      <h2>Messages</h2>

      <LoadingComponent :loading="loading" :error="error">
        <ThreadSummary
          v-for="thread in inbox"
          :key="thread.id"
          :thread="thread"
          :link="getLink(thread)"
        />
      </LoadingComponent>
    </section>
  </div>
</template>
<script setup>
import ThreadSummary from '~/components/ui/thread/ThreadSummary.vue'
import LoadingComponent from '~/components/ui/LoadingComponent.vue'

useHead({
  title: 'Moderation inbox - Modrinth',
})

const app = useNuxtApp()

const loading = ref(true)
const error = ref(null)

const inbox = ref(null)

onMounted(() => {
  fetchData()
})

const fetchData = async () => {
  try {
    await useBaseFetch('thread/inbox', app.$defaultHeaders()).then(
      (result) => (inbox.value = result)
    )
  } catch (err) {
    onError(err)
  }
  loading.value = false
}

const onError = (err) => {
  error.value = (
    err.data ? (err.data.description ? err.data.description : err.data) : err
  ).toString()
  app.$notify({
    group: 'main',
    title: 'Error loading inbox',
    text: error.value,
    type: 'error',
  })
  console.error(err)
}

function getLink(thread) {
  console.log(thread)
  return '#'
}
</script>
<style lang="scss" scoped>
.thread-summary:not(:last-child) {
  margin-bottom: var(--spacing-card-md);
}
</style>
