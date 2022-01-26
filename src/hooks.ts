import type { GetSession, Handle } from '@sveltejs/kit';
import { send } from '$lib/api';
import cookie from 'cookie';

export const getSession: GetSession = (event) => {
	const acceptedLanguage =
		event.request.headers['accept-language'] &&
		event.request.headers['accept-language'].split(',')[0];

	const token = event.locals.token;
	const user = event.locals.user;

	return { acceptedLanguage, token, user };
};

const loggedInPages = ['/following', '/report', '/moderation', '/settings'];

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');

	let token = '';

	if (cookies['modrinth-token']) {
		token = cookies['modrinth-token'];
	} else if (event.url.searchParams.has('code')) {
		token = event.url.searchParams.get('code');
	}

	if (token) {
		try {
			const user = await send('GET', 'user', null, { token });
			event.locals.token = token;
			event.locals.user = user;
		} catch {
			// Invalid token
			token = '';
		}
	}

	if (!token && loggedInPages.includes(event.url.pathname)) {
		return new Response(null, {
			status: 307,
			headers: new Headers({ Location: '/' }),
		});
	}

	const response = await resolve(event);

	if (!cookies['modrinth-token'] && token) {
		response.headers.set(
			'set-cookie',
			cookie.serialize('modrinth-token', token, {
				path: '/',
				secure: true,
				sameSite: 'strict',
				expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
			})
		);
	}

	return response;
};
