<template>
  <div
    :class="{
      'search-page': true,
      'normal-page': true,
    }"
  >
    <Head>
      <Title>Search {{ projectType.display }}s - Modrinth</Title>
    </Head>
    <section class="normal-page__header">
      <GameBanner game="minecraft_java" />
      <h1 class="type-header">{{ formatProjectType(projectType.display) }}s</h1>
      <PageBar class="filter-row">
        <span class="page-bar__title">Sort by</span>
        <div class="sort-by-desktop">
          <button
            v-for="sortMode in sortModes.filter((x) => x.featured || sortType === x.id)"
            :key="`sort-mode-${sortMode.id}`"
            class="button-base nav-button"
            :class="{ 'router-link-exact-active': sortType === sortMode.id }"
            @click="
              () => {
                sortType = sortMode.id
                onSearchChange(1)
              }
            "
          >
            <TopIcon v-if="sortMode.id === 'relevance'" aria-hidden="true" />
            <NewIcon v-else-if="sortMode.id === 'newest'" aria-hidden="true" />
            <HistoryIcon v-else-if="sortMode.id === 'updated'" aria-hidden="true" />
            <HeartIcon v-else-if="sortMode.id === 'follows'" aria-hidden="true" />
            <DownloadIcon v-else-if="sortMode.id === 'downloads'" aria-hidden="true" />
            <UnknownIcon v-else aria-hidden="true" />
            {{ formatMessage(sortTypeNames[sortMode.id]) }}
          </button>
          <OverflowMenu
            class="button-base nav-button"
            position="bottom"
            direction="right"
            :options="
              sortModes
                .filter((x) => !x.featured && sortType !== x.id)
                .map((x) => {
                  return {
                    id: x.id,
                    action: () => {
                      sortType = x.id
                      onSearchChange(1)
                    },
                  }
                })
            "
          >
            <MoreHorizontalIcon />
            <template #downloads>
              <DownloadIcon /> {{ formatMessage(sortTypeNames.downloads) }}
            </template>
            <template #follows> <HeartIcon /> {{ formatMessage(sortTypeNames.follows) }} </template>
          </OverflowMenu>
        </div>
        <div class="sort-by-mobile">
          <OverflowMenu
            class="btn btn-dropdown-animation"
            position="bottom"
            direction="right"
            :options="
              sortModes
                .filter((x) => sortType !== x.id)
                .map((x) => {
                  return {
                    id: x.id,
                    action: () => {
                      sortType = x.id
                      onSearchChange(1)
                    },
                  }
                })
            "
          >
            <TopIcon v-if="sortType === 'relevance'" aria-hidden="true" />
            <NewIcon v-else-if="sortType === 'newest'" aria-hidden="true" />
            <HistoryIcon v-else-if="sortType === 'updated'" aria-hidden="true" />
            <HeartIcon v-else-if="sortType === 'follows'" aria-hidden="true" />
            <DownloadIcon v-else-if="sortType === 'downloads'" aria-hidden="true" />
            <UnknownIcon v-else aria-hidden="true" />
            {{ formatMessage(sortTypeNames[sortType]) }} <DropdownIcon />
            <template #relevance>
              <TopIcon aria-hidden="true" /> {{ formatMessage(sortTypeNames.relevance) }}
            </template>
            <template #newest>
              <NewIcon aria-hidden="true" /> {{ formatMessage(sortTypeNames.newest) }}
            </template>
            <template #updated>
              <HistoryIcon aria-hidden="true" /> {{ formatMessage(sortTypeNames.updated) }}
            </template>
            <template #downloads>
              <DownloadIcon aria-hidden="true" /> {{ formatMessage(sortTypeNames.downloads) }}
            </template>
            <template #follows>
              <HeartIcon aria-hidden="true" /> {{ formatMessage(sortTypeNames.follows) }}
            </template>
          </OverflowMenu>
        </div>
        <template #right>
          <span class="view-options-title page-bar__title">View as</span>
          <div class="page-bar__buttons">
            <button
              v-tooltip="`List`"
              :aria-label="`List`"
              class="btn icon-only"
              :class="{
                'btn-brand-highlight': cosmetics.searchDisplayMode[projectType.id] === 'list',
              }"
              @click="setSearchDisplayMode('list')"
            >
              <ListIcon />
            </button>
            <button
              v-tooltip="`Grid`"
              :aria-label="`Grid`"
              class="btn icon-only"
              :class="{
                'btn-brand-highlight': cosmetics.searchDisplayMode[projectType.id] === 'grid',
              }"
              @click="setSearchDisplayMode('grid')"
            >
              <GridIcon />
            </button>
          </div>
        </template>
      </PageBar>
    </section>
    <aside
      :class="{
        'normal-page__sidebar': true,
        open: sidebarMenuOpen,
      }"
      aria-label="Filters"
    >
      <section class="card filters-card">
        <h2>Filters</h2>
        <div class="filters-search-row">
          <div class="iconified-input">
            <label class="hidden" for="search">Search</label>
            <SearchIcon aria-hidden="true" />
            <input
              id="search"
              v-model="filterQuery"
              type="text"
              name="search"
              :placeholder="`Search filters...`"
              autocomplete="off"
              @input="onSearchChange(1)"
            />
            <Button v-if="filterQuery" @click="() => (filterQuery = '')">
              <XIcon />
            </Button>
          </div>
          <button
            v-if="hasFiltersEnabled"
            v-tooltip="`Reset filters`"
            class="btn icon-only"
            @click="clearFilters"
          >
            <FilterXIcon />
          </button>
        </div>
        <div class="filter-section" :class="{ expanded: !isFilterCollapsed('environment') }">
          <button class="button-base heading" @click="() => toggleFilterCollapse('environment')">
            <h3>Environment</h3>
            <DropdownIcon v-if="!filterQuery" />
          </button>
          <div class="content-wrapper">
            <div class="content">
              <SearchFilter
                v-if="isFilterShown('client')"
                :active-filters="selectedEnvironments"
                display-name="Client"
                facet-name="client"
                @toggle="toggleEnv"
              />
              <SearchFilter
                v-if="isFilterShown('server')"
                :active-filters="selectedEnvironments"
                display-name="Server"
                facet-name="server"
                @toggle="toggleEnv"
              />
            </div>
          </div>
        </div>
        <div
          v-if="primaryLoaders.length + secondaryLoaders.length > 1"
          class="filter-section"
          :class="{ expanded: !isFilterCollapsed('platform') }"
        >
          <button class="button-base heading" @click="() => toggleFilterCollapse('platform')">
            <h3>Platform</h3>
            <DropdownIcon v-if="!filterQuery" />
          </button>
          <div class="content-wrapper">
            <div class="content">
              <SearchFilter
                v-for="loader in primaryLoaders.filter((x) =>
                  isFilterShown(formatCategory(x.name))
                )"
                :key="loader.name"
                ref="loaderFilters"
                :active-filters="orFacets"
                :display-name="formatCategory(loader.name)"
                :facet-name="`categories:'${encodeURIComponent(loader.name)}'`"
                @toggle="toggleOrFacet"
              />
              <template
                v-if="
                  (showAllLoaders && secondaryLoaders.length > 0) ||
                  (filterQuery &&
                    secondaryLoaders.filter((x) => isFilterShown(formatCategory(x.name))))
                "
              >
                <SearchFilter
                  v-for="loader in secondaryLoaders.filter((x) =>
                    isFilterShown(formatCategory(x.name))
                  )"
                  :key="loader.name"
                  ref="loaderFilters"
                  :active-filters="orFacets"
                  :display-name="formatCategory(loader.name)"
                  :facet-name="`categories:'${encodeURIComponent(loader.name)}'`"
                  @toggle="toggleOrFacet"
                />
              </template>
              <ListSelector
                v-if="secondaryLoaders.length > 0 && !filterQuery"
                v-model="showAllLoaders"
                no-active-state
                class="see-more"
              >
                {{ showAllLoaders ? 'See fewer' : 'See more' }}
              </ListSelector>
            </div>
          </div>
        </div>
        <div class="filter-section" :class="{ expanded: !isFilterCollapsed('version') }">
          <button class="button-base heading" @click="() => toggleFilterCollapse('version')">
            <h3>Version</h3>
            <DropdownIcon v-if="!filterQuery" />
          </button>
          <div class="content-wrapper">
            <div class="content">
              <ScrollableMultiSelect>
                <ListSelector
                  v-for="(version, index) in filterQuery
                    ? tags.gameVersions.filter((x) => isFilterShown(x.version))
                    : showSnapshots
                    ? tags.gameVersions
                    : tags.gameVersions.filter((it) => it.version_type === 'release')"
                  :key="`filter-version-${index}`"
                  :model-value="selectedVersions.includes(version)"
                >
                  {{ version.version }}
                </ListSelector>
              </ScrollableMultiSelect>
              <div v-if="!filterQuery" class="toggle-option">
                <label for="show-all-versions"> Show pre-release versions </label>
                <Toggle id="show-all-versions" v-model="showSnapshots" :checked="showSnapshots" />
              </div>
            </div>
          </div>
        </div>

        <template v-for="(categories, header) in categoriesMap">
          <div
            v-if="categories.filter((x) => x.project_type === projectType.actual).length > 0"
            :key="`tag-header-${header}`"
            class="filter-section"
            :class="{ expanded: !isFilterCollapsed(header) }"
          >
            <button class="button-base heading" @click="() => toggleFilterCollapse(header)">
              <h3>{{ formatCategoryHeader(header) }}</h3>
              <DropdownIcon v-if="!filterQuery" />
            </button>
            <div class="content-wrapper">
              <div class="content">
                <SearchFilter
                  v-for="category in categories.filter(
                    (x) =>
                      x.project_type === projectType.actual && isFilterShown(formatCategory(x.name))
                  )"
                  :key="category.name"
                  :active-filters="facets"
                  :display-name="formatCategory(category.name)"
                  :facet-name="`categories:'${encodeURIComponent(category.name)}'`"
                  @toggle="toggleFacet"
                />
              </div>
            </div>
          </div>
        </template>
        <div class="filter-section" :class="{ expanded: !isFilterCollapsed('license') }">
          <button class="button-base heading" @click="() => toggleFilterCollapse('license')">
            <h3>License</h3>
            <DropdownIcon v-if="!filterQuery" />
          </button>
          <div class="content-wrapper">
            <div class="content">
              <ListSelector
                v-if="isFilterShown('open source')"
                v-model="onlyOpenSource"
                @update:model-value="onSearchChange(1)"
              >
                Open source
              </ListSelector>
            </div>
          </div>
        </div>
      </section>
    </aside>
    <section class="normal-page__content">
      <Promotion />
      <div class="search-row">
        <div class="iconified-input">
          <label class="hidden" for="search">Search</label>
          <SearchIcon aria-hidden="true" />
          <input
            id="search"
            v-model="query"
            type="text"
            name="search"
            :placeholder="`Search ${projectType.display}s...`"
            autocomplete="off"
            @input="onSearchChange(1)"
          />
          <Button class="r-btn" v-if="query" @click="() => (query = '')">
            <XIcon />
          </Button>
        </div>
        <Pagination
          :page="currentPage"
          :count="pageCount"
          :link-function="(x) => getSearchUrl(x <= 1 ? 0 : (x - 1) * maxResults)"
          @switch-page="onSearchChange"
        />
      </div>
      <AnimatedLogo v-if="searchLoading && !noLoad" />
      <div
        v-else-if="
          results && results.hits && results.hits.length === 0 && (!searchLoading || noLoad)
        "
        class="no-results"
      >
        <FrownIcon />
        <p v-if="query && hasFiltersEnabled">
          We couldn't find any results matching "{{ query }}" with your filters.
        </p>
        <p v-else-if="query">We couldn't find any results matching "{{ query }}"</p>
        <p v-else-if="hasFiltersEnabled">We couldn't find any results matching your filters.</p>
        <p v-else>We couldn't find any results.</p>
      </div>
      <div v-else class="search-results-container">
        <div
          id="search-results"
          class="project-list"
          :class="
            'display-mode--' +
            (['list', 'grid'].includes(cosmetics.searchDisplayMode[projectType.id])
              ? cosmetics.searchDisplayMode[projectType.id]
              : 'list')
          "
          role="list"
          aria-label="Search results"
        >
          <ProjectCard
            v-for="result in results?.hits"
            :id="result.slug ? result.slug : result.project_id"
            :key="result.project_id"
            :display="cosmetics.searchDisplayMode[projectType.id]"
            :featured-image="result.featured_gallery ? result.featured_gallery : result.gallery[0]"
            :type="getProjectTypeForUrl(result.project_type, result.categories)"
            :author="result.author"
            :name="result.title"
            :description="result.description"
            :created-at="result.date_created"
            :updated-at="result.date_modified"
            :downloads="result.downloads.toString()"
            :follows="result.follows.toString()"
            :icon-url="result.icon_url"
            :client-side="result.client_side"
            :server-side="result.server_side"
            :categories="
              result.display_categories.filter(
                (cat) => !tags.loaders.some((loader) => loader.name === cat)
              )
            "
            :search="true"
            :show-updated-date="sortType !== 'newest'"
            :hide-loaders="['resourcepack', 'datapack'].includes(projectType.id)"
            :color="result.color"
            :from-now="fromNow"
          />
        </div>
      </div>
      <div class="pagination-container">
        <div>
          <span>Show per page</span>
          <DropdownSelect
            v-model="maxResults"
            class="count-dropdown"
            name="Per page"
            :options="maxResultsForView[cosmetics.searchDisplayMode[projectType.id]]"
            @update:model-value="onMaxResultsChange(currentPage)"
          />
        </div>
        <Pagination
          :page="currentPage"
          :count="pageCount"
          :link-function="(x) => getSearchUrl(x <= 1 ? 0 : (x - 1) * maxResults)"
          @switch-page="onSearchChangeToTop"
        />
      </div>
    </section>
  </div>
