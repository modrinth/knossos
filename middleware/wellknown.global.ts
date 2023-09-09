export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/.well-known/change-password') {
    return navigateTo('/settings/account')
  }
})
