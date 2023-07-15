export default defineNuxtRouteMiddleware(async () => {
  const auth = await useAuth()

  if (!auth.value.user) {
    return navigateTo('/auth/sign-in')
  }
})
