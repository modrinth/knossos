import type { Handle } from '@sveltejs/kit'

// Time to cache in seconds
const DEFAULT_TTL = 60
const LONG_TTL_PAGES = ['/sitemap.xml', '/']

export const cache: Handle = async ({ event, resolve }) => {
	// Only attempt to cache if in production
	if (event.platform) {
		const cacheKey = event.url + (event.locals.theme ? '&theme=' + event.locals.theme : '')

		const cache = event.platform.caches.default

		let response = await cache.match(cacheKey)

		if (!response) {
			// Not present in cache, rendering & caching
			response = await resolve(event)
			response.headers.append(
				'Cache-Control',
				`s-maxage=${
					LONG_TTL_PAGES.includes(event.url.pathname) ? 12 * 60 * 60 /* 12 hours */ : DEFAULT_TTL
				}`
			)
			event.platform.context.waitUntil(cache.put(cacheKey, response.clone()))
		}

		return response
	} else {
		return await resolve(event)
	}
}
