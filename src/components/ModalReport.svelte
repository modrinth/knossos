<script lang="ts">
	import IconArrowRight from 'virtual:icons/heroicons-outline/arrow-right'
	import { Modal, Button, TextInput, Field, Select } from 'omorphia'
	import { t } from 'svelte-intl-precompile'
	import IconFlag from 'virtual:icons/heroicons-outline/flag'
	import { markdown, send } from 'omorphia/utils'
	import { reportTypes } from '$generated/tags.json'

	export let type: 'project' | 'version' | 'user'
	export let id: string
	export let buttonColor = ''
	export let buttonRaised = false

	let open = false

	let data: { reason: string; body?: string }

	async function sendReport() {
		await send('POST', 'report', {
			report_type: data?.reason,
			body: data?.body,
			item_id: id,
			item_type: type,
		})
		open = false
	}
</script>

<Modal title={$t(`modal.report.${type}.action`)} bind:open bind:data defaultData={{ reason: '' }}>
	<svelte:fragment slot="trigger" let:trigger>
		<Button raised={buttonRaised} color={buttonColor} on:click={trigger}>
			<IconFlag />
			{$t('generic.actions.report')}
		</Button>
	</svelte:fragment>

	{@html markdown($t(`modal.report.generic.description`))}

	<Field label={$t('modal.report.generic.fields.reason.label')}>
		<Select
			bind:value={data.reason}
			options={reportTypes.map((type) => ({
				label: $t(`report.type.${type}`),
				value: type,
			}))} />
	</Field>

	<Field
		label={$t('modal.report.generic.fields.information.label')}
		helper={$t('modal.report.generic.fields.information.helper')}
		let:id>
		<TextInput
			placeholder={$t('modal.report.generic.fields.information.placeholder')}
			bind:value={data.body}
			multiline
			{id} />
	</Field>

	<Button color="primary" slot="button" on:click={sendReport}>
		<IconArrowRight />
		{$t(`modal.report.${type}.action`)}
	</Button>
</Modal>
