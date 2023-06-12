export default defineNuxtPlugin(async (nuxtApp) => {
  const auth = useAuth()
  const { tags } = useTag()
  const { cosmetics } = useCosmetics()
  await useUser()

  nuxtApp.provide('auth', auth)
  nuxtApp.provide('cosmetics', cosmetics)
  nuxtApp.provide('tag', tags)
  nuxtApp.provide(' notify', notif => addNotification(notif))
})
