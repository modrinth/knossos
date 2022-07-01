<script lang="ts">
	import { t } from 'svelte-intl-precompile'
	import Meta from '$components/utils/Meta.svelte'
	import { notifications, updateSelf, loaded } from '$stores/account'
	import { Button } from 'omorphia'
	import { markdownInline, ago } from 'omorphia/utils'
	import IconTrash from 'virtual:icons/heroicons-outline/trash'
	import { send } from 'omorphia/utils'
	import { onMount } from 'svelte'
	import UpToDate from '$assets/illustrations/undraw_notify.svg'

	onMount(async () => {
		await updateSelf()
	})

	async function deleteNotification(id) {
		await send('DELETE', `notification/${id}`)
		$notifications = $notifications.filter((it) => it.id !== id)
	}
</script>

<Meta title={$t('pages.notifications')} noindex />

<div class="single-layout">
	<div class="title-bar">
		<h1>{$t('pages.notifications')}</h1>
		{#if !$loaded || $notifications.length > 0}
			<Button
				color="primary"
				on:click={async () => {
					await send(
						'DELETE',
						`notifications?ids=${JSON.stringify($notifications.map((it) => it.id))}`
					)
					$notifications = []
				}}>
				<IconTrash /> Clear all
			</Button>
		{/if}
	</div>
	{#if !$loaded}
		Loading notifications...
	{:else if $notifications.length > 0}
		{#each $notifications as notification}
			<div class="card notification">
				<div class="notification__info">
					<div class="notification__info__title">
						<h3>
							<a href={notification.link}>
								{@html markdownInline(notification.title)}
							</a>
						</h3>
						<span class="notification__info__title__time">
							{@html $t('stats.notified', { values: { ago: ago(notification.created) } })}
						</span>
					</div>
					<p>{notification.text}</p>
				</div>
				<div class="notification__actions">
					{#if notification.type === 'project_update'}
						<Button
							on:click={async () => {
								await deleteNotification(notification.id)
							}}>
							<IconTrash /> Clear
						</Button>
					{/if}
					{#each notification.actions as action}
						<Button
							on:click={async () => {
								try {
									await send(action.action_route[0], action.action_route[1])
								} catch {
									// Workaround for https://github.com/modrinth/labrinth/issues/279
									console.warn('Could not perform notification action.')
								}
								await deleteNotification(notification.id)
							}}>
							{action.title}
						</Button>
					{/each}
				</div>
			</div>
		{/each}
	{:else}
		<div class="illustration">
			<UpToDate class="illustration__image" />
			<p class="illustration__description">{$t('generic.up_to_date')}</p>
		</div>
	{/if}
</div>

<style lang="postcss">
	.title-bar {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;

		@media (width <= 400px) {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}
	}

	.notification {
		display: flex;
		flex-direction: row;
		justify-content: space-between;

		@media (width <= 800px) {
			flex-direction: column;
		}

		&__info {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;

			&__title {
				display: flex;
				flex-direction: row;
				align-items: center;
				gap: 0.5rem;

				@media (width <= 800px) {
					flex-direction: column;
					align-items: flex-start;
				}

				:global(strong) {
					text-decoration: underline;
				}

				&__time {
					color: var(--color-text-light);
				}
			}
		}

		&__actions {
			display: flex;
			flex-direction: row;
			align-items: flex-end;
			gap: 0.5rem;
		}
	}
</style>
