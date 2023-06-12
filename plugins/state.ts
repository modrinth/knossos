export default defineNuxtPlugin(async (nuxtApp) => {
  const auth = useAuth()
  const { tags } = useTag()
  await useUser()
  const cosmeticsStore = useCosmetics()

  nuxtApp.provide('auth', auth)
  nuxtApp.provide('cosmetics', cosmeticsStore.value)
  nuxtApp.provide('tag', tags)
  nuxtApp.provide(' notify', notif => addNotification(notif))
})
