<script lang="ts">
	import Meta from '$components/utils/Meta.svelte'
	import { t } from 'svelte-intl-precompile'
	import { project, dependencies, featuredVersions, versions } from '../../_store'
	import { Button, Avatar, TextInput, Select, Field, CheckboxList, FileUpload } from 'omorphia'
	import { getPrimary, send } from 'omorphia/utils'
	import IconFile from 'virtual:icons/lucide/file'
	import { tagIcons, loaders } from '$generated/tags.json'
	import IconStar from 'virtual:icons/heroicons-outline/star'
	import IconTrash from 'virtual:icons/heroicons-outline/trash'
	import IconSave from 'virtual:icons/lucide/save'
	import IconPlus from 'virtual:icons/heroicons-outline/plus'
	import IconSwitchHorizontal from 'virtual:icons/heroicons-outline/switch-horizontal'
	import IconX from 'virtual:icons/heroicons-outline/x'
	import IconFlagTriangleRight from 'virtual:icons/lucide/flag-triangle-right'
	import IconHash from 'virtual:icons/lucide/hash'
	import IconTextCursor from 'virtual:icons/lucide/text-cursor'
	import GameVersions from '$components/GameVersions.svelte'
	import { onMount } from 'svelte'
	import { user } from '$stores/account'
	import { page } from '$app/stores'
	import { goto } from '$app/navigation'

	// TODO: Making versions primary

	export let version: Version | undefined

	let versionFiles: { primary?: File | RemoteFile; additional: (File | RemoteFile)[] } = {
		additional: [],
	}

	const existingVersion = $versions.find(
		(it) => it.version_number === $page.params.version || it.id === $page.params.version
	)
	if (existingVersion) {
		// Uses spread syntax so that the version in the $versions array isn't mutated
		version = { ...existingVersion }

		const primaryFile = getPrimary(version.files)
		versionFiles.primary = {
			name: primaryFile.filename,
			remote: true,
		}
		versionFiles.additional = version.files
			.filter((it) => it !== primaryFile)
			.map((it) => {
				return {
					name: it.filename,
					remote: true,
				}
			})
	}

	onMount(async () => {
		if (window.history.state.inferredVersion) {
			version = window.history.state.inferredVersion.version
			versionFiles.primary = window.history.state.inferredVersion.file
			window.history.state.inferredVersion.dependencies.forEach(addDependency)
			creation = true
		} else if (!version) {
			// No new version being created or existing version being edited
			await goto('../404')
		}
	})

	interface RemoteFile {
		name: string
		remote: true
	}

	let editingTitle = false
	let creation = false

	let dependencyData = $dependencies

	let newDependency: {
		target: 'project' | 'version'
		identifier: string
		type: 'required' | 'optional' | 'incompatible' | 'embedded'
	} = { target: 'project', identifier: '', type: 'required' }

	async function addDependency(dep = newDependency) {
		try {
			let versionData: Version | undefined
			if (dep.target === 'version') {
				versionData = await send<'getVersion'>('GET', `version/${dep.identifier}`)
				if (version!.dependencies?.filter((it) => it?.version_id === versionData.id).length) {
					throw new Error('This version is already a dependency.')
				}
			}

			const projectData = await send<'getProject'>(
				'GET',
				`project/${versionData?.project_id || dep.identifier}`
			)
			if (version!.dependencies?.filter((it) => it?.project_id === projectData.id).length) {
				throw new Error('This project is already a dependency.')
			} else if (projectData.id === $project.id) {
				throw new Error('You cannot add a dependency to itself.')
			}

			version!.dependencies = [
				...(version!.dependencies || []),
				{
					dependency_type: dep.type,
					project_id: projectData.id,
					...(versionData ? { version_id: versionData.id } : {}),
				},
			]

			if (versionData) {
				dependencyData.versions = [...dependencyData.versions, versionData]
			}
			dependencyData.projects = [...dependencyData.projects, projectData]

			newDependency = { target: 'project', identifier: '', type: 'required' }
		} catch (error) {
			if (error?.status === 404) {
				console.warn(
					`Could not add dependency ${dep.target} ${dep.identifier} because it does not exist`
				)
			} else {
				console.warn(error)
			}
		}
	}

	async function saveVersion() {
		try {
			editingTitle = false
			if (version) {
				const versionPartial = {
					name: version.name,
					version_number: version.version_number,
					changelog: version.changelog,
					dependencies: version.dependencies?.map((it) => {
						if (it.project) delete it.project
						if (it.version) delete it.version
						return it
					}),
					game_versions: version.game_versions,
					version_type: version.version_type,
					loaders: version.loaders,
					featured: version.featured,
				}

				const files = [
					...(versionFiles.primary ? [versionFiles.primary] : []),
					...versionFiles.additional,
				]

				if (creation) {
					const formData = new FormData()

					formData.append(
						'data',
						JSON.stringify({
							project_id: $project.id,
							file_parts: files.map((_, index) => `file-${index}`),
							...versionPartial,
						})
					)

					files.forEach((file, index) => {
						formData.append(`file-${index}`, file as File, file.name)
					})

					await send<'createVersion'>('POST', 'version', formData)
				} else {
					// Upload metadata
					await send<'modifyVersion'>('PATCH', `version/${version.id}`, versionPartial)

					// Delete files
					const oldVersion = $versions.find((it) => it.id === version!.id)
					const deletedFiles = oldVersion?.files.filter(
						(old) => !files.map((it) => it.name).includes(old.filename)
					)
					if (deletedFiles?.length) {
						for (const file of deletedFiles) {
							console.log('deleting', file.filename)
							await send<'deleteFileFromHash'>(
								'DELETE',
								`version_file/${file.hashes.sha512}?algorithm=sha512`
							)
						}
					}

					// Upload files
					const newFiles = files.filter((file) => !('remote' in file)) as File[]
					if (newFiles.length) {
						const formData = new FormData()

						// Add empty data object (https://docs.modrinth.com/api-spec/#tag/versions/operation/addFilesToVersion)
						formData.append('data', JSON.stringify({}))

						newFiles.forEach((file, index) => {
							formData.append(`file-${index}`, file, file.name)
						})

						await send<'addFilesToVersion'>('POST', `version/${version.id}/file`, formData)
					}
				}
			} else {
				throw new Error('No version to save.')
			}

			await Promise.all([
				(async () => {
					$versions = await send<'getProjectVersions'>('GET', `project/${$project.id}/version`)
				})(),
				(async () =>
					($featuredVersions = await send<'getProjectVersions'>(
						'GET',
						`project/${$project.id}/version?featured=true`
					)))(),
				(async () =>
					($dependencies = await send<'getDependencies'>(
						'GET',
						`project/${$project.id}/dependencies`
					)))(),
			])

			await goto(`../${version.version_number}`)
		} catch (error) {
			console.error(error)
		}
	}