</template>
<script setup>
import {
  HeartIcon,
  DownloadIcon,
  UnknownIcon,
  Toggle,
  DropdownIcon,
  OverflowMenu,
  Promotion,
  Button,
  DropdownSelect,
  XIcon,
  MoreHorizontalIcon,
  ProjectCard,
  ListSelector,
  Pagination,
  SearchFilter,
  AnimatedLogo,
  SearchIcon,
  GridIcon,
  ListIcon,
  HistoryIcon,
  ScrollableMultiSelect,
  PageBar,
  formatCategory,
  formatCategoryHeader,
  formatProjectType,
} from 'omorphia'

import TopIcon from 'assets/images/utils/arrow-big-up-dash.svg'
import NewIcon from 'assets/images/utils/burst.svg'
import { getProjectTypeForUrl } from '~/helpers/projects.js'
import FrownIcon from '~/assets/images/utils/frown.svg'
import FilterXIcon from '~/assets/images/utils/filter-x.svg'
import GameBanner from '~/components/ui/GameBanner.vue'

const vintl = useVIntl()
const { formatMessage } = vintl

const sortTypeNames = defineMessages({
  relevance: {
    id: 'search.sort.top',
    defaultMessage: 'Top',
  },
  newest: {
    id: 'search.sort.new',
    defaultMessage: 'New',
  },
  updated: {
    id: 'search.sort.updated',
    defaultMessage: 'Updated recently',
  },
  downloads: {
    id: 'search.sort.downloads',
    defaultMessage: 'Most downloaded',
  },
  follows: {
    id: 'search.sort.followers',
    defaultMessage: 'Most followed',
  },
})

