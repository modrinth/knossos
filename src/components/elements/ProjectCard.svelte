<script lang="ts">
  import { markdownInline } from '$lib/parse'
  import { t } from 'svelte-intl-precompile'
  import IconHeart from 'virtual:icons/lucide/heart'
  import IconDownload from 'virtual:icons/heroicons-outline/download'
  import IconCalendar from 'virtual:icons/lucide/calendar'
  import { ago } from '$lib/ago'
  import { tagIcons } from '$stores/tags'
  import ProfilePicture from './ProfilePicture.svelte'

  export let project: Project | ProjectResult

  // @ts-ignore: Author is only available in the result
  let author = project.author ?? ''

  // @ts-ignore: ID is in different locations in the result and project
  let id = project.id ?? project.project_id

  // @ts-ignore: Updated is in different locations in the result and project
  let updated = project.date_modified ?? project.updated

  const href = `/${project.project_type}/${project.slug || id}`
</script>

<div class="card project-card">
  <a {href}>
    <ProfilePicture src={project.icon_url} size="md"/>
  </a>

  <div class="project-card__info">
		<span
    ><a class="title" {href}>{project.title}</a>
      {#if author}
        <a href="/user/{author}">{@html $t('generic.byline', {values: {author}})}</a>
      {/if}
		</span>

    <p>
      {project.description}
    </p>

    <div class="tags">
      {#each project.categories as category}
        <div class="tags__tag">
          {@html $tagIcons[category] || "?"}
          {$t(`tags.${category}`)}
        </div>
      {/each}
    </div>
  </div>

  <div class="project-card__stats">
		<span class="stat">
			<IconDownload/>
      {@html markdownInline($t('stats.downloads', {values: {downloads: project.downloads}}))}
		</span>
    <span class="stat">
			<IconHeart/>
      {@html markdownInline($t('stats.followers', {values: {followers: project.followers ?? project.follows}}))}
		</span>
    <span class="stat">
			<IconCalendar/>
      {@html markdownInline($t('stats.updated', {values: {ago: ago(updated)}}))}
		</span>
  </div>
</div>

<style lang="postcss">
  .project-card {
    flex-direction: row;

    &__info {
      display: flex;
      flex-direction: column;
    }

    &__stats {
      margin-left: auto;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      min-width: fit-content;

      > *:last-child {
        margin-top: auto;
        color: var(--color-text-light);
      }
    }
  }
</style>
