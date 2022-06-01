<script lang="ts">
    // noinspection ES6UnusedImports
    import { tagIcons } from "$generated/tags.json";
    import { simplify } from "$lib/number";
    import { packMods } from "$stores/app";
    import Button from "./Button.svelte";
    import { Avatar } from "omorphia";
    import { ago } from "omorphia/utils/ago";
    import { onMount } from "svelte";
    import { t } from "svelte-intl-precompile";
    import { get } from "svelte/store";
    import IconDownload from "virtual:icons/heroicons-outline/download";
    import IconCalendar from "virtual:icons/lucide/calendar";
    import IconHeart from "virtual:icons/lucide/heart";

    export let project: Project | ProjectResult;
    export let builder = false;

    $: includesMod =
        get(packMods).filter((v) => v.slug == project.slug).length > 0;

    // @ts-ignore: Author is only available in the result
    let author = project.author ?? "";

    // @ts-ignore: ID is in different locations in the result and project
    let id = project.id ?? project.project_id;

    // @ts-ignore: Updated is in different locations in the result and project
    let updated = project.date_modified ?? project.updated;

    const href = `/${project.project_type}/${project.slug || id}`;

    packMods.subscribe((v) => {
        includesMod = v.filter((v) => v.slug == project.slug).length > 0;
    });

    const addMod = () => {
        if (!includesMod) {
            packMods.set([project, ...get(packMods)]);
        } else {
            packMods.set([
                ...get(packMods).filter((v) => v.slug != project.slug),
            ]);
        }
    };

    // TODO: Add the latest version's download URL into Labyrinth's search page.
    const download = () => {
        // @ts-ignore
        if (!project.download) {
            alert("Modrinth hasn't implemented this feature yet!");
        } else {
            // @ts-ignore
            window.open(project.download);
        }
    };
</script>

<div class="card project-card">
    <div class="project-card__main">
        <a {href} tabindex="-1">
            <Avatar src={project.icon_url} size="md" />
        </a>

        <div class="project-card__main__info">
            <span
                ><a class="title" {href}>{project.title}</a>
                {#if author}
                    <a
                        href="/user/{author}"
                        class="project-card__main__info__author"
                        >{@html $t("generic.byline", { values: { author } })}</a
                    >
                {/if}
            </span>

            <p class="summary">
                {project.description}
            </p>

            <div class="tags">
                {#each project.categories as category}
                    <div class="tags__tag">
                        {@html tagIcons[category] || "?"}
                        {$t(`tags.${category}`)}
                    </div>
                {/each}
            </div>
        </div>
    </div>

    {#if !$$slots.actions}
        <div class="actions">
            <span class="stat">
                <IconDownload />
                {@html $t("stats.downloads", {
                    values: { downloads: simplify(project.downloads) },
                })}
            </span>
            <span class="stat">
                <IconHeart />
                {@html $t("stats.followers", {
                    values: {
                        followers: simplify(
                            project.followers ?? project.follows
                        ),
                    },
                })}
            </span>
            <span class="stat">
                {#if builder}
                    <Button
                        color={includesMod ? "danger" : "brand"}
                        label={includesMod ? "Remove" : "Add"}
                        evenPadding
                        on:click={addMod}
                    />
                {:else}
                    <Button
                        color="brand"
                        label="Download"
                        evenPadding
                        icon={IconDownload}
                        on:click={download}
                    />
                {/if}
                &nbsp;&nbsp;
                <IconCalendar />
                {@html $t("stats.updated", { values: { ago: ago(updated) } })}
            </span>
        </div>
    {:else}
        <slot name="actions" />
    {/if}
</div>

<style lang="postcss">
    .project-card {
        flex-direction: row;
        flex-wrap: nowrap;

        @media (width <= 1000px) {
            flex-wrap: wrap;
        }

        &__main {
            display: flex;
            grid-gap: 1rem;

            :global(.profile-picture) {
                @media (width <= 700px) {
                    --size: 4rem;
                    border-radius: 0.75rem;
                }
            }

            &__info {
                display: flex;
                flex-direction: column;
                grid-gap: 0.25rem;
                line-height: 100%;
                margin-top: 0.2rem;

                &__author {
                    white-space: nowrap;
                }
            }
        }
    }
</style>