const sidebarMenuOpen = ref(false)
const showAllLoaders = ref(false)

const route = useRoute()

const cosmetics = useCosmetics()
const tags = useTags()

const query = ref('')
const filterQuery = ref('')
const facets = ref([])
const orFacets = ref([])
const selectedVersions = ref([])
const onlyOpenSource = ref(false)
const showSnapshots = ref(false)
const selectedEnvironments = ref([])

const sortModes = shallowReadonly([
  { id: 'relevance', featured: true },
  { id: 'newest', featured: true },
  { id: 'updated', featured: true },
  { id: 'follows' },
  { id: 'downloads' },
])

const sortType = ref('relevance')
const maxResults = ref(20)
const currentPage = ref(1)
const projectType = ref({ id: 'mod', display: 'mod', actual: 'mod' })

const ogTitle = computed(
  () => `Search ${projectType.value.display}s${query.value ? ' | ' + query.value : ''}`
)

const hasFiltersEnabled = computed(() => {
  return (
    onlyOpenSource.value ||
    selectedEnvironments.value.length > 0 ||
    selectedVersions.value.length > 0 ||
    facets.value.length > 0 ||
    orFacets.value.length > 0
  )
})

const description = computed(
  () =>
    `Search and browse thousands of Minecraft ${projectType.value.display}s on Modrinth with instant, accurate search results. Our filters help you quickly find the best Minecraft ${projectType.value.display}s.`
)

