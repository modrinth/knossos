<template>
  <div class="page-container">
    <div class="page-contents">
      <section ref="filters" class="filters">
        <div class="filters-wrapper">
          <section class="filter-group">
            <button class="filter-button-done" @click="toggleFiltersMenu">
              Close
            </button>
            <button class="iconified-button" @click="clearFilters">
              <IconX />
              Clear filters
            </button>
            <h3
              v-if="
                $tag.categories.filter((x) => x.project_type === projectType)
                  .length > 0
              "
            >
              Categories
            </h3>
            <SearchFilter
              v-for="category in $tag.categories.filter(
                (x) => x.project_type === projectType
              )"
              :key="category.name"
              :active-filters="facets"
              :display-name="category.name"
              :facet-name="`categories:${category.name}`"
              :icon="category.icon"
              @toggle="toggleFacet"
            />
            <h3
              v-if="
                $tag.loaders.filter((x) =>
                  x.supported_project_types.includes(projectType)
                ).length > 0
              "
              class="upper-spacing"
            >
              Loaders
            </h3>
            <SearchFilter
              v-for="loader in $tag.loaders.filter((x) =>
                x.supported_project_types.includes(projectType)
              )"
              :key="loader.name"
              :active-filters="facets"
              :display-name="loader.name"
              :facet-name="`categories:${loader.name}`"
              :icon="loader.icon"
              @toggle="toggleFacet"
            />
            <h3 class="upper-spacing">Environments</h3>
            <SearchFilter
              :active-filters="selectedEnvironments"
              display-name="Client"
              facet-name="client"
              @toggle="toggleEnv"
            >
              <IconMonitor />
            </SearchFilter>
            <SearchFilter
              :active-filters="selectedEnvironments"
              display-name="Server"
              facet-name="server"
              @toggle="toggleEnv"
            >
              <IconHardDrive />
            </SearchFilter>
            <h3 class="upper-spacing">Minecraft versions</h3>
            <Checkbox
              v-model="showSnapshots"
              label="Include snapshots"
              style="margin-bottom: 0.5rem"
              :border="false"
            />
          </section>
          <multiselect
            v-model="selectedVersions"
            :options="
              showSnapshots
                ? $tag.gameVersions.map((x) => x.version)
                : $tag.gameVersions
                    .filter((it) => it.version_type === 'release')
                    .map((x) => x.version)
            "
            :multiple="true"
            :searchable="true"
            :show-no-results="false"
            :close-on-select="false"
            :clear-search-on-select="false"
            :show-labels="false"
            :selectable="() => selectedVersions.length <= 6"
            placeholder="Choose versions..."
            @input="onSearchChange(1)"
          ></multiselect>
          <h3 class="upper-spacing">Licenses</h3>
          <Multiselect
            v-model="displayLicense"
            placeholder="Choose licenses..."
            :loading="$tag.licenses.length === 0"
            :options="$tag.licenses"
            track-by="name"
            label="name"
            :searchable="false"
            :close-on-select="true"
            :show-labels="false"
            :allow-empty="true"
            @input="toggleLicense"
          />
        </div>
        <AdsAdvertisement type="square" small-screen="destroy" />
      </section>
      <div class="content">
        <section class="search-nav">
          <div class="iconified-input column-grow-2">
            <label class="hidden" for="search">Search Mods</label>
            <input
              id="search"
              v-model="query"
              type="search"
              name="search"
              placeholder="Search..."
              autocomplete="off"
              @input="onSearchChange(1)"
            />
            <IconSearch />
          </div>
          <div class="labeled-control">
            <p>Sort by</p>
            <Multiselect
              v-model="sortType"
              class="top-margin"
              placeholder="Select one"
              track-by="display"
              label="display"
              :options="sortTypes"
              :searchable="false"
              :close-on-select="true"
              :show-labels="false"
              :allow-empty="false"
              @input="onSearchChange(1)"
            >
              <template slot="singleLabel" slot-scope="{ option }">{{
                option.display
              }}</template>
            </Multiselect>
          </div>
          <div class="labeled-control">
            <p>Show per page</p>
            <Multiselect
              v-model="maxResults"
              class="top-margin"
              placeholder="Select one"
              :options="[5, 10, 15, 20, 50, 100]"
              :searchable="false"
              :close-on-select="true"
              :show-labels="false"
              :allow-empty="false"
              @input="onSearchChange(currentPage)"
            />
          </div>
          <div class="labeled-control mobile-filters-button">
            <p>Filters</p>
            <button class="iconified-button" @click="toggleFiltersMenu">
              Open
            </button>
          </div>
