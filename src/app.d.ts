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
    }

    // interface Session {}

    // interface Stuff {}
}
