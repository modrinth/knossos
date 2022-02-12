<script lang="ts">
  export let fullTitle = ''
  export let title = ''
  export let description =
    'Modrinth is an open-source mod distribution platform. Modrinth is modern, easy to use, and built for modders. Modrinth currently supports Minecraft, including Forge and Fabric mod loaders.'
  export let noindex = false
  export let image = ''
  export let color = '#18B572'
</script>

<svelte:head>
  <title>{fullTitle || (title ? title + ' - Modrinth' : 'Modrinth')}</title>
  <meta name="og:title" content={title}/>
  <meta name="apple-mobile-web-app-title" content={fullTitle || title || 'Modrinth'}/>
  <meta name="og:description" content={description}/>
  <meta name="description" content={description}/>
  {#if image}
    <meta name="og:image" content={image}/>
  {:else}
    <meta name="og:image" content="/images/logo/icon.png"/>
  {/if}
  <meta name="theme-color" content={color} />
  {#if noindex}
    <meta name="robots" content="noindex"/>
  {/if}
</svelte:head>