<<<<<<< HEAD
          <Pagination
            :current-page="currentPage"
            :pages="pages"
            @switch-page="onSearchChange"
          />
=======
>>>>>>> 8593d5d1a746b49f041111d958f6509d8063ec67
        </section>
        <pagination
          :current-page="currentPage"
          :pages="pages"
          @switch-page="onSearchChange"
        ></pagination>
        <div class="results column-grow-4">
          <Advertisement
            type="banner"
            small-screen="square"
            ethical-ads-small
            ethical-ads-big
          />
          <div v-if="$fetchState.pending" class="no-results">
            <LogoAnimated />
            <p>Loading...</p>
          </div>
          <div v-else>
<<<<<<< HEAD
            <ProjectCard
              v-for="(result, index) in results"
              :id="result.slug ? result.slug : result.project_id.split('-')[1]"
=======
            <SearchResult
              v-for="result in results"
              :id="result.slug ? result.slug : result.project_id"
>>>>>>> 8593d5d1a746b49f041111d958f6509d8063ec67
              :key="result.project_id"
              :type="result.project_type"
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
              :categories="result.categories"
            />
            <div v-if="results && results.length === 0" class="no-results">
              <p>No results found for your query!</p>
            </div>
          </div>
        </div>
        <pagination
          :current-page="currentPage"
          :pages="pages"
          @switch-page="onSearchChangeToTop"
        ></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  auth: false,
  components: {
    Multiselect,
  },
  data() {
    return {
      query: '',

      displayLicense: '',
      selectedLicense: '',

      showSnapshots: false,
      selectedVersions: [],

      selectedEnvironments: [],

      facets: [],
      results: null,
      pages: [],
      currentPage: 1,

      projectType: 'mod',

      sortTypes: [
        { display: 'Relevance', name: 'relevance' },
        { display: 'Download count', name: 'downloads' },
        { display: 'Follow count', name: 'follows' },
        { display: 'Recently created', name: 'newest' },
        { display: 'Recently updated', name: 'updated' },
      ],
      sortType: { display: 'Relevance', name: 'relevance' },

      maxResults: 20,
    }
  },
  async fetch() {
    if (this.$route.query.q) this.query = this.$route.query.q
    if (this.$route.query.f) {
      const facets = this.$route.query.f.split(',')

      for (const facet of facets) await this.toggleFacet(facet, false)
    }
    if (this.$route.query.v)
      this.selectedVersions = this.$route.query.v.split(',')
    if (this.$route.query.h) this.showSnapshots = this.$route.query.h === 'true'
    if (this.$route.query.e)
      this.selectedEnvironments = this.$route.query.e.split(',')
    if (this.$route.query.s) {
      this.sortType.name = this.$route.query.s

      switch (this.sortType.name) {
        case 'relevance':
          this.sortType.display = 'Relevance'
          break
        case 'downloads':
          this.sortType.display = 'Downloads'
          break
        case 'newest':
          this.sortType.display = 'Recently created'
          break
        case 'updated':
          this.sortType.display = 'Recently updated'
          break
        case 'follows':
          this.sortType.display = 'Follow count'
          break
      }
    }
    if (this.$route.query.m) {
      this.maxResults = this.$route.query.m
    }
    if (this.$route.query.o)
      this.currentPage = Math.ceil(this.$route.query.o / this.maxResults) + 1

    this.projectType = this.$route.name.substring(
      0,
      this.$route.name.length - 1
    )

    await this.onSearchChange(this.currentPage)
  },
<<<<<<< HEAD
  fetchOnServer: false,
  head: {
    title: 'Mods - Modrinth',
    meta: [
      {
        hid: 'apple-mobile-web-app-title',
        name: 'apple-mobile-web-app-title',
        content: 'Mods',
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content: 'Mods',
      },
      {
        hid: 'og:url',
        name: 'og:url',
        content: `https://modrinth.com/mods`,
      },
    ],
  },
