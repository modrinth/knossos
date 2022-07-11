/// <reference types="@sveltejs/kit" />

declare namespace App {
	interface Locals {
		token: string
		user: User
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
		user: User
		acceptLanguage: string
	}

	interface Stuff {
		versions: Version[]
	}
}
