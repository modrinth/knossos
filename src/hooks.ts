import type { GetSession, Handle } from '@sveltejs/kit';
import { send } from '$lib/api';
import cookie from 'cookie';

export const getSession: GetSession = (request) => {
	const acceptedLanguage =
		request.headers['accept-language'] && request.headers['accept-language'].split(',')[0];

	const token = request.locals.token;
	const user = request.locals.user;

	return { acceptedLanguage, token, user };
};

const loggedInPages = ['/following', '/report'];

export const handle: Handle = async ({ request, resolve }) => {
	const cookies = cookie.parse(request.headers.cookie || '');

	let token = '';

	if (cookies['modrinth-token']) {
		token = cookies['modrinth-token'];
	} else if (request.url.searchParams.has('code')) {
		token = request.url.searchParams.get('code');
	}

	if (token) {
		try {
			const user = await send('GET', 'user', null, { token });
			request.locals.token = token;
			request.locals.user = user;
		} catch {
			// Invalid token
			token = '';
		}
	}

	if (!token && loggedInPages.includes(request.url.pathname)) {
		return {
			headers: { Location: '/' },
			status: 307,
		};
	}

	const response = await resolve(request);

	if (!cookies['modrinth-token'] && token) {
		response.headers['set-cookie'] = cookie.serialize('modrinth-token', token, {
			path: '/',
			secure: true,
			sameSite: 'strict',
			expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
		});
	}

	return response;
};
