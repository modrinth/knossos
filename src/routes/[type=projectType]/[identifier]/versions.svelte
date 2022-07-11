<script lang="ts">
	import DropArea from '$components/DropArea.svelte'
	import Meta from '$components/utils/Meta.svelte'
	import { t } from 'svelte-intl-precompile'
	import { members, project, releaseColors, versions, color, permissions } from './_store'
	import { formatVersions, downloadUrl, getPrimary } from 'omorphia/utils'
	import { Button, Badge } from 'omorphia'
	import IconDownload from 'virtual:icons/heroicons-outline/download'
	import IconPlus from 'virtual:icons/heroicons-outline/plus'
	import IconInfo from 'virtual:icons/heroicons-outline/information-circle'
	import { tagIcons } from '$generated/tags.json'
	import { simplify } from '$utils/number'
	import { goto } from '$app/navigation'
	import { inferVersion } from '$utils/infer'

	const dateFormat = new Intl.DateTimeFormat('en', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	})

	async function newVersion(file: File) {
		try {
			const inferredVersion = await inferVersion(file, $project.id)
			goto('./version/new/edit', {
				state: {
					inferredVersion,
				},
			})
		} catch (error) {
			console.error('Failed to create new version.')
			console.error(error)
		}
	}
</script>

<Meta
	title="{$project.title} - {$t('pages.versions')}"
	description="Download and browse {$versions.length} {$project.title} versions. {simplify(
		$project.downloads
	)} total downloads. Last updated {dateFormat.format(new Date($project.updated))}."
	color={$color}
	image={$project?.icon_url} />

{#if $permissions.uploadVersions}
	<div class="button-group">
		<Button
			color="primary"
			as="file"
			on:files={({ detail }) => {
				const file = detail[0]
				if (file) newVersion(file)
			}}>
			<IconPlus />
			{$t('project.versions.upload')}
		</Button>
		<div class="tag">
			<IconInfo />
			Click to choose a file or drag one onto this page
		</div>
	</div>
	<DropArea
		accept={['application/', '']}
		on:drop={(event) => {
			const file = event.detail.dataTransfer?.files?.[0]
			if (file) newVersion(file)
		}} />
{/if}

<div class="versions">
	{#each $versions as version}
		{@const publisher = (
			$members.find((member) => member.user.id === version.author_id) || $members[0]
		).user.username}
		<div class="card card--pad-x card--strip version">
			<div class="version__info">
				<div class="version__info__row">
					<a href="./version/{version.version_number || version.id}">
						<b>{version.name || version.version_number}</b>
					</a>
					<a href="/user/{publisher}"
						>{@html $t('generic.byline', {
							values: {
								author: publisher,
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
			<Button href={downloadUrl(getPrimary(version.files))}>
				<IconDownload />
				{$t('generic.actions.download')}
			</Button>
		</div>
	{/each}
</div>

<style lang="postcss">
	.versions {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		.version {
			&__info {
				overflow: hidden;
				display: flex;
				flex-direction: column;

				&__row {
					display: flex;
					align-items: center;
					gap: 0 0.4rem;
					flex-wrap: wrap;
				}
			}
		}
	}

	.drop-area {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 10;
		visibility: hidden;
		background-color: hsla(0, 0%, 0%, 0.5);
		transition: visibility 0.2s ease-in-out, background-color 0.1s ease-in-out;
		display: flex;
		padding: 2rem;

		&::before {
			--indent: 1rem;
			content: ' ';
			position: relative;
			top: var(--indent);
			left: var(--indent);
			width: calc(100% - (2 * var(--indent)));
			height: calc(100% - (2 * var(--indent)));
			border-radius: 1rem;
			border: 0.25rem dashed var(--color-button-bg);
		}
	}
</style>
