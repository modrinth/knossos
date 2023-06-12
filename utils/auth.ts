export function getAuthUrl() {
  const config = useRuntimeConfig()
  const route = useRoute()

  return `${config.public.apiBaseUrl}auth/init?url=${config.public.siteUrl}${route.fullPath}`
}
