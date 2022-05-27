<script lang="ts">
    import FollowIllustration from "$assets/images/illustrations/undraw_appreciation.svg";
    import Button from "$components/elements/Button.svelte";
    import ProjectCard from "$components/elements/ProjectCard.svelte";
    import Meta from "$components/utils/Meta.svelte";
    import { ago } from "$lib/ago";
    import { send } from "$lib/api";
    import { following, updateSelf, loaded } from "$stores/self";
    import { onMount } from "svelte";
    import { t } from "svelte-intl-precompile";
    import IconHeartSolid from "virtual:icons/heroicons-solid/heart";
    import IconCalendar from "virtual:icons/lucide/calendar";

    onMount(async () => {
        await updateSelf();
    });
</script>

<Meta title={$t("pages.following")} noindex />

<div class="single-layout">
    <div class="title-bar">
        <h1>{$t("pages.following")}</h1>
    </div>
    {#if !$loaded}
        Loading followed projects...
    {:else if $following.length > 0}
        {#each $following.sort((a, b) => a.title - b.title) as project}
            <ProjectCard {project}>
                <div class="actions" slot="actions">
                    <Button
                        label={$t("generic.actions.unfollow")}
                        icon={IconHeartSolid}
                        on:click={async () => {
                            await send(
                                "DELETE",
                                `project/${project.id}/follow`
                            );
                            $following = $following.filter(
                                (followed) => followed.id !== project.id
                            );
                        }}
                    />
                    <span class="stat">
                        <IconCalendar />
                        {@html $t("stats.updated", {
                            values: { ago: ago(project.updated) },
                        })}
                    </span>
                </div>
            </ProjectCard>
        {/each}
    {:else}
        <div class="illustration">
            <FollowIllustration class="illustration__image" />
            <p class="illustration__description">
                You haven't followed any projects.
            </p>
        </div>
    {/if}
</div>

<style lang="postcss">
    .title-bar {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;

        @media (width <= 400px) {
            flex-direction: column;
            align-items: flex-start;
            grid-gap: 0.75rem;
        }
    }
</style>
