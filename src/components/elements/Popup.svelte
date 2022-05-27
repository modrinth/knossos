<script lang="ts">
    import { navigating } from "$app/stores";
    import Button from "$components/elements/Button.svelte";
    import Chips from "$components/elements/Chips.svelte";
    import ImageUpload from "$components/elements/ImageUpload.svelte";
    import Input from "$components/elements/Input.svelte";
    import Multiselect from "$components/elements/Multiselect.svelte";
    import { markdown } from "$lib/parse";
    import { popups } from "$stores/app";
    import { clickOutside } from "svelte-use-click-outside";
    import { fade } from "svelte/transition";
    import IconArrowRight from "virtual:icons/heroicons-outline/arrow-right";
    import IconExclamation from "virtual:icons/heroicons-outline/exclamation";
    import IconX from "virtual:icons/heroicons-outline/x";

    let popup;
    $: popup = $popups[0];
    let deletionKey = "";
    let body = "";
    let report_type = "";
    let status = "approved";
    let project_type = "";
    let name = "";
    let file;

    function close() {
        deletionKey = "";
        report_type = "";
        body = "";
        status = "approved";
        project_type = "";
        name = "";
        file = undefined;
        $popups = $popups.slice(1, $popups.length - 1);
    }

    $: {
        if ($navigating) {
            $popups = [];
        }
    }
</script>

{#if popup}
    <div class="popup" transition:fade={{ duration: 100 }}>
        <div
            class="popup__card card card--gap-compressed"
            use:clickOutside={() => {
                if (!popup?.type?.creation) close();
            }}
            class:popup__card--wide={popup?.style?.wide}
        >
            <h1 class="popup__card__top">
                <h2 class="title-secondary">{popup.title}</h2>
                <Button
                    title="Close"
                    icon={IconX}
                    color="transparent"
                    iconSize={20}
                    on:click={close}
                />
            </h1>
            {#if popup?.type?.deletion}
                <div class="popup__card__warning">
                    <IconExclamation height="26px" width="26px" /><span
                        >This is extremely important.</span
                    >
                </div>
            {/if}
            {#if popup.body}
                {@html markdown(popup.body)}
            {/if}
            {#if popup?.type?.deletion}
                <p>
                    <b>To verify, type</b> <i>{popup.type.deletion.key}</i>
                    <b>below:</b>
                </p>
                <Input
                    type="text"
                    placeholder="Type here..."
                    bind:value={deletionKey}
                />
            {/if}
            {#if popup?.type?.report}
                <p><b>Reason</b></p>
                <Multiselect
                    bind:value={report_type}
                    options={[
                        { label: "Spam", value: "spam" },
                        { label: "Copyright", value: "copyright" },
                        { label: "Inappropriate", value: "inappropriate" },
                        { label: "Malicious", value: "malicious" },
                        { label: "Name-squatting", value: "name-squatting" },
                    ]}
                />
                <p>
                    <b>Additional Information</b><br />Include links and images
                    if possible. Markdown formatting is supported.
                </p>
                <Input
                    type="textarea"
                    placeholder="Enter additional information..."
                    bind:value={body}
                />
            {/if}
            {#if popup?.type?.creation === "project"}
                <p><b>Project type</b></p>
                <Chips
                    bind:value={project_type}
                    options={[
                        { label: "Mod", value: "mod" },
                        { label: "Modpack", value: "modpack" },
                    ]}
                />
                <p><b>Name</b></p>
                <Input
                    type="text"
                    placeholder="Enter project name..."
                    bind:value={name}
                />
                <p>
                    <b>Summary</b><br />This appears in search and on the
                    sidebar of your project's page.
                </p>
                <Input
                    type="textarea"
                    placeholder="Enter short summary of project..."
                    bind:value={body}
                />
            {/if}
            {#if popup?.type?.creation === "galleryItem"}
                <p>
                    <b
                        >{#if !file}Image file{:else}Preview{/if}</b
                    >
                </p>
                <ImageUpload bind:file />
                <p><b>Title</b></p>
                <Input
                    type="text"
                    placeholder="Enter image title..."
                    bind:value={name}
                />
                <p><b>Description</b></p>
                <Input
                    type="textarea"
                    placeholder="Enter image description..."
                    bind:value={body}
                />
            {/if}
            {#if popup?.type?.moderation}
                <p><b>Status</b></p>
                <Multiselect
                    bind:value={status}
                    options={[
                        { label: "Approve", value: "approved" },
                        { label: "Unlist", value: "unlisted" },
                        { label: "Reject", value: "rejected" },
                    ]}
                />
                <p>
                    <b>Moderation message</b><br />Optionally include
                    information to communicate problems with a project's team
                    members. Markdown formatting is supported.
                </p>
                <Input
                    type="textarea"
                    placeholder="Enter additional information..."
                    bind:value={body}
                />
            {/if}
            <div class="popup__card__buttons">
                {#if popup?.type?.deletion}
                    <Button label="Cancel" on:click={close} />
                {/if}
                <Button
                    label={popup?.button?.label || "Continue"}
                    on:click={async () => {
                        await popup.button?.click({
                            body,
                            status,
                            report_type,
                            project_type,
                            name,
                            file,
                        });
                        close();
                    }}
                    color={popup?.type?.deletion ? "red" : "brand"}
                    icon={popup?.type?.deletion || popup?.type?.report
                        ? null
                        : IconArrowRight}
                    disabled={(popup?.type?.deletion &&
                        popup.type.deletion.key !== deletionKey) ||
                        (popup?.type?.report && !report_type) ||
                        (popup?.type?.creation === "project" &&
                            (!project_type || !name || !body)) ||
                        (popup?.type?.creation === "galleryItem" && !file)}
                />
            </div>
        </div>
    </div>
{/if}

<style lang="postcss">
    .popup {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: hsla(0, 0%, 0%, 0.5);
        backdrop-filter: blur(3px);
        z-index: 20;
        display: flex;
        justify-content: center;
        align-items: center;

        &__card {
            width: 80%;
            max-width: 600px;
            z-index: 25;
            max-height: calc(100% - 2rem);
            overflow-y: auto;

            &--wide {
                max-width: 750px;
            }

            &__top {
                background-color: var(--color-bg);
                margin: -1rem -1rem 0.5rem -1rem;
                padding: 0.8rem 1rem 0.8rem 1.25rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            &__warning {
                margin: -1.1rem -1rem 0.25rem;
                background-color: var(--color-danger-bg);
                padding: 1rem 1.25rem;
                display: flex;
                align-items: center;
                grid-gap: 0.5rem;
                color: var(--color-danger-text);
                border-color: var(--color-danger-text);
                border-width: 0.15rem 0;
                border-style: solid;
            }

            :global(p),
            :global(ul),
            :global(ol) {
                line-height: 1.5;
                margin: 0;

                :global(a) {
                    color: var(--color-link);

                    &:hover {
                        text-decoration: underline;
                    }
                }
            }

            &__buttons {
                margin-top: 1rem;
                display: flex;
                justify-content: flex-end;
                grid-gap: 1rem;
            }
        }
    }
</style>
