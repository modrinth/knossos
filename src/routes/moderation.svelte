<script context="module" lang="ts">
	import { create } from '$utils/create'
	import { send } from 'omorphia/utils'

	export const load: import('./__types/moderation').Load = async ({ fetch }) => {
		try {
			let [projects, reports] = await Promise.all([
				send<'getModerationProjects'>('GET', 'moderation/projects', null, { fetch }),
				send<'getReports'>('GET', 'report', null, { fetch }),
			])

			projects = projects.map((it) => ({
				...it,
				moderation_type: it.project_type,
			}))

			reports = await Promise.all(
				reports.map(async (report) => {
					report.item_id = report.item_id?.replace
						? report.item_id.replace(/"/g, '')
						: report.item_id
					let url = ''

					if (report.item_type === 'user') {
						const user = await send<'getUser'>('GET', `user/${report.item_id}`, null, { fetch })
						url = `/user/${user.username}`
						report.item_id = user.username
					} else if (report.item_type === 'project') {
						const project = await send<'getProject'>('GET', `project/${report.item_id}`, null, {
							fetch,
						})
						report.item_id = project.slug || report.item_id
						url = `/${project.project_type}/${report.item_id}`
					} else if (report.item_type === 'version') {
						const version = await send<'getVersion'>('GET', `version/${report.item_id}`, null, {
							fetch,
						})
						const project = await send<'getProject'>('GET', `project/${version.project_id}`, null, {
							fetch,
						})
						report.item_id = version.version_number || report.item_id
						url = `/${project.project_type}/${project.slug || project.id}/version/${report.item_id}`
					}

					report.reporter = (
						await send<'getUser'>('GET', `user/${report.reporter}`, null, { fetch })
					).username

					return {
						...report,
						moderation_type: 'report',
						url,
					}
				})
			)

			interface ReportItem {
				published?: boolean
				created?: boolean
			}

			const items = [...projects, ...reports].sort(
				(a: any, b: any) =>
					new Date(a.published || a.created).valueOf() -
					new Date(b.published || b.created).valueOf()
			)
			return {
				props: {
					items,
				},
			}
		} catch {
			return {
				status: 404,
				error: new Error(`The moderation queue could not be received.`),
			}
		}
	}
</script>

<script lang="ts">
	import { NavRow } from 'omorphia'
	import { projectTypes } from '$generated/tags.json'
	import { t } from 'svelte-intl-precompile'
	import Meta from '$components/utils/Meta.svelte'
	import ProjectCard from '$components/elements/ProjectCard.svelte'
	import { page } from '$app/stores'
	import { Button, Badge, Field, Select, TextInput, Modal } from 'omorphia'
	import { ago, markdown } from 'omorphia/utils'
	import IconCalendar from 'virtual:icons/lucide/calendar'
	import IconEye from 'virtual:icons/heroicons-outline/eye'
	import IconTrash from 'virtual:icons/heroicons-outline/trash'
	import IconCheck from 'virtual:icons/heroicons-outline/check'
	import NoData from '$assets/images/illustrations/undraw_no_data.svg'

	export let items

	let newStatus: any = {}

	$: filteredItems = items.filter((item) =>
		$page.url.searchParams.get('type')
			? item.moderation_type === $page.url.searchParams.get('type')
			: true
	)

	async function changeStatus(id: string) {
		await send('PATCH', `project/${id}`, {
			status: newStatus.status,
			...(newStatus.body
				? {
						moderation_message: 'Moderator message',
						moderation_message_body: newStatus.body,
				  }
				: {}),
		})
		removeItem(id)
	}

	function removeItem(id: string) {
		items = items.filter((item) => item.id !== id)
	}
</script>

<Meta title={$t('pages.moderation')} noindex />

<div class="single-layout">
	<h1>{$t('pages.moderation')}</h1>
	<div class="card">
		<NavRow
			links={[
				{
					label: $t('pages.all'),
					href: '',
				},
				{
					label: $t('report.plural'),
					href: 'report',
				},
				...projectTypes.map((type) => ({
					label: $t(`project.types.${type}.plural`),
					href: type,
				})),
			]}
			query="type" />
	</div>

	{#if filteredItems.length > 0}
		{#each filteredItems as item}
			{#if item.moderation_type === 'report'}
				<div class="card report">
					<div class="report__info">
						<div class="report__info__title">
							<h3>{item.item_type} <a href={item.url}>{item.item_id}</a></h3>
							reported by<a href="/user/{item.reporter}">{item.reporter}</a>
						</div>
						{#if item.body}
							{@html markdown(item.body)}
						{/if}
						<Badge label="Marked as {item.report_type}" color="yellow" />
					</div>
					<div class="actions">
						<Button
							on:click={async () => {
								await send('DELETE', `report/${item.id}`)
								removeItem(item.id)
							}}>
							<IconTrash /> Delete report
						</Button>
						<span class="stat">
							<IconCalendar />
							{@html $t('stats.created', { values: { ago: ago(item.created) } })}
						</span>
					</div>
				</div>
			{:else}
				<ProjectCard project={item}>
					<div slot="actions" class="actions">
						<Modal
							title={$t('modal.moderation.project_status.title')}
							let:trigger
							bind:data={newStatus}
							defaultData={{
								status: 'approve',
							}}>
							<Button slot="trigger" on:click={trigger}>
								<IconEye /> Change status
							</Button>

							<Field label={$t('modal.moderation.project_status.fields.status.label')}>
								<Select
									bind:value={newStatus.status}
									options={[
										{
											label: $t('modal.moderation.project_status.fields.status.options.approve'),
											value: 'approved',
										},
										{
											label: $t('modal.moderation.project_status.fields.status.options.unlist'),
											value: 'unlisted',
										},
										{
											label: $t('modal.moderation.project_status.fields.status.options.reject'),
											value: 'rejected',
										},
									]} />
							</Field>
							<Field
								label={$t('modal.moderation.project_status.fields.moderation_message.label')}
								helper={$t('modal.moderation.project_status.fields.moderation_message.helper')}>
								<TextInput
									multiline
									placeholder={$t(
										'modal.moderation.project_status.fields.moderation_message.placeholder'
									)}
									bind:value={newStatus.body} />
							</Field>

							<Button
								color="primary"
								slot="button"
								let:close
								on:click={() => {
									changeStatus(item.id)
									close()
								}}><IconCheck /> {$t('modal.moderation.project_status.action')}</Button>
						</Modal>

						<span class="stat">
							<IconCalendar />
							{@html $t('stats.created', { values: { ago: ago(item.published) } })}
						</span>
					</div>
				</ProjectCard>
			{/if}
		{/each}
	{:else}
		<div class="illustration">
			<NoData class="illustration__image" />
			<p class="illustration__description">You are up to date!</p>
		</div>
	{/if}
</div>

<style lang="postcss">
	.report {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 1rem;

		> div {
			display: flex;
			flex-direction: column;
			gap: 0.75rem;
		}

		&__info {
			display: flex;
			flex-wrap: wrap;

			&__title {
				display: flex;
				align-items: center;
				gap: 0.5rem;
				flex-wrap: wrap;

				h3 {
					text-transform: capitalize;

					a {
						text-transform: none;
					}
				}

				a {
					text-decoration: underline;
				}
			}
		}
	}
</style>
