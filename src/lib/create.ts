import { licenses } from "$generated/tags.json";
import { send, sendAxios } from "$lib/api";
import { popups } from "$stores/app";
import { token as tokenStore, user } from "$stores/server";
import type { AxiosError, AxiosResponse } from "axios";
import { get } from "svelte/store";

export function create(type: "project" | "user" | "version", id: string): void {
    popups.set([
        {
            title: `Create project`,
            body: `New projects are created as drafts, and can be found under your profile page.`,
            type: {
                creation: "project",
            },
            button: {
                label: "click me",
                click: async ({ project_type, name, body }) => {
                    let slug = name.toLowerCase().replace(/ /g, "-");

                    // Test for slug conflict
                    try {
                        await send("GET", `project/${slug}`);
                        // Doesn't 404, meaning there is a conflict, so add random suffix
                        slug +=
                            "-" +
                            (window.crypto || (window as any).msCrypto)
                                .getRandomValues(new Uint16Array(1))
                                .join("");
                    } catch {
                        // Do nothing because there is no slug conflict
                    }

                    const data = {
                        title: name,
                        project_type: project_type,
                        slug: slug,
                        description: body,
                        body: `# Placeholder description

This is your new ${project_type}, ${name}. A checklist below is provided to help prepare for release.

### Before submitting for review

- [ ] Upload at least one version
- [ ] Edit project description
- [ ] Update metadata
- [ ] Select license
- [ ] Set up environments
- [ ] Choose categories
- [ ] Add project and donation links (optional)
- [ ] Add images to gallery (optional)
- [ ] Invite project team members (optional)

> Submissions are normally reviewed within 24 hours, but may take up to 48 hours

Questions? [Join the Modrinth Discord server for support!](/discord)`,
                        initial_versions: [],
                        team_members: [
                            {
                                user_id: get(user).id,
                                name: get(user).username,
                                role: "Owner",
                            },
                        ],
                        categories: [],
                        client_side: "optional",
                        server_side: "optional",
                        license_id: licenses
                            .map((it) => it.short.toLowerCase())
                            .includes("arr")
                            ? "arr"
                            : licenses[0].short,
                        is_draft: true,
                    };

                    try {
                        await sendAxios("POST", "project", data);
                    } catch (e) {
                        console.error(e);
                    }
                },
            },
        },
        ...get(popups),
    ]);
}
