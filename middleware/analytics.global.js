export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) return
  if (to.path === from.path) return

  if (process.env.NODE_ENV !== 'production') {
    return
  }

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
})
