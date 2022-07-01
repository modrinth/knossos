<script lang="ts">
	import { t } from 'svelte-intl-precompile'
	import Meta from '$components/utils/Meta.svelte'
	import { following, updateSelf, loaded } from '$stores/account'
	import { Button } from 'omorphia'
	import { ago } from 'omorphia/utils'
	import IconHeartSolid from 'virtual:icons/heroicons-solid/heart'
	import { send } from 'omorphia/utils'
	import { onMount } from 'svelte'
	import FollowIllustration from '$assets/illustrations/undraw_appreciation.svg'
	import ProjectCard from '$components/ProjectCard.svelte'
	import IconCalendar from 'virtual:icons/lucide/calendar'

	onMount(async () => {
		await updateSelf()
	})
</script>

<Meta title={$t('pages.following')} noindex />

<div class="single-layout">
	<div class="title-bar">
		<h1>{$t('pages.following')}</h1>
	</div>
	{#if !Array.isArray($following)}
		{$t('user.following.loaded')}
	{:else if $following.length > 0}
		{#each $following.sort((a, b) => a.title - b.title) as project}
			<ProjectCard {project}>
				<div class="actions" slot="actions">
					<Button
						on:click={async () => {
							await send('DELETE', `project/${project.id}/follow`)
							$following = $following.filter((followed) => followed.id !== project.id)
						}}>
						<IconHeartSolid />
						{$t('generic.actions.unfollow')}
					</Button>
					<span class="stat">
						<IconCalendar />
						{@html $t('stats.updated', { values: { ago: ago(project.updated) } })}
					</span>
				</div>
			</ProjectCard>
		{/each}
	{:else}
		<div class="illustration">
			<FollowIllustration class="illustration__image" />
			<p class="illustration__description">{$t('user.following.none')}</p>
		</div>
	{/if}
</div>

<style lang="postcss">
	.title-bar {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;

		@media (width <= 400px) {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}
	}
</style>
