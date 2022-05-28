import { send } from "$lib/api";
import type { Handle } from "@sveltejs/kit";
import cookie from "cookie";

export const login: Handle = async ({ event, resolve }) => {
    const LOGGED_IN_PAGES = [
        "/following",
        "/report",
        "/moderation",
        "/settings",
    ];

    let token = event.locals.token || event.url.searchParams.get("code") || "";

    if (token) {
        try {
            event.locals.user = (await send("GET", "user", null, {
                token,
            })) as User;
        } catch {
            // Invalid token
            token = "";
        }
    }

    // User is not logged in and is on a page that requires login, redirect them
    if (!token && LOGGED_IN_PAGES.includes(event.url.pathname)) {
        return new Response(null, {
            status: 307,
            headers: new Headers({ Location: "/" }),
        });
    }

    const response = await resolve(event);

    if (!event.locals.token && token) {
        response.headers.set(
            "set-cookie",
            cookie.serialize("modrinth-token", token, {
                path: "/",
                secure: true,
                sameSite: "strict",
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            })
        );
        event.locals.token = token;
    }

    return response;
};
