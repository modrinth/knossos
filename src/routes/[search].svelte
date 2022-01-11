<script context="module" lang="ts">
	import { send } from '$lib/api';

	export async function load({ params, url, fetch, session, stuff }) {
		const project_type = params.search.replace('s', '');

		if (!['mod', 'modpack'].includes(project_type)) {
			return {
				status: 404,
			};
		}
		const route = `search?query=${url.searchParams.get("q") || ""}`;
		const data = await send('GET', route, null, { fetch });

		return {
			props: {
				data,
			},
		};
	}
</script>

<script lang="ts">
  import ProjectCard from "$components/elements/ProjectCard.svelte";

  export let data = []
</script>


<div class="column-layout">
  <div class="column-layout__sidebar">
    <div class="card card--gap-compressed">
      <h3>Filter</h3>
    </div>
  </div>

  <div class="column-layout__content">
    {#each data.hits as project}
      <ProjectCard {project} />
    {/each}
  </div>
</div>
