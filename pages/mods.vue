<template>
  <div class="columns">
    <div class="content column-grow-4">
      <h2>Mods</h2>
      <section id="search-pagination">
        <div class="iconified-input column-grow-2">
          <input
            id="search"
            v-model="query"
            type="search"
            name="search"
            placeholder="Search mods"
            @input="onSearchChange"
          />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <div class="pagination column-grow-1 columns paginates">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>...</p>
          <p>10</p>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </section>
      <div class="results column-grow-4">
        <SearchResult
          v-for="result in results"
          :id="result.mod_id"
          :key="result.mod_id"
          :author="result.author"
          :name="result.title"
          :description="result.description"
          :latest-version="result.versions[0]"
          :created-at="result.date_created.substring(0, 10)"
          :updated-at="result.date_modified.substring(0, 10)"
          :downloads="formatNumber(result.downloads)"
          :icon-url="result.icon_url"
          :author-url="result.author_url"
          :page-url="result.page_url"
          :categories="result.categories"
        />
      </div>
    </div>
    <section class="filters column-grow-1">
      <h3>Filters</h3>
      <a>Test</a>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import SearchResult from '@/components/SearchResult'

export default {
  components: {
    SearchResult,
  },
  data() {
    return {
      query: '',
      results: [],
    }
  },
  async created() {
    const config = {
      headers: {
        Accept: 'application/json',
      },
    }

    try {
      const res = await axios.get('https://api.modrinth.com/api/v1/mod', config)

      this.results = res.data
    } catch (err) {
      console.error(err)
    }
  },
  methods: {
    async onSearchChange() {
      const config = {
        headers: {
          Accept: 'application/json',
        },
      }

      try {
        const res = await axios.get(
          `https://api.modrinth.com/api/v1/mod?query=${this.query}`,
          config
        )

        this.results = res.data
      } catch (err) {
        console.error(err)
      }
    },
    formatNumber(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
  },
}
</script>

<style lang="scss">
#search-pagination {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.paginates {
  align-items: center;
}

.paginates p {
  margin-left: 5px;
  margin-right: 5px;
}

.content {
  min-height: 100vh;
}

.filters {
  background-color: var(--color-bg);
  border-left: 1px solid var(--color-grey-2);
  top: 0;
  position: -webkit-sticky;
  position: sticky;
  max-height: 100vh;
  min-width: 15%;
}
</style>
