<script lang="ts">
	import { Button, Avatar, Chips, TextInput, Checkbox } from 'omorphia'
	import { markdown, Permissions } from 'omorphia/utils'
	import Meta from '$components/utils/Meta.svelte'
	import { t } from 'svelte-intl-precompile'
	import IconPencil from 'virtual:icons/heroicons-outline/pencil'
	import IconSwitchHorizontal from 'virtual:icons/heroicons-outline/switch-horizontal'
	import IconTrash from 'virtual:icons/heroicons-outline/trash'
	import IconEye from 'virtual:icons/heroicons-outline/eye'
	import { permissions, project, members, color } from './_store'
	import autosize from 'svelte-autosize'
	import { onDestroy, onMount } from 'svelte'
	import { send } from '$utils/api'

	let modifiedMembers = $members.map(({ permissions, role, user }) => ({
		permissions: new Permissions(permissions),
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
			<div class="edit-member__column__row avatar">
				<Avatar size="sm" src={member.user.avatar_url} circle />
				<h2 class="title-secondary">{member.user.username}</h2>
			</div>
			<div class="edit-member__column">
				<b>{$t('project.role.text')}</b>
				<TextInput
					placeholder={$t('project.role.placeholder')}
					bind:value={modifiedMembers[index].role} />
			</div>
			<div class="button-group">
				<Button><IconTrash /> {$t('generic.actions.remove')}</Button>
			</div>
		</div>

		<div class="edit-member__column">
			<b>{$t('project.permissions')}</b>
			<div class="edit-member__column__grid">
				<Checkbox bind:checked={modifiedMembers[index].permissions.uploadVersions}>
					{$t('project.permission.upload_version')}
				</Checkbox>
				<Checkbox bind:checked={modifiedMembers[index].permissions.deleteVersion}>
					{$t('project.permission.delete_version')}
				</Checkbox>
				<Checkbox bind:checked={modifiedMembers[index].permissions.editDetails}>
					{$t('project.permission.edit_details')}
				</Checkbox>
				<Checkbox bind:checked={modifiedMembers[index].permissions.editBody}>
					{$t('project.permission.edit_body')}
				</Checkbox>
				<Checkbox bind:checked={modifiedMembers[index].permissions.manageInvites}>
					{$t('project.permission.manage_invites')}
				</Checkbox>
				<Checkbox bind:checked={modifiedMembers[index].permissions.removeMember}>
					{$t('project.permission.remove_member')}
				</Checkbox>
				<Checkbox bind:checked={modifiedMembers[index].permissions.editMember}>
					{$t('project.permission.edit_member')}
				</Checkbox>
				<Checkbox bind:checked={modifiedMembers[index].permissions.deleteProject}>
					{$t('project.permission.delete_project')}
				</Checkbox>
			</div>
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
		display: flex;
		margin-top: 40px;

		&__column {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;

			&__row {
				display: flex;
				align-items: center;
				gap: 0.75rem;

				&.avatar {
					margin-top: -55px;
				}
			}

			&__grid {
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
				gap: 0.5rem;
			}

			.button-group {
				margin-top: auto;
			}
		}
	}

	.setting {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: center;
		justify-content: space-between;
		width: 100%;

		&__label {
			max-width: 80%;
			min-width: 70%;
		}
	}
</style>
