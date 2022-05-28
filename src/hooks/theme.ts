import type { Handle } from "@sveltejs/kit";

// If theme cookie is present, set the theme class on the body
export const theme: Handle = async ({ event, resolve }) => {
    return await resolve(event, {
        ...(event.locals.theme
            ? {
                  transformPage: async ({ html }) =>
                      html.replace(
                          '<body class="base">',
                          `<body class="base theme-${event.locals.theme}">`
                      ),
              }
            : {}),
    });
};
