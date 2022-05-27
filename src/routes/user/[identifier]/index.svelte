<script lang="ts">
    import { page } from "$app/stores";
    import ProjectCard from "$components/elements/ProjectCard.svelte";
    import { getContext } from "svelte";

    const projects: Project[] = getContext("projects");
</script>

{#each projects.filter( (project) => ($page.url.searchParams.get("type") ? project.project_type === $page.url.searchParams.get("type") : true) ) as project}
    <ProjectCard {project} />
{/each}
