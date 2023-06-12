export default defineNuxtPlugin(async (nuxtApp) => {
  const auth = await useAuth()
  await useUser()
  const cosmeticsStore = useCosmetics()
  const tagsStore = useTags()

  nuxtApp.provide('auth', auth)
  nuxtApp.provide('cosmetics', cosmeticsStore.value)
  nuxtApp.provide('tag', tagsStore.value)
  nuxtApp.provide(' notify', notif => addNotification(notif))
})
