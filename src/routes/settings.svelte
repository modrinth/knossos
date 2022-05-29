<script lang="ts">
	import { t } from 'svelte-intl-precompile'
	import Meta from '$components/utils/Meta.svelte'
	import { Button } from 'omorphia'
	import { token, user } from '$stores/server'
	import { popups } from '$stores/app'
	import { goto } from '$app/navigation'
	import { send } from '$lib/api'
	import IconCheck from 'virtual:icons/heroicons-outline/check'

	let copiedToken = false

	function deleteAccount() {
		$popups = [
			{
				title: $t('user.delete.confirm_title'),
				type: {
					deletion: {
						key: $user.username,
					},
				},
				body: $t('user.delete.confirm_body'),
				button: {
					label: $t('user.delete.yes_I_want_to_do_this'),
					click: async () => {
						await send('DELETE', `user/${$user.id}`)
						await logOut()
					},
				},
				style: {
					wide: true,
				},
			},
			...$popups,
		]
	}

	function revokeToken() {
		$popups = [
			{
				title: $t('user.revoke_token.title'),
				body: $t('user.revoke_token.body'),
				button: {
					label: $t('user.revoke_token.action'),
					click: async () => {
						await logOut()
					},
				},
			},
			...$popups,
		]
	}

	async function logOut() {
		$user = null
		$token = ''
		document.cookie = 'modrinth-token' + '=test; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
		await goto('/')
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
				{#if (copiedToken)}<IconCheck />{/if}
				{$t(`user.auth.${copiedToken ? 'copied' : 'copy'}`)}
			</Button>
			<Button on:click={revokeToken}>{$t('user.auth.revoke')}</Button>
		</div>
	</div>
	<div class="card markdown">
		<h3>{$t('user.delete.title')}</h3>
		<p>{$t('user.delete.body')}</p>
		<div class="button-group">
			<Button color="danger" on:click={deleteAccount}>{$t('user.delete.title')}</Button>
		</div>
	</div>
</div>

<style lang="postcss">
</style>
