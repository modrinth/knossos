<script context="module" lang="ts">
	import { send } from 'omorphia/utils'

	export const load: import('./__types/__layout').Load = async ({ params, fetch }) => {
		try {
			const [project, members, versions, featuredVersions, dependencies]: any[] = await Promise.all(
				[
					send('GET', `project/${params.identifier}`, null, { fetch }),
					send('GET', `project/${params.identifier}/members`, null, { fetch }),
					send('GET', `project/${params.identifier}/version`, null, { fetch }),
					send('GET', `project/${params.identifier}/version?featured=true`, null, { fetch }),
					send('GET', `project/${params.identifier}/dependencies`, null, { fetch }),
				]
			)

			if (!project.body && project.body_url) {
				try {
					project.body = await (await fetch(project.body_url)).text()
				} catch {
					// Do nothing because couldn't fetch body
				}
			}

			return {
				props: {
					data: {
						project,
						members,
						versions,
						featuredVersions,
						dependencies,
					},
				},
				stuff: {
					project,
					members,
					versions,
					featuredVersions,
					dependencies,
				},
			}
		} catch (error) {
			if (error?.status === 404) {
				return {
					status: 404,
					// TODO make this translatable
					error: new Error(`The ${params.type} you were looking for cannot be found.`),
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
	import { Button, Avatar, Badge, NavRow } from 'omorphia'
	import { ago, Permissions, downloadUrl, getPrimary } from 'omorphia/utils'
	import IconHeart from 'virtual:icons/heroicons-outline/heart'
	import IconHeartSolid from 'virtual:icons/heroicons-solid/heart'
	import IconPencil from 'virtual:icons/heroicons-outline/pencil'
	import IconDownload from 'virtual:icons/heroicons-outline/download'
	import IconIssues from 'virtual:icons/heroicons-outline/exclamation'
	import IconCode from 'virtual:icons/heroicons-outline/code'
	import IconClock from 'virtual:icons/lucide/flag-triangle-right'
	import IconWiki from 'virtual:icons/heroicons-outline/book-open'
	import IconDiscord from 'virtual:icons/simple-icons/discord'
	import IconPatreon from 'virtual:icons/simple-icons/patreon'
	import IconPayPal from 'virtual:icons/simple-icons/paypal'
	import IconKoFi from 'virtual:icons/simple-icons/kofi'
	import IconBMAC from 'virtual:icons/simple-icons/buymeacoffee'
	import IconGithubSponsors from 'virtual:icons/simple-icons/githubsponsors'
	import IconOther from 'virtual:icons/heroicons-outline/globe-alt'
	import IconFlag from 'virtual:icons/heroicons-outline/flag'

	import IconCalendar from 'virtual:icons/lucide/calendar'
	import { tagIcons } from '$generated/tags.json'
	import projectColors from '$generated/projects.json'
	import { user } from '$stores/account'
	import {
		project,
		members,
		versions,
		featuredVersions,
		releaseColors,
		dependencies,
		permissions,
		color,
	} from './_store'
	import Ad from '$components/elements/Ad.svelte'
	import { report } from '$utils/report'
	import { simplify } from '$utils/number'
	import { following } from '$stores/account'

	export let data
	$project = data.project
	$members = data.members
	$versions = data.versions
	$featuredVersions = data.featuredVersions
	$dependencies = data.dependencies

	let currentMember = $members.find((member) => $user?.id === member.user.id)

	if (['admin', 'moderator'].includes($user?.role)) {
		$permissions = new Permissions('ALL')
	} else if (currentMember && currentMember.accepted) {
		$permissions = new Permissions(currentMember.permissions)
	} else {
		$permissions = new Permissions(0)
	}

	$: banner = $project.gallery.find((item) => item.featured)

	let externalResources = [
		{
			title: $t('generic.external.issues'),
			icon: IconIssues,
			url: $project.issues_url,
		},
		{
			title: $t('generic.external.source'),
			icon: IconCode,
			url: $project.source_url,
		},
		{
			title: $t('generic.external.wiki'),
			icon: IconWiki,
			url: $project.wiki_url,
		},
		{
			title: $t('generic.external.discord'),
			icon: IconDiscord,
			url: $project.discord_url,
		},
		{
			title: $t('generic.external.patreon'),
			icon: IconPatreon,
			url: $project.donation_urls.find((source) => source.id === 'patreon')?.url,
		},
		{
			title: $t('generic.external.paypal'),
			icon: IconPayPal,
			url: $project.donation_urls.find((source) => source.id === 'paypal')?.url,
		},
		{
			title: $t('generic.external.paypal'),
			icon: IconPayPal,
			url: $project.donation_urls.find((source) => source.id === 'paypal')?.url,
		},
		{
			title: $t('generic.external.kofi'),
			icon: IconKoFi,
			url: $project.donation_urls.find((source) => source.id === 'ko-fi')?.url,
		},
		{
			title: $t('generic.external.donate'),
			icon: IconOther,
			url: $project.donation_urls.find((source) => source.id === 'other')?.url,
		},
		{
			title: $t('generic.external.buy_me_a_coffee'),
			icon: IconBMAC,
			url: $project.donation_urls.find((source) => source.id === 'bmac')?.url,
		},
		{
			title: $t('generic.external.github_sponsors'),
			icon: IconGithubSponsors,
			url: $project.donation_urls.find((source) => source.id === 'github')?.url,
		},
	]

	$color = projectColors[$project.id] || ''

	let isFollowed: boolean
	$: isFollowed = $following.map((it) => it.id).includes($project.id)

	let baseUrl: string
	$: baseUrl = `/${$project.project_type}/${$project.slug || $project.id}`
</script>

<div class="column-layout">
	<div class="column-layout__sidebar">
		<div class="card">
			<div class="card__overlay">
				{#if $permissions.editDetails}
					<Button color="raised"><IconPencil /> {$t('generic.actions.edit')}</Button>
				{:else if $user}
					<Button color="raised" on:click={() => report('project', $project.id)}>
						<IconFlag />
						{$t('generic.actions.report')}
					</Button>
				{/if}
				{#if $user}
					<Button
						color="raised"
						on:click={async () => {
							await send(isFollowed ? 'DELETE' : 'POST', `project/${$project.id}/follow`)
							if (isFollowed) {
								$following = $following.filter((followed) => followed.id !== $project.id)
							} else {
								$following = [...$following, $project]
							}
						}}>
						{#if isFollowed}
							<IconHeartSolid />
							{$t('generic.actions.unfollow')}
						{:else}
							<IconHeart />
							{$t('generic.actions.follow')}
						{/if}
					</Button>
				{/if}
			</div>
			{#if banner}
				<img
					class=" card__banner"
					src={banner.url}
					alt={banner.description}
					style:background-color={$color || 'var(--color-divider)'} />
			{:else}
				<div
					class="card__banner card__banner--dark"
					style:background-color={$color || 'var(--color-divider)'} />
			{/if}
			<Avatar src={$project.icon_url} size="md" floatUp />
			<h1 class="title">{$project.title.replace(/([a-z])([A-Z])/g, '$1\u200B$2')}</h1>
			<p class="summary">{$project.description}</p>

			<div class="tag-group">
				{#each $project.categories as category}
					<div class="tag">
						{@html tagIcons[category] || '?'}
						{$t(`tags.${category}`)}
					</div>
				{/each}
			</div>

			<hr class="divider" />

			<div class="stat-group">
				<div class="stat">
					<IconDownload />
					<span
						>{@html $t('stats.downloads', {
							values: { downloads: simplify($project.downloads) },
						})}</span>
				</div>
				<div class="stat">
					<IconHeart />
					<span
						>{@html $t('stats.followers', {
							values: { followers: simplify($project.followers) },
						})}</span>
				</div>
			</div>

			<div class="condensed-group">
				<div class="stat stat--color-light">
					<IconCalendar />
					<span>{@html $t('stats.updated', { values: { ago: ago($project.updated) } })}</span>
				</div>
				<div class="stat stat--color-light">
					<IconClock />
					<span>{@html $t('stats.created', { values: { ago: ago($project.published) } })}</span>
				</div>
			</div>
		</div>

		<div class="card">
			{#if externalResources.filter((resource) => resource.url).length > 0}
				<h2 class="title-secondary">{$t('project.sidebar_headings.external_resources')}</h2>
				<div class="link-group">
					{#each externalResources.filter((resource) => resource.url) as resource}
						<a class="link" href={resource.url} rel="noreferrer">
							<svelte:component this={resource.icon} />
							{resource.title}
						</a>
					{/each}
				</div>

				<hr class="divider" />
			{/if}

			{#if $featuredVersions.length > 0}
				<h2 class="title-secondary">{$t('project.sidebar_headings.featured_versions')}</h2>
				<div class="limited-list">
					{#each $featuredVersions as version}
						<div class="featured-version">
							<a class="featured-version__download" href={downloadUrl(getPrimary(version.files))}>
								<IconDownload />
							</a>
							<div class="featured-version__info">
								<a
									class="featured-version__info__name"
									href="{baseUrl}/version/{version.version_number}"
									>{version.name || version.version_number}</a>
								<div class="featured-version__info__details">
									<Badge
										label={$t(`release_channels.${version.version_type}`)}
										color={releaseColors[version.version_type]} />
									•
									<div class="tag-group">
										{#each version.loaders as loader, index}
											<div class="tag">
												{@html tagIcons[loader]}{$t(`tags.${loader}`)}
											</div>
										{/each}
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>

				<hr class="divider" />
			{/if}

			<h2 class="title-secondary">{$t('project.sidebar_headings.project_members')}</h2>
			{#each $members.filter((member) => member.accepted) as member}
				<a class="member" href="/user/{member.user.username}">
					<Avatar src={member.user.avatar_url} size="sm" circle />
					<div class="member__info">
						<span class="member__info__link">{member.user.username}</span>
						<span>{member.role}</span>
					</div>
				</a>
			{/each}

			<hr class="divider" />

			<h2 class="title-secondary">{$t('project.sidebar_headings.technical_information')}</h2>
			<div class="info-table">
				<span class="info-table__label">
					{$t('generic.labels.license.singular')}
				</span>
				<span class="info-table__value info-table__value--link">
					<a href={$project.license.url} class="link">{$project.license.id.toUpperCase()}</a>
				</span>
				<span class="info-table__label">
					{$t('generic.environments.client_side')}
				</span>
				<span class="info-table__value">
					{$t(`generic.environments.values.${$project.client_side}`)}
				</span>
				<span class="info-table__label">
					{$t('generic.environments.server_side')}
				</span>
				<span class="info-table__value">
					{$t(`generic.environments.values.${$project.server_side}`)}
				</span>
				<span class="info-table__label">
					{$t('generic.labels.project_id')}
				</span>
				<span class="info-table__value">
					{$project.id}
				</span>
				<span class="info-table__label">
					{$t('generic.labels.project_status')}
				</span>
				<span class="info-table__value">
					{$t(`status.${$project.status}`)}
				</span>
			</div>
		</div>
	</div>

	<div class="column-layout__content">
		<Ad placement="project-{$project.id}" />

		<div class="card card--strip card--pad-x">
			<NavRow
				links={[
					{
						label: $t('pages.description'),
						href: '/',
					},
					{
						label: $t('pages.versions'),
						href: '/versions',
					},
					...($project.gallery.length > 0 || $permissions.editDetails
						? [
								{
									label: $t('pages.gallery'),
									href: '/gallery',
								},
						  ]
						: []),
					{
						label: $t('pages.changelog'),
						href: '/changelog',
					},
					...($permissions.settingsPage
						? [
								{
									label: $t('pages.settings'),
									href: '/settings',
								},
						  ]
						: []),
				]}
				level={2} />
		</div>

		<slot />
	</div>
</div>

<style lang="postcss">
	.limited-list {
		max-height: 18rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		overflow-y: auto;
	}

	.featured-version {
		display: flex;
		gap: 0.75rem;

		&__download {
			background-color: var(--color-brand);
			color: var(--color-brand-contrast);
			border-radius: var(--rounded-max);
			display: flex;
			align-items: center;
			justify-content: center;
			min-width: 2.5rem;
			height: 2.5rem;
			box-shadow: var(--shadow-inset-sm);

			&:hover {
				background-color: var(--color-brand-dark);
			}

			:global(.icon) {
				/* slightly larger than default icon size to fill the button */
				width: 22px;
				height: 22px;
			}
		}

		&__info {
			display: flex;
			flex-direction: column;

			&__name {
				font-weight: var(--font-weight-medium);
				font-size: var(--font-size);
				line-height: 120%;
			}

			&__details {
				display: flex;
				gap: 0.5rem;
				align-items: center;
			}
		}
	}
</style>
