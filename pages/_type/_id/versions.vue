<template>
  <div class="content">
    <div v-if="currentMember" class="card header-buttons">
      <nuxt-link to="version/create" class="brand-button iconified-button">
        <PlusIcon />
        {{ $t('project.versions.actions.create') }}
      </nuxt-link>
    </div>
    <Pagination
      :page="currentPage"
      :count="Math.ceil(versions.length / 50)"
      :link-function="getPageLink"
      @switch-page="switchPage"
    />
    <div v-if="versions.length > 0" class="card">
      <table>
        <thead>
          <tr>
            <th role="presentation"></th>
            <th>{{ $t('project.versions.column.version') }}</th>
            <th>{{ $t('project.versions.column.supports') }}</th>
            <th>{{ $t('project.versions.column.stats') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="version in versions.slice(
              (currentPage - 1) * 50,
              currentPage * 50
            )"
            :key="version.id"
          >
            <td>
              <a
                v-tooltip="
                  $t('project.versions.download.tooltip', {
                    fileName: $parent.findPrimary(version).filename,
                    size: $formatBytes($parent.findPrimary(version).size),
                  })
                "
                :href="$parent.findPrimary(version).url"
                class="download-button"
                :class="version.version_type"
                :title="
                  $t('project.versions.download.title', {
                    versionName: version.name,
                  })
                "
              >
                <DownloadIcon aria-hidden="true" />
              </a>
            </td>
            <td>
              <div class="info">
                <div class="top">
                  <nuxt-link
                    :to="`/${project.project_type}/${
                      project.slug ? project.slug : project.id
                    }/version/${encodeURI(version.displayUrlEnding)}`"
                  >
                    {{ version.name }}
                  </nuxt-link>
                </div>
                <div class="bottom">
                  <VersionBadge
                    v-if="version.version_type === 'release'"
                    :type="$t('release-channel.release')"
                    color="green"
                  />
                  <VersionBadge
                    v-else-if="version.version_type === 'beta'"
                    :type="$t('release-channel.beta')"
                    color="yellow"
                  />
                  <VersionBadge
                    v-else-if="version.version_type === 'alpha'"
                    :type="$t('release-channel.alpha')"
                    color="red"
                  />
                  <span class="divider" />
                  <span class="version_number">{{
                    version.version_number
                  }}</span>
                </div>
                <div class="mobile-info">
                  <p>
                    {{
                      $t('project.versions.supports', {
                        loaders: $fmt.list(
                          version.loaders.map((x) => $formatLoader(x))
                        ),
                        versions: $formatVersion(version.game_versions),
                      })
                    }}
                  </p>
                  <p></p>
                  <p>
                    <i18n-formatted
                      message-id="project.versions.downloads"
                      :values="
                        $deunionize(
                          $fmt.compactNumber(version.downloads),
                          'counter',
                          'count'
                        )
                      "
                    >
                      <strong v-i18n:wrap="'strong'" />
                    </i18n-formatted>
                  </p>
                  <p>
                    <i18n-formatted
                      message-id="project.versions.published"
                      :values="{
                        publishedAt: new Date(version.date_published),
                      }"
                    >
                      <strong v-i18n:wrap="'strong'" />
                    </i18n-formatted>
                  </p>
                </div>
              </div>
            </td>
            <td>
              <p>
                {{ $fmt.list(version.loaders.map((x) => $formatLoader(x))) }}
              </p>
              <p>{{ $formatVersion(version.game_versions) }}</p>
            </td>
            <td>
              <p>
                <i18n-formatted
                  message-id="project.versions.downloads"
                  :values="
                    $deunionize(
                      $fmt.compactNumber(version.downloads),
                      'counter',
                      'count'
                    )
                  "
                >
                  <span v-i18n:wrap="'strong'" />
                </i18n-formatted>
              </p>
              <p>
                <i18n-formatted
                  message-id="project.versions.published"
                  :values="{ publishedAt: new Date(version.date_published) }"
                >
                  <span v-i18n:wrap="'strong'" />
                </i18n-formatted>
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Pagination
      :page="currentPage"
      :count="Math.ceil(versions.length / 50)"
      :link-function="getPageLink"
      @switch-page="(page) => switchPage(page, true)"
    />
  </div>
</template>
<script>
import PlusIcon from '~/assets/images/utils/plus.svg?inline'
import DownloadIcon from '~/assets/images/utils/download.svg?inline'
import VersionBadge from '~/components/ui/Badge'
import Pagination from '~/components/ui/Pagination'

export default {
  components: {
    Pagination,
    PlusIcon,
    DownloadIcon,
    VersionBadge,
  },
  auth: false,
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
    currentMember: {
      type: Object,
      default() {
        return null
      },
    },
  },
  data() {
    return {
      currentPage: 1,
    }
  },
  fetch() {
    if (this.$route.query.page)
      this.currentPage = parseInt(this.$route.query.page)
  },
  head() {
    console.log(this.project)
    const title = this.$t('project.versions.meta.title', {
      project: this.project.title,
    })
    const description = this.$t('project.versions.meta.description', {
      versions: this.versions.length,
      project: this.project.title,
      ...this.$deunionize(
        this.$fmt.compactNumber(this.project.downloads),
        'downloadsCounter',
        'downloads'
      ),
      lastUpdatedAt: new Date(this.versions[0]?.date_published ?? 0),
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
}
</script>

<style lang="scss" scoped>
table {
  border-collapse: separate;
  border-spacing: 0 0.75rem;

  th {
    text-align: left;
    font-size: var(--font-size-md);

    &:nth-child(3),
    &:nth-child(4) {
      display: none;
    }
  }

  tr {
    td:nth-child(2) {
      padding-right: 2rem;
      min-width: 16rem;
      .top {
        font-weight: bold;
      }
      .bottom {
        display: flex;
        flex-direction: row;
        align-items: center;
        text-overflow: ellipsis;
        margin-top: 0.25rem;

        .divider {
          width: 0.25rem;
          height: 0.25rem;
          border-radius: 50%;
          display: inline-block;
          margin: 0 0.25rem;
          background-color: var(--color-text);
        }
      }

      .mobile-info {
        p {
          margin: 0.25rem 0 0;
        }
      }
    }
    td:nth-child(3) {
      display: none;
      width: 100%;
      p {
        margin: 0.25rem 0;
      }
    }
    td:nth-child(4) {
      display: none;
      min-width: 15rem;
      p {
        margin: 0.25rem 0;
        span {
          font-weight: bold;
        }
      }
    }
  }
}

@media screen and (min-width: 1024px) {
  table {
    tr {
      th:nth-child(3),
      td:nth-child(3),
      th:nth-child(4),
      td:nth-child(4) {
        display: table-cell;
      }
    }
  }

  .mobile-info {
    display: none;
  }
}

.header-buttons {
  display: flex;
  justify-content: right;
}
</style>
