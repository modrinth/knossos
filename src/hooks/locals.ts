import cookie from 'cookie'
import type { Handle } from '@sveltejs/kit'

// Add all cookies as locals to be used in other handle functions
export const locals: Handle = async ({ event, resolve }) => {
	if (event.request.headers.has('cookie')) {
		const cookies = cookie.parse(event.request.headers.get('cookie') || '')

		event.locals = Object.fromEntries(
			Object.entries(cookies).map(([key, value]) => [key.replace('modrinth-', ''), value])
		) as any
	}

	return await resolve(event)
}
