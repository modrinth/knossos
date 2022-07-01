<script lang="ts">
	import { onMount } from 'svelte'
	import { t } from 'svelte-intl-precompile'

	export let placement = ''

	let state: 'waiting' | 'blocked' | 'ready' = 'waiting'

	onMount(() => {
		if ((window as any).ethicalads) {
			state = 'ready'
			setTimeout(() => {
				;(window as any).ethicalads.load()
			}, 20)
		} else {
			console.log(
				'%c' + $t('ads.console.line1'),
				'font-family: Inter; font-size: 20px; line-height: 60px; font-weight:bold; background-color: darkgreen; border-radius: 10px; padding: 10px 30px; color: white;'
			)
			console.log(
				'%c' + $t('ads.console.line2'),
				'font-family: Inter; font-size: 14px; line-height: 20px;'
			)
			console.log(
				'%c' + $t('ads.console.line3'),
				'font-family: Inter; font-size: 14px; line-height: 20px;'
			)
			console.log(
				'%c' + $t('ads.console.line4'),
				'font-family: Inter; font-size: 16px; line-height: 20px; text-decoration: underline; color: hsl(210deg,50%,50%); font-style: normal;'
			)
			state = 'blocked'
		}
	})
</script>

{#if state === 'waiting'}
	<div class="ad">
		<div class="ea-content" />
	</div>
{:else if state === 'blocked'}
	<div class="ad">
		<div class="blocked-placement">
			<div class="blocked-content">
				<div class="blocked-text">{$t('ads.privacy_respecting')}</div>
			</div>
		</div>
	</div>
{:else if state === 'ready'}
	<div
		data-ea-publisher="modrinth-com"
		data-ea-type="text"
		class="ad"
		id={placement ? `ea-${placement}` : 'ea-unknown'}>
		<div class="ea-content" />
	</div>
{/if}

<style lang="postcss">
	.ad {
		margin-bottom: -0.6rem;
		min-height: 4.375rem;

		:global(.ea-content),
		:global(.blocked-content) {
			margin: 0 !important;
			border-radius: var(--rounded-lg) !important;
			padding: 1rem 1.1rem !important;
			background-color: var(--color-ad-bg) !important;
			box-shadow: var(--shadow-raised), var(--shadow-inset) !important;
			min-height: 3.125rem;
			font-size: 14px;
			line-height: 18.2px;
			color: var(--color-text-light) !important;
		}

		:global(.ea-content strong),
		:global(.blocked-content strong) {
			color: var(--color-ad-link) !important;
		}

		:global(.ea-content span),
		:global(.blocked-content span) {
			color: var(--color-text-light) !important;
		}

		:global(.ea-callout) {
			margin: 0 !important;
			padding: 0 !important;
		}
	}
</style>
