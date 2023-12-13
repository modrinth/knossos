<template>
  <div>
    <div class="normal-page alt-layout">
      <div class="normal-page__sidebar">Meow</div>
      <div class="normal-page__content">
        <h1>Analytics</h1>
        <ChartDisplay :projects="projects ?? undefined" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LabrinthAPI } from '~/types/labrinth'
import ChartDisplay from '~/components/ui/charts/ChartDisplay.vue'

useHead({
  title: 'Analytics - Modrinth',
})

definePageMeta({
  middleware: 'auth',
})

const auth: any = await useAuth()
const id = auth.value?.user?.id

const { data: projects } = await useAsyncData<LabrinthAPI.Project[], unknown>(
  `user/${id}/projects`,
  () => useBaseFetch(`user/${id}/projects`) as any
)
</script>

<style scoped lang="scss">
h1 {
  margin-bottom: var(--gap-sm);
}
</style>
