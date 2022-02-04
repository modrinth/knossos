<script lang="ts">
  import Button from '$components/elements/Button.svelte'
  import Meta from '$components/utils/Meta.svelte'
  import { markdownXSS } from '$lib/parse'
  import { t } from 'svelte-intl-precompile'
  import IconPencil from 'virtual:icons/heroicons-outline/pencil'
  import IconX from 'virtual:icons/heroicons-outline/x'
  import IconTrash from 'virtual:icons/heroicons-outline/trash'
  import IconSave from 'virtual:icons/lucide/save'
  import { permissions, project } from './_store'
  import Chips from '$components/elements/Chips.svelte'
  import autosize from 'svelte-autosize'
  import { onDestroy, onMount } from 'svelte'
  import { send } from '$lib/api'
  import { browser } from '$app/env'

  let isEditing = false
  let viewMode: 'editor' | 'preview' = 'editor'

  let modifiedBody = $project.body

  let dirty: boolean
  $: dirty = $project.body !== modifiedBody

  function preventLeave(e) {
    if (dirty && isEditing) {
      e.preventDefault()
      e.returnValue = ''
    }
  }

  onMount(() => {if (browser) window.addEventListener('beforeunload', preventLeave)})

  onDestroy(() => {if (browser) window.removeEventListener('beforeunload', preventLeave)})

  async function save(): Promise<void> {
    if (dirty) {
      await send('PATCH', `project/${$project.id}`, {body: modifiedBody})
      $project.body = modifiedBody
    }
    isEditing = false
  }
</script>

<Meta title={$project.title} description={$project.description}/>

<div class="card project-body card--gap-none" style:--padding="0">
  <div class="card__overlay card__overlay--row">
    {#if $permissions.data.editBody}
      {#if isEditing}
        {#if dirty}
          <Button label={$t('generic.actions.discard')} icon={IconTrash}
                  on:click={() => {modifiedBody = $project.body; isEditing = false}}
          />
          <Button label={$t('generic.actions.save')} color="brand" icon={IconSave} on:click={save}/>
        {:else}
          <Button label={$t('generic.actions.cancel')} icon={IconX} on:click={() => isEditing = false}/>
        {/if}
      {:else}
        <Button label={$t('generic.actions.edit')} icon={IconPencil} on:click={() => isEditing = true}/>
      {/if}
    {/if}
  </div>
  {#if isEditing}
    <div class="project-body__toolbar">
      <Chips bind:value={viewMode} options={[
          {
            label: 'Editor',
            value: 'editor',
          },
          {
            label: 'Preview',
            value: 'preview',
          }
        ]} neverEmpty/>
    </div>
    {#if viewMode === 'editor'}
      <textarea class="project-body__editor" placeholder="Enter project body..." bind:value={modifiedBody} use:autosize/>
    {:else}
      <div class="project-body__text text">
        {@html markdownXSS(modifiedBody)}
      </div>
    {/if}
  {:else}
    <div class="project-body__text text">
      {#if $project.body}
        {@html markdownXSS($project.body)}
      {:else}
        <p class="project-body__text__placeholder">This project description is empty.</p>
      {/if}
    </div>
  {/if}
</div>

<style lang="postcss">
  .project-body {
    min-height: 4rem;

    &__text {
      padding: 1.5rem;

      &__placeholder {
        color: var(--color-text-lightest)
      }

      position: relative;
    }

    &__toolbar {
      padding: 1rem;
    }

    &__editor {
      border: none;
      padding: 1rem;
      background-color: var(--color-input-light);
    }
  }
</style>
