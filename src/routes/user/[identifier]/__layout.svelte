<script context="module" lang="ts">
    import { send } from "$lib/api";

    export async function load({ params, fetch, session, stuff }) {
        try {
            const user: User = (await send(
                "GET",
                `user/${params.identifier}`,
                null,
                {
                    fetch,
                }
            )) as User;

            return {
                props: {
                    user,
                    projects: (
                        await send(
                            "GET",
                            `user/${params.identifier}/projects`,
                            null,
                            { fetch }
                        )
                    ).sort((a: any, b: any) => b.downloads - a.downloads),
                    github_url: (
                        await (
                            await fetch(
                                `https://api.github.com/user/${user.github_id}`
                            )
                        ).json()
                    ).html_url,
                },
            };
        } catch (error) {
            if (error?.status === 404) {
                return {
                    status: 404,
                    error: new Error(
                        `The user you were looking for cannot be found.`
                    ),
                };
            } else {
                return {};
            }
        }
    }
</script>

<script lang="ts">
    import Ad from "$components/elements/Ad.svelte";
    import Badge from "$components/elements/Badge.svelte";
    import Button from "$components/elements/Button.svelte";
    import Input from "$components/elements/Input.svelte";
    import Nav from "$components/elements/Nav.svelte";
    import ProfilePicture from "$components/elements/ProfilePicture.svelte";
    import Meta from "$components/utils/Meta.svelte";
    import { projectTypes } from "$generated/tags.json";
    import { ago } from "$lib/ago";
    import { create as _create } from "$lib/create";
    import { simplify } from "$lib/number";
    import { report } from "$lib/report";
    import { user as currentUser } from "$stores/server";
    import { setContext } from "svelte";
    import { t } from "svelte-intl-precompile";
    import IconCake from "virtual:icons/heroicons-outline/cake";
    import IconDownload from "virtual:icons/heroicons-outline/download";
    import IconFlag from "virtual:icons/heroicons-outline/flag";
    import IconPencil from "virtual:icons/heroicons-outline/pencil";
    import IconPlus from "virtual:icons/heroicons-outline/plus";
    import IconUpload from "virtual:icons/heroicons-outline/upload";
    import IconX from "virtual:icons/heroicons-outline/x";
    import IconHeart from "virtual:icons/lucide/heart";
    import IconSave from "virtual:icons/lucide/save";
    import IconUser from "virtual:icons/lucide/user";
    import IconGithub from "virtual:icons/simple-icons/github";

    const create = _create as any;

    export let user: User;
    export let projects: Project[];
    setContext("projects", projects);
    export let github_url: string;

    let downloads = projects.reduce(
        (acc, project) => acc + project.downloads,
        0
    );
    let followers = projects.reduce(
        (acc, project) => acc + project.followers,
        0
    );

    let roleColors = {
        admin: "red",
        moderator: "yellow",
        developer: "green",
    };

    let isEditing = false;

    let modifiedUser;

    function startEditing() {
        modifiedUser = {
            username: $currentUser.username,
            bio: $currentUser.bio,
            email: $currentUser.email,
        };
        isEditing = true;
    }

    // Not async because Vite "asyncGeneratorStep" error
    function editUser() {
        const oldUsername = $currentUser.username;
        const body = {
            ...(modifiedUser.username !== $currentUser.username
                ? { username: modifiedUser.username }
                : {}),
            ...(modifiedUser.bio !== $currentUser.bio
                ? { bio: modifiedUser.bio }
                : {}),
            ...(modifiedUser.email !== $currentUser.email
                ? { email: modifiedUser.email }
                : {}),
        };

        if (Object.keys(body).length > 0) {
            send("PATCH", `user/${user.id}`, body).then(() => {
                currentUser.set({ ...$currentUser, ...modifiedUser });
                user = $currentUser;
                isEditing = false;
                if (oldUsername !== $currentUser.username) {
                    history.replaceState(
                        null,
                        "",
                        `/user/${modifiedUser.username}`
                    );
                }
            });
        } else {
            isEditing = false;
        }
    }
</script>

