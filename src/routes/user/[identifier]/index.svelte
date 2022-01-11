<script lang="ts">
	import ProjectCard from '$components/elements/ProjectCard.svelte';
	import { getContext } from 'svelte';
	import { page } from '$app/stores';

	const projects: Project[] = getContext('projects');
</script>

{#each projects.filter( (project) => ($page.url.searchParams.get('type') ? project.project_type === $page.url.searchParams.get('type') : true) ) as project}
	<ProjectCard {project} />
{/each}