useSeoMeta({
  description,
  ogTitle,
  ogDescription: description,
})

if (route.query.q) {
  query.value = route.query.q
}
if (route.query.f) {
  facets.value = getArrayOrString(route.query.f)
}
if (route.query.g) {
  orFacets.value = getArrayOrString(route.query.g)
}
if (route.query.v) {
  selectedVersions.value = getArrayOrString(route.query.v)
}
if (route.query.l) {
  onlyOpenSource.value = route.query.l === 'true'
}
if (route.query.h) {
  showSnapshots.value = route.query.h === 'true'
}
if (route.query.e) {
  selectedEnvironments.value = getArrayOrString(route.query.e)
}
if (route.query.s) {
  sortType.value = route.query.s
}

if (route.query.m) {
  maxResults.value = route.query.m
}
if (route.query.o) {
  currentPage.value = Math.ceil(route.query.o / maxResults.value) + 1
}

projectType.value = tags.value.projectTypes.find(
  (x) => x.id === route.path.substring(1, route.path.length - 1)
)

const noLoad = ref(false)
const {
  data: rawResults,
  refresh: refreshSearch,
  pending: searchLoading,
} = useLazyFetch(
  () => {
    const config = useRuntimeConfig()
    const base = process.server ? config.apiBaseUrl : config.public.apiBaseUrl

    const params = [`limit=${maxResults.value}`, `index=${sortType.value}`]

    if (query.value.length > 0) {
      params.push(`query=${encodeURIComponent(query.value.replace(/ /g, '+'))}`)
    }

    if (
      facets.value.length > 0 ||
      orFacets.value.length > 0 ||
      selectedVersions.value.length > 0 ||
      selectedEnvironments.value.length > 0 ||
      projectType.value
    ) {
      let formattedFacets = []
      for (const facet of facets.value) {
        formattedFacets.push([facet])
      }

      // loaders specifier
      if (orFacets.value.length > 0) {
        formattedFacets.push(orFacets.value)
      } else if (projectType.value.id === 'plugin') {
        formattedFacets.push(
          tags.value.loaderData.allPluginLoaders.map((x) => `categories:'${encodeURIComponent(x)}'`)
        )
      } else if (projectType.value.id === 'mod') {
        formattedFacets.push(
          tags.value.loaderData.modLoaders.map((x) => `categories:'${encodeURIComponent(x)}'`)
        )
      } else if (projectType.value.id === 'datapack') {
        formattedFacets.push(
          tags.value.loaderData.dataPackLoaders.map((x) => `categories:'${encodeURIComponent(x)}'`)
        )
      }

      if (selectedVersions.value.length > 0) {
        const versionFacets = []
        for (const facet of selectedVersions.value) {
          versionFacets.push('versions:' + facet)
        }
        formattedFacets.push(versionFacets)
      }

      if (onlyOpenSource.value) {
        formattedFacets.push(['open_source:true'])
      }

      if (selectedEnvironments.value.length > 0) {
        let environmentFacets = []

        const includesClient = selectedEnvironments.value.includes('client')
        const includesServer = selectedEnvironments.value.includes('server')
        if (includesClient && includesServer) {
          environmentFacets = [['client_side:required'], ['server_side:required']]
        } else {
          if (includesClient) {
            environmentFacets = [
              ['client_side:optional', 'client_side:required'],
              ['server_side:optional', 'server_side:unsupported'],
            ]
          }
          if (includesServer) {
            environmentFacets = [
              ['client_side:optional', 'client_side:unsupported'],
              ['server_side:optional', 'server_side:required'],
            ]
          }
        }

        formattedFacets = [...formattedFacets, ...environmentFacets]
      }

      if (projectType.value) {
        formattedFacets.push([`project_type:${projectType.value.actual}`])
      }

      params.push(`facets=${encodeURIComponent(JSON.stringify(formattedFacets))}`)
    }

    const offset = (currentPage.value - 1) * maxResults.value
    if (currentPage.value !== 1) {
      params.push(`offset=${offset}`)
    }

    let url = 'search'

    if (params.length > 0) {
      for (let i = 0; i < params.length; i++) {
        url += i === 0 ? `?${params[i]}` : `&${params[i]}`
      }
    }

    return `${base}${url}`
  },
  {
    transform: (hits) => {
      noLoad.value = false
      return hits
    },
  }
)

