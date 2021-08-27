<template>
  <div class="page-container">
    <div class="page-contents">
      <header class="columns">
        <h3 class="column-grow-1">{{ $t('report.file') }}</h3>
        <button
          title="Create"
          class="brand-button column"
          :disabled="!$nuxt.$loading"
          @click="createReport"
        >
          {{ $t('report.create') }}
        </button>
      </header>
      <section class="info">
        <h3>{{ $t('report.itemId') }}</h3>
        <label>
          <span>{{ $t('report.itemIdDescription') }}</span>
          <input v-model="itemId" type="text" placeholder="Enter the item ID" />
        </label>
        <h3>{{ $t('report.type') }}</h3>
        <label>
          <span>{{ $t('report.typeDescription') }}</span>
          <multiselect
            id="item-type"
            v-model="itemType"
            :options="['project', 'version', 'user']"
            :multiple="false"
            :searchable="false"
            :show-no-results="false"
            :show-labels="false"
            placeholder="Choose item type"
          />
        </label>
        <h3>{{ $t('report.category') }}</h3>
        <label>
          <span>{{ $t('report.categoryDescription') }}</span>
          <multiselect
            id="report-type"
            v-model="reportType"
            :options="reportTypes"
            :multiple="false"
            :searchable="false"
            :show-no-results="false"
            :show-labels="false"
            placeholder="Choose report type"
          />
        </label>
      </section>
      <section class="description">
        <h3>
          <label
            for="body"
            title="You can type the description of your report here."
          >
            {{ $t('report.description') }}
          </label>
        </h3>
        <span>
          <span>
            {{ $t('report.descriptionDescription.preLink')
            }}<a
              href="https://guides.github.com/features/mastering-markdown/"
              target="_blank"
              rel="noopener noreferrer"
              >{{ $t('report.descriptionDescription.link') }}</a
            >{{ $t('report.descriptionDescription.postLink') }}
          </span>
        </span>
        <div class="columns">
          <div class="textarea-wrapper">
            <textarea id="body" v-model="body"></textarea>
          </div>
          <div class="markdown-body" v-html="$xss($md.render(body))"></div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  components: {
    Multiselect,
  },
  async asyncData(data) {
    const reportTypes = (await data.$axios.get(`tag/report_type`)).data

    return {
      reportTypes,
    }
  },
  data() {
    return {
      itemId: '',
      itemType: '',
      reportType: '',
      body: '',

      reportTypes: ['aaaa'],
    }
  },
  fetch() {
    if (this.$route.query.id) this.itemId = this.$route.query.id
    if (this.$route.query.t) this.itemType = this.$route.query.t
  },
  methods: {
    async createReport() {
      this.$nuxt.$loading.start()

      try {
        const data = {
          report_type: this.reportType,
          item_id: this.itemId,
          item_type: this.itemType,
          body: this.body,
        }

        await this.$axios.post('report', data, this.$auth.headers)

        await this.$router.replace(`/${this.itemType}/${this.itemId}`)
      } catch (err) {
        this.$notify({
          group: 'main',
          title: this.$i18n.t('error.error'),
          text: err.response.data.description,
          type: 'error',
        })
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      this.$nuxt.$loading.finish()
    },
  },
}
</script>

<style lang="scss" scoped>
.title {
  * {
    display: inline;
  }
  .button {
    margin-left: 1rem;
  }
}

label {
  display: flex;

  span {
    flex: 2;
    padding-right: var(--spacing-card-lg);
  }

  input,
  .multiselect,
  .input-group {
    flex: 3;
    height: fit-content;
  }
}

.textarea-wrapper {
  display: flex;
  flex-direction: column;
  align-items: stretch;

  textarea {
    flex: 1;
    overflow-y: auto;
    resize: none;
    max-width: 100%;
  }
}

.page-contents {
  display: grid;
  grid-template:
    'header       header      header' auto
    'info         info        info' auto
    'description  description description' auto
    'footer       footer      footer' auto
    / 4fr 1fr 4fr;
  column-gap: var(--spacing-card-md);
  row-gap: var(--spacing-card-md);
}

header {
  @extend %card;

  grid-area: header;
  padding: var(--spacing-card-md) var(--spacing-card-lg);

  h3 {
    margin: auto 0;
    color: var(--color-text-dark);
    font-weight: var(--font-weight-extrabold);
  }

  button {
    margin-left: 0.5rem;
  }
}

section {
  @extend %card;

  padding: var(--spacing-card-md) var(--spacing-card-lg);
}

section.info {
  grid-area: info;
}

section.description {
  grid-area: description;

  & > .columns {
    align-items: stretch;
    min-height: 10rem;
    max-height: 40rem;

    & > * {
      flex: 1;
      max-width: 50%;
    }
  }

  .markdown-body {
    overflow-y: auto;
    padding: 0 var(--spacing-card-sm);
  }
}
</style>
