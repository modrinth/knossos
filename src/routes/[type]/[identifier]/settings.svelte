<script lang="ts">
  import Button from '$components/elements/Button.svelte'
  import Meta from '$components/utils/Meta.svelte'
  import { markdownXSS } from '$lib/parse'
  import { t } from 'svelte-intl-precompile'
  import IconPencil from 'virtual:icons/heroicons-outline/pencil'
  import IconSwitchHorizontal from 'virtual:icons/heroicons-outline/switch-horizontal'
  import IconTrash from 'virtual:icons/heroicons-outline/trash'
  import IconEye from 'virtual:icons/heroicons-outline/eye'
  import { permissions, project, members, color } from './_store'
  import Chips from '$components/elements/Chips.svelte'
  import autosize from 'svelte-autosize'
  import { onDestroy, onMount } from 'svelte'
  import { send } from '$lib/api'
  import ProfilePicture from "$components/elements/ProfilePicture.svelte";
  import Input from '$components/elements/Input.svelte'

  let modifiedMembers = $members.map(({ permissions, role, user }) => ({permissions, role, id: user.id}))
</script>

<Meta title="{$project.title} - {$t('pages.settings')}" description={$project.description} noindex color={$color} />

<h2 class="title">Members</h2>
{#each $members as member, index}
  <div class="card edit-member">
    <div class="edit-member__column">
      <div class="edit-member__column__row">
        <ProfilePicture size="xs" src={member.user.avatar_url} circle />
        <h2 class="title-secondary">{member.user.username}</h2>
      </div>
      <div class="button-group">
        <Button label="Remove" icon={IconTrash} />
      </div>
    </div>

    <div class="edit-member__column">
      <b>Role</b>
      <Input type="text" placeholder="Enter role..." bind:value={modifiedMembers[index].role} />
    </div>

    <div class="edit-member__column">
      <b>Permissions</b>
      <Input type="checkboxes" options={[
        {
          label: 'Upload version',
          value: 1 << 0,
        },
        {
          label: 'Delete version',
          value: 1 << 1,
        },
      ]} />
    </div>
  </div>
{/each}

<h2 class="title">Advanced</h2>
<div class="card">
  <div class="setting">
    <div class="setting__label">
      <b>Change visibility</b><br />
      This project is currently public.
    </div>
      <Button label="Change visibility" color="danger-light" on:click={() => {}} icon={IconEye} />
  </div>
  <div class="setting">
    <div class="setting__label">
      <b>Transfer ownership</b><br />
      Transfer this project to another user.
    </div>
    <Button label="Transfer ownership" color="danger-light" on:click={() => {}} icon={IconSwitchHorizontal} />
  </div>
  <div class="setting">
    <div class="setting__label">
      <b>Delete project</b><br />
      Deleting a project erases all project data, including versions.
    </div>
    <Button label="Delete project" color="danger" on:click={() => {}} icon={IconTrash} />
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
