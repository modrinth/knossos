<script context="module" lang="ts">
	import { send } from '$lib/api';

	export async function load({ params, fetch, session, stuff }) {
		try {
			if (!['mod', 'modpack'].includes(params.type)) {
				throw new Error('Invalid type');
			}

			return {
				props: {
					project: await send('GET', `project/${params.identifier}`, null, { fetch }),
					members: await send('GET', `project/${params.identifier}/members`, null, { fetch }),
					versions: await send('GET', `project/${params.identifier}/version`, null, { fetch }),
					featuredVersions: await send(
						'GET',
						`project/${params.identifier}/version?featured=true`,
						null,
						{ fetch }
					),
				},
			};
		} catch {
			return {
				status: 404,
				error: new Error(`The ${params.type} you were looking for cannot be found.`),
			};
		}
	}
</script>

<script lang="ts">
	import Nav from '$components/elements/Nav.svelte';
	import { t } from 'svelte-intl-precompile';
  import { onMount, setContext } from 'svelte'
	import Button from '$components/elements/Button.svelte';
	import IconHeart from 'virtual:icons/lucide/heart';
	import IconPencil from 'virtual:icons/heroicons-outline/pencil';
	import IconDownload from 'virtual:icons/heroicons-outline/download';
	import IconIssues from 'virtual:icons/heroicons-outline/exclamation';
	import IconCode from 'virtual:icons/heroicons-outline/code';
	import IconUpdated from 'virtual:icons/heroicons-outline/refresh';
	import IconWiki from 'virtual:icons/heroicons-outline/book-open';
	import IconDiscord from 'virtual:icons/simple-icons/discord';
	import IconPatreon from 'virtual:icons/simple-icons/patreon';
	import IconPayPal from 'virtual:icons/simple-icons/paypal';
	import IconKoFi from 'virtual:icons/simple-icons/kofi';
	import IconBMAC from 'virtual:icons/simple-icons/buymeacoffee';
	import IconGithubSponsors from 'virtual:icons/simple-icons/githubsponsors';
	import IconOther from 'virtual:icons/heroicons-outline/globe-alt';
	import IconDownloadFile from 'virtual:icons/heroicons-outline/document-download';

	import ProfilePicture from '$components/elements/ProfilePicture.svelte';
	import { markdownInline } from '$lib/parse';
	import { ago } from '$lib/ago';
	import IconCalendar from 'virtual:icons/lucide/calendar';
	import { tagIcons } from '$stores/tags';
	import Avatar from '$components/elements/Avatar.svelte';
	import Badge from '$components/elements/Badge.svelte';
  import { browser } from '$app/env'
  import { cache } from '$stores/cache'
  import { user } from '$stores/server'
  import { Permissions} from '$lib/permissions'

  interface Member {
		team_id: string;
		user: User;
		role: string;
		permissions: number;
		accepted: boolean;
	}

	export let project: Project;
	setContext('project', project);
	export let members: Member[];
	setContext('members', members);
	export let versions: Version[];
	setContext('versions', versions);
	export let featuredVersions: Version[];
  let currentMember = members.find(member => $user.id === member.user.id)
  let permissions: Permissions;

  if (['admin', 'moderator'].includes($user.role)) {
    permissions = new Permissions('ALL');
  } else if (currentMember && currentMember.accepted) {
    permissions = new Permissions(currentMember.permissions);
  } else {
    permissions = new Permissions(0)
  }

	let banner = project.gallery.find((item) => item.featured) || project.gallery[0];

	let externalResources = [
		{
			title: $t('generic.external.issues'),
			icon: IconIssues,
			url: project.issues_url,
		},
		{
			title: $t('generic.external.source'),
			icon: IconCode,
			url: project.source_url,
		},
		{
			title: $t('generic.external.wiki'),
			icon: IconWiki,
			url: project.wiki_url,
		},
		{
			title: $t('generic.external.discord'),
			icon: IconDiscord,
			url: project.discord_url,
		},
		{
			title: $t('generic.external.patreon'),
			icon: IconPatreon,
			url: project.donation_urls.find((source) => source.id === 'patreon')?.url,
		},
		{
			title: $t('generic.external.paypal'),
			icon: IconPayPal,
			url: project.donation_urls.find((source) => source.id === 'paypal')?.url,
		},
		{
			title: $t('generic.external.paypal'),
			icon: IconPayPal,
			url: project.donation_urls.find((source) => source.id === 'paypal')?.url,
		},
		{
			title: $t('generic.external.kofi'),
			icon: IconKoFi,
			url: project.donation_urls.find((source) => source.id === 'ko-fi')?.url,
		},
		{
			title: $t('generic.external.donate'),
			icon: IconOther,
			url: project.donation_urls.find((source) => source.id === 'other')?.url,
		},
		{
			title: $t('generic.external.buy_me_a_coffee'),
			icon: IconBMAC,
			url: project.donation_urls.find((source) => source.id === 'bmac')?.url,
		},
		{
			title: $t('generic.external.github_sponsors'),
			icon: IconGithubSponsors,
			url: project.donation_urls.find((source) => source.id === 'github')?.url,
		},
	];

	let releaseColors = {
		release: 'green',
		beta: 'yellow',
		alpha: 'red',
	};

  let bannerColor = $cache.projectColors[project.id] || "white"

	onMount(() => {
    if (!banner && project.icon_url) {
      const foo = import('node-vibrant/lib/browser').then(Vibrant => {
        let palette = Vibrant.from(project.icon_url)
          .getPalette().then(colors => {
            bannerColor = colors.Muted.getHex();
            $cache.projectColors[project.id] = bannerColor;
          })
      })
    }
  })
