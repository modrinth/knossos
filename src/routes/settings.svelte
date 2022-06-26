<script lang="ts">
	import IconArrowRight from 'virtual:icons/heroicons-outline/arrow-right'
	import { t } from 'svelte-intl-precompile'
	import Meta from '$components/utils/Meta.svelte'
	import { Button, ModalDeletion, Modal } from 'omorphia'
	import { token, user } from '$stores/account'
	import { goto } from '$app/navigation'
	import { send } from 'omorphia/utils'
	import IconCheck from 'virtual:icons/heroicons-outline/check'
	import { markdown } from 'omorphia/utils'

	let copiedToken = false

	async function logOut() {
		await goto('/')
		$user = undefined
		$token = ''
		document.cookie = 'modrinth-token' + '=test; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
	}
</script>

<Meta title={$t('pages.settings')} />

<div class="single-layout">
	<h1>{$t('pages.settings')}</h1>
	<div class="card markdown">
		<h3>{$t('user.auth.title')}</h3>
		<p>{$t('user.auth.body')}</p>
		<div class="button-group">
			<Button
				on:click={async () => {
					await navigator.clipboard.writeText($token)
					copiedToken = true
				}}>
				{#if copiedToken}<IconCheck />{/if}
				{$t(`user.auth.${copiedToken ? 'copied' : 'copy'}`)}
			</Button>
			<Modal title={$t('user.revoke_token.title')} size="lg">
				<Button slot="trigger" let:trigger on:click={trigger}>{$t('user.auth.revoke')}</Button>

				{@html markdown($t('user.revoke_token.body'))}

				<Button
					slot="button"
					color="primary"
					let:close
					on:click={async () => {
						close()
						await logOut()
					}}><IconArrowRight /> {$t('user.revoke_token.action')}</Button>
			</Modal>
		</div>
	</div>
	<div class="card markdown">
		<h3>{$t('user.delete.title')}</h3>
		<p>{$t('user.delete.body')}</p>
		<div class="button-group">
			<ModalDeletion
				type="account"
				key={$user.username}
				let:trigger
				on:deletion={async () => {
					await send('DELETE', `user/${$user.id}`)
					await logOut()
				}}>
				<Button slot="trigger" color="danger" on:click={trigger}>{$t('user.delete.title')}</Button>
			</ModalDeletion>
		</div>
	</div>
</div>

<style lang="postcss">
</style>
