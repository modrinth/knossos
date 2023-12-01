<template>
  <div class="content" :class="{ 'edit-mode': editMode }">
    <Head>
      <Title> {{ project.title }} - Versions </Title>
      <Meta name="og:title" :content="`${project.title} - Versions`" />
      <Meta name="description" :content="metaDescription" />
      <Meta name="apple-mobile-web-app-title" :content="`${project.title} - Versions`" />
      <Meta name="og:description" :content="metaDescription" />
    </Head>
    <div>
      <div v-if="editMode" class="edit-alert">
        <Button color="primary" :action="() => (editMode = false)">
          <SaveIcon /> Save changes
        </Button>
      </div>
      <div v-else class="search-row">
        <div class="iconified-input">
          <label for="search-input" hidden>Search notifications</label>
          <SearchIcon />
          <input id="search-input" v-model="notificationSearchInput" type="text" />
          <Button
            :class="notificationSearchInput ? '' : 'empty'"
            @click="() => (notificationSearchInput = '')"
          >
            <XIcon />
          </Button>
        </div>
        <PopoutMenu class="btn">
          <FilterIcon /> Filter...
          <template #menu>
            <div class="filter-section">
              <div class="filter-section__title">Type</div>
              <div class="filter-section__options">
                <Checkbox>Release</Checkbox>
                <Checkbox>Beta</Checkbox>
                <Checkbox>Alpha</Checkbox>
              </div>
            </div>
            <div class="filter-section">
              <div class="filter-section__title">Platform</div>
              <div class="filter-section__options">
                <Checkbox v-for="platform in platformOptions" :key="`platform-filter-${platform}`">
                  {{ formatCategory(platform) }}
                </Checkbox>
              </div>
            </div>
            <div class="filter-section">
              <div class="filter-section__title">Game versions</div>
              <div class="filter-section__options">
                <Checkbox
                  v-for="gameVersion in gameVersionOptions"
                  :key="`game-version-filter-${gameVersion}`"
                >
                  {{ gameVersion }}
                </Checkbox>
              </div>
            </div>
          </template>
        </PopoutMenu>
        <OverflowMenu
          class="btn btn-primary btn-dropdown-animation"
          :options="[
            {
              id: 'upload',
              action: () => {},
            },
            {
              id: 'import',
              action: () => {},
            },
          ]"
        >
          <PlusIcon /> Create new <DropdownIcon />
          <template #upload> <UploadIcon /> Upload files</template>
          <template #import> <ImportIcon /> Import versions</template>
        </OverflowMenu>
        <OverflowMenu
          class="btn icon-only"
          :options="[
            {
              id: 'edit',
              action: () => {
                editMode = true
              },
            },
          ]"
        >
          <MoreHorizontalIcon />
          <template #edit> <EditIcon /> Edit</template>
        </OverflowMenu>
      </div>
      <div class="version-table card">
        <div class="version-row version__header">
          <div class="version__checkbox">
            <Checkbox></Checkbox>
          </div>
          <div class="version__type">
            <Button v-if="editMode" disabled>
              <VersionTypeIndicator type="unknown" />
              <DropdownIcon />
            </Button>
            <VersionTypeIndicator v-else type="unknown" />
          </div>
          <div class="version__name">Name</div>
          <div class="version__published">Published</div>
          <div class="version__game-version">Game version</div>
          <div class="version__loader">Platform</div>
          <div class="version__downloads">Downloads</div>
          <div class="version__actions">
            <Button icon-only><DownloadIcon /></Button>
            <Button icon-only><MoreHorizontalIcon /></Button>
          </div>
        </div>
        <div
          v-for="version in versions.slice(0, 20)"
          :key="`version-row-${version.id}`"
          class="version-row"
        >
          <div class="version__checkbox">
            <Checkbox></Checkbox>
          </div>
          <div class="version__type">
            <OverflowMenu
              v-if="editMode"
              class="btn btn-transparent btn-dropdown-animation"
              position="bottom"
              direction="right"
              :options="[
                {
                  id: 'release',
                  action: () => {},
                },
                {
                  id: 'beta',
                  action: () => {},
                },
                {
                  id: 'alpha',
                  action: () => {},
                },
              ]"
            >
              <VersionTypeIndicator :type="version.version_type" />
              <DropdownIcon />
              <template #release> <VersionTypeIndicator type="release" /> Release </template>
              <template #beta> <VersionTypeIndicator type="beta" /> Beta </template>
              <template #alpha> <VersionTypeIndicator type="alpha" /> Alpha </template>
            </OverflowMenu>
            <VersionTypeIndicator v-else :type="version.version_type" />
          </div>
          <div class="version__name">
            <template v-if="editMode">
              <input v-model="version.version_number" class="version__number" />
              <input v-model="version.name" class="version__subtitle" />
            </template>
            <template v-else>
              <div class="version__number">{{ version.version_number }}</div>
              <div class="version__subtitle">{{ version.name }}</div>
            </template>
          </div>
          <div class="version__published">{{ fromNow(version.date_published) }}</div>
          <div class="version__game-version">
            <PopoutMenu
              v-if="editMode"
              class="btn btn-transparent hover-icon-only"
              position="bottom"
              direction="right"
            >
              {{ formatVersions(version.game_versions) }}
              <EditIcon />
              <template #menu> Edit the versions here! </template>
            </PopoutMenu>
            <template v-else>
              {{ formatVersions(version.game_versions) }}
            </template>
          </div>
          <div class="version__loader">
            <PopoutMenu
              v-if="editMode"
              class="btn btn-transparent hover-icon-only"
              position="bottom"
              direction="right"
            >
              {{ version.loaders.map((x) => $formatCategory(x)).join(', ') }} <EditIcon />
              <template #menu> Edit the platforms here! </template>
            </PopoutMenu>
            <template v-else>
              {{ version.loaders.map((x) => $formatCategory(x)).join(', ') }}
            </template>
          </div>
          <div class="version__downloads">{{ formatNumber(version.downloads) }}</div>
          <div class="version__actions">
            <Button icon-only><DownloadIcon /></Button>
            <Button icon-only><MoreHorizontalIcon /></Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  SaveIcon,
  PlusIcon,
  Button,
  XIcon,
  PopoutMenu,
  OverflowMenu,
  DropdownIcon,
  EditIcon,
  MoreHorizontalIcon,
  Checkbox,
  formatCategory,
  formatNumber,
  DownloadIcon,
  UploadIcon,
  SearchIcon,
  FilterIcon,
} from 'omorphia'
import ImportIcon from '~/assets/images/utils/import.svg'
import VersionTypeIndicator from '~/components/ui/VersionTypeIndicator.vue'

