import { App } from 'APP';
import { manifest, prerendered } from 'MANIFEST';

const app = new App(manifest);

const prefix = `/${manifest.appDir}/`;

const parseCookie = (str) =>
	str !== null
		? str
				.split(';')
				.map((v) => v.split('='))
				.reduce((acc, v) => {
					acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
					return acc;
				}, {})
		: {};

// Time to cache in seconds
const DEFAULT_TTL = 60;
const LONG_TTL_PAGES = ['/sitemap.xml', '/', '/api/random.json'];

export default {
	async fetch(req, env, context) {
		const url = new URL(req.url);

		// static assets
		if (url.pathname.startsWith(prefix)) {
			/** @type {Response} */
			const res = await env.ASSETS.fetch(req);

			return new Response(res.body, {
				headers: {
					// include original cache headers, minus cache-control which
					// is overridden, and etag which is no longer useful
					'cache-control': 'public, immutable, max-age=31536000',
					'content-type': res.headers.get('content-type'),
					'x-robots-tag': 'noindex',
				},
			});
		}

		// prerendered pages and index.html files
		const pathname = url.pathname.replace(/\/$/, '');
		let file = pathname.substring(1);

		try {
			file = decodeURIComponent(file);
		} catch (err) {
			// ignore
		}

		if (
			manifest.assets.has(file) ||
			manifest.assets.has(file + '/index.html') ||
			prerendered.has(pathname || '/')
		) {
			return env.ASSETS.fetch(req);
		}

		// dynamically-generated pages
		try {
			const cookies = parseCookie(req.headers.get('Cookie'));
			if (!cookies['modrinth-token'] && !url.searchParams.has('code') && req.method === 'GET') {
				// Request valid for caching
				const cacheKey =
					req.url + (cookies['modrinth-theme'] ? '&theme=' + cookies['modrinth-theme'] : '');
				//+ (req.headers.has('Accept-Language') ? '&lang=' + req.headers.get('Accept-Language') : '')
				const cache = caches.default;

				let response = await cache.match(cacheKey);
				console.log('response', response);
				if (!response) {
					// Not present in cache, rendering & caching
					response = await app.render(req, { platform: { env } });
					response.headers.append(
						'Cache-Control',
						`s-maxage=${LONG_TTL_PAGES.includes(url.pathname) ? 43200 /* 12 hours */ : DEFAULT_TTL}`
					);
					context.waitUntil(cache.put(cacheKey, response.clone()));
				}
				return response;
			} else {
				return await app.render(req, { platform: { env } });
			}
		} catch (e) {
			return new Response('Error rendering route: ' + (e.message || e.toString()), { status: 500 });
		}
	},
};
