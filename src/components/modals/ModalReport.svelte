<script lang="ts">
	import { Modal, Button, TextInput, Field } from 'omorphia'
	import { t } from 'svelte-intl-precompile'
	import IconExclamation from 'virtual:icons/heroicons-outline/exclamation'
	import IconTrash from 'virtual:icons/heroicons-outline/trash'
	import { markdown } from 'omorphia/utils'
	import { createEventDispatcher } from 'svelte'

	export let key: string
	export let type: 'project' | 'version' | 'account' | 'image'

	export let open = false

	let data: { key?: string } = {}

	const dispatch = createEventDispatcher()
</script>

<Modal title={$t(`modal.deletion.${type}.title`)} bind:open let:trigger bind:data>
	<slot slot="trigger" name="trigger" {trigger} />

	{#if type === 'account' || 'project'}
		<div class="important-banner">
			<IconExclamation /><span>{$t('modal.deletion.generic.important')}</span>
		</div>
	{/if}
	{@html markdown($t(`modal.deletion.${type}.description`))}
	<Field label={$t('modal.deletion.generic.verify', { values: { key } })} let:id>
		<TextInput
			placeholder={$t('modal.deletion.generic.placeholder', { values: { key } })}
			bind:value={data.key}
			{id} />
	</Field>

	<Button
		color="danger"
		slot="button"
		disabled={key !== data.key}
		let:close
		on:click={() => {
			close()
			dispatch('deletion')
		}}>
		<IconTrash />
		{$t(`modal.deletion.${type}.action`)}
	</Button>
</Modal>

<style lang="postcss">
</style>
