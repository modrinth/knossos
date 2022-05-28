<script lang="ts">
    import Badge from "$components/elements/Badge.svelte";
    import Button from "$components/elements/Button.svelte";
    import Meta from "$components/utils/Meta.svelte";
    import { tagIcons } from "$generated/tags.json";
    import { simplify } from "$lib/number";
    import { createVersion, formatVersions } from "$lib/versions";
    import { downloadUrl, getPrimary } from "$lib/versions";
    import {
        members,
        project,
        releaseColors,
        versions,
        color,
        permissions,
    } from "./_store";
    import { t } from "svelte-intl-precompile";
    import IconDownload from "virtual:icons/heroicons-outline/download";
    import IconPlus from "virtual:icons/heroicons-outline/plus";

    const dateFormat = new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
</script>

<Meta
    title="{$project.title} - {$t('pages.versions')}"
    description="Download and browse {$versions.length} {$project.title} versions. {simplify(
        $project.downloads
    )} total downloads. Last updated {dateFormat.format(
        new Date($project.updated)
    )}."
    color={$color}
    image={$project?.icon_url}
/>

{#if $permissions.data.uploadVersions}
    <div class="button-group">
        <Button
            label="Create version"
            icon={IconPlus}
            color="brand"
            on:click={() => createVersion($project.id)}
        />
    </div>
{/if}

<div class="versions">
    {#each $versions as version}
        <div class="card card--pad-x card--strip version">
            <div class="version__info">
                <div class="version__info__row">
                    <a href="./version/{version.version_number || version.id}"
                        ><b>{version.name || version.version_number}</b></a
                    >
                    <a
                        href="/user/{$members.find(
                            (member) => member.user.id === version.author_id
                        ).user.username}"
                        >{@html $t("generic.byline", {
                            values: {
                                author: $members.find(
                                    (member) =>
                                        member.user.id === version.author_id
                                ).user.username,
                            },
                        })}</a
                    >
                    &bull;
                    <span
                        >{dateFormat.format(
                            new Date(version.date_published)
                        )}</span
                    >
                </div>
                <div class="version__info__row">
                    <Badge
                        label={$t(`release_channels.${version.version_type}`)}
                        color={releaseColors[version.version_type]}
                    />
                    &bull;
                    <div class="tags">
                        {#each version.loaders as loader, index}
                            <div class="tags__tag">
                                {@html tagIcons[loader]}{$t(`tags.${loader}`)}
                            </div>
                        {/each}
                    </div>
                    &bull;
                    {formatVersions(version.game_versions)}
                    &bull;
                    {@html $t("stats.downloads", {
                        values: { downloads: version.downloads },
                    })}
                </div>
            </div>
            <Button
                label={$t("generic.actions.download")}
                icon={IconDownload}
                href={downloadUrl(getPrimary(version.files))}
            />
        </div>
    {/each}
</div>

<style lang="postcss">
    .versions {
        display: flex;
        flex-direction: column;
        grid-gap: 1rem;

        .version {
            &__info {
                overflow: hidden;
                display: flex;
                flex-direction: column;

                &__row {
                    display: flex;
                    align-items: center;
                    grid-gap: 0 0.4rem;
                    flex-wrap: wrap;
                }
            }
        }
    }
</style>
