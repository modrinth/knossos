export default defineNuxtRouteMiddleware(async (to) => {
  const auth = await useAuth()
  if (to && to.name === 'index' && auth.value.user) {
    return navigateTo(`/home`)
  } else if (to && to.name === 'creations' && auth.value.user) {
    return navigateTo(`/creations/projects`)
  } else if (to && to.name === 'moderation' && auth.value.user) {
    return navigateTo(`/moderation/review`)
  }
})
