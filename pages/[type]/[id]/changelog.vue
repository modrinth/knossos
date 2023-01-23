<template>
  <div class="content">
<!--    <VersionFilterControl-->
<!--      class="card"-->
<!--      :versions="versions"-->
<!--      @updateVersions="updateVersions"-->
<!--    />-->
    <div class="card" v-html="versionHtml"></div>
  </div>
</template>
<script>
import DownloadIcon from '~/assets/images/utils/download.svg'
import VersionFilterControl from '~/components/ui/VersionFilterControl'

export default {
  components: {
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
  head() {
    const title = `${this.project.title} - Changelog`
    const description = `Explore the changelog of ${this.project.title}'s ${this.versions.length} versions.`

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
  computed: {
    versionHtml() {
      let string = ''

      for (const version of this.filteredVersions) {
        let teamMember = this.members.find((x) => x.user.id === version.author_id)
        //todo: add back download icon and nuxt link.. somehow and highlighting
        string += `
<div class="changelog-item">
  <div class="changelog-bar ${version.version_type} ${ version.duplicate ? 'duplicate' : ''}"></div>
    <div class="version-wrapper">
      <div class="version-header">
        <div class="version-header-text">
          <h2 class="name">
            <a href="/${this.project.project_type}/${this.project.slug ? this.project.slug : this.project.id}/version/${encodeURI(version.displayUrlEnding)}">
              ${version.name}
            </a>
          </h2>
          ${teamMember ? `<span>
            by
            <a
              class="text-link"
              href="${'/user/' + teamMember.user.username}"
            >
              ${teamMember.user.username}
            </a>
          </span>` : ''}
          <span>
            on
            ${this.$dayjs(version.date_published).format('MMM D, YYYY')}
          </span>
        </div>
        <a
          href="${this.$findPrimary(this.project, version).url}"
          class="iconified-button download"
          title="Download ${version.name}"
        >
          Download
        </a>
      </div>
      ${version.changelog && !version.duplicate ? `<div
        class="markdown-body"
      >
        ${this.$xss(this.$md(version.changelog))}
      </div>` : ''}
  </div>
</div>
        `
      }

      return string
    }
  },
  auth: false,
}
</script>

<style lang="scss">
.changelog-item {
  display: block;
  margin-bottom: 1rem;
  position: relative;
  padding-left: 1.8rem;

  .changelog-bar {
    --color: var(--color-special-green);

    &.alpha {
      --color: var(--color-special-red);
    }

    &.release {
      --color: var(--color-special-green);
    }

    &.beta {
      --color: var(--color-special-orange);
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

    &.duplicate {
      height: calc(100% + 1.5rem);
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

    .markdown-body {
      margin: 0.5rem 0.5rem 0 0;
    }
  }
}
</style>