const PRIMARY_MOD_LOADERS = ['fabric', 'forge', 'neoforge', 'quilt']

const primaryLoaders = computed(() => {
  return tags.value.loaders.filter((x) => {
    if (projectType.value.id === 'mod') {
      if (!PRIMARY_MOD_LOADERS.includes(x.name)) {
        return false
      } else {
        return tags.value.loaderData.modLoaders.includes(x.name)
      }
    } else if (projectType.value.id === 'plugin') {
      return tags.value.loaderData.pluginLoaders.includes(x.name)
    } else if (projectType.value.id === 'datapack') {
      return tags.value.loaderData.dataPackLoaders.includes(x.name)
    } else {
      return x.supported_project_types.includes(projectType.value.actual)
    }
  })
})

const secondaryLoaders = computed(() => {
  return tags.value.loaders.filter((x) => {
    if (projectType.value.id === 'mod') {
      if (!PRIMARY_MOD_LOADERS.includes(x.name)) {
        return tags.value.loaderData.modLoaders.includes(x.name)
      }
    }
    return false
  })
})

function isFilterShown(keyword) {
  return !filterQuery.value || keyword.toLowerCase().includes(filterQuery.value.toLowerCase())
}

function isFilterCollapsed(heading) {
  const headings = cosmetics.value.searchFiltersCollapsed[projectType.value.id]
  return !!filterQuery.value || headings ? headings[heading] : false
}

