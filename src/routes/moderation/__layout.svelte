<script context="module" lang="ts">
  import { send } from '$lib/api';

  export async function load({ params, fetch, session, stuff }) {
    try {
      const [projects, reports] = (
        await Promise.all([
          (await send('GET', `moderation/projects`, null, {fetch})).map(it => ({...it, moderation_type: it.project_type})),
          (await send('GET', `report`, null, {fetch})).map(it => ({ ...it, moderation_type: 'report'})),
        ])
      )

      return {
        props: {
          items: [...projects, ...reports],
        },
      };
    } catch {
      return {
        status: 404,
        error: new Error(`The moderation queue could not be received.`),
      };
    }
  }
</script>

<script lang="ts">
  import Nav from '$components/elements/Nav.svelte';
  import { projectTypes } from '$generated/tags.json'
  import { t } from "svelte-intl-precompile";
  import Meta from "$components/utils/Meta.svelte";
  import { setContext } from 'svelte'

  export let items;

  items = items.map(it => ({...it, ...(it?.item_id?.replaceAll ? {item_id: it.item_id.replaceAll('"', '')} : {})}))
  setContext('items', items);
</script>

<Meta title={$t('pages.moderation')} />

<div class="single-layout">
  <h1>{$t('pages.moderation')}</h1>
  <div class="card">
    <Nav
      links={[
					{
						label: $t('pages.all'),
						href: '',
					},
					{
						label: $t('pages.reports'),
						href: 'report',
					},
					...projectTypes.map((type) => ({
						label: $t(`project.types.${type}.plural`),
						href: type,
					})),
			]}
      query="type"
    />
  </div>
  <slot />
</div>

<style lang="postcss">

</style>
