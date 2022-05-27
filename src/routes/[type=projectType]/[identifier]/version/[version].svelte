<script context="module" lang="ts">
	export async function load({ params, fetch, session, stuff }) {
		const version = stuff.versions.find((it) => [it.version_number, it.id].includes(params.version))

		if (version) {
			return {
				props: {
					version,
				},
			}
		} else {
			return {
				status: 404,
				error: new Error(`The version you were looking for cannot be found.`),
			}
		}
	}
</script>

<script lang="ts">
	import Meta from '$components/utils/Meta.svelte'
	import { t } from 'svelte-intl-precompile'
	import {
		members,
		project,
		releaseColors,
		dependencies,
		permissions,
		color,
		featuredVersions,
	} from '../_store'
	import { Button, Avatar, Badge } from 'omorphia'
	import { markdown } from 'omorphia/utils'
	import IconDownload from 'virtual:icons/heroicons-outline/download'
	import IconFile from 'virtual:icons/lucide/file'
	import { tagIcons } from '$generated/tags.json'
	import { formatVersions, downloadUrl, getPrimary } from 'omorphia/utils'
	import IconPencil from 'virtual:icons/heroicons-outline/pencil'
	import IconFlag from 'virtual:icons/heroicons-outline/flag'
	import IconStar from 'virtual:icons/heroicons-outline/star'
	import IconTrash from 'virtual:icons/heroicons-outline/trash'
	import { report } from '$lib/report'
	import { user } from '$stores/server'

	const dateFormat = new Intl.DateTimeFormat('en', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
	})

	export let version

	const gameVersions = formatVersions(version.game_versions)

	$: versionDependencies = version.dependencies.map((dep) => ({
		...dep,
		project: $dependencies.projects.find(({ id }) => dep.project_id === id),
		version: $dependencies.versions.find(({ id }) => dep.version_id === id),
	}))

	$: publisher = $members.find((it) => it.user.id === version.author_id)
</script>

<Meta
	title="{version.name || version.version_number} - {$project.title}"
	description="Download {$project.title} {version.version_number} on Modrinth. Supports {gameVersions} {version.loaders
		.map((it) => $t(`tags.${it}`))
		.join(' & ')}. Published on {new Date(version.date_published).toLocaleDateString('en', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	})}. {version.downloads > 0 ? ` ${version.downloads} downloads.` : ''}"
	color={$color}
	image={$project?.icon_url} />

<h1 class="title">
	{version.name || version.version_number}
	{#if version.featured}
		<div class="featured"><IconStar /> Featured</div>
	{:else if $featuredVersions.find((it) => it.id === version.id)}
		<div class="featured"><IconStar /> Auto-featured</div>
	{/if}
</h1>

{#if $user}
	<div class="button-group">
		{#if $permissions.data.uploadVersions}
			<Button color="raised"><IconStar /> Feature</Button>
			<Button color="raised"><IconPencil /> Edit</Button>
		{:else}
			<Button color="raised" on:click={() => report('version', version.id)}>
				<IconFlag /> Report
			</Button>
		{/if}
		{#if $permissions.data.deleteVersion}
			<Button color="raised"><IconTrash /> Delete</Button>
		{/if}
	</div>
{/if}

<div class="grid grid--col-2-1">
	<div class="grid__col">
		<div class="card">
			<h2 class="title-secondary">Files</h2>
			{#each version.files as file}
				<a
					class="file"
					href={downloadUrl(file)}
					class:file--primary={file.primary || version.files.length === 1}>
					<IconFile />
					<div class="file__name"><b>{file.filename}</b></div>
					<div class="file__download">
						<IconDownload />
					</div>
				</a>
			{/each}
		</div>

		{#if version.changelog}
			<div class="card">
				<h2 class="title-secondary">Changelog</h2>
				<div class="markdown">
					{@html markdown(version.changelog)}
				</div>
			</div>
		{/if}

		{#if versionDependencies.length > 0}
			<div class="card">
				<h2 class="title-secondary">Dependencies</h2>
				{#each versionDependencies as dep}
					<a
						class="dependency"
						href="/{dep.project.project_type}/{dep.project.slug || dep.project.id}{dep.version
							? `/version/${dep.version.version_number}`
							: ''}">
						<Avatar size="sm" src={dep?.project?.icon_url} />
						<div class="dependency__info">
							<b>{dep.project.title}</b>
							{#if dep.version}
								<p>Version {dep.version.version_number} is {dep.dependency_type}</p>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>

	<div class="grid__col">
		<div class="card">
			<h2 class="title-secondary">Metadata</h2>
			<div>
				<b>Release channel</b><br />
				<Badge
					label={$t(`release_channels.${version.version_type}`)}
					color={releaseColors[version.version_type]} />
			</div>
			<div>
				<b>Version number</b><br />
				{version.version_number}
			</div>
			<div>
				<b>Mod loaders</b><br />
				<div class="tag-group">
					{#each version.loaders as loader, index}
						<div class="tag">
							{@html tagIcons[loader]}{$t(`tags.${loader}`)}
						</div>
					{/each}
				</div>
			</div>
			<div>
				<b>Minecraft versions</b><br />
				{gameVersions}
			</div>
			<div>
				<b>Downloads</b><br />
				{version.downloads}
			</div>
			<div>
				<b>Publication date</b><br />
				{dateFormat.format(new Date(version.date_published))}
			</div>
			<div>
				<b>Publisher</b><br />
				<a class="member" href="/user/{publisher.user.username}">
					<Avatar src={publisher.user.avatar_url} size="sm" circle />
					<div class="member__info">
						<span class="member__info__link">{publisher.user.username}</span>
						<span>{publisher.role}</span>
					</div>
				</a>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.featured {
		font-size: var(--font-size-nm);
		color: var(--color-text-lightest);
		display: inline-flex;
		grid-gap: 0.25rem;
		align-items: center;
		margin-left: 0.5rem;
		font-weight: var(--font-weight-medium);
	}

	.file {
		display: flex;
		align-items: center;
		background-color: var(--color-bg);
		padding: 0.75rem 1rem;
		border-radius: var(--rounded);
		grid-gap: 0.5rem;
		box-shadow: var(--shadow-inset);
		flex-wrap: wrap;

		&--primary {
			background-color: var(--color-brand-light);
		}

		&__name {
			max-width: calc(100% - 4rem);
			@media (width <= 900px) {
				word-break: break-all;
			}
		}

		&__download {
			margin-left: auto;
			display: flex;
			grid-gap: 0.5rem;
		}

		&:hover {
			filter: brightness(0.9);
		}
	}

	.dependency {
		display: flex;
		grid-gap: 1rem;
	}
</style>
