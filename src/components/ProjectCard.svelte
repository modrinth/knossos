<script lang="ts">
	import { t } from 'svelte-intl-precompile'
	import IconHeart from 'virtual:icons/lucide/heart'
	import IconDownload from 'virtual:icons/heroicons-outline/download'
	import IconCalendar from 'virtual:icons/lucide/calendar'
	import { Avatar } from 'omorphia'
	import { ago } from 'omorphia/utils'
	import { tagIcons } from '$generated/tags.json'
	import { simplify } from '$utils/number'

	export let project

	// Author is only available in the result
	let author = project.author ?? ''

	// ID is in different locations in the result and project
	let id = project.id ?? project.project_id

	// Updated is in different locations in the result and project
	let updated = project.date_modified ?? project.updated

	const href = `/${project.project_type}/${project.slug || id}`
</script>

<div class="card project-card">
	<div class="project-card__main">
		<a {href} tabindex="-1">
			<Avatar src={project.icon_url} size="md" />
		</a>

		<div class="project-card__main__info">
			<span
				><a class="title-primary" {href}>{project.title}</a>
				{#if author}
					<a href="/user/{author}" class="project-card__main__info__author"
						>{@html $t('generic.byline', { values: { author } })}</a>
				{/if}
			</span>

			<p class="project-card__main__info__summary summary">
				{project.description}
			</p>

			<div class="tag-group">
				{#each project.categories as category}
					<div class="tag">
						{@html tagIcons[category] || '?'}
						{$t(`tags.${category}`)}
					</div>
				{/each}
			</div>
		</div>
	</div>

	{#if !$$slots.actions}
		<div class="actions">
			<span class="stat">
				<IconDownload />
				{@html $t('stats.downloads', { values: { downloads: simplify(project.downloads) } })}
			</span>
			<span class="stat">
				<IconHeart />
				{@html $t('stats.followers', {
					values: { followers: simplify(project.followers ?? project.follows) },
				})}
			</span>
			<span class="stat">
				<IconCalendar />
				{@html $t('stats.updated', { values: { ago: ago(updated) } })}
			</span>
		</div>
	{:else}
		<slot name="actions" />
	{/if}
</div>

<style lang="postcss">
	.project-card {
		flex-direction: row;
		flex-wrap: nowrap;

		@media (width <= 1000px) {
			flex-wrap: wrap;
		}

		&__main {
			display: flex;
			gap: 1rem;

			:global(.profile-picture) {
				@media (width <= 700px) {
					--size: 4rem;
					border-radius: 0.75rem;
				}
			}

			&__info {
				display: flex;
				flex-direction: column;
				gap: 0.25rem;
				line-height: 100%;
				margin-top: 0.2rem;

				&__summary {
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 3;
					-webkit-box-orient: vertical;
				}

				&__author {
					white-space: nowrap;
				}
			}
		}
	}
</style>