</script>

<div class="column-layout">
	<div class="column-layout__sidebar">
		<div class="card">
			<div class="card__overlay">
				<Button label={$t('generic.actions.edit')} color="raised" icon={IconPencil} />
				<Button label={$t('generic.actions.follow')} color="raised" icon={IconHeart} />
			</div>
			{#if banner}
				<img class="card__banner card__banner--short" src={banner.url} alt={banner.description} />
			{:else}
        <div class="card__banner card__banner--short" style="background-color: {bannerColor}" />
      {/if}
			<ProfilePicture src="{project.icon_url}" size="md" floatUp />
			<h1 class="title">{project.title}</h1>
			<p>{project.description}</p>

			<div class="tags">
				{#each project.categories as category}
					<div class="tags__tag">
						{@html $tagIcons[category]}
						{$t(`tags.${category}`)}
					</div>
				{/each}
			</div>

			<hr class="divider" />

			<div class="stat">
				<IconDownload />
				<span
					>{@html markdownInline(
						$t('stats.downloads', { values: { downloads: project.downloads } })
					)}</span
				>
				&nbsp;
				<IconHeart />
				<span
					>{@html markdownInline(
						$t('stats.followers', { values: { followers: project.followers } })
					)}</span
				>
			</div>
			<div class="condensed-group">
				<div class="stat stat--color-light">
					<IconCalendar />
					<span
						>{@html markdownInline(
							$t('stats.created', { values: { ago: ago(project.published) } })
						)}</span
					>
				</div>
				<div class="stat stat--color-light">
					<IconUpdated />
					<span
						>{@html markdownInline(
							$t('stats.updated', { values: { ago: ago(project.updated) } })
						)}</span
					>
				</div>
			</div>
		</div>

		<div class="card">
			<h2 class="title-secondary">{$t('project.sidebar_headings.external_resources')}</h2>
			<div class="link-group">
				{#each externalResources.filter((resource) => resource.url) as resource}
					<a class="link-group__link" href={resource.url} rel="noreferrer">
						<svelte:component this={resource.icon} />
						{resource.title}
					</a>
				{/each}
			</div>

			<hr class="divider" />

			<h2 class="title-secondary">{$t('project.sidebar_headings.featured_versions')}</h2>
			{#each featuredVersions as version}
				<div class="featured-version">
					<a
						class="featured-version__download"
						href={version.files.find((file) => file.primary)?.url || version.files[0].url}
					>
						<IconDownloadFile width={24} height={24} />
					</a>
					<div class="featured-version__info">
						<h3 class="featured-version__info__name">{version.name || version.version_number}</h3>
						<div class="featured-version__info__details">
							<Badge
								label={$t(`release_channels.${version.version_type}`)}
								color={releaseColors[version.version_type]}
							/>
							•
							{version.loaders.join(', ')}
						</div>
					</div>
				</div>
			{/each}

			<hr class="divider" />

			<h2 class="title-secondary">{$t('project.sidebar_headings.project_members')}</h2>
			{#each members.filter((member) => member.accepted) as member}
				<a class="member" href="/user/{member.user.username}">
					<ProfilePicture src={member.user.avatar_url} size="sm" circle />
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
					{$t('generic.labels.license')}
				</span>
				<span class="info-table__value info-table__value--link">
					<a href={project.license.url} class="link">{project.license.id.toUpperCase()}</a>
				</span>
				<span class="info-table__label">
					{$t('generic.environments.client_side')}
				</span>
				<span class="info-table__value">
					{$t(`generic.environments.values.${project.client_side}`)}
				</span>
				<span class="info-table__label">
					{$t('generic.environments.server_side')}
				</span>
				<span class="info-table__value">
					{$t(`generic.environments.values.${project.server_side}`)}
				</span>
				<span class="info-table__label">
					{$t('generic.labels.project_id')}
				</span>
				<span class="info-table__value">
					{project.id}
				</span>
				<span class="info-table__label">
					{$t('generic.labels.project_status')}
				</span>
				<span class="info-table__value">
					{$t(`status.${project.status}`)}
				</span>
			</div>
		</div>
	</div>

	<div class="column-layout__content">
		<div class="card card--strip">
			<Nav
				links={[
					{
						label: $t('pages.description'),
						href: '/',
					},
					...(project.gallery.length > 0 || permissions.data.editDetails ? [{
						label: $t('pages.gallery'),
						href: '/gallery',
					}] : []),
					{
						label: $t('pages.changelog'),
						href: '/changelog',
					},
					{
						label: $t('pages.versions'),
						href: '/versions',
					},
					...(permissions.settingsPage ? [{
						label: $t('pages.settings'),
						href: '/settings',
					}] : []),
				]}
				level={2}
			/>
		</div>

		<slot />
	</div>
</div>

<style lang="postcss">
	.member {
		display: flex;
		grid-gap: 0.75rem;

		&__info {
			display: flex;
			flex-direction: column;

			&__link {
				font-weight: var(--font-weight-medium);
			}
		}
	}

	.featured-version {
		display: flex;
		grid-gap: 0.75rem;

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
		}

		&__info {
			display: flex;
			flex-direction: column;

			&__name {
				font-weight: var(--font-weight-medium);
				font-size: var(--font-size-nm);
			}

			&__details {
				display: flex;
				grid-gap: 0.5rem;
			}
		}
	}
</style>
