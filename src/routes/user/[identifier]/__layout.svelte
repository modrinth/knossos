<script context="module" lang="ts">
	import { send } from '$lib/api'

	export async function load({ params, fetch, session, stuff }) {
		try {
			const user: User = (await send('GET', `user/${params.identifier}`, null, {
				fetch,
			})) as User

			return {
				props: {
					user,
					projects: (await send('GET', `user/${params.identifier}/projects`, null, { fetch })).sort(
						(a, b) => b.downloads - a.downloads
					),
					github_url: (await (await fetch(`https://api.github.com/user/${user.github_id}`)).json())
						.html_url,
				},
			}
		} catch (error) {
			if (error?.status === 404) {
				return {
					status: 404,
					error: new Error(`The user you were looking for cannot be found.`),
				}
			} else {
				return {}
			}
		}
	}
</script>

<script lang="ts">
	import { t } from 'svelte-intl-precompile'
	import { Button, Avatar, Badge, NavRow, TextInput } from 'omorphia'
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
	import { setContext } from 'svelte'
	import { projectTypes } from '$generated/tags.json'
	import Meta from '$components/utils/Meta.svelte'
	import { user as currentUser } from '$stores/server'
	import Ad from '$components/elements/Ad.svelte'
	import { report } from '$lib/report'
	import { simplify } from '$lib/number'
	import { create } from '$lib/create'
	import { project } from '../../[type=projectType]/[identifier]/_store'

	export let user: User
	export let projects: Project[]
	setContext('projects', projects)
	export let github_url: string

	let downloads = projects.reduce((acc, project) => acc + project.downloads, 0)
	let followers = projects.reduce((acc, project) => acc + project.followers, 0)

	let roleColors = {
		admin: 'red',
		moderator: 'yellow',
		developer: 'green',
	}

	let isEditing = false

	let modifiedUser

	function startEditing() {
		modifiedUser = {
			username: $currentUser.username,
			bio: $currentUser.bio,
			email: $currentUser.email,
		}
		isEditing = true
	}

	// Not async because Vite "asyncGeneratorStep" error
	function editUser() {
		const oldUsername = $currentUser.username
		const body = {
			...(modifiedUser.username !== $currentUser.username
				? { username: modifiedUser.username }
				: {}),
			...(modifiedUser.bio !== $currentUser.bio ? { bio: modifiedUser.bio } : {}),
			...(modifiedUser.email !== $currentUser.email ? { email: modifiedUser.email } : {}),
		}

		if (Object.keys(body).length > 0) {
			send('PATCH', `user/${user.id}`, body).then(() => {
				currentUser.set({ ...$currentUser, ...modifiedUser })
				user = $currentUser
				isEditing = false
				if (oldUsername !== $currentUser.username) {
					history.replaceState(null, '', `/user/${modifiedUser.username}`)
				}
			})
		} else {
			isEditing = false
		}
	}
</script>

<Meta
	title={user.username}
	description="{user.bio} - Download {user.username}'s mods & modpacks on Modrinth" />

<div class="user-header">
	<Avatar src={user.avatar_url} size="lg" circle />
	<h1 class="user-header__title">{modifiedUser?.username ?? user.username}</h1>
</div>

<div class="column-layout">
	<div class="column-layout__sidebar">
		<div class="card card--pad-top card--gap-compressed">
			<h1 class="mobile-title">{user.username}</h1>

			{#if $currentUser}
				<div class="button-group">
					{#if user.id === $currentUser?.id}
						{#if isEditing}
							<Button color="primary" on:click={editUser}><IconSave /> Save</Button>
							<Button on:click={editUser}><IconX /> Cancel</Button>
						{:else}
							<Button on:click={startEditing}><IconPencil /> Edit</Button>
						{/if}
					{:else}
						<Button on:click={() => report('user', user.id)}><IconFlag /> Report</Button>
					{/if}
				</div>
			{/if}

			{#if isEditing}
				<b>Username</b>
				<TextInput placeholder="Enter username..." bind:value={modifiedUser.username} />

				<b>Bio</b>
				<TextInput multiline placeholder="Add a bio..." bind:value={modifiedUser.bio} />

				<p><b>Private email</b> (only for moderators)</p>
				<TextInput placeholder="Add a bio..." bind:value={modifiedUser.email} />

				<Button><IconUpload /> Upload avatar</Button>
			{:else}
				<Badge label={$t('roles.' + user.role)} color={roleColors[user.role]} />

				{#if user.bio}
					<p class="summary">{user.bio}</p>
				{/if}
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

		<slot />
	</div>
</div>

<style lang="postcss">
	.user-header {
		display: flex;
		width: 100%;
		padding: 0 1rem;
		margin-bottom: -2.5rem;
		z-index: 1;
		grid-gap: 1.5rem;
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