function toggleFilterCollapse(heading) {
  const { searchFiltersCollapsed } = cosmetics.value

  if (!searchFiltersCollapsed) {
    cosmetics.value.searchFiltersCollapsed = {
      [projectType.value.id]: {
        [heading]: true,
      },
    }
  } else {
    const headings = searchFiltersCollapsed[projectType.value.id] || {}
    const currentValue = headings[heading]

    searchFiltersCollapsed[projectType.value.id] = {
      ...headings,
      [heading]: currentValue !== undefined ? !currentValue : true,
    }

    saveCosmetics()
  }
}

const results = shallowRef(toRaw(rawResults))
const pageCount = computed(() =>
  results.value ? Math.ceil(results.value.total_hits / results.value.limit) : 1
)

function onSearchChange(newPageNumber) {
  noLoad.value = true

  currentPage.value = newPageNumber

  if (query.value === null) {
    return
  }

  refreshSearch()

  if (process.client) {
    const router = useRouter()
    const obj = getSearchUrl((currentPage.value - 1) * maxResults.value, true)
    router.replace({ path: route.path, query: obj })
  }
}

function getSearchUrl(offset, useObj) {
  const queryItems = []
  const obj = {}

  if (query.value) {
    queryItems.push(`q=${encodeURIComponent(query.value)}`)
    obj.q = query.value
  }
  if (offset > 0) {
    queryItems.push(`o=${offset}`)
    obj.o = offset
  }
  if (facets.value.length > 0) {
    queryItems.push(`f=${encodeURIComponent(facets.value)}`)
    obj.f = facets.value
  }
  if (orFacets.value.length > 0) {
    queryItems.push(`g=${encodeURIComponent(orFacets.value)}`)
    obj.g = orFacets.value
  }
  if (selectedVersions.value.length > 0) {
    queryItems.push(`v=${encodeURIComponent(selectedVersions.value)}`)
    obj.v = selectedVersions.value
  }
  if (onlyOpenSource.value) {
    queryItems.push('l=true')
    obj.l = true
  }
  if (showSnapshots.value) {
    queryItems.push('h=true')
    obj.h = true
  }
  if (selectedEnvironments.value.length > 0) {
    queryItems.push(`e=${encodeURIComponent(selectedEnvironments.value)}`)
    obj.e = selectedEnvironments.value
  }
  if (sortType.value !== 'relevance') {
    queryItems.push(`s=${encodeURIComponent(sortType.value)}`)
    obj.s = sortType.value
  }
  if (maxResults.value !== 20) {
    queryItems.push(`m=${encodeURIComponent(maxResults.value)}`)
    obj.m = maxResults.value
  }

  let url = `${route.path}`

  if (queryItems.length > 0) {
    url += `?${queryItems[0]}`

    for (let i = 1; i < queryItems.length; i++) {
      url += `&${queryItems[i]}`
    }
  }

  return useObj ? obj : url
}

