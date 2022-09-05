<template>
  <div class="content">
    <VersionFilterControl
      class="card"
      :versions="versions"
      @updateVersions="updateVersions"
    />
    <div class="card">
      <div
        v-for="version in filteredVersions"
        :key="version.id"
        class="changelog-item"
      >
        <div :class="'changelog-bar ' + version.version_type"></div>
        <div class="version-wrapper">
          <div class="version-header">
            <div class="version-header-text">
              <h2 class="name">
                <nuxt-link
                  :to="`/${project.project_type}/${
                    project.slug ? project.slug : project.id
                  }/version/${encodeURI(version.displayUrlEnding)}`"
                  >{{ version.name }}</nuxt-link
                >
              </h2>
              <span v-if="members.find((x) => x.user.id === version.author_id)">
                by
                <nuxt-link
                  class="text-link"
                  :to="
                    '/user/' +
                    members.find((x) => x.user.id === version.author_id).user
                      .username
                  "
                  >{{
                    members.find((x) => x.user.id === version.author_id).user
                      .username
                  }}</nuxt-link
                >
              </span>
              <span>
                on
                {{ $dayjs(version.date_published).format('MMM D, YYYY') }}</span
              >
            </div>
            <a
              :href="$parent.findPrimary(version).url"
              class="iconified-button download"
              :title="`Download ${version.name}`"
            >
              <DownloadIcon aria-hidden="true" />
              Download
            </a>
          </div>
          <div
            v-highlightjs
            class="markdown-body"
            v-html="
              version.changelog
                ? $xss($md.render(version.changelog))
                : 'No changelog specified.'
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DownloadIcon from '~/assets/images/utils/download.svg?inline'
import VersionFilterControl from '~/components/ui/VersionFilterControl'

export default {
  components: {
    DownloadIcon,
    VersionFilterControl,
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
      filteredVersions: this.versions,
    }
  },
  auth: false,
  methods: {
    updateVersions(updatedVersions) {
      this.filteredVersions = updatedVersions
    },
  },
}
</script>

<style lang="scss" scoped>
.changelog-item {
  display: flex;
  margin-bottom: 1rem;
  position: relative;
  padding-left: 1.8rem;

  .changelog-bar {
    left: 0;
    top: 0.5rem;
    width: 0.2rem;
    min-width: 0.2rem;
    position: absolute;
    margin: 0 0.4rem;
    border-radius: var(--size-rounded-max);
    min-height: 100%;

    &:before {
      content: '';
      width: 1rem;
      height: 1rem;
      position: absolute;
      top: 0;
      left: -0.4rem;
      border-radius: var(--size-rounded-max);
    }

    &.alpha {
      background-color: var(--color-badge-red-bg);

      &:before {
        background-color: var(--color-badge-red-bg);
      }
    }

    &.release {
      background-color: var(--color-badge-green-bg);

      &:before {
        background-color: var(--color-badge-green-bg);
      }
    }

    &.beta {
      background-color: var(--color-badge-yellow-bg);

      &:before {
        background-color: var(--color-badge-yellow-bg);
      }
    }
  }
}

.version-header {
  display: flex;
  align-items: center;
  margin-top: 0.2rem;

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

    h2 {
      margin: 0;
      font-size: var(--font-size-lg);
    }

    h2,
    span {
      padding-right: 0.25rem;
    }
  }

  .download {
    display: none;

    @media screen and (min-width: 800px) {
      display: flex;
    }
  }
}

.markdown-body {
  margin: 0.5rem 0.5rem 0 0;
}
</style>
