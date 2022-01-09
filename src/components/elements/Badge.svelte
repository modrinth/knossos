<script lang="ts">
	export let label = '';
	export let color = '';
</script>

<div class="badge badge--color-{color}">
	<span class="badge__label">{label}</span>
</div>

<style lang="postcss">
	.badge {
		font-weight: var(--font-weight-bold);

		&--color-green {
			color: var(--color-badge-green-text);
			--color-dot: var(--color-badge-green-dot);
		}
		&--color-yellow {
			color: var(--color-badge-yellow-text);
			--color-dot: var(--color-badge-yellow-dot);
		}
		&--color-red {
			color: var(--color-badge-red-text);
			--color-dot: var(--color-badge-red-dot);
		}

		&__label::before {
			content: '';
			display: inline-block;
			width: 0.5rem;
			height: 0.5rem;
			border-radius: 50%;
			background-color: var(--color-dot);
			margin-right: 0.5rem;
		}
	}
</style>
