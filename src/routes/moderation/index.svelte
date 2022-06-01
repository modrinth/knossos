<script lang="ts">
	import ProjectCard from '$components/elements/ProjectCard.svelte'
	import { getContext } from 'svelte'
	import { page } from '$app/stores'
	import { Button, Badge } from 'omorphia'
	import { markdown, ago } from 'omorphia/utils'
	import IconCalendar from 'virtual:icons/lucide/calendar'
	import { t } from 'svelte-intl-precompile'
	import { send } from '$utils/api'
	import IconEye from 'virtual:icons/heroicons-outline/eye'
	import IconTrash from 'virtual:icons/heroicons-outline/trash'
	import { popups } from '$stores/app'
	import NoData from '$assets/images/illustrations/undraw_no_data.svg'

	let items: Array<any> = getContext('items')

	let filteredItems: Array<any> = []
	$: filteredItems = items.filter((item) =>
		$page.url.searchParams.get('type')
			? item.moderation_type === $page.url.searchParams.get('type')
			: true
	)

	async function changeStatus(id: string) {
		$popups = [
			{
				title: 'Change project status',
				type: {
					moderation: true,
				},
				button: {
					label: 'Confirm',
					click: async ({ status, body }) => {
						await send('PATCH', `project/${id}`, {
							status,
							...(body
								? {
										moderation_message: 'Moderator message',
										moderation_message_body: body,
								  }
								: {}),
						})
						removeItem(id)
					},
				},
			},
			...$popups,
		]
	}

	function removeItem(id: string) {
		items = items.filter((item) => item.id !== id)
	}
</script>

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
					<Button on:click={() => changeStatus(item.id)}><IconEye /> Change status</Button>
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

<style lang="postcss">
	.report {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		flex-wrap: wrap;
		grid-gap: 1rem;

		> div {
			display: flex;
			flex-direction: column;
			grid-gap: 0.75rem;
		}

		&__info {
			display: flex;
			flex-wrap: wrap;

			&__title {
				display: flex;
				align-items: center;
				grid-gap: 0.5rem;
				flex-wrap: wrap;

				h3 {
					text-transform: capitalize;
				}

				a {
					text-decoration: underline;
				}
			}
		}
	}
</style>
