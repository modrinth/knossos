<script lang="ts">
	import Meta from '$components/utils/Meta.svelte'
	import { t } from 'svelte-intl-precompile'
	import { members, project, releaseColors, versions, color } from './_store'
	import { Button, Badge } from 'omorphia'
	import { markdown, formatVersions, downloadUrl, getPrimary } from 'omorphia/utils'
	import IconDownload from 'virtual:icons/heroicons-outline/download'

	const dateFormat = new Intl.DateTimeFormat('en', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	})

	let changelogVersions: Array<Version & { duplicate: boolean }>
	$: changelogVersions = $versions.map((version, index) => {
		const nextVersion = $versions[index + 1]
		if (nextVersion && version.changelog && nextVersion.changelog === version.changelog) {
			return { duplicate: true, ...version }
		} else {
			return { duplicate: false, ...version }
		}
	})
</script>

<Meta
	title="{$project.title} - {$t('pages.changelog')}"
	description="Explore the changelog of {$project.title}'s {$versions.length} versions."
	color={$color}
	image={$project?.icon_url} />

<div class="card changelog">
	{#each changelogVersions as version}
		<div class="changelog__item">
			<div
				class="changelog__item__color"
				style:--color="var(--color-badge-{releaseColors[version.version_type]}-dot)"
				class:has-body={version.changelog}
				class:is-duplicate={version.duplicate} />
			<div class="changelog__item__body">
				<div class="changelog__item__body__title">
					<a href="./version/{version.version_number || version.id}"
						><h1 class="title-secondary">{version.name || version.version_number}</h1></a>
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
					<Button href={downloadUrl(getPrimary(version.files))}>
						<IconDownload /> {$t('generic.actions.download')}</Button>
				</div>
				{#if version.changelog && !version.duplicate}
					<div class="changelog__item__body__log markdown">
						{@html markdown(version.changelog)}
					</div>
				{/if}
			</div>
		</div>
	{/each}
</div>

<style lang="postcss">
	.changelog {
		display: flex;
		flex-direction: column;
		grid-gap: 1rem;

		&__item {
			display: flex;
			grid-gap: 0.8rem;
			position: relative;
			padding-left: 1.8rem;

			&__color {
				--color: var(--color-badge-green-dot);
				left: 0;
				top: 0.5rem;
				width: 0.2rem;
				min-width: 0.2rem;
				position: absolute;
				margin: 0 0.4rem;
				border-radius: var(--rounded-max);
				min-height: 100%;

				&.has-body {
					background-color: var(--color);
				}

				&.is-duplicate {
					height: calc(100% + 1.5rem);
					background: linear-gradient(
						to bottom,
						transparent,
						transparent 30%,
						var(--color) 30%,
						var(--color)
					);
					background-size: 100% 10px;
				}

				&::before {
					content: '';
					width: 1rem;
					height: 1rem;
					background-color: var(--color);
					position: absolute;
					top: 0;
					left: -0.4rem;
					border-radius: var(--rounded-max);
				}
			}

			&__body {
				display: flex;
				flex-direction: column;

				&__title {
					display: flex;
					grid-gap: 0.5rem;
					align-items: baseline;
					flex-wrap: wrap;
				}
			}
		}
	}
</style>
