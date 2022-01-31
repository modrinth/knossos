<script lang="ts">
  import Meta from '$components/utils/Meta.svelte'
  import { t } from 'svelte-intl-precompile'
  import { members, project, releaseColors, versions } from './_store'
  import Badge from '$components/elements/Badge.svelte'
  import { formatVersions } from '$lib/versions'
  import Button from '$components/elements/Button.svelte'
  import IconDownload from 'virtual:icons/heroicons-outline/download'
  import { tagIcons } from '$generated/tags.json'
  import { downloadUrl, getPrimary } from '$lib/versions'
  import { markdownXSS } from "$lib/parse";

  const dateFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric' })
</script>

<Meta title={`${$t('pages.changelog')} - ${$project.title}`} description={$project.description}/>

<div class="card changelog">
  {#each $versions as version}
      <div class="changelog__item">
        <div class="changelog__item__color" style:--color="var(--color-badge-{releaseColors[version.version_type]}-dot)" />
        <div class="changelog__item__body">
          <div class="changelog__item__body__title">
            <a href="./version/{version.version_number || version.id}"><h1 class="title-secondary">{version.name || version.version_number}</h1></a>
            <a href="/user/{$members.find(member => member.user.id === version.author_id).user.username}">{@html $t('generic.byline', {values: {author: $members.find(member => member.user.id === version.author_id).user.username}})}</a>
            &bull;
            <span>{dateFormat.format(new Date(version.date_published))}</span>
            <Button label={$t('generic.actions.download')} icon={IconDownload} href={downloadUrl(getPrimary(version.files))}/>
          </div>
          <div class="changelog__item__body__log text">
            {@html markdownXSS(version.changelog)}
          </div>
        </div>
      </div>
  {/each}
</div>

<style lang="postcss">
  .changelog {
    display: flex;
    flex-direction: column;
    grid-gap: 1rem;

    &__item {
      display: flex;
      grid-gap: 0.8rem;

      &__color {
        --color: var(--color-badge-green-dot);
        width: 0.2rem;
        min-width: 0.2rem;
        background-color: var(--color);
        position: relative;
        margin: 0.5rem 0.4rem 0 0.4rem;
        border-radius: var(--rounded-max);

        &::before {
          content: '';
          width: 1rem;
          height: 1rem;
          background-color: var(--color);
          position: absolute;
          top: 0;
          left: -0.4rem;
          border-radius: var(--rounded-max);
        }
      }

      &__body {
        display: flex;
        flex-direction: column;

        &__title {
          display: flex;
          grid-gap: 0.5rem;
          align-items: baseline;
          flex-wrap: wrap;
        }
      }
    }
  }
</style>