<Meta
    title={user.username}
    description="{user.bio} - Download {user.username}'s mods & modpacks on Modrinth"
/>

<div class="user-header">
    <ProfilePicture src={user.avatar_url} size="md" circle />
    <h1 class="user-header__title">
        {modifiedUser?.username ?? user.username}
    </h1>
</div>

<div class="column-layout">
    <div class="column-layout__sidebar">
        <div class="card card--pad-top card--gap-compressed">
            <h1 class="mobile-title">{user.username}</h1>

            {#if $currentUser}
                <div class="button-group">
                    {#if user.id === $currentUser?.id}
                        {#if isEditing}
                            <Button
                                label="Save"
                                icon={IconSave}
                                color="brand"
                                on:click={editUser}
                            />
                            <Button
                                label="Cancel"
                                icon={IconX}
                                on:click={editUser}
                            />
                        {:else}
                            <Button
                                label="Edit"
                                icon={IconPencil}
                                on:click={startEditing}
                            />
                        {/if}
                    {:else}
                        <Button
                            label="Report"
                            icon={IconFlag}
                            on:click={() => report("user", user.id)}
                        />
                    {/if}
                </div>
            {/if}

            {#if isEditing}
                <b>Username</b>
                <Input
                    type="text"
                    placeholder="Enter username..."
                    bind:value={modifiedUser.username}
                />

                <b>Bio</b>
                <Input
                    type="textarea"
                    placeholder="Add a bio..."
                    bind:value={modifiedUser.bio}
                />

                <p><b>Private email</b> (only for moderators)</p>
                <Input
                    type="text"
                    placeholder="Add a bio..."
                    bind:value={modifiedUser.email}
                />

                <Button label="Upload avatar" icon={IconUpload} />
            {:else}
                <Badge
                    label={$t("roles." + user.role)}
                    color={roleColors[user.role]}
                />

                {#if user.bio}
                    <p class="summary">{user.bio}</p>
                {/if}
            {/if}

            <hr class="divider" />

            <div class="stat">
                <IconDownload />
                <span
                    >{@html $t("stats.downloads", {
                        values: { downloads: simplify(downloads) },
                    })}</span
                >
            </div>
            <div class="stat">
                <IconHeart />
                <span
                    >{@html $t("stats.followers_of_projects", {
                        values: { followers: simplify(followers) },
                    })}</span
                >
            </div>
            <div class="stat stat--color-light">
                <IconCake />
                <span
                    >{$t("stats.joined", {
                        values: { ago: ago(user.created) },
                    })}</span
                >
            </div>
            <div class="stat stat--color-light">
                <IconUser />
                <span>{$t("stats.user_id", { values: { id: user.id } })}</span>
            </div>

            <hr class="divider" />

            <div class="button-group">
                <Button
                    label={$t("generic.external.github_profile")}
                    icon={IconGithub}
                    color="transparent"
                    href={github_url}
                />
            </div>
        </div>
    </div>

    <div class="column-layout__content">
        <Ad />

        <div class="card card--strip card--pad-x">
            <Nav
                links={[
                    {
                        label: $t("pages.all"),
                        href: "",
                    },
                    ...projectTypes
                        .filter(
                            (t) =>
                                projects.filter((p) => p.project_type == t)
                                    .length > 0
                        )
                        .map((type) => ({
                            label: $t(`project.types.${type}.plural`),
                            href: type,
                        })),
                ]}
                query="type"
            />

            {#if $currentUser && $currentUser.id === user.id}
                <Button
                    label={$t("generic.actions.new_project")}
                    color="brand"
                    icon={IconPlus}
                    on:click={create}
                />
            {/if}
        </div>

        <slot />
    </div>
</div>

<style lang="postcss">
    .user-header {
        display: flex;
        width: 100%;
        padding: 0 1rem;
        margin-bottom: -2.5rem;
        z-index: 1;
        grid-gap: 0.75rem;
        align-items: center;

        &__title {
            font-size: 1.5rem;

            @media (width <= 500px) {
                display: none;
            }
        }
    }

    .mobile-title {
        display: none;

        @media (width <= 500px) {
            display: flex;
        }
    }
</style>
