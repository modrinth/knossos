<script context="module" lang="ts">
	import { send } from 'omorphia/utils'

	export const load: import('./__types/[identifier]').Load = async ({ params, fetch }) => {
		try {
			const user = await send<'getUser'>('GET', `user/${params.identifier}`, null, {
				fetch,
			})

			return {
				props: {
					user,
					projects: (
						await send<'getUserProjects'>('GET', `user/${params.identifier}/projects`, null, {
							fetch,
						})
					).sort((a, b) => b.downloads - a.downloads),
					github_url: (await (await fetch(`https://api.github.com/user/${user.github_id}`)).json())
						.html_url,
				},
			}
		} catch (error: any) {
			if (error?.status === 404) {
				return {
					status: 404,
					error: new Error(`The user you were looking for cannot be found.`),
				}
			} else {
				return {
					status: error.status,
					error: error.message,
				}
			}
		}
	}
</script>

<script lang="ts">
	import { t } from 'svelte-intl-precompile'
	import { Button, Avatar, Badge, NavRow, TextInput, Field, Modal, FileUpload } from 'omorphia'
	import { ago } from 'omorphia/utils'
	import IconHeart from 'virtual:icons/lucide/heart'
	import IconUser from 'virtual:icons/lucide/user'
	import IconDownload from 'virtual:icons/heroicons-outline/download'
	import IconPencil from 'virtual:icons/heroicons-outline/pencil'
	import IconCake from 'virtual:icons/heroicons-outline/cake'
	import IconFlag from 'virtual:icons/heroicons-outline/flag'
	import IconPlus from 'virtual:icons/heroicons-outline/plus'
	import IconGithub from 'virtual:icons/simple-icons/github'
	import IconX from 'virtual:icons/heroicons-outline/x'
	import IconUpload from 'virtual:icons/heroicons-outline/upload'
	import IconSave from 'virtual:icons/lucide/save'
	import { projectTypes } from '$generated/tags.json'
	import Meta from '$components/utils/Meta.svelte'
	import { user as currentUser } from '$stores/account'
	import Ad from '$components/elements/Ad.svelte'
	import { report } from '$utils/report'
	import { simplify } from '$utils/number'
	import { create } from '$utils/create'
	import ProjectCard from '$components/elements/ProjectCard.svelte'
	import { page } from '$app/stores'

	export let user: User
	export let projects: Project[]
	export let github_url: string

	let downloads = projects.reduce((acc, project) => acc + project.downloads, 0)
	let followers = projects.reduce((acc, project) => acc + project.followers, 0)

	let roleColors = {
		admin: 'red',
		moderator: 'yellow',
		developer: 'green',
	}

	let isEditing = false

	let modifiedUser: { username?: string; bio?: string; email?: string | null; icon?: File } = {}

	function startEditing() {
		modifiedUser = {
			username: user.username,
			bio: user.bio || '',
			...($currentUser.id === user.id && { email: $currentUser.email }),
		}
		isEditing = true
	}

	function pickAvatar() {
		const input = document.createElement('input')
		input.type = 'file'

		input.onchange = (event: any) => {
			const files: FileList = event.target.files

			if (files[0]) modifiedUser.icon = files[0]
		}

		input.click()
	}

	async function editUser() {
		const oldUsername = user.username
		const patch = {
			...(modifiedUser.username !== user.username && { username: modifiedUser.username }),
			...(modifiedUser.bio !== user.bio && { bio: modifiedUser.bio }),
			...(modifiedUser.email && modifiedUser.email !== user.email && { email: modifiedUser.email }),
		}

		await Promise.all([
			(async () => {
				if (Object.keys(patch).length > 0) {
					await send('PATCH', `user/${user.id}`, patch)
					user = { ...user, ...modifiedUser }
					if (user.id === $currentUser.id) [($currentUser = user)]
					if (oldUsername !== user.username) {
						history.replaceState(null, '', `/user/${modifiedUser.username}`)
					}
				}
			})(),
			(async () => {
				if (modifiedUser.icon) {
					await send(
						'PATCH',
						`user/${user.id}/icon`,
						{ ext: modifiedUser.icon.name.split('.').pop() },
						{ file: modifiedUser.icon }
					)

					user = { ...user, avatar_url: URL.createObjectURL(modifiedUser.icon) }
					if (user.id === $currentUser.id) [($currentUser = user)]
				}
			})(),
		])
		isEditing = false
	}
</script>

