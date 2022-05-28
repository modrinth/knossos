import { cache } from "./cache";
import { locals } from "./locals";
import { login } from "./login";
import { theme } from "./theme";
import type { GetSession } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

export const handle = sequence(locals, cache, login, theme);

export const getSession: GetSession = (event) => {
    return {
        acceptedLanguage:
            event.request.headers["accept-language"] &&
            event.request.headers["accept-language"].split(",")[0],
        ...event.locals,
    };
};
