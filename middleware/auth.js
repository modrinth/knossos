export default defineNuxtRouteMiddleware(async (_to, from) => {
  const auth = await useAuth()

  if (!auth.value.user) {
    const fullPath = from.fullPath
    const encodedPath = encodeURIComponent(fullPath)

    return await navigateTo(
      {
        path: '/auth/sign-in',
        query: {
          redirect: encodedPath,
        },
      },
      {
        replace: true,
      }
    )
  }
})
