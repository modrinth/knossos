<script lang="ts">
	interface Item {
		label?: string;
		sublabel?: string;
		href?: string;
		// @ts-ignore: Icon components passed in as SvelteComponentDev can't be type-checked
		icon?: any;
		divider?: boolean;
		action?: () => void;
	}
	export let items: Array<Item> = [];

	export let display = true;

	export let align: 'right' | 'left' = 'left';
</script>

{#if display}
	<div class="floating-menu floating-menu--align-{align}">
		{#each items as item}
			{#if item.divider}
				<hr class="divider" />
			{:else if item.href}
				<a href={item.href} class="floating-menu__item" on:click={() => (display = false)}>
					{#if item.icon}
						<svelte:component this={item.icon} height={16} width={16} />
					{/if}
					<span class="floating-menu__item__label">
						{item.label}
						{#if item.sublabel}
							<br /><span class="floating-menu__item__label__sublabel">{item.sublabel}</span>
						{/if}
					</span>
				</a>
			{:else}
				<button on:click={item.action} class="floating-menu__item">
					{#if item.icon}
						<svelte:component this={item.icon} height={16} width={16} />
					{/if}
					<span class="floating-menu__item__label">
						{item.label}
						{#if item.sublabel}
							<br /><span class="floating-menu__item__label__sublabel">{item.sublabel}</span>
						{/if}
					</span>
				</button>
			{/if}
		{/each}
	</div>
{/if}

<style lang="postcss">
	.floating-menu {
		position: absolute;
		top: calc(100% + 0.1rem);
		width: auto;
		background-color: var(--color-raised-bg);
		border-radius: var(--rounded);
		box-shadow: var(--shadow-floating);
		padding: 0.75rem;
		z-index: 5;
		border: 0.1rem solid var(--color-raised-bg-hover);
		display: flex;
		flex-direction: column;
		grid-gap: 0.25rem;

		&--align-right {
			right: 0;
		}

		&--align-left {
			left: 0;
		}

		&__item {
			padding: 0.2rem 0.4rem;
			border-radius: var(--rounded-sm);
			display: flex;
			align-items: center;
			grid-gap: 0.3rem;

			&:hover {
				background-color: var(--color-raised-bg-hover);
			}

			&__label {
				min-width: 7.5rem;
				text-align: left;

				&__sublabel {
					color: var(--color-text-lightest);
				}
			}
		}
	}
</style>
