export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === '/.well-known/change-password') {
    return navigateTo('/settings/account')
  }
})
