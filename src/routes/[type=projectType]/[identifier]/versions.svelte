<script lang="ts">
	import Meta from '$components/utils/Meta.svelte'
	import { t } from 'svelte-intl-precompile'
	import { members, project, releaseColors, versions, color } from './_store'
	import { formatVersions, downloadUrl, getPrimary } from 'omorphia/utils'
	import { Button, Badge } from 'omorphia'
	import IconDownload from 'virtual:icons/heroicons-outline/download'
	import IconUpload from 'virtual:icons/heroicons-outline/upload'
	import { tagIcons } from '$generated/tags.json'
	import { simplify } from '$lib/number'
	import { browser } from '$app/env'

	const dateFormat = new Intl.DateTimeFormat('en', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	})
</script>

<Meta
	title="{$project.title} - {$t('pages.versions')}"
	description="Download and browse {$versions.length} {$project.title} versions. {simplify(
		$project.downloads
	)} total downloads. Last updated {dateFormat.format(new Date($project.updated))}."
	color={$color}
	image={$project?.icon_url} />

<div class="versions">
	{#each $versions as version}
		<div class="card card--pad-x card--strip version">
			<div class="version__info">
				<div class="version__info__row">
					<a href="./version/{version.version_number || version.id}"
						><b>{version.name || version.version_number}</b></a>
					<a
						href="/user/{$members.find((member) => member.user.id === version.author_id).user
							.username}"
						>{@html $t('generic.byline', {
							values: {
								author: $members.find((member) => member.user.id === version.author_id).user
									.username,
							},
						})}</a>
					&bull;
					<span>{dateFormat.format(new Date(version.date_published))}</span>
				</div>
				<div class="version__info__row">
					<Badge
						label={$t(`release_channels.${version.version_type}`)}
						color={releaseColors[version.version_type]} />
					&bull;
					<div class="tag-group">
						{#each version.loaders as loader, index}
							<div class="tag">
								{@html tagIcons[loader]}{$t(`tags.${loader}`)}
							</div>
						{/each}
					</div>
					&bull;
					{formatVersions(version.game_versions)}
					&bull;
					{@html $t('stats.downloads', { values: { downloads: version.downloads } })}
				</div>
			</div>
			<div style="display:inline-flex;">
				{#if browser && document.cookie.indexOf('integration-enabled') != -1}
					<div style="width:max-content;margin-right:0.5rem;">
						<Button on:click={(e) => (location.href = 'modrinth:/add-item/' + version.id)}>
							<IconUpload />
							{$t('generic.actions.with_manager')}
						</Button>
					</div>
				{/if}
				<div>
					<Button href={downloadUrl(getPrimary(version.files))}>
						<IconDownload />
					</Button>
				</div>
			</div>
		</div>
	{/each}
</div>

<style lang="postcss">
	.versions {
		display: flex;
		flex-direction: column;
		grid-gap: 1rem;

		.version {
			&__info {
				overflow: hidden;
				display: flex;
				flex-direction: column;

				&__row {
					display: flex;
					align-items: center;
					grid-gap: 0 0.4rem;
					flex-wrap: wrap;
				}
			}
		}
	}
</style>
