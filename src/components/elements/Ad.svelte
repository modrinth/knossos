<script lang="ts">
  import { onMount } from 'svelte'

  export let placement = ''

  let failed = false;

  onMount(() => {
    if (window.ethicalads) {
      ethicalads.load()
    } else {
      console.log('%c' + 'You are using an adblocker.', 'font-family: Inter; font-size: 20px; line-height: 60px; font-weight:bold; background-color: darkgreen; border-radius: 10px; padding: 10px 30px; color: white;')
      console.log('%c' + 'Your adblocker prevented Modrinth from showing Ethical Ads, its only source of income. Contribute to Modrinth on GitHub!', 'font-family: Inter; font-size: 14px; line-height: 20px;')
      console.log('%c' + 'https://github.com/modrinth/', 'font-family: Inter; font-size: 16px; line-height: 20px; text-decoration: underline; color: hsl(210deg,50%,50%); font-style: normal;')
      failed = true
    }
  })
</script>

{#if !failed}
  <div
    data-ea-publisher="modrinth-com"
    data-ea-type="text"
    class="ad"
    id={placement ? `ea-${placement}` : ''}
  >
    <div class="ea-content" />
  </div>
{/if}

<style lang="postcss">
  .ad {
    margin-bottom: -0.6rem;
    min-height: 4.375rem;

    :global(.ea-content) {
      margin: 0 !important;
      border-radius: var(--rounded) !important;
      padding: 1rem 1.1rem !important;
      background-color: var(--color-ad-bg) !important;
      box-shadow: var(--shadow-raised), var(--shadow-inset) !important;
      min-height: 3.125rem;
    }

    :global(.ea-content strong) {
      color: var(--color-ad-link) !important;
    }

    :global(.ea-content span) {
      color: var(--color-text-light) !important;
    }

    :global(.ea-callout) {
      margin: 0 !important;
      padding: 0 !important;
    }
  }
</style>
