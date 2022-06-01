/// <reference types="@sveltejs/kit" />

declare namespace App {
	interface Locals {
		token: string
		user: any
		theme: string
	}

	interface Platform {
		context: {
			waitUntil: (promise: Promise<void>) => void
		}
		caches: CacheStorage & { default: Cache }
	}

	interface Session {
		theme: string
		token: string
		user: any
		acceptLanguage: string
	}

	// interface Stuff {}
}