const categoriesMap = computed(() => {
  const categories = {}

  for (const category of sortedCategories()) {
    if (categories[category.header]) {
      categories[category.header].push(category)
    } else {
      categories[category.header] = [category]
    }
  }

  return Object.keys(categories).reduce((obj, key) => {
    obj[key] = categories[key]
    return obj
  }, {})
})

function clearFilters() {
  for (const facet of [...facets.value]) {
    toggleFacet(facet, true)
  }
  for (const facet of [...orFacets.value]) {
    toggleOrFacet(facet, true)
  }

  onlyOpenSource.value = false
  selectedVersions.value = []
  selectedEnvironments.value = []
  onSearchChange(1)
}

function toggleFacet(elementName, doNotSendRequest = false) {
  const index = facets.value.indexOf(elementName)

  if (index !== -1) {
    facets.value.splice(index, 1)
  } else {
    facets.value.push(elementName)
  }

  if (!doNotSendRequest) {
    onSearchChange(1)
  }
}

function toggleOrFacet(elementName, doNotSendRequest) {
  const index = orFacets.value.indexOf(elementName)
  if (index !== -1) {
    orFacets.value.splice(index, 1)
  } else {
    if (elementName === 'categories:purpur') {
      if (!orFacets.value.includes('categories:paper')) {
        orFacets.value.push('categories:paper')
      }
      if (!orFacets.value.includes('categories:spigot')) {
        orFacets.value.push('categories:spigot')
      }
      if (!orFacets.value.includes('categories:bukkit')) {
        orFacets.value.push('categories:bukkit')
      }
    } else if (elementName === 'categories:paper') {
      if (!orFacets.value.includes('categories:spigot')) {
        orFacets.value.push('categories:spigot')
      }
      if (!orFacets.value.includes('categories:bukkit')) {
        orFacets.value.push('categories:bukkit')
      }
    } else if (elementName === 'categories:spigot') {
      if (!orFacets.value.includes('categories:bukkit')) {
        orFacets.value.push('categories:bukkit')
      }
    } else if (elementName === 'categories:waterfall') {
      if (!orFacets.value.includes('categories:bungeecord')) {
        orFacets.value.push('categories:bungeecord')
      }
    }
    orFacets.value.push(elementName)
  }

  if (!doNotSendRequest) {
    onSearchChange(1)
  }
}

function toggleEnv(environment, sendRequest) {
  const index = selectedEnvironments.value.indexOf(environment)
  if (index !== -1) {
    selectedEnvironments.value.splice(index, 1)
  } else {
    selectedEnvironments.value.push(environment)
  }

  if (!sendRequest) {
    onSearchChange(1)
  }
}

function onSearchChangeToTop(newPageNumber) {
  if (process.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  onSearchChange(newPageNumber)
}

function setSearchDisplayMode(mode) {
  cosmetics.value.searchDisplayMode[projectType.value.id] = mode
  saveCosmetics()
  setClosestMaxResults()
}

const previousMaxResults = ref(20)
const maxResultsForView = ref({
  list: [5, 10, 15, 20, 50, 100],
  grid: [6, 12, 18, 24, 48, 96],
  gallery: [6, 10, 16, 20, 50, 100],
})

function onMaxResultsChange(newPageNumber) {
  newPageNumber = Math.max(
    1,
    Math.min(
      Math.floor(newPageNumber / (maxResults.value / previousMaxResults.value)),
      pageCount.value
    )
  )
  previousMaxResults.value = maxResults.value
  onSearchChange(newPageNumber)
}

function setClosestMaxResults() {
  const view = cosmetics.value.searchDisplayMode[projectType.value.id]
  const maxResultsOptions = maxResultsForView.value[view] ?? [20]
  const currentMax = maxResults.value
  if (!maxResultsOptions.includes(currentMax)) {
    maxResults.value = maxResultsOptions.reduce(function (prev, curr) {
      return Math.abs(curr - currentMax) <= Math.abs(prev - currentMax) ? curr : prev
    })
  }
}
</script>

<style lang="scss" scoped>
.normal-page__content {
  // Passthrough children as grid items on mobile
  display: contents;

  @media screen and (min-width: 1024px) {
    display: block;
  }
}

// Move the filters "sidebar" on mobile underneath the search card
.normal-page__sidebar {
  grid-row: 3;

  // Always show on desktop
  @media screen and (min-width: 1024px) {
    display: block;
  }

  // Hide on mobile unless open
  display: none;
  &.open {
    display: block;
  }
}

.no-results {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: var(--gap-lg);

  svg {
    --_size: 5rem;
    width: var(--_size);
    height: var(--_size);
    color: var(--color-brand);

    :deep(circle) {
      fill: var(--color-brand-highlight);
    }
  }

  p {
    color: var(--color-contrast);
    font-size: var(--font-size-xl);
    font-weight: bold;
    max-width: 30rem;
  }

  @media screen and (max-width: 500px) {
    p {
      font-size: var(--font-size-nm);
    }
  }

  @media screen and (max-width: 300px) {
    p {
      font-size: var(--font-size-sm);
    }
  }
}

.loading-logo {
  margin: 2rem;
}

#search-results {
  min-height: 20vh;
}

