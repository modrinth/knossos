export const useBaseFetch = async (url, options = {}, skipAuth = false) => {
  const config = useRuntimeConfig()
  let base = process.server ? config.apiBaseUrl : config.public.apiBaseUrl

  if (!options.headers) {
    options.headers = {}
  }

  if (process.server) {
    options.headers['x-ratelimit-key'] = config.rateLimitKey
  }

  if (!skipAuth) {
    const auth = await useAuth()

    options.headers.Authorization = auth.value.token
  }

  if (options.apiVersion) {
    // Base may end in /vD/ or /vD. We would need to replace the digit with the new version number
    // and keep the trailing slash if it exists
    const baseVersion = base.match(/\/v\d\//)

    if (baseVersion) {
      base = base.replace(baseVersion[0], `/v${options.apiVersion}/`)
    } else {
      base = base.replace(/\/v\d$/, `/v${options.apiVersion}`)
    }

    delete options.apiVersion
  }

  return await $fetch(`${base}${url}`, options)
}
