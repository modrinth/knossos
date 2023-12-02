export default defineNuxtRouteMiddleware(async (to) => {
  const auth = await useAuth()
  if (to && to.name === 'index' && auth.value.user) {
    return navigateTo(`/home`)
  }
})
