export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = await useAuth()
  const userStore = await useUser(true)
  const cosmeticsStore = useCosmetics()
  const tagsStore = useTags()

  nuxtApp.provide('auth', authStore.value)
  nuxtApp.provide('user', userStore)
  nuxtApp.provide('cosmetics', cosmeticsStore.value)
  nuxtApp.provide('tag', tagsStore.value)
  nuxtApp.provide('notify', (notif) => addNotification(notif))

  // nuxtApp.hook('app:beforeMount', runAnalytics)
  // nuxtApp.hook('page:start', runAnalytics)
})

function runAnalytics() {
  const config = useRuntimeConfig()

  setTimeout(() => {
    $fetch(`${config.public.ariadneBaseUrl}view`, {
      method: 'POST',
      body: {
        url: window.location.href,
      },
    })
      .then(() => {})
      .catch((e) => {
        console.error('An error occurred while registering the visit: ', e)
      })
  })
}
