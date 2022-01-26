<script lang="ts">
	export let href = '';
	export let color = '';
	export let label = '';
	export let title = '';
  export let badge = false;
	export let newTab = false;
	// @ts-ignore: Icon components passed in as SvelteComponentDev can't be type-checked
	export let icon: any = null;
  export let disabled = false;
  export let evenPadding = icon && !label;

  let className = ''

  $: {
    className = `button button--color-${color} ${
      evenPadding ? 'button--pad-even' : icon ? 'is-iconified' : ''
    } ${badge ? 'has-badge' : ''}`
  }

	export let iconSize = 16;
</script>

{#if href}
	<a {href} {title} class={className} target={newTab ? '_blank' : ''} {disabled}>
		<svelte:component this={icon} height={iconSize} width={iconSize} />
		{label}
	</a>
{:else}
	<button {title} class={className} on:click {disabled}>
		<svelte:component this={icon} height={iconSize} width={iconSize} />
		{label}
	</button>
{/if}

<style lang="postcss">
	.button {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 0.25rem 1rem;
		grid-gap: 0.4rem;
		cursor: pointer;
    position: relative;

		box-shadow: var(--shadow-inset-sm);

		background-color: var(--color-button-bg);
		border-radius: var(--rounded);
    transition: opacity 1s ease-in-out, filter 1s ease-in-out;

    &:hover {
			background-color: var(--color-button-bg-hover);
		}

    &:disabled {
      opacity: 50%;
      cursor: not-allowed;
      pointer-events: none;
      filter: grayscale(50%);
    }

		&--color-raised {
			background-color: var(--color-raised-bg);
		}

		&--color-brand {
			background-color: var(--color-brand);
			color: var(--color-brand-contrast);

			&:hover {
				background-color: var(--color-brand-dark);
			}
		}

		&--color-transparent {
			background-color: transparent;
			box-shadow: none;
		}

    &--color-red {
      background-color: var(--color-badge-red-dot);
      color: var(--color-brand-contrast);

      &:hover {
        background-color: var(--color-badge-red-text);
      }
    }

		&--pad-even {
			padding: 0.5rem;
      font-size: 16px;
      line-height: 0;
      min-width: 2rem;
      min-height: 2rem;
      justify-content: center;
		}

		&.is-iconified {
			padding: 0.25rem 0.75rem 0.25rem 0.5rem;
		}

    &.has-badge::after {
      content: '';
      width: 0.5rem;
      height: 0.5rem;
      border-radius: var(--rounded-max);
      background-color: var(--color-brand);
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
    }
	}
</style>
