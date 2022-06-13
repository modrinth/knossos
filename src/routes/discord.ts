import type { RequestHandler } from '@sveltejs/kit'

export const get: RequestHandler = async () => {
	return {
		headers: { Location: 'https://discord.gg/EUHuJHt' },
		status: 307,
	}
}
