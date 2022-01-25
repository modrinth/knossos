<script lang="ts">
	import { popups } from '$stores/app';
	import { clickOutside } from 'svelte-use-click-outside';
	import Multiselect from '$components/elements/Multiselect.svelte';
	import Button from '$components/elements/Button.svelte';
  import { markdown } from "$lib/parse";
  import IconX from 'virtual:icons/heroicons-outline/x'
  import IconArrowRight from 'virtual:icons/heroicons-outline/arrow-right'
  import IconExclamation from 'virtual:icons/heroicons-outline/exclamation'
  import { fade } from 'svelte/transition';
  import Input from "$components/elements/Input.svelte";

  $: popup = $popups[0];
  let deletionKey = ''

  function close() {
    deletionKey = ''
    $popups = $popups.slice(1, $popups.length - 1);
	}
</script>

{#if $popups.length > 0}
	<div class="popup" transition:fade="{{ duration: 100 }}">
		<div class="popup__card card card--gap-compressed" use:clickOutside={() => {if (!popup?.type?.creation) close()}} class:popup__card--wide={popup?.style?.wide}>
			<h1 class="popup__card__top">
        <h2 class="title-secondary">{popup.title}</h2>
        <Button title="Close" icon={IconX} color="transparent" iconSize={20} on:click={close} />
      </h1>
      {#if popup?.type?.deletion}
        <div class="popup__card__warning">
          <IconExclamation height="26px" width="26px" /><span>This is extremely important.</span>
        </div>
      {/if}
			{#if popup.body}
				{@html markdown(popup.body)}
			{/if}
			{#if popup?.type?.deletion}
        <p><b>To verify, type</b> <i>{popup.type.deletion.key}</i> <b>below:</b></p>
        <Input type='text' placeholder="Type here..." bind:value={deletionKey} />
			{/if}
			<div class="popup__card__buttons">
        {#if popup?.type?.deletion}
          <Button label="Cancel" on:click={close} />
        {/if}
				<Button label={popup?.button?.label || 'Continue' } on:click={() => {close(); popup.button?.click()}} color={popup?.type?.deletion ? 'red' : 'brand'} icon={popup?.type?.deletion ? null : IconArrowRight} disabled={(popup?.type?.deletion) && (popup.type.deletion.key !== deletionKey)} />
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
			max-width: 500px;
			z-index: 25;

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

			:global(p), :global(ul), :global(ol) {
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
