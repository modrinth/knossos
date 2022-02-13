<script context="module" lang="ts">
  import { send } from '$lib/api';

  export async function load({ params, fetch, session, stuff }) {
    try {
      let [projects, reports] = (
        await Promise.all([
          (await send('GET', `moderation/projects`, null, {fetch})).map(it => ({...it, moderation_type: it.project_type})),
          (await send('GET', `report`, null, {fetch})).map(it => ({ ...it, moderation_type: 'report'})),
        ])
      )

      reports = await Promise.all(reports.map(async (report) => {
        try {
          report.item_id = report.item_id?.replace ? report.item_id.replace(/"/g, '') : report.item_id
          let url = ''

          if (report.item_type === 'user') {
            url = `/user/${report.item_id}`
          } else if (report.item_type === 'project') {
            const project = await send('GET', `project/${report.item_id}`)
            report.item_id = project.slug || report.item_id
            url = `/${project.project_type}/${report.item_id}`
          } else if (report.item_type === 'version') {
            console.log(`version/${report.item_id}`)
            const version = await send('GET', `version/${report.item_id}`)
            const project = await send('GET', `project/${version.project_id}`)
            report.item_id = version.version_number || report.item_id
            url = `/${project.project_type}/${project.slug || project.id}/version/${report.item_id}`
          }

          return {
            ...report,
            moderation_type: 'report',
            url
          }
        } catch (error) {
          // Do nothing...
        }
      }))

      const items = [...projects, ...reports].sort((a, b) => new Date(a.published || a.created).valueOf() - new Date(b.published || b.created).valueOf())
      return {
        props: {
          items,
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
  setContext('items', items);
</script>

<Meta title={$t('pages.moderation')} noindex />

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