<Meta
	title={user.username}
	description="{user.bio} - Download {user.username}'s mods & modpacks on Modrinth"
	image={user.avatar_url} />

<div class="user-header">
	<Avatar
		src={isEditing && modifiedUser.icon ? URL.createObjectURL(modifiedUser.icon) : user.avatar_url}
		size="lg"
		circle />
	<h1 class="user-header__title">{modifiedUser?.username ?? user.username}</h1>
</div>

<div class="column-layout">
	<div class="column-layout__sidebar">
		<div class="card card--pad-top card--gap-compressed">
			<h1 class="mobile-title">{user.username}</h1>

			{#if $currentUser}
				<div class="card__overlay">
					{#if user.id === $currentUser?.id}
						{#if isEditing}
							<Button on:click={pickAvatar}>
								<IconUpload />
								{$t('settings.avatar')}
							</Button>
						{:else}
							<Button on:click={startEditing}><IconPencil /> Edit</Button>
						{/if}
					{:else}
						<Button on:click={() => report('user', user.id)}><IconFlag /> Report</Button>
					{/if}
				</div>
			{/if}

			{#if isEditing}
				<Field label={$t('settings.username.text')} let:id>
					<TextInput
						placeholder={$t('settings.username.placeholder')}
						bind:value={modifiedUser.username}
						fill
						{id} />
				</Field>

				<!-- Convert the following fields to use the Field component -->
				<Field label={$t('settings.bio.text')} let:id>
					<TextInput
						multiline
						placeholder={$t('settings.bio.placeholder')}
						bind:value={modifiedUser.bio}
						fill
						{id} />
				</Field>

				{#if modifiedUser.email}
					<Field label={$t('settings.email.text')} helper={$t('settings.email.helper')} let:id>
						<TextInput
							placeholder={$t('settings.email.placeholder')}
							bind:value={modifiedUser.email}
							fill
							{id} />
					</Field>
				{/if}

				<br />

				<div class="button-group">
					<Button color="primary" on:click={editUser}><IconSave /> Save</Button>
					<Button on:click={() => (isEditing = false)}><IconX /> Cancel</Button>
				</div>
			{:else}
				<Badge label={$t('roles.' + user.role)} color={roleColors[user.role]} />

				{#if user.bio}
					<p class="summary">{user.bio}</p>
				{/if}

				<hr class="divider" />

				<div class="stat">
					<IconDownload />
					<span>{@html $t('stats.downloads', { values: { downloads: simplify(downloads) } })}</span>
				</div>
				<div class="stat">
					<IconHeart />
					<span
						>{@html $t('stats.followers_of_projects', {
							values: { followers: simplify(followers) },
						})}</span>
				</div>
				<div class="stat stat--color-light">
					<IconCake />
					<span>{$t('stats.joined', { values: { ago: ago(user.created) } })}</span>
				</div>
				<div class="stat stat--color-light">
					<IconUser />
					<span>{$t('stats.user_id', { values: { id: user.id } })}</span>
				</div>

				<hr class="divider" />

				<div class="button-group">
					<Button color="transparent" href={github_url}>
						<IconGithub />
						{$t('generic.external.github_profile')}
					</Button>
				</div>
			{/if}
		</div>
	</div>

	<div class="column-layout__content">
		<Ad />

		<div class="card card--strip card--pad-x">
			<NavRow
				links={[
					{
						label: $t('pages.all'),
						href: '',
					},
					...projectTypes.map((type) => ({
						label: $t(`project.types.${type}.plural`),
						href: type,
					})),
				]}
				query="type" />

			{#if $currentUser && $currentUser.id === user.id}
				<Button color="primary" on:click={create}>
					<IconPlus />
					{$t('generic.actions.new_project')}
				</Button>
			{/if}
		</div>

		{#each projects.filter( (project) => ($page.url.searchParams.get('type') ? project.project_type === $page.url.searchParams.get('type') : true) ) as project}
			<ProjectCard {project} />
		{/each}
	</div>
</div>

<style lang="postcss">
	.user-header {
		display: flex;
		width: 100%;
		padding: 0 1rem;
		margin-bottom: -2.5rem;
		z-index: 1;
		gap: 1.5rem;
		align-items: center;

		&__title {
			font-size: 2.5rem;

			@media (width <= 500px) {
				display: none;
			}
		}
	}

	.mobile-title {
		display: none;

		@media (width <= 500px) {
			display: flex;
		}
	}
</style>
