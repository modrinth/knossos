<script lang="ts">
	import ProjectCard from '$components/elements/ProjectCard.svelte';
  import { getContext, setContext } from 'svelte'
	import { page } from '$app/stores';
  import Badge from "$components/elements/Badge.svelte";
  import { markdownXSS } from "$lib/parse";
  import Button from "$components/elements/Button.svelte";
  import IconCalendar from 'virtual:icons/lucide/calendar'
  import { t } from "svelte-intl-precompile";
  import { ago } from '$lib/ago'
  import { send } from "$lib/api";
  import IconCheck from 'virtual:icons/heroicons-outline/check'
  import IconX from 'virtual:icons/heroicons-outline/x'
  import IconUnlist from 'virtual:icons/heroicons-outline/eye-off'
  import IconTrash from 'virtual:icons/heroicons-outline/trash'

  let items = getContext('items');

  async function setProject(id, status) {
    await send('PATCH', `project/${id}`, {
      status
    })
    removeItem(id)
  }

  function removeItem(id) {
    items = items.filter(item => item.id !== id)
  }
</script>

{#each items.filter( (item) => ($page.url.searchParams.get('type') ? item.moderation_type === $page.url.searchParams.get('type') : true) ) as item}
  {#if item.moderation_type === 'report'}
      <div class="card report">
        <div class="report__info">
          <div class="report__info__title">
            <h3>{item.item_type} <a href="/{item.item_type}/{item.item_id}">{item.item_id}</a></h3>
            reported by <a href="/user/{item.reporter}">{item.reporter}</a>
          </div>
          <span class="stat">
            <IconCalendar/>
            {@html $t('stats.created', {values: {ago: ago(item.created)}})}
          </span>
          {#if item.body}
            {@html markdownXSS(item.body)}
          {/if}
          <Badge label="Marked as {item.report_type}" color="yellow" />
        </div>
        <div class="actions">
          <Button label="Delete report" icon={IconTrash} on:click={async () => {
                await send('DELETE', `report/${item.id}`)
                 removeItem(item.id)
          }} />
        </div>
      </div>
    {:else}
      <ProjectCard project={item}>
        <div slot="actions" class="actions">
          <Button label="Approve" on:click={() => setProject(item.id, 'approved')} icon={IconCheck}/>
          <Button label="Unlist" on:click={() => setProject(item.id, 'unlisted')} icon={IconUnlist}/>
          <Button label="Reject" on:click={() => setProject(item.id, 'rejected')} icon={IconX}/>
        </div>
      </ProjectCard>
    {/if}
{/each}

<style lang="postcss">
  .report {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    > div {
      display: flex;
      flex-direction: column;
      grid-gap: 0.75rem;
    }

    &__info {
      &__title {
        display: flex;
        align-items: center;
        grid-gap: 0.5rem;

        h3 {
          text-transform: capitalize;
        }

        a {
          text-decoration: underline;
        }
      }
    }
  }

  .actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    grid-gap: 0.5rem;
  }
</style>
