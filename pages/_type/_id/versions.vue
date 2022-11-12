<template>
  <div class="content">
    <div v-if="currentMember" class="card header-buttons">
      <nuxt-link to="version/create" class="brand-button iconified-button">
        <PlusIcon />
        Create a version
      </nuxt-link>
    </div>
    <VersionFilterControl
      class="card"
      :versions="versions"
      @updateVersions="updateVersions"
    />
    <div v-if="versions.length > 0" class="card">
      <table>
        <thead>
          <tr>
            <th role="presentation"></th>
            <th>Version</th>
            <th>Supports</th>
            <th>Stats</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="version in filteredVersions"
            :key="version.id"
            class="version-row button-transparent"
            @click="
              $router.push(
                `/${project.project_type}/${
                  project.slug ? project.slug : project.id
                }/version/${encodeURI(version.displayUrlEnding)}`
              )
            "
          >
            <td>
              <a
                v-tooltip="
                  $parent.findPrimary(version).filename +
                  ' (' +
                  $formatBytes($parent.findPrimary(version).size) +
                  ')'
                "
                :href="$parent.findPrimary(version).url"
                class="download-button"
                :class="version.version_type"
                :title="`Download ${version.name}`"
              >
                <DownloadIcon aria-hidden="true" />
              </a>
            </td>
            <td class="last-on-mobile">
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
                    type="release"
                    color="green"
                  />
                  <VersionBadge
                    v-else-if="version.version_type === 'beta'"
                    type="beta"
                    color="yellow"
                  />
                  <VersionBadge
                    v-else-if="version.version_type === 'alpha'"
                    type="alpha"
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
                      version.loaders
                        .map((x) => $formatCategory(x))
                        .join(', ') +
                      ' ' +
                      $formatVersion(version.game_versions)
                    }}
                  </p>
                  <p></p>
                  <p>
                    <strong>{{ $formatNumber(version.downloads) }}</strong>
                    downloads
                  </p>
                  <p>
                    Published on
                    <strong>{{
                      $dayjs(version.date_published).format('MMM D, YYYY')
                    }}</strong>
                  </p>
                </div>
              </div>
            </td>
            <td>
              <p>
                {{ version.loaders.map((x) => $formatCategory(x)).join(', ') }}
              </p>
              <p>{{ $formatVersion(version.game_versions) }}</p>
            </td>
            <td>
              <p>
                <span>{{ $formatNumber(version.downloads) }}</span>
                downloads
              </p>
              <p>
                Published on
                <span>{{
                  $dayjs(version.date_published).format('MMM D, YYYY')
                }}</span>
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import PlusIcon from '~/assets/images/utils/plus.svg?inline'
import DownloadIcon from '~/assets/images/utils/download.svg?inline'
import VersionBadge from '~/components/ui/Badge'
import VersionFilterControl from '~/components/ui/VersionFilterControl'

export default {
  components: {
    PlusIcon,
    DownloadIcon,
    VersionBadge,
    VersionFilterControl,
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
      filteredVersions: this.versions,
    }
  },
  fetch() {
    if (this.$route.query.page)
      this.currentPage = parseInt(this.$route.query.page)
  },
  head() {
    const title = `${this.project.title} - Versions`
    const description = `Download and browse ${this.versions.length} ${
      this.project.title
    } versions. ${this.$formatNumber(
      this.project.downloads
    )} total downloads. Last updated ${this.$dayjs(
      this.versions[0] ? this.versions[0].date_published : null
    ).format('MMM D, YYYY')}.`

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
    updateVersions(updatedVersions) {
      this.filteredVersions = updatedVersions
    },
  },
}
</script>

<style lang="scss" scoped>
table {
  border-collapse: separate;
  border-spacing: 0 0;

  th {
    text-align: left;
    font-size: var(--font-size-md);
    padding-block: var(--spacing-card-md);
    color: var(--color-text-dark);

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

  .version-row .last-on-mobile {
    border-top-right-radius: unset;
    border-bottom-right-radius: unset;
    padding-right: unset;
  }
}

.header-buttons {
  display: flex;
  justify-content: right;
}

.version-row {
  td {
    padding-block: var(--spacing-card-sm);
  }

  td:first-child {
    border-top-left-radius: var(--size-rounded-card);
    border-bottom-left-radius: var(--size-rounded-card);
    padding-left: var(--spacing-card-sm);
  }

  .last-on-mobile,
  td:last-child {
    border-top-right-radius: var(--size-rounded-card);
    border-bottom-right-radius: var(--size-rounded-card);
    padding-right: var(--spacing-card-sm);
  }
}
</style>
