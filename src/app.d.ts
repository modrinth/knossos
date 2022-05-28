/// <reference types="@sveltejs/kit" />

declare namespace App {
    interface Locals {
        token: string;
        user: User;
        theme: string;
    }

    interface Platform {
        env: {
            API_CACHE: DurableObjectNamespace;
        };
        context: {
            waitUntil: (promise: Promise<void>) => void;
        };
        caches: CacheStorage & { default: Cache };
    }

    // interface Session {}

    // interface Stuff {}
}
