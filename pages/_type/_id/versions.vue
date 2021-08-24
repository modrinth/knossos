<template>
  <div>
    <nuxt-link
      v-if="currentMember"
      to="version/create"
      class="iconified-button new-version"
    >
      <UploadIcon />
      Upload
    </nuxt-link>
    <table>
      <thead>
        <tr>
          <th></th>
          <th>{{ $t('version.version') }}</th>
          <th>Supports</th>
          <th>Stats</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="version in versions" :key="version.id">
          <td>
            <a
              :href="$parent.findPrimary(version).url"
              class="download-button"
              @click.prevent="
                $parent.downloadFile(
                  $parent.findPrimary(version).hashes.sha1,
                  $parent.findPrimary(version).url
                )
              "
            >
              <DownloadIcon />
            </a>
          </td>
          <td>
            <div class="info">
              <div class="top">
                <nuxt-link
                  :to="`/${project.project_type}/${
                    project.slug ? project.slug : project.id
                  }/version/${encodeURIComponent(version.version_number)}`"
                >
                  {{ version.name }}
                </nuxt-link>
              </div>
              <div class="bottom">
                <VersionBadge :type="version.version_type" />
                <span class="divider" />
                <span class="version_number">{{ version.version_number }}</span>
              </div>
            </div>
          </td>
          <td>
            <p>
              {{
                version.loaders
                  .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
                  .join(', ')
              }}
            </p>
            <p>{{ version.game_versions[version.game_versions.length - 1] }}</p>
          </td>
          <td>
            <p>
              <span>{{ $parent.formatNumber(version.downloads) }}</span>
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
</template>
<script>
import UploadIcon from '~/assets/images/utils/upload.svg?inline'
import DownloadIcon from '~/assets/images/utils/download.svg?inline'
import VersionBadge from '~/components/ui/VersionBadge'

export default {
  components: {
    UploadIcon,
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
}
</script>

<style lang="scss" scoped>
.new-version {
  max-width: 4.25rem;
}

table {
  border-collapse: separate;
  border-spacing: 0 0.75rem;

  th {
    text-align: left;
    font-size: var(--font-size-md);
  }

  tr {
    font-size: var(--font-size-sm);
    td:nth-child(2) {
      padding-right: 2rem;
      min-width: 13.875rem;
      .top {
        font-weight: bold;
      }
      .bottom {
        @extend %row;
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
    }
    td:nth-child(3) {
      width: 100%;
      p {
        margin: 0.25rem 0;
      }
    }
    td:nth-child(4) {
      min-width: 12rem;
      p {
        margin: 0.25rem 0;
        span {
          font-weight: bold;
        }
      }
    }
  }
}
</style>
