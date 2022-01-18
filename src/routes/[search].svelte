<script context="module" lang="ts">
	import { send } from '$lib/api';

	export async function load({ params, url, fetch, session, stuff }) {
		const project_type = params.search.replace('s', '');

		if (!['mod', 'modpack'].includes(project_type)) {
			return {
				status: 404,
			};
		}

    const term = url.searchParams.get("q")

		const route = `search?query=${term || ""}`;
		const data = await send('GET', route, null, { fetch });

		return {
			props: {
				data,
        project_type,
        term,
			},
		};
	}
</script>

<script lang="ts">
  import ProjectCard from "$components/elements/ProjectCard.svelte";
  import { t } from "svelte-intl-precompile";
  import Input from "$components/elements/Input.svelte";
  import Multiselect from "$components/elements/Multiselect.svelte";

  export let data = []
  export let project_type: string;

  export let term: string;

  let parameters;
</script>


<div class="column-layout">
  <div class="column-layout__sidebar">
    <div class="card card--gap-compressed">
      <h3>Minecraft versions</h3>

      <h3>Mod Loaders</h3>
      <h3>Environments</h3>
      <h3>Categories</h3>
      <Input type="checkboxes" label="Decoration" />
    </div>
  </div>

  <div class="column-layout__content">
    <div class="card card--gap-compressed card--row">
      <Input type="text" placeholder="{$t(`project.types.${project_type}.search`)}" bind:value={term} />
      Sort by
      <Multiselect options={[{ value: "relevance", label: "Relevance" }]} value="relevance" />
    </div>
    {#each data.hits as project}
      <ProjectCard {project} />
    {/each}
  </div>
</div>
