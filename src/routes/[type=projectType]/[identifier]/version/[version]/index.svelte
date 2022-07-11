<script context="module" lang="ts">
	import { user } from '$stores/account'
	import { versions } from '../../_store'

	export const load: import('./__types/index').Load = async ({ params, stuff }) => {
		// Check if version exists
		if (
			stuff.versions!.find((it) => [it.version_number, it.id].includes(params.version)) ||
			get(versions).find((it) => [it.version_number, it.id].includes(params.version))
		) {
			return {}
		} else {
			return {
				status: 404,
				// TODO: make this translatable
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
	} from '../../_store'
	import { Button, Avatar, Badge, Code, Modal } from 'omorphia'
	import { getPrimary, markdown, send } from 'omorphia/utils'
	import IconDownload from 'virtual:icons/heroicons-outline/download'
	import IconFile from 'virtual:icons/lucide/file'
	import { tagIcons } from '$generated/tags.json'
	import { formatVersions, downloadUrl } from 'omorphia/utils'
	import IconPencil from 'virtual:icons/heroicons-outline/pencil'
	import IconStar from 'virtual:icons/heroicons-outline/star'
	import IconTrash from 'virtual:icons/heroicons-outline/trash'
	import ModalReport from '$components/ModalReport.svelte'
	import { page } from '$app/stores'
	import { get } from 'svelte/store'

	const dateFormat = new Intl.DateTimeFormat('en', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
	})

	export let version: Version = $versions.find((it) =>
		[it.version_number, it.id].includes($page.params.version)
	)!

	interface RemoteFile {
		name: string
		remote: true
	}

	const primaryFile = getPrimary(version.files)

	$: gameVersions = formatVersions(version.game_versions.sort() || [])

	$: publisher = $members.find((it) => it.user.id === version.author_id) || $members[0]
</script>

<Meta
	title="{version.name || version.version_number} - {$project.title}"
	description="Download {$project.title} {version.version_number} on Modrinth. Supports {gameVersions} {version.loaders &&
		version.loaders.map((it) => $t(`tags.${it}`)).join(' & ')}. Published on {new Date(
		version.date_published
	).toLocaleDateString('en', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	})}. {version.downloads > 0 ? ` ${version.downloads} downloads.` : ''}"
	color={$color}
	image={$project?.icon_url} />

<span class="version-title">
	<h1>
		{version.name || version.version_number}
	</h1>

	{#if version.featured}
		<span class="tag"><IconStar /> {$t('version.featured')}</span>
	{:else if $featuredVersions.find((it) => it.id === version.id)}
		<span class="tag"><IconStar /> {$t('version.autofeatured')}</span>
	{/if}
</span>

{#if $user}
	<div class="button-group">
		{#if $permissions.uploadVersions}
			<Button raised href="./{$page.params.version}/edit"><IconPencil /> Edit version</Button>
		{:else}
			<ModalReport type="version" id={version.id} buttonRaised />
		{/if}
		{#if $permissions.deleteVersion}
			<Modal size="sm" title={$t('modal.deletion.version.title')}>
				<svelte:fragment slot="trigger" let:trigger>
					<Button on:click={trigger} color="danger-light" raised
						><IconTrash /> {$t('generic.actions.delete')}</Button>
				</svelte:fragment>

				{$t('modal.deletion.version.description')}

				<svelte:fragment slot="button" let:close>
					<Button on:click={close} color="danger" raised
						><IconTrash /> {$t('modal.deletion.version.action')}</Button>
				</svelte:fragment>
			</Modal>
		{/if}
	</div>
{/if}

<div class="grid grid--col-2-1">
	<div class="grid__col">
		<div class="card">
			<h2 class="title-secondary">{$t('generic.labels.files')}</h2>
			{#each version.files as file}
				<a
					class="file"
					href={downloadUrl(file)}
					class:file--primary={primaryFile.filename === file.filename}>
					<div class="file__tab">
						<IconFile />
						<div class="file__tab__name"><b>{file.filename}</b></div>
						<IconDownload />
					</div>
				</a>
			{/each}
		</div>

		{#if version.changelog}
			<div class="card">
				<h2 class="title-secondary">{$t('pages.changelog')}</h2>
				<div class="markdown">
					{@html markdown(version.changelog)}
				</div>
			</div>
		{/if}

		{#if version?.dependencies?.length}
			<div class="card">
				<h2 class="title-secondary">{$t('version.dependencies')}</h2>
				{#each version.dependencies as dep}
					{#if dep.file_name}
						<div class="dependency">
							<Avatar size="sm" src="" />
							<div class="dependency__info">
								<b>{dep.file_name}</b>
								<p>Added via overrides</p>
							</div>
						</div>
					{:else}
						{@const version = $dependencies.versions.find((it) => it.id === dep.version_id)}
						{@const project = $dependencies.projects.find(
							(it) => it.id === dep.project_id || version?.project_id === it.id
						)}
						<a
							class="dependency"
							href="/{project.project_type}/{project.slug || project.id}{version
								? `/version/${version.version_number}`
								: ''}">
							<Avatar size="sm" src={project?.icon_url} />
							<div class="dependency__info">
								<b>{project.title}</b>
								{#if version}
									<p>Version {version.version_number} is {dep.dependency_type}</p>
								{:else}
									<p>{dep.dependency_type}</p>
								{/if}
							</div>
						</a>
					{/if}
				{/each}
			</div>
		{/if}
	</div>

	<div class="grid__col">
		<div class="card">
			<h2 class="title-secondary">{$t('version.metadata')}</h2>
			<div>
				<b>{$t('version.release_channel')}</b><br />
				<Badge
					label={$t(`release_channels.${version.version_type}`)}
					color={releaseColors[version.version_type]} />
			</div>
			<div>
				<b>{$t('version.number')}</b><br />
				{version.version_number}
			</div>
			<div>
				<b>{$t('generic.labels.mod_loaders')}</b><br />
				<div class="tag-group">
					{#each version.loaders as loader}
						<div class="tag">
							{@html tagIcons[loader]}{$t(`tags.${loader}`)}
						</div>
					{/each}
				</div>
			</div>
			<div>
				<b>{$t('generic.labels.minecraft_versions')}</b><br />
				{gameVersions}
			</div>
			<div>
				<b>{$t('generic.labels.downloads')}</b><br />
				{version.downloads}
			</div>
			<div>
				<b>{$t('version.publication_date')}</b><br />
				{dateFormat.format(new Date(version.date_published || 0))}
			</div>
			<div>
				<b>{$t('version.publisher')}</b><br />
				<a class="member" href="/user/{publisher.user.username}">
					<Avatar src={publisher.user.avatar_url} size="sm" circle />
					<div class="member__info">
						<span class="member__info__link">{publisher.user.username}</span>
						<span>{publisher.role}</span>
					</div>
				</a>
			</div>
			<div>
				<b>Version ID</b><br />
				<Code text={version.id} />
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.version-title {
		display: flex;
		align-items: flex-end;
		gap: 1rem;
	}

	.featured {
		font-size: var(--font-size);
		color: var(--color-text-lightest);
		display: inline-flex;
		gap: 0.25rem;
		align-items: center;
		margin-left: 0.5rem;
		font-weight: var(--font-weight-medium);
	}

	.dependency {
		display: flex;
		gap: 1rem;
		align-items: center;

		&__info {
			margin-right: auto;

			p {
				text-transform: capitalize;
			}
		}
	}
</style>