@media screen and (min-width: 860px) {
  .labeled-control {
    flex-wrap: nowrap !important;
    flex-direction: row !important;
  }
}

@media screen and (min-width: 1024px) {
  .sidebar-menu {
    display: block;
    margin-top: 0;
  }

  .sidebar-menu-close-button {
    display: none;
  }

  .labeled-control {
    flex-wrap: wrap !important;
    flex-direction: column !important;
  }
}

@media screen and (min-width: 1100px) {
  .labeled-control {
    flex-wrap: nowrap !important;
    flex-direction: row !important;
  }
}

h1 {
  margin-block: var(--gap-sm) var(--gap-lg);
  font-size: 2em;
  line-height: 1em;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: var(--gap-lg);
  flex-wrap: wrap;

  .count-dropdown {
    width: 5.5rem;
  }

  .animated-dropdown {
    margin-inline: var(--gap-sm);
  }
}

.type-header {
  margin-top: 1rem;
}

.filters-card {
  .card-title {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;

    h2 {
      margin: 0;
    }
  }

  .iconified-input {
    input {
      border: var(--button-border-width) solid var(--color-divider);
      box-shadow: none;
    }
  }
  h2 {
    font-size: var(--font-size-lg) !important;
  }
}

.filter-section {
  display: flex;
  flex-direction: column;
  transition: padding-bottom 0.125s ease-in-out;

  .heading {
    display: flex;
    background-color: transparent;
    padding: 0;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-block: 0.5rem 0;

    h3 {
      font-size: var(--font-size-nm);
    }

    svg {
      width: 1.25rem;
      height: 1.25rem;
      transition: rotate 0.25s ease-in-out;
    }
  }

  .content-wrapper {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.25s ease-in-out;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: var(--font-size-sm);
    overflow: hidden;

    .see-more {
      color: #737d80;
    }

    > :last-child {
      margin-bottom: 0.5rem;
    }
  }

  &.expanded {
    .heading svg {
      rotate: 180deg;
    }

    .content-wrapper {
      grid-template-rows: 1fr;
    }
  }

  &:not(.expanded) {
    padding-bottom: 0.5rem;
  }

  &:not(:last-child):not(:empty) {
    border-bottom: 1px solid var(--color-divider);
  }

  .toggle-option {
    margin-inline: 0.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    label {
      flex-grow: 1;
      font-weight: 600;
    }

    :not(:focus-visible) {
      box-shadow: none;
    }
  }
}

.filters-search-row {
  display: flex;
  gap: var(--gap-sm);

  input {
    min-height: 36px;
    height: 36px;
  }

  .iconified-input {
    svg {
      width: 1rem;
      height: 1rem;
    }
  }
}

.sort-by-desktop {
  display: contents;
}

.sort-by-mobile {
  display: none;
}

.page-bar {
  @media screen and (max-width: 750px) {
    .sort-by-desktop {
      display: none;
    }

    .sort-by-mobile {
      display: contents;
    }
  }

  @media screen and (max-width: 600px) {
    padding-bottom: var(--gap-xs);

    .page-bar__title {
      display: none;
    }
  }
}
</style>
