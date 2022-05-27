<script context="module" lang="ts">
    export function load({ error, status }) {
        return {
            props: {
                status,
                message: error.message,
            },
        };
    }
</script>

<script lang="ts">
    import Logo404 from "$assets/images/logo/404.svg";
    import Button from "$components/elements/Button.svelte";
    import Meta from "$components/utils/Meta.svelte";
    import { markdownInline } from "$lib/parse";
    import { t } from "svelte-intl-precompile";

    export let status: number;
    export let message = "";
</script>

<Meta
    title={$t("error.status", { values: { status } })}
    description={message || $t("error.message.default")}
    noindex
/>

<div class="status">
    {#if status === 404}
        <Logo404 width="100%" />
    {:else}
        <h1>{$t("error.status", { values: { status } })}</h1>
    {/if}
</div>

<p class="error-message">
    {#if message}
        {message}
    {:else if status === 404}
        {@html markdownInline($t("error.message.404"))}
    {:else}
        {$t("error.message.default")}
    {/if}
</p>

<div class="error-actions">
    <Button href="/" label={$t("error.actions.home")} color="brand" />
    <Button
        href="/discord"
        label={$t("error.actions.discord")}
        color="raised"
        newTab={true}
    />
</div>

<style lang="postcss">
    .status {
        display: flex;
        margin: 2rem 0;
        max-width: 600px;
        font-size: 2rem;
    }

    .error-actions {
        display: flex;
        grid-gap: 0.5rem;
        flex-wrap: wrap;
    }

    .error-message {
        text-align: center;
        line-height: 200%;
        margin-top: -1rem;

        :global(a) {
            color: var(--color-link);

            &:hover {
                text-decoration: underline;
            }
        }
    }
</style>
