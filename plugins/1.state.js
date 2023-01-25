export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = await useAuth()
  const userStore = await useUser(true)
  const cosmeticsStore = useCosmetics()
  const tagsStore = useTags()
  const loadingStore = useLoading()

  nuxtApp.provide('auth', authStore.value)
  nuxtApp.provide('user', userStore.value)
  nuxtApp.provide('cosmetics', cosmeticsStore.value)
  nuxtApp.provide('tag', tagsStore.value)
  nuxtApp.provide('loading', loadingStore.value.loading)
})