const props = defineProps({
  project: {
    type: Object,
    default() {
      return {}
    },
  },
  versions: {
    type: Array,
    default() {
      return []
    },
  },
  members: {
    type: Array,
    default() {
      return []
    },
  },
  currentMember: {
    type: Object,
    default() {
      return null
    },
  },
})

const data = useNuxtApp()
const metaDescription = computed(
  () =>
    `Download and browse ${props.versions.length} ${
      props.project.title
    } versions. ${data.$formatNumber(props.project.downloads)} total downloads. Last updated ${data
      .$dayjs(props.project.updated)
      .format('MMM D, YYYY')}.`
)

const route = useRoute()
const currentPage = ref(Number(route.query.p ?? 1))
const filteredVersions = computed(() => {
  const selectedGameVersions = getArrayOrString(route.query.g) ?? []
  const selectedLoaders = getArrayOrString(route.query.l) ?? []
  const selectedVersionTypes = getArrayOrString(route.query.c) ?? []

  return props.versions.filter(
    (projectVersion) =>
      (selectedGameVersions.length === 0 ||
        selectedGameVersions.some((gameVersion) =>
          projectVersion.game_versions.includes(gameVersion)
        )) &&
      (selectedLoaders.length === 0 ||
        selectedLoaders.some((loader) => projectVersion.loaders.includes(loader))) &&
      (selectedVersionTypes.length === 0 ||
        selectedVersionTypes.includes(projectVersion.version_type))
  )
})

