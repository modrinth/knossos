<template>
  <div class="content">
    <h2>Modpacks</h2>
    <div class="columns">
      <div class="column-grow-4">
        <div class="column-grow-2">
          <section id="search-pagination">
            <div class="iconified-input column-grow-2">
              <input
                id="search"
                type="search"
                name="search"
                placeholder="Search modpacks"
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
          <div class="results w-100">
            <SearchResult
              v-for="result in results"
              :id="result.mod_id"
              :key="result.mod_id"
              :author="result.author"
              :name="result.title"
              :description="result.description"
              :latest-version="result.versions[0]"
              :created-at="result.date_created"
              :updated-at="result.date_modified"
              :downloads="result.downloads"
              :icon-url="result.icon_url"
            />
          </div>
        </div>
      </div>
      <section class="column-grow-1">
        <h3>Filters</h3>
      </section>
    </div>
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
      results: [],
    }
  },
  async created() {
    const config = {
      headers: {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }

    try {
      const res = await axios.get('http://localhost:8000/api/v1/mod', config)

      this.results = res.data
    } catch (err) {
      console.error(err)
    }
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
</style>
