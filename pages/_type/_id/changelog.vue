<template>
  <div class="content">
    <Pagination
      :page="currentPage"
      :count="Math.ceil(changelogVersions.length / 50)"
      :link-function="getPageLink"
      @switch-page="switchPage"
    />
    <div class="card">
      <div
        v-for="(version, index) in changelogVersions.slice(
          (currentPage - 1) * 50,
          currentPage * 50
        )"
        :key="version.id"
        class="changelog-item"
      >
        <div
          :class="`changelog-bar ${version.version_type} ${
            version.duplicate ? 'duplicate' : ''
          } ${index === 50 - 1 ? 'last-child' : ''}`"
        ></div>
        <div class="version-wrapper">
          <div class="version-header">
            <div class="version-header-text">
              <IntlFormatted
                message-id="project.changelog.item"
                :values="{
                  publishedAt: new Date(version.date_published),
                }"
              >
                <template #~name>
                  <h2 class="name">
                    <nuxt-link
                      :to="`/${project.project_type}/${
                        project.slug ? project.slug : project.id
                      }/version/${encodeURI(version.displayUrlEnding)}`"
                      v-text="version.name"
                    />
                  </h2>
                </template>
                <template #~publisher>
                  <nuxt-link
                    class="text-link"
                    :to="
                      '/user/' +
                      members.find((x) => x.user.id === version.author_id).user
                        .username
                    "
                    v-text="
                      members.find((x) => x.user.id === version.author_id).user
                        .username
                    "
                  />
                </template>
              </IntlFormatted>
            </div>
            <a
              :href="$parent.findPrimary(version).url"
              class="iconified-button download"
              :title="
                $t('project.changelog.download-button.title', {
                  version: version.name,
                })
              "
            >
              <DownloadIcon aria-hidden="true" />
              {{ $t('project.changelog.download-button.label') }}
            </a>
          </div>
          <div
            v-if="version.changelog && !version.duplicate"
            v-highlightjs
            class="markdown-body"
            v-html="$xss($md.render(version.changelog))"
          />
        </div>
      </div>
    </div>
    <Pagination
      :page="currentPage"
      :count="Math.ceil(changelogVersions.length / 50)"
      :link-function="getPageLink"
      @switch-page="(page) => switchPage(page, true)"
    />
  </div>
</template>
<script>
import DownloadIcon from '~/assets/images/utils/download.svg?inline'
import Pagination from '~/components/ui/Pagination'

export default {
  components: {
    Pagination,
    DownloadIcon,
  },
  props: {
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
  },
  data() {
    return {
      changelogVersions: [],
      currentPage: 1,
    }
  },
  fetch() {
    if (this.$route.query.page)
      this.currentPage = parseInt(this.$route.query.page)

    this.changelogVersions = this.versions.map((version, index) => {
      const nextVersion = this.versions[index + 1]
      if (
        nextVersion &&
        version.changelog &&
        nextVersion.changelog === version.changelog
      ) {
        return { duplicate: true, ...version }
      } else {
        return { duplicate: false, ...version }
      }
    })
  },
  head() {
    const title = this.$t('project.changelog.meta.title', {
      project: this.project.title,
    })

    const description = this.$t('project.changelog.meta.description', {
      project: this.project.title,
      versions: this.versions.length,
    })

    return {
      title,
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: title,
        },
        {
          hid: 'apple-mobile-web-app-title',
          name: 'apple-mobile-web-app-title',
          content: title,
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: description,
        },
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
      ],
    }
  },
  methods: {
    switchPage(page, toTop) {
      this.currentPage = page
      this.$router.replace(this.getPageLink(page))

      if (toTop) {
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50)
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50)
      }
    },
    getPageLink(page) {
      if (page === 1) {
        return this.$route.path
      } else {
        return `${this.$route.path}?page=${this.currentPage}`
      }
    },
  },
  auth: false,
}
</script>

<style lang="scss" scoped>
.changelog-item {
  display: flex;
  margin-bottom: 1rem;
  position: relative;
  padding-left: 1.8rem;

  .changelog-bar {
    --color: var(--color-badge-green-bg);

    &.alpha {
      --color: var(--color-badge-red-bg);
    }

    &.release {
      --color: var(--color-badge-green-bg);
    }

    &.beta {
      --color: var(--color-badge-yellow-bg);
    }

    left: 0;
    top: 0.5rem;
    width: 0.2rem;
    min-width: 0.2rem;
    position: absolute;
    margin: 0 0.4rem;
    border-radius: var(--size-rounded-max);
    min-height: 100%;
    background-color: var(--color);

    &:before {
      content: '';
      width: 1rem;
      height: 1rem;
      position: absolute;
      top: 0;
      left: -0.4rem;
      border-radius: var(--size-rounded-max);
      background-color: var(--color);
    }

    &.duplicate {
      background: linear-gradient(
        to bottom,
        transparent,
        transparent 30%,
        var(--color) 30%,
        var(--color)
      );
      background-size: 100% 10px;
    }

    &.duplicate:not(&.last-child) {
      height: calc(100% + 1.5rem);
    }
  }
}

.version-header {
  display: flex;
  align-items: center;

  .circle {
    min-width: 0.75rem;
    min-height: 0.75rem;
    border-radius: 50%;
    display: inline-block;
    margin-right: 0.25rem;
  }

  .version-header-text {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    white-space: pre-wrap;

    h2 {
      margin: 0;
      font-size: var(--font-size-lg);
    }
  }

  .download {
    display: none;
    margin-left: 0.25rem;

    @media screen and (min-width: 800px) {
      display: flex;
    }
  }
}

.markdown-body {
  margin: 0.5rem 0.5rem 0 0;
}
</style>