function switchPage(page) {
  currentPage.value = page

  const router = useRouter()
  const route = useRoute()

  router.replace({
    query: {
      ...route.query,
      p: currentPage.value !== 1 ? currentPage.value : undefined,
    },
  })
}

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

function formatVersions(versions) {
  if (versions.length > 2) {
    return `${versions[0]} + ${versions.length - 2} more`
  }
  return versions.join(', ')
}

const platformOptions = computed(() => {
  return props.versions ? [...new Set(props.versions.flatMap((v) => v.loaders))] : []
})

const gameVersionOptions = computed(() => {
  return props.versions ? [...new Set(props.versions.flatMap((v) => v.game_versions))] : []
})

const editMode = ref(true)
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

.edit-mode .version-table {
  .version-row {
    grid-template-columns: min-content min-content 1fr 1fr 1fr;
    gap: var(--gap-xs);

    .version__checkbox {
      display: unset;
    }

    .version__published,
    .version__actions,
    .version__downloads {
      display: none;
    }

    &.version__header {
      .version__name {
        margin-left: var(--gap-sm);
      }

      .version__game-version,
      .version__loader {
        margin-left: var(--gap-lg);
      }
    }

    .btn-transparent.hover-icon-only {
      svg {
        opacity: 0;
        transition: opacity 0.125s ease-in-out;
      }

      &:hover {
        svg {
          opacity: 1;
        }
      }
    }

    .version__name,
    .version__game-version,
    .version__loader {
      overflow: visible;

      input {
        padding: var(--gap-xs) var(--gap-sm);
        background-color: transparent;
        box-shadow: none;
        min-height: unset;
        flex-basis: unset;
        height: fit-content;
        width: 100%;
        border: 2px solid transparent;

        &:hover,
        &:focus {
          border-color: var(--color-divider);
          background-color: var(--color-bg);
        }

        &:focus {
          border-color: var(--color-brand);
        }
      }
    }
  }
}

.version-table {
  display: flex;
  flex-direction: column;
  gap: var(--gap-md);
  padding: var(--gap-lg);

  .version-row {
    display: grid;
    grid-template-columns: min-content 3fr 3fr 3fr 3fr 2fr auto;
    align-items: center;
    column-gap: var(--gap-sm);

    .version__name,
    .version__number,
    .version__subtitle,
    .version__game-version,
    .version__loader {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .version__name {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .version__checkbox {
      display: none;
    }

    .version__name {
      .version__number {
        font-weight: 500;
      }

      .version__subtitle {
        color: var(--color-text-secondary);
        font-size: var(--font-size-xs);
      }
    }

    .version__actions {
      display: flex;
      gap: var(--gap-sm);
    }

    &.version__header {
      > div {
        justify-content: flex-start;
        font-size: var(--font-size-sm);
        font-weight: bold;
        color: var(--color-contrast);
      }

      .version__type,
      .version__actions {
        visibility: hidden;
      }
    }
  }
}

.filter-section {
  padding-inline: var(--gap-md);

  &:first-child {
    padding-top: var(--gap-md);
  }

  &:last-child {
    padding-bottom: var(--gap-md);
  }

  &:not(:last-child) {
    margin-bottom: var(--gap-md);
  }

  .filter-section__title {
    font-weight: bold;
    margin-bottom: var(--gap-sm);
  }

  .filter-section__options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--gap-sm);
    white-space: nowrap;
  }
}

.edit-alert {
  display: flex;
  justify-content: right;
  margin-bottom: var(--gap-md);
}

.search-row {
  margin-bottom: var(--gap-md);
}
</style>
