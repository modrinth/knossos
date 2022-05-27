import type { GetSession } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import { login } from './login'
import { cache } from './cache'
import { theme } from './theme'
import { locals } from './locals'

export const handle = sequence(locals, cache, login, theme)

export const getSession: GetSession = (event) => {
	return {
		acceptedLanguage:
			event.request.headers['accept-language'] &&
			event.request.headers['accept-language'].split(',')[0],
		...event.locals,
	}
}