</script>

{#if version}
	<span class="version-title">
		<h1>
			{#if editingTitle}
				<TextInput
					bind:value={version.name}
					placeholder="Enter version title..."
					fill
					raised
					autofocus />
			{:else}
				{version?.name || version?.version_number}
			{/if}
		</h1>

		{#if version?.featured}
			<span class="tag"><IconStar /> {$t('version.featured')}</span>
		{:else if $featuredVersions.find((it) => it.id === version?.id)}
			<span class="tag"><IconStar /> {$t('version.autofeatured')}</span>
		{/if}
	</span>

	{#if $user}
		<div class="button-group">
			<Button color="primary" on:click={saveVersion} raised>
				<IconSave />
				{$t('generic.actions.save')}
			</Button>
			<Button raised><IconStar /> {$t('generic.actions.feature')}</Button>
			{#if editingTitle}
				<Button raised on:click={() => (editingTitle = false)} color="tertiary">
					<IconTextCursor /> Stop editing title
				</Button>
			{:else}
				<Button raised on:click={() => (editingTitle = true)}>
					<IconTextCursor /> Edit version title
				</Button>
			{/if}
			{#if creation}
				<Button color="danger-light" raised href="../../versions">
					<IconX /> Cancel version creation
				</Button>
			{:else}
				<Button raised href="./">
					<IconX /> Discard changes
				</Button>
			{/if}
		</div>
	{/if}

	<div class="grid grid--col-2-1">
		<div class="grid__col">
			<div class="card">
				<h2 class="title-secondary">{$t('generic.labels.files')}</h2>
				<div class="file" class:file--primary={true}>
					<div class="file__tab">
						<IconFile />
						<div class="file__tab__name">
							<b>{versionFiles.primary?.name}</b> <i>Primary&nbsp;</i>
						</div>
						<Button as="file" raised on:files={({ detail }) => (versionFiles.primary = detail[0])}
							><IconSwitchHorizontal /> Replace</Button>
					</div>
				</div>
				<Field label="Additional files" helper="Used for files such as sources or Javadocs.">
					<FileUpload
						bind:files={versionFiles.additional}
						multiple
						accept={$project.project_type === 'modpack'
							? '.mrpack,application/x-modrinth-modpack+zip'
							: $project.project_type === 'mod'
							? '.jar,application/java-archive'
							: '*'} />
				</Field>
			</div>

			<div class="card">
				<Field
					label={$t('pages.changelog')}
					helper="Markdown formatting is supported in changelogs.">
					<TextInput
						bind:value={version.changelog}
						multiline
						fill
						placeholder="Enter version changelog..." />
				</Field>
			</div>

			<div class="card">
				<h2 class="title-secondary">{$t('version.dependencies')}</h2>
				{#each version.dependencies as dep, index}
					{@const versionData = dependencyData.versions.find((it) => it.id === dep.version_id)}
					{@const projectData = dependencyData.projects.find(
						(it) => it.id === dep.project_id || versionData?.project_id === it.id
					)}
					{#if projectData}
						<div class="dependency">
							<Avatar size="sm" src={projectData.icon_url} />
							<div class="dependency__info">
								{#if projectData}
									<b>{projectData.title}</b>
								{:else if dep.file_name}
									<b>{dep.file_name}</b>
								{/if}
								{#if versionData}
									<p>Version {versionData.version_number} is {dep.dependency_type}</p>
								{:else if projectData}
									<p>{dep.dependency_type}</p>
								{:else}
									<p>Added via overrides</p>
								{/if}
							</div>
							<Button
								on:click={() => {
									version.dependencies = version.dependencies.filter((it) =>
										dep.project_id
											? it.project_id !== dep.project_id
											: it.version_id !== dep.version_id
									)
								}}>
								<IconTrash />
								{$t('generic.actions.remove')}
							</Button>
						</div>
					{:else if dep.file_name}
						<div class="dependency">
							<Avatar size="sm" src="" />
							<div class="dependency__info" />
						</div>
					{/if}
				{/each}
				<hr class="divider" />
				<h3 class="title-tertiary">Add dependency</h3>
				<div class="button-group">
					<Select
						options={[
							{
								label: 'Project',
								value: 'project',
							},
							{
								label: 'Version',
								value: 'version',
							},
						]}
						bind:value={newDependency.target} />
					<TextInput
						bind:value={newDependency.identifier}
						placeholder="Enter {newDependency.target} {newDependency.target === 'project'
							? 'slug/ID'
							: 'ID'}..."
						fill />
					<Select
						options={[
							{
								label: 'Required',
								value: 'required',
							},
							{
								label: 'Optional',
								value: 'optional',
							},
							{
								label: 'Incompatible',
								value: 'incompatible',
							},
							{
								label: 'Embedded',
								value: 'embedded',
							},
						]}
						bind:value={newDependency.type} />
				</div>
				<div class="button-group">
					<Button color="primary" on:click={() => addDependency()}
						><IconPlus /> Add dependency</Button>
				</div>
			</div>
		</div>

		<div class="grid__col">
			<div class="card">
				<h2 class="title-secondary">{$t('version.metadata')}</h2>
				<Field label={$t('version.release_channel')}>
					<Select
						options={[
							{
								label: 'Release',
								value: 'release',
							},
							{
								label: 'Beta',
								value: 'beta',
							},
							{
								label: 'Alpha',
								value: 'alpha',
							},
						]}
						bind:value={version.version_type}
						icon={IconFlagTriangleRight} />
				</Field>

				<Field
					label={$t('version.number')}
					helper="Version numbers must be unique across all project versions."
					let:id>
					<TextInput bind:value={version.version_number} icon={IconHash} fill {id} />
				</Field>

				<Field label={$t('generic.labels.mod_loaders')}>
					<CheckboxList
						options={loaders
							.filter((it) => it.supported_project_types.includes($project.project_type))
							.map(({ name }) => ({
								label: $t(`tags.${name}`),
								value: name,
								icon: tagIcons[name],
							}))}
						bind:value={version.loaders} />
				</Field>

				<Field label={$t('generic.labels.minecraft_versions')}>
					<GameVersions bind:value={version.game_versions} />
				</Field>
			</div>
		</div>
	</div>
{/if}

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
