<template>
  <div class="content">
    <Head>
      <Title> {{ project.title }} - Versions </Title>
      <Meta name="og:title" :content="`${project.title} - Versions`" />
      <Meta name="description" :content="metaDescription" />
      <Meta name="apple-mobile-web-app-title" :content="`${project.title} - Versions`" />
      <Meta name="og:description" :content="metaDescription" />
    </Head>
    <div v-if="currentMember" class="card header-buttons">
      <FileInput
        :max-size="524288000"
        :accept="acceptFileFromProjectType(project.project_type)"
        prompt="Upload a version"
        class="brand-button iconified-button"
        @change="handleFiles"
      >
        <UploadIcon />
      </FileInput>
      <span class="indicator">
        <InfoIcon /> Click to choose a file or drag one onto this page
      </span>
      <DropArea :accept="acceptFileFromProjectType(project.project_type)" @change="handleFiles" />
    </div>
    <div v-if="versions.length > 0" class="universal-card all-versions">
      <div class="header">
        <div />
        <div>Version</div>
        <div>Supports</div>
        <div>Stats</div>
      </div>
      <div
        v-for="version in versions"
        :key="version.id"
        class="version-button button-transparent"
        @click="
          $router.push(
            `/${project.project_type}/${
              project.slug ? project.slug : project.id
            }/version/${encodeURI(version.displayUrlEnding)}`
          )
        "
      >
        <a
          v-tooltip="
            version.primaryFile.filename + ' (' + $formatBytes(version.primaryFile.size) + ')'
          "
          :href="version.primaryFile.url"
          class="download-button square-button brand-button"
          :class="version.version_type"
          :title="`Download ${version.name}`"
          @click.stop="(event) => event.stopPropagation()"
        >
          <DownloadIcon aria-hidden="true" />
        </a>
        <nuxt-link
          :to="`/${project.project_type}/${
            project.slug ? project.slug : project.id
          }/version/${encodeURI(version.displayUrlEnding)}`"
          class="version__title"
        >
          {{ version.name }}
        </nuxt-link>
        <div class="version__metadata">
          <VersionBadge v-if="version.version_type === 'release'" type="release" color="green" />
          <VersionBadge v-else-if="version.version_type === 'beta'" type="beta" color="orange" />
          <VersionBadge v-else-if="version.version_type === 'alpha'" type="alpha" color="red" />
          <span class="divider" />
          <span class="version_number">{{ version.version_number }}</span>
        </div>
        <div class="version__supports">
          <span>
            {{ version.loaders.map((x) => $formatCategory(x)).join(', ') }}
          </span>
          <span>{{ $formatVersion(version.game_versions) }}</span>
        </div>
        <div class="version__stats">
          <span>
            <strong>{{ $formatNumber(version.downloads) }}</strong>
            downloads
          </span>
          <span>
            Published on
            <strong>{{ $dayjs(version.date_published).format('MMM D, YYYY') }}</strong>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { acceptFileFromProjectType } from '~/helpers/fileUtils'
import DownloadIcon from '~/assets/images/utils/download.svg'
import UploadIcon from '~/assets/images/utils/upload.svg'
import InfoIcon from '~/assets/images/utils/info.svg'
import VersionBadge from '~/components/ui/Badge'
import FileInput from '~/components/ui/FileInput'
import DropArea from '~/components/ui/DropArea.vue'

const props = defineProps({
  project: {
    type: Object,
    default() {
      return {}
    },
  },
  members: {
    type: Array,
    default() {
      return []
    },
  },
})

const metaDescription = computed(
  () =>
    `Download and browse ${props.project.versions.length} ${
      props.project.title
    } versions. ${this.$formatNumber(
      props.project.downloads
    )} total downloads. Last updated ${this.$dayjs(props.project.updated).format('MMM D, YYYY')}.`
)

async function handleFiles(files) {
  const router = useRouter()
  await router.push({
    name: 'type-id-version-version',
    params: {
      type: props.project.project_type,
      id: props.project.slug ? props.project.slug : props.project.id,
      version: 'create',
    },
    state: {
      newPrimaryFile: files[0],
    },
  })
}
</script>

<style lang="scss" scoped>
.header-buttons {
  display: flex;
  align-items: center;
  gap: 1rem;

  .indicator {
    display: flex;
    gap: 0.5ch;
    align-items: center;
    color: var(--color-text-inactive);
  }
}

.all-versions {
  display: flex;
  flex-direction: column;

  .header {
    display: grid;
    grid-template: 'download title supports stats';
    grid-template-columns: calc(2.25rem + var(--spacing-card-sm)) 1.25fr 1fr 1fr;
    color: var(--color-text-dark);
    font-size: var(--font-size-md);
    font-weight: bold;
    justify-content: left;
    margin-inline: var(--spacing-card-md);
    margin-bottom: var(--spacing-card-sm);
    column-gap: var(--spacing-card-sm);

    div:first-child {
      grid-area: download;
    }

    div:nth-child(2) {
      grid-area: title;
    }

    div:nth-child(3) {
      grid-area: supports;
    }

    div:nth-child(4) {
      grid-area: stats;
    }
  }

  .version-button {
    display: grid;
    grid-template:
      'download title supports stats'
      'download metadata supports stats'
      'download dummy supports stats';
    grid-template-columns: calc(2.25rem + var(--spacing-card-sm)) 1.25fr 1fr 1fr;
    column-gap: var(--spacing-card-sm);
    justify-content: left;
    padding: var(--spacing-card-md);

    .download-button {
      grid-area: download;
    }
    .version__title {
      grid-area: title;
      font-weight: bold;

      svg {
        vertical-align: top;
      }
    }
    .version__metadata {
      grid-area: metadata;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: var(--spacing-card-xs);
      margin-top: var(--spacing-card-xs);
    }
    .version__supports {
      grid-area: supports;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-card-xs);
    }
    .version__stats {
      grid-area: stats;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-card-xs);
    }

    &:active:not(&:disabled) {
      transform: scale(0.99) !important;
    }
  }
}

@media screen and (max-width: 1024px) {
  .all-versions {
    .header {
      grid-template: 'download title';
      grid-template-columns: calc(2.25rem + var(--spacing-card-sm)) 1fr;

      div:nth-child(3) {
        display: none;
      }

      div:nth-child(4) {
        display: none;
      }
    }

    .version-button {
      grid-template: 'download title' 'download metadata' 'download supports' 'download stats';
      grid-template-columns: calc(2.25rem + var(--spacing-card-sm)) 1fr;
      row-gap: var(--spacing-card-xs);

      .version__supports {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        column-gap: var(--spacing-card-xs);
      }
      .version__metadata {
        margin: 0;
      }
    }
  }
}

.modal-create {
  padding: var(--spacing-card-bg);

  .input-group {
    width: fit-content;
    margin-left: auto;
    margin-top: 1.5rem;
  }
}
</style>
