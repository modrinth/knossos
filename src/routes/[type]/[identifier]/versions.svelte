<script lang="ts">
  import Meta from '$components/utils/Meta.svelte'
  import { t } from 'svelte-intl-precompile'
  import { members, project, releaseColors, versions } from './_store'
  import Badge from '$components/elements/Badge.svelte'
  import { formatVersions } from '$lib/versions'
  import Button from '$components/elements/Button.svelte'
  import IconDownload from 'virtual:icons/heroicons-outline/download'
  import { tagIcons } from '$stores/tags'

  const owner = $members.find(member => member.role === 'Owner').user.username
</script>

<Meta title={`${$t('pages.versions')} -  ${$project.title}`} description={$project.description}/>

<div class="versions">
  {#each $versions as version}
    <div class="card card--pad-x card--strip version">
      <div class="version__info">
        <div class="version__info__row">
          <a href="./version/{version.version_number || version.id}"><b>{version.name || version.version_number}</b></a>
          <a href="/user/{owner}">{@html $t('generic.byline', {values: {author: owner}})}</a>
          &bull;
          <span>{(new Date(version.date_published))
            .toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'})}</span>
        </div>
        <div class="version__info__row">
          <Badge
            label={$t(`release_channels.${version.version_type}`)}
            color={releaseColors[version.version_type]}
          />
          &bull;
          <div class="tags">
            {#each version.loaders as loader, index}
              <div class="tags__tag">
                {@html $tagIcons[loader]}{$t(`tags.${loader}`)}
              </div>
            {/each}
          </div>
          &bull;
          {formatVersions(version.game_versions)}
          &bull;
          {@html $t('stats.downloads', {values: {downloads: version.downloads}})}
        </div>
      </div>
      <Button label={$t('generic.actions.download')} icon={IconDownload} href={version.files.find((file) => file.primary)?.url || version.files[0].url}/>
    </div>
  {/each}
</div>

<style lang="postcss">
  .versions {
    display: flex;
    flex-direction: column;
    grid-gap: 1rem;

    .version {
      &__info {
        overflow: hidden;
        display: flex;
        flex-direction: column;

        &__row {
          display: flex;
          align-items: center;
          grid-gap: 0 0.4rem;
          flex-wrap: wrap;
        }
      }
    }
  }
</style>
