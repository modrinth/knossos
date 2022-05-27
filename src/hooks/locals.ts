import cookie from 'cookie'
import type { Handle } from '@sveltejs/kit'

// If theme cookie is present, set the theme class on the body
export const locals: Handle = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '')

	event.locals = Object.fromEntries(
		Object.entries(cookies).map(([key, value]) => [key.replace('modrinth-', ''), value])
	) as any

	return await resolve(event)
}