=======
>>>>>>> 8593d5d1a746b49f041111d958f6509d8063ec67
  watch: {
    '$route.path': {
      async handler() {
        this.projectType = this.$route.name.substring(
          0,
          this.$route.name.length - 1
        )

        this.results = null
        this.pages = []
        this.currentPage = 1
        this.query = ''
        this.maxResults = 20
        this.sortType = { display: 'Relevance', name: 'relevance' }

        await this.clearFilters()
      },
    },
  },
  methods: {
    async toggleLicense(license) {
      if (this.selectedLicense) {
        const index = this.facets.indexOf(this.selectedLicense)

        this.facets.splice(index, 1)
      }

      if (license) {
        this.selectedLicense = `license:${license.short}`
        this.facets.push(this.selectedLicense)
      }

      await this.onSearchChange(1)
    },
    async clearFilters() {
      for (const facet of [...this.facets]) await this.toggleFacet(facet, true)

      this.displayLicense = null
      this.selectedLicense = null
      this.selectedVersions = []
      this.selectedEnvironments = []
      await this.onSearchChange(1)
    },
    async toggleFacet(elementName, sendRequest) {
      const index = this.facets.indexOf(elementName)
      if (index !== -1) {
        this.facets.splice(index, 1)
      } else {
        this.facets.push(elementName)
      }

      if (!sendRequest) await this.onSearchChange(1)
    },
    async toggleEnv(environment, sendRequest) {
      const index = this.selectedEnvironments.indexOf(environment)
      if (index !== -1) {
        this.selectedEnvironments.splice(index, 1)
      } else {
        this.selectedEnvironments.push(environment)
      }

      if (!sendRequest) await this.onSearchChange(1)
    },
    async onSearchChangeToTop(newPageNumber) {
      if (process.client) window.scrollTo({ top: 0, behavior: 'smooth' })

      await this.onSearchChange(newPageNumber)
    },
    async onSearchChange(newPageNumber) {
      if (this.query === null) return

      try {
        const params = [
          `limit=${this.maxResults}`,
          `index=${this.sortType.name}`,
        ]

        if (this.query.length > 0) {
          params.push(`query=${this.query.replace(/ /g, '+')}`)
        }

        if (
          this.facets.length > 0 ||
          this.selectedVersions.length > 0 ||
          this.selectedEnvironments.length > 0 ||
          this.projectType
        ) {
          let formattedFacets = []
          for (const facet of this.facets) {
            formattedFacets.push([facet])
          }

          if (this.selectedVersions.length > 0) {
            const versionFacets = []
            for (const facet of this.selectedVersions) {
              versionFacets.push('versions:' + facet)
            }
            formattedFacets.push(versionFacets)
          }

          if (this.selectedEnvironments.length > 0) {
            let environmentFacets = []

            const includesClient = this.selectedEnvironments.includes('client')
            const includesServer = this.selectedEnvironments.includes('server')
            if (includesClient && includesServer) {
              environmentFacets = [
                ['client_side:required'],
                ['server_side:required'],
              ]
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

          if (this.projectType)
            formattedFacets.push([`project_type:${this.projectType}`])

          params.push(`facets=${JSON.stringify(formattedFacets)}`)
        }

        const offset = (newPageNumber - 1) * this.maxResults
        if (newPageNumber !== 1) {
          params.push(`offset=${offset}`)
        }

        let url = 'search'

        if (params.length > 0) {
          for (let i = 0; i < params.length; i++) {
            url += i === 0 ? `?${params[i]}` : `&${params[i]}`
          }
        }

        const res = await this.$axios.get(url)
        this.results = res.data.hits

        const pageAmount = Math.ceil(res.data.total_hits / res.data.limit)

        this.currentPage = newPageNumber
        if (pageAmount > 4) {
          if (this.currentPage + 3 >= pageAmount) {
            this.pages = [
              1,
              '-',
              pageAmount - 4,
              pageAmount - 3,
              pageAmount - 2,
              pageAmount - 1,
              pageAmount,
            ]
          } else if (this.currentPage > 4) {
            this.pages = [
              1,
              '-',
              this.currentPage - 1,
              this.currentPage,
              this.currentPage + 1,
              '-',
              pageAmount,
            ]
          } else {
            this.pages = [1, 2, 3, 4, 5, '-', pageAmount]
          }
        } else {
          this.pages = Array.from({ length: pageAmount }, (_, i) => i + 1)
        }

        if (process.client) {
          const queryItems = []

          if (this.query) queryItems.push(`q=${encodeURIComponent(this.query)}`)
          if (offset > 0) queryItems.push(`o=${offset}`)
          if (this.facets.length > 0)
            queryItems.push(`f=${encodeURIComponent(this.facets)}`)
          if (this.selectedVersions.length > 0)
            queryItems.push(`v=${encodeURIComponent(this.selectedVersions)}`)
          if (this.showSnapshots) url += `h=true`
          if (this.selectedEnvironments.length > 0)
            queryItems.push(
              `e=${encodeURIComponent(this.selectedEnvironments)}`
            )
          if (this.sortType.name !== 'relevance')
            queryItems.push(`s=${encodeURIComponent(this.sortType.name)}`)
          if (this.maxResults !== 20)
            queryItems.push(`m=${encodeURIComponent(this.maxResults)}`)

          url = `${this.$route.path}`

          if (queryItems.length > 0) {
            url += `?${queryItems[0]}`

            for (let i = 1; i < queryItems.length; i++) {
              url += `&${queryItems[i]}`
            }
          }

          await this.$router.push({ path: url })
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      }
    },
    toggleFiltersMenu() {
      const currentlyActive = this.$refs.filters.className === 'filters active'
      this.$refs.filters.className = `filters${
        currentlyActive ? '' : ' active'
      }`
      document.body.style.overflow =
        document.body.style.overflow !== 'hidden' ? 'hidden' : 'auto'
    },
  },
}
</script>

<style lang="scss" scoped>
.search-nav {
  @extend %card;

  align-items: center;
  display: flex;
  flex-flow: column;
  padding: var(--spacing-card-sm) var(--spacing-card-md);
  margin-bottom: var(--spacing-card-md);

  .iconified-input {
    margin-left: 1rem;
    width: auto;

    input {
      border-radius: var(--size-rounded-sm);
      max-width: 250px;
    }
  }

  .labeled-control {
    display: flex;
    margin: 0 0 0 1rem;

    p {
      white-space: nowrap;
      margin: auto 0.5rem auto 0;
    }

    &.sort-types {
      min-width: 200px;
    }

    &.max-results {
      max-width: 80px;
    }

    &.mobile-filters-button {
      @media screen and (min-width: 1250px) {
        display: none;
      }
    }
  }

  @media screen and (min-width: 1050px) {
    flex-flow: row;
  }
}

.filters {
  overflow-y: auto;
  position: fixed;
  width: 100vw;
  right: -100vw;
  max-height: 100vh;
  min-width: 15%;
  top: var(--size-navbar-height);
  height: calc(100vh - var(--size-navbar-height));
  transition: right 150ms;
  background-color: var(--color-raised-bg);
  flex-shrink: 0; // Stop shrinking when page contents change
  .filters-wrapper {
    padding: var(--spacing-card-bg) var(--spacing-card-lg);
    margin-bottom: var(--spacing-card-md);
  }
  h3 {
    @extend %new-label;
    margin-top: var(--spacing-card-bg);
  }
  &.active {
    right: 0;
  }
  // Larger screens that don't need to collapse
  @media screen and (min-width: 1250px) {
    top: 0;
    right: auto;
    position: unset;
    height: unset;
    max-height: unset;
    transition: none;
    overflow-y: unset;
    padding-right: 1rem;
    width: 18vw;
    background-color: transparent;
    .filters-wrapper {
      background: var(--color-raised-bg);
      border-radius: var(--size-rounded-card);
      box-shadow: 0 2px 4px 0 rgba(17, 24, 39, 0.1),
        0 -2px 2px 0 rgba(17, 24, 39, 0.05);
    }
  }
  @media screen and (min-width: 1250px) {
    width: 20rem;
  }
}

.filter-group {
  button {
    cursor: pointer;
  }

  .filter-clear-button {
    display: flex;
    justify-content: space-between;
  }

  // Large screens that don't collapse
  @media screen and (min-width: 1250px) {
    .filter-button-done {
      display: none;
    }
  }
}

.no-results {
  text-align: center;
  padding: 20px 0;
  font-size: 1.25rem;
  color: var(--color-text);
  margin-bottom: var(--spacing-card-md);
  background: var(--color-raised-bg);
  border-radius: var(--size-rounded-card);
}

@media screen and (min-width: 1024px) {
  .page-contents {
    max-width: calc(1280px - 8rem) !important;
  }
}
</style>
