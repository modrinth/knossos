<template>
  <div v-if="version" class="version-page">
    <ModalConfirm
      ref="modal_confirm"
      title="Are you sure you want to delete this version?"
      description="This will remove this version forever (like really forever)."
      :has-to-type="false"
      proceed-label="Delete"
      @proceed="deleteVersion()"
    />
    <ModalReport
      ref="modal_version_report"
      :item-id="version.id"
      item-type="version"
    />
    <div class="version-page__title card">
      <div class="version-header">
        <h2>{{ version.name }}</h2>
        <div v-if="version.featured" class="featured">
          <StarIcon aria-hidden="true" />
          Featured
        </div>
        <div v-else-if="featuredVersions.find((x) => x.id === version.id)">
          <StarIcon aria-hidden="true" />
          Auto-featured
        </div>
      </div>
      <div class="button-group">
        <a
          v-if="primaryFile"
          v-tooltip="
            primaryFile.filename + ' (' + $formatBytes(primaryFile.size) + ')'
          "
          :href="primaryFile.url"
          class="iconified-button brand-button"
          :title="`Download ${primaryFile.filename}`"
        >
          <DownloadIcon aria-hidden="true" />
          Download
        </a>
        <button
          class="iconified-button"
          @click="$refs.modal_version_report.show()"
        >
          <ReportIcon aria-hidden="true" />
          Report
        </button>
        <nuxt-link
          v-if="currentMember"
          class="action iconified-button"
          :to="`/${project.project_type}/${
            project.slug ? project.slug : project.id
          }/version/${encodeURI(version.displayUrlEnding)}/edit`"
        >
          <EditIcon aria-hidden="true" />
          Edit
        </nuxt-link>
        <button
          v-if="currentMember"
          class="iconified-button danger-button"
          @click="$refs.modal_confirm.show()"
        >
          <TrashIcon aria-hidden="true" />
          Delete
        </button>
      </div>
    </div>
    <div class="version-page__changelog card">
      <h3>Changelog</h3>
      <div
        v-highlightjs
        class="markdown-body"
        v-html="
          version.changelog
            ? $xss($md.render(version.changelog))
            : 'No changelog specified.'
        "
      ></div>
    </div>
    <div
      v-if="version.dependencies.length > 0"
      class="version-page__dependencies card"
    >
      <h3>Dependencies</h3>
      <div
        v-for="(dependency, index) in version.dependencies.filter(
          (x) => !x.file_name
        )"
        :key="index"
        class="dependency button-transparent"
        @click="$router.push(dependency.link)"
      >
        <Avatar
          :src="dependency.project ? dependency.project.icon_url : null"
          alt="dependency-icon"
          size="sm"
        />
        <nuxt-link :to="dependency.link" class="info">
          <span class="project-title">
            {{
              dependency.project ? dependency.project.title : 'Unknown Project'
            }}
          </span>
          <span v-if="dependency.version">
            Version {{ dependency.version.version_number }} is
            {{ dependency.dependency_type }}
          </span>
          <span v-else class="dep-type">
            {{ dependency.dependency_type }}
          </span>
        </nuxt-link>
      </div>
      <div
        v-for="(dependency, index) in version.dependencies.filter(
          (x) => x.file_name
        )"
        :key="index"
        class="dependency"
      >
        <Avatar :src="null" alt="dependency-icon" size="sm" />
        <div class="info">
          <span class="project-title">
            {{ dependency.file_name }}
          </span>
          <span>Added via overrides</span>
        </div>
      </div>
    </div>
    <div class="version-page__files card">
      <h3>Files</h3>
      <div
        v-for="file in version.files"
        :key="file.hashes.sha1"
        :class="{
          file: true,
          primary: primaryFile.hashes.sha1 === file.hashes.sha1,
        }"
      >
        <FileIcon />
        <span>
          <strong>{{ file.filename }}</strong>
          <span class="file-size">({{ $formatBytes(file.size) }})</span>
        </span>
        <a
          :href="file.url"
          class="iconified-button raised-button"
          :title="`Download ${file.filename}`"
          tabindex="0"
        >
          <DownloadIcon />
          Download
        </a>
      </div>
    </div>
    <div class="version-page__metadata">
      <div class="card">
        <h3>Metadata</h3>
        <div>
          <h4>Release channel</h4>
          <VersionBadge
            v-if="version.version_type === 'release'"
            class="value"
            type="release"
            color="green"
          />
          <VersionBadge
            v-else-if="version.version_type === 'beta'"
            class="value"
            type="beta"
            color="orange"
          />
          <VersionBadge
            v-else-if="version.version_type === 'alpha'"
            class="value"
            type="alpha"
            color="red"
          />
        </div>
        <div>
          <h4>Version number</h4>
          <span>{{ version.version_number }}</span>
        </div>
        <div>
          <h4>Loaders</h4>
          <Categories :categories="version.loaders" />
        </div>
        <div>
          <h4>Game versions</h4>
          <span>{{ $formatVersion(version.game_versions) }}</span>
        </div>
        <div>
          <h4>Downloads</h4>
          <span>{{ version.downloads }}</span>
        </div>
        <div>
          <h4>Publication date</h4>
          <span>
            {{
              $dayjs(version.published).format('MMMM D, YYYY [at] h:mm:ss A')
            }}
          </span>
        </div>
        <div>
          <h4>Publisher</h4>
          <div
            class="team-member columns button-transparent"
            @click="
              $router.push('/user/' + version.author_member.user.username)
            "
          >
            <Avatar
              :src="version.author_member.avatar_url"
              :alt="version.author_member.user.username"
              size="sm"
              circle
            />

            <div class="member-info">
              <nuxt-link
                :to="'/user/' + version.author_member.user.username"
                class="name"
              >
                <p>{{ version.author_member.name }}</p>
              </nuxt-link>
              <p class="role">{{ version.author_member.role }}</p>
            </div>
          </div>
        </div>
        <div>
          <h4>Version ID</h4>
          <CopyCode :text="version.id" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import VersionBadge from '~/components/ui/Badge'
import Avatar from '~/components/ui/Avatar'
import CopyCode from '~/components/ui/CopyCode'
import Categories from '~/components/ui/search/Categories'
import ModalConfirm from '~/components/ui/ModalConfirm'
import ModalReport from '~/components/ui/ModalReport'

import FileIcon from '~/assets/images/utils/file.svg?inline'
import TrashIcon from '~/assets/images/utils/trash.svg?inline'
import EditIcon from '~/assets/images/utils/edit.svg?inline'
import DownloadIcon from '~/assets/images/utils/download.svg?inline'
import StarIcon from '~/assets/images/utils/star.svg?inline'
import ReportIcon from '~/assets/images/utils/report.svg?inline'

export default {
  components: {
    Categories,
    DownloadIcon,
    EditIcon,
    TrashIcon,
    StarIcon,
    FileIcon,
    ReportIcon,
    VersionBadge,
    Avatar,
    CopyCode,
    ModalConfirm,
    ModalReport,
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
    featuredVersions: {
      type: Array,
      default() {
        return []
      },
    },
    members: {
      type: Array,
      default() {
        return [{}]
      },
    },
    currentMember: {
      type: Object,
      default() {
        return null
      },
    },
    dependencies: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      primaryFile: {},
      version: {},
    }
  },
  fetch() {
    this.setVersion()
  },
  head() {
    if (!this.version || !this.version.game_versions) {
      return {}
    }
    const title = `${
      this.mode === 'create' ? 'Create Version' : this.version.name
    } - ${this.project.title}`
    const description = `Download ${this.project.title} ${
      this.version.version_number
    } on Modrinth. Supports ${this.$formatVersion(
      this.version.game_versions
    )} ${this.version.loaders
      .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
      .join(' & ')}. Published on ${this.$dayjs(
      this.version.date_published
    ).format('MMM D, YYYY')}. ${this.version.downloads} downloads.`

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
  watch: {
    '$route.path': {
      handler() {
        this.setVersion()
      },
    },
  },
  methods: {
    setVersion() {
      this.version = this.versions.find(
        (x) => x.id === this.$route.params.version
      )

      if (!this.version)
        this.version = this.versions.find(
          (x) => x.displayUrlEnding === this.$route.params.version
        )

      if (!this.version) {
        this.$nuxt.context.error({
          statusCode: 404,
          message: 'The page could not be found',
        })
        return
      }

      this.version = JSON.parse(JSON.stringify(this.version))
      this.primaryFile =
        this.version.files.find((file) => file.primary) ?? this.version.files[0]

      this.version.author_member = this.members.find(
        (x) => x.user.id === this.version.author_id
      )

      for (const dependency of this.version.dependencies) {
        dependency.version = this.dependencies.versions.find(
          (x) => x.id === dependency.version_id
        )

        if (dependency.version) {
          dependency.project = this.dependencies.projects.find(
            (x) => x.id === dependency.version.project_id
          )
        }

        if (!dependency.project) {
          dependency.project = this.dependencies.projects.find(
            (x) => x.id === dependency.project_id
          )
        }

        dependency.link = dependency.project
          ? `/${dependency.project.project_type}/${
              dependency.project.slug ?? dependency.project.id
            }${
              dependency.version
                ? `/version/${encodeURI(dependency.version.version_number)}`
                : ''
            }`
          : ''
      }
    },
    async deleteVersion() {
      this.$nuxt.$loading.start()

      await this.$axios.delete(
        `version/${this.version.id}`,
        this.$defaultHeaders()
      )

      await this.$router.replace(
        `/${this.project.project_type}/${this.project.id}`
      )
      this.$nuxt.$loading.finish()
    },
  },
}
</script>

<style lang="scss" scoped>
.version-page {
  display: grid;

  grid-template:
    'title' auto
    'changelog' auto
    'dependencies' auto
    'metadata' auto
    'files' auto
    / 1fr;

  column-gap: var(--spacing-card-md);

  .version-page__title {
    grid-area: title;

    .version-header {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;

      h2 {
        margin: 0 0.75rem 0 0;
        font-size: var(--font-size-2xl);
      }

      .featured {
        display: flex;
        align-items: center;
        gap: 0.25rem;

        svg {
          height: 1.45rem;
        }
      }
    }
  }

  h3 {
    font-size: var(--font-size-lg);
    margin: 0 0 0.5rem 0;
  }

  .version-page__changelog {
    grid-area: changelog;
  }

  .version-page__dependencies {
    grid-area: dependencies;

    .dependency {
      align-items: center;
      display: flex;
      gap: 0.5rem;
      padding: 0.5rem;

      .info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        .project-title {
          font-weight: bold;
        }

        .dep-type {
          text-transform: capitalize;
        }
      }
    }
  }

  .version-page__files {
    grid-area: files;

    .file {
      --text-color: var(--color-button-text);
      --background-color: var(--color-button-bg);

      &.primary {
        --background-color: var(--color-brand-highlight);
        --text-color: var(--color-button-text-active);
      }

      display: flex;
      align-items: center;

      font-weight: 500;
      color: var(--text-color);
      background-color: var(--background-color);
      padding: var(--spacing-card-sm) var(--spacing-card-bg);
      border-radius: var(--size-rounded-sm);

      svg {
        min-width: 1.1rem;
        min-height: 1.1rem;
        margin-right: 0.5rem;
      }

      .file-size {
        font-weight: 400;
        white-space: nowrap;
      }

      .iconified-button {
        margin-left: auto;
      }

      &:not(:nth-child(2)) {
        margin-top: 0.5rem;
      }
    }
  }

  .version-page__metadata {
    grid-area: metadata;

    h4 {
      margin: 1rem 0 0.25rem 0;
    }

    .team-member {
      align-items: center;
      padding: 0.25rem 0.5rem;

      .member-info {
        overflow: hidden;
        margin: auto 0 auto 0.75rem;

        .name {
          font-weight: bold;
        }

        p {
          font-size: var(--font-size-sm);
          margin: 0.2rem 0;
        }
      }
    }
  }
}

@media (min-width: 1200px) {
  .version-page {
    grid-template:
      'title title' auto
      'changelog metadata' auto
      'dependencies metadata' auto
      'files metadata' auto
      'dummy metadata' 1fr
      / 1fr 20rem;
  }
}
</style>
