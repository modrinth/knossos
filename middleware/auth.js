export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = await useAuth()

  if (!auth.value.user) {
    return navigateTo(`/auth/sign-in?redirect=${encodeURIComponent(to.fullPath ?? from.fullPath)}`)
  }
})
