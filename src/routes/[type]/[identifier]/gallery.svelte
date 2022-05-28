<script lang="ts">
    import Button from "$components/elements/Button.svelte";
    import Input from "$components/elements/Input.svelte";
    import Meta from "$components/utils/Meta.svelte";
    import { send, sendAxios } from "$lib/api";
    import { popups } from "$stores/app";
    import { permissions, project, color } from "./_store";
    import { t } from "svelte-intl-precompile";
    import IconCheck from "virtual:icons/heroicons-outline/check";
    import IconPencil from "virtual:icons/heroicons-outline/pencil";
    import IconPlus from "virtual:icons/heroicons-outline/plus";
    import IconTrash from "virtual:icons/heroicons-outline/trash";
    import IconX from "virtual:icons/heroicons-outline/x";

    let modifiedItems = {};

    async function editItem(item) {
        try {
            await sendAxios(
                "PATCH",
                `project/${$project.id}/gallery?${new URLSearchParams({
                    url: item.url,
                    featured: "false",
                    title: item.title || "\u200b",
                    description: item.description || "\u200b",
                })}`,
                {
                    type: "application/json",
                    useFormData: false,
                }
            );
        } catch (e) {
            console.error(e);
        }
        delete modifiedItems[item.url];
        modifiedItems = modifiedItems;
    }

    function createItem() {
        $popups = [
            {
                title: `Upload gallery image`,
                body: ``,
                type: {
                    creation: "galleryItem",
                },
                button: {
                    click: async ({ name, body, file }) => {
                        try {
                            await sendAxios(
                                "POST",
                                `project/${
                                    $project.id
                                }/gallery?${new URLSearchParams({
                                    ext: file.name.split(".").pop(),
                                    featured: "false",
                                    title: name || "\u200b",
                                    description: body || "\u200b",
                                })}`,
                                file,
                                {
                                    type: "image/png",
                                    useFormData: false,
                                }
                            );
                        } catch (e) {
                            console.error(e);
                        }
                        $project.gallery = (
                            await send("GET", `project/${$project.id}`)
                        ).gallery;
                    },
                    label: "Upload image",
                },
            },
            ...$popups,
        ];
    }

    async function deleteItem(item) {
        if (
            window.confirm(
                "Are you sure you want to delete this gallery image?"
            )
        ) {
            try {
                await sendAxios(
                    "DELETE",
                    `project/${$project.id}/gallery?${new URLSearchParams({
                        url: item.url,
                    })}`,
                    {},
                    {
                        type: "application/json",
                        useFormData: false,
                    }
                );
            } catch (e) {
                console.error(e);
            }
            $project.gallery = $project.gallery.filter(
                (it) => it.url !== item.url
            );
        }
    }
</script>

<Meta
    title="{$project.title} - {$t('pages.gallery')}"
    description="View {$project.gallery
        .length} images of the Minecraft {$project.project_type} {$project.title} on Modrinth."
    color={$color}
    image={$project?.icon_url}
/>

{#if $permissions.data.editDetails}
    <div class="button-group">
        <Button
            label="Upload image"
            icon={IconPlus}
            color="brand"
            on:click={createItem}
        />
    </div>
{/if}

<div class="gallery">
    {#each $project.gallery.filter((item, index) => $project.gallery
                .map((it) => it.url)
                .indexOf(item.url) === index) as item (item.url)}
        <div class="card gallery__item">
            <img class="gallery__item__image" src={item.url} alt="" />
            {#if modifiedItems[item.url]}
                <Input
                    type="text"
                    placeholder="Enter title..."
                    bind:value={modifiedItems[item.url].title}
                />
                <Input
                    type="textarea"
                    placeholder="Enter description..."
                    bind:value={modifiedItems[item.url].description}
                />
            {:else}
                <h1 class="title">{item.title}</h1>
                <p class="gallery__item__description">{item.description}</p>
            {/if}
            {#if $permissions.data.editDetails}
                <div class="button-group">
                    {#if modifiedItems[item.url]}
                        <Button
                            label="Save"
                            icon={IconCheck}
                            color="brand"
                            on:click={() => editItem(item)}
                        />
                        <Button
                            label="Cancel"
                            icon={IconX}
                            on:click={() => {
                                delete modifiedItems[item.url];
                                modifiedItems = modifiedItems;
                            }}
                        />
                    {:else}
                        <Button
                            label="Edit"
                            icon={IconPencil}
                            on:click={() => (modifiedItems[item.url] = item)}
                        />
                        <Button
                            label="Delete"
                            icon={IconTrash}
                            on:click={() => deleteItem(item)}
                        />
                    {/if}
                </div>
            {/if}
        </div>
    {/each}
</div>

<style lang="postcss">
    .gallery {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
        grid-gap: 1rem;

        &__item {
            &__image {
                margin: -1rem -1rem 0 -1rem;
                height: auto;
                width: calc(100% + 2rem);
            }
            &__description {
                line-height: normal;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .button-group {
                margin-top: auto;
            }
        }
    }
</style>
