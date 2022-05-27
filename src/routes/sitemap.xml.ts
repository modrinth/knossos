import type { RequestHandler } from "@sveltejs/kit";

interface page {
    path: string;
    modified?: string;
}

export const get: RequestHandler = async ({ url }) => {
    let pages: page[] = [
        {
            path: "",
        },
        {
            path: "/mods",
        },
        {
            path: "/modpacks",
        },
        {
            path: "/builder",
        },
        {
            path: "/about",
        },
        {
            path: "/legal/rules",
        },
        {
            path: "/legal/privacy",
        },
        {
            path: "/legal/terms",
        },
    ];

    let projects = [];
    const projectCount = (
        await (
            await fetch(import.meta.env.VITE_API_URL + "search?limit=0")
        ).json()
    ).total_hits;

    for (let i = 0; i < Math.ceil(projectCount / 100); i++) {
        projects = projects.concat(
            (
                await (
                    await fetch(
                        import.meta.env.VITE_API_URL +
                            `search?limit=100&offset=${i * 100}`
                    )
                ).json()
            ).hits
        );
    }

    for (const project of projects) {
        const base = `/${project.project_type}/${project.slug || project.id}`;
        pages = pages.concat([
            {
                path: base,
            },
            {
                path: `${base}/versions`,
                modified: project.date_modified,
            },
            ...(project.gallery.length > 0
                ? [
                      {
                          path: `${base}/gallery`,
                      },
                  ]
                : []),
            {
                path: `${base}/changelog`,
                modified: project.date_modified,
            },
        ]);
    }

    const authors = projects.map((it) => it.author);

    for (const author of authors) {
        pages.push({
            path: `/user/${author}`,
        });
    }

    const urlTags = pages.map(
        (page) => `<url>
    <loc>${url.origin}${page.path}</loc>
    ${
        page.modified
            ? `<lastmod>${toW3CString(new Date(page.modified))}</lastmod>`
            : ""
    }
  </url>`
    );

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urlTags.join("\n")}
</urlset>`;

    return {
        status: 200,
        body,
        headers: {
            "Content-Type": "application/xml",
        },
    };
};

function toW3CString(date: Date): string {
    return (
        date.getUTCFullYear().toString().padStart(2, "0") +
        "-" +
        (date.getUTCMonth() + 1).toString().padStart(2, "0") +
        "-" +
        date.getUTCDate().toString().padStart(2, "0") +
        "T" +
        date.getUTCHours().toString().padStart(2, "0") +
        ":" +
        date.getUTCMinutes().toString().padStart(2, "0") +
        ":" +
        date.getUTCMilliseconds().toString().padStart(2, "0")
    );
}
