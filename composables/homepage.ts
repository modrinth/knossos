import type { UseFetchOptions } from '#app'

export async function useHomepageProjects(rowsCount: number) {
  const runtimeConfig = useRuntimeConfig()

  const fetchOptions: UseFetchOptions<any[], any[][]> = {
    baseURL: runtimeConfig.public.apiBaseUrl,
    key: `homepageProjects/${rowsCount}`,
    transform(homepageProjects) {
      const val = Math.ceil(homepageProjects.length / rowsCount)
      const result: any[][] = []
      for (let i = 0; i < rowsCount; i++) {
        result.push(homepageProjects.slice(val * i, val * (i + 1)))
      }
      return result
    },
  }

  if (import.meta.server) {
    fetchOptions.headers = {
      'User-Agent': 'Knossos Server (support@modrinth.com)',
      'X-Ratelimit-Key': runtimeConfig.rateLimitKey,
    }
  }

  return await useFetch('/projects_random?count=40', fetchOptions)
}
