<script lang="ts">
	import { Button, Avatar, Chips, TextInput, CheckboxList } from 'omorphia'
	import { markdown } from 'omorphia/utils'
	import Meta from '$components/utils/Meta.svelte'
	import { t } from 'svelte-intl-precompile'
	import IconPencil from 'virtual:icons/heroicons-outline/pencil'
	import IconSwitchHorizontal from 'virtual:icons/heroicons-outline/switch-horizontal'
	import IconTrash from 'virtual:icons/heroicons-outline/trash'
	import IconEye from 'virtual:icons/heroicons-outline/eye'
	import { permissions, project, members, color } from './_store'
	import autosize from 'svelte-autosize'
	import { onDestroy, onMount } from 'svelte'
	import { send } from '$lib/api'

	let modifiedMembers = $members.map(({ permissions, role, user }) => ({
		permissions,
		role,
		id: user.id,
	}))
</script>

<Meta
	title="{$project.title} - {$t('pages.settings')}"
	description={$project.description}
	noindex
	color={$color} />

<h2 class="title">{$t('project.members')}</h2>
{#each $members as member, index}
	<div class="card edit-member">
		<div class="edit-member__column">
			<div class="edit-member__column__row">
				<Avatar size="xs" src={member.user.avatar_url} circle />
				<h2 class="title-secondary">{member.user.username}</h2>
			</div>
			<div class="button-group">
				<Button><IconTrash /> {$t('generic.actions.remove')}</Button>
			</div>
		</div>

		<div class="edit-member__column">
			<b>{$t('project.role.text')}</b>
			<TextInput
				placeholder={$t('project.role.placeholder')}
				bind:value={modifiedMembers[index].role} />
		</div>

		<div class="edit-member__column">
			<b>{$t('project.permissions')}</b>
			<!-- TODO make this prettier (not code-wise) -->
			<CheckboxList
				options={[
					{
						label: $t('project.permission.upload_version'),
						value: 1 << 0,
					},
					{
						label: $t('project.permission.delete_version'),
						value: 1 << 1,
					},
					{
						label: $t('project.permission.edit_details'),
						value: 1 << 2,
					},
					{
						label: $t('project.permission.edit_body'),
						value: 1 << 3,
					},
					{
						label: $t('project.permission.manage_invites'),
						value: 1 << 4,
					},
					{
						label: $t('project.permission.remove_member'),
						value: 1 << 5,
					},
					{
						label: $t('project.permission.edit_member'),
						value: 1 << 6,
					},
					{
						label: $t('project.permission.delete_project'),
						value: 1 << 7,
					},
				]} />
		</div>
	</div>
{/each}

<h2 class="title">{$t('project.advanced')}</h2>
<div class="card">
	<div class="setting">
		<div class="setting__label">
			<b>{$t('project.visibility.title')}</b><br />
			{$t('project.visibility.description', {
				values: { status: $t(`status.${$project.status}`) },
			})}
		</div>
		<Button color="danger-light"><IconEye /> {$t('project.visibility.action')}</Button>
	</div>
	<div class="setting">
		<div class="setting__label">
			<b>{$t('project.ownership.title')}</b><br />
			{$t('project.ownership.description')}
		</div>
		<Button color="danger-light">
			<IconSwitchHorizontal />
			{$t('project.ownership.action')}
		</Button>
	</div>
	<div class="setting">
		<div class="setting__label">
			<b>{$t('project.delete.title')}</b><br />
			{$t('project.delete.description')}
		</div>
		<Button color="danger">
			<IconTrash />
			{$t('project.delete.action')}
		</Button>
	</div>
</div>

<style lang="postcss">
	.edit-member {
		display: grid;
		grid-auto-flow: column;

		&__column {
			display: flex;
			flex-direction: column;
			grid-gap: 0.5rem;

			&__row {
				display: flex;
				align-items: center;
				grid-gap: 0.75rem;
			}

			.button-group {
				margin-top: auto;
			}

			&:last-child {
				margin-left: auto;
			}
		}
	}

	.setting {
		display: flex;
		flex-wrap: wrap;
		grid-gap: 1rem;
		align-items: center;
		justify-content: space-between;
		width: 100%;

		&__label {
			max-width: 80%;
			min-width: 70%;
		}
	}
</style>
