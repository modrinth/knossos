<template>
  <div>
    <ConfirmPopup
      ref="delete_version_popup"
      title="Are you sure you want to delete this version?"
      description="This will remove this version forever (like really forever)."
      :has-to-type="false"
      proceed-label="Delete version"
      @proceed="deleteVersion()"
    />
    <nuxt-link
      v-if="mode === 'normal'"
      class="iconified-button back-button"
      :to="`/${project.project_type}/${
        project.slug ? project.slug : project.id
      }/versions`"
    >
      <BackIcon />
      Back to list
    </nuxt-link>
    <div>
      <div v-if="mode === 'normal'" class="version-header">
        <h2>{{ version.name }}</h2>
        <div
          v-if="featuredVersions.find((x) => x.id === version.id)"
          class="featured"
        >
          <StarIcon />
          Auto-featured
        </div>
        <div v-else-if="version.featured" class="featured">
          <StarIcon />
          Featured
        </div>
      </div>
      <div v-if="mode === 'edit'" class="buttons">
        <button class="action iconified-button brand-button-colors">
          <CheckIcon />
          Save
        </button>
        <nuxt-link
          v-if="$auth.user"
          :to="`/${project.project_type}/${
            project.slug ? project.slug : project.id
          }/version/${encodeURIComponent(version.version_number)}`"
          class="action iconified-button"
        >
          <TrashIcon />
          Discard changes
        </nuxt-link>
      </div>
      <div v-else class="buttons">
        <a
          v-if="primaryFile"
          :href="primaryFile.url"
          class="action iconified-button brand-button-colors"
          @click.prevent="
            $parent.downloadFile(primaryFile.hashes.sha1, primaryFile.url)
          "
        >
          <DownloadIcon />
          Download
        </a>
        <nuxt-link
          v-if="$auth.user"
          :to="`/create/report?id=${version.id}&t=version`"
          class="action iconified-button"
        >
          <ReportIcon />
          Report
        </nuxt-link>
        <button
          v-if="currentMember"
          class="action iconified-button"
          @click="deleteVersionPopup"
        >
          <TrashIcon />
          Delete
        </button>
        <nuxt-link
          v-if="currentMember"
          class="action iconified-button"
          :to="`/${project.project_type}/${
            project.slug ? project.slug : project.id
          }/version/${encodeURIComponent(version.version_number)}/edit`"
          @click.prevent="mode = 'edit'"
        >
          <EditIcon />
          Edit
        </nuxt-link>
      </div>
      <div v-if="mode === 'edit'" class="version-data-inputs">
        <input
          v-model="version.name"
          type="text"
          placeholder="Enter the version name..."
        />
        <Checkbox v-model="version.featured" label="Featured" />
      </div>
      <section v-if="mode === 'edit'">
        <h3>Changelog</h3>
        <ThisOrThat :items="['source', 'preview']" />
        <div
          class="markdown-body"
          v-html="
            version.changelog
              ? $xss($md.render(version.changelog))
              : 'No changelog specified.'
          "
        ></div>
      </section>
      <section v-else>
        <h3>Changelog</h3>
        <div
          class="markdown-body"
          v-html="
            version.changelog
              ? $xss($md.render(version.changelog))
              : 'No changelog specified.'
          "
        ></div>
      </section>
      <section>
        <h3>Metadata</h3>
        <div :class="'data-wrapper ' + mode">
          <div class="data">
            <p class="title">Release channel</p>
            <Multiselect
              v-if="mode === 'edit'"
              v-model="version.version_type"
              class="input"
              placeholder="Select one"
              :options="['release', 'beta', 'alpha']"
              :searchable="false"
              :close-on-select="true"
              :show-labels="false"
              :allow-empty="false"
            />
            <VersionBadge v-else class="value" :type="version.version_type" />
          </div>
          <div class="data">
            <p class="title">Mod loaders</p>
            <multiselect
              v-if="mode === 'edit'"
              v-model="version.loaders"
              :options="
                $tag.loaders
                  .filter((x) =>
                    x.supported_project_types.includes(
                      project.project_type.toLowerCase()
                    )
                  )
                  .map((it) => it.name)
              "
              :loading="$tag.loaders.length === 0"
              :multiple="true"
              :searchable="false"
              :show-no-results="false"
              :close-on-select="true"
              :clear-on-select="false"
              :show-labels="false"
              :limit="6"
              :hide-selected="true"
              placeholder="Choose mod loaders..."
            />
            <p v-else class="value">{{ version.loaders.join(',') }}</p>
          </div>
          <div v-if="mode === 'normal'" class="data">
            <p class="title">Downloads</p>
            <p class="value">{{ $parent.formatNumber(version.downloads) }}</p>
          </div>
          <div class="data">
            <p class="title">Version number</p>
            <input
              v-if="mode === 'edit'"
              v-model="version.version_number"
              type="text"
              placeholder="Enter the version number..."
            />
            <p v-else class="value">{{ version.version_number }}</p>
          </div>
          <div class="data">
            <p class="title">Game versions</p>
            <multiselect
              v-if="mode === 'edit'"
              v-model="version.game_versions"
              :options="$tag.gameVersions.map((it) => it.version)"
              :loading="$tag.gameVersions.length === 0"
              :multiple="true"
              :searchable="true"
              :show-no-results="false"
              :close-on-select="false"
              :clear-on-select="false"
              :show-labels="false"
              :limit="6"
              :hide-selected="true"
              placeholder="Choose versions..."
            />
            <p v-else class="value">{{ version.game_versions.join(',') }}</p>
          </div>
          <div v-if="mode === 'normal'" class="data">
            <p class="title">Published</p>
            <p class="value">
              {{ $dayjs(version.date_published).format('MMM D, YYYY') }}
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
            </p>
          </div>
        </div>
      </section>
      <section v-if="version.dependencies.length > 0">
        <h3>Dependencies</h3>
        <div class="dependencies">
          <div
            v-for="(dependency, index) in version.dependencies"
            :key="index"
            class="dependency"
          >
            <img
              class="icon"
              :src="
                dependency.project
                  ? dependency.project.icon_url
                  : 'https://cdn.modrinth.com/placeholder.svg'
              "
              alt="dependency-icon"
            />
            <div class="info">
              <nuxt-link
                :to="
                  dependency.project
                    ? dependency.version
                      ? `/${dependency.project.project_type}/${
                          dependency.project.slug
                            ? dependency.project.slug
                            : dependency.project.id
                        }/version/${encodeURIComponent(
                          dependency.version.version_number
                        )}`
                      : `/${dependency.project.project_type}/${
                          dependency.project.slug
                            ? dependency.project.slug
                            : dependency.project.id
                        }/`
                    : ''
                "
              >
                <h4 class="title">
                  {{
                    dependency.project
                      ? dependency.project.title
                      : 'Unknown Project'
                  }}
                </h4>
                <p v-if="dependency.version" class="version-number">
                  {{ dependency.version.version_number }}
                </p>
              </nuxt-link>
              <p v-if="mode === 'normal'" class="dependency-type">
                {{ dependency.dependency_type }}
              </p>
            </div>
          </div>
        </div>
        <div v-if="mode === 'edit'">
          <h4>Add dependency</h4>
          <ThisOrThat :items="['Project Dependency', 'Version Dependency']" />
          <div>
            <input type="text" placeholder="Enter the project ID..." />
          </div>
        </div>
      </section>
      <section v-if="version.files.length > 0">
        <h3>Files</h3>
        <div v-for="file in version.files" :key="file.hashes.sha1" class="file">
          <p class="filename">{{ file.filename }}</p>
          <div
            v-if="primaryFile.hashes.sha1 === file.hashes.sha1"
            class="featured"
          >
            <StarIcon />
            Primary
          </div>
          <a
            v-if="primaryFile"
            :href="primaryFile.url"
            class="action iconified-button"
            @click.prevent="$parent.downloadFile(file.hashes.sha1, file.url)"
          >
            <DownloadIcon />
            Download
          </a>
          <button v-if="mode === 'edit'" class="action iconified-button">
            <TrashIcon />
            Delete
          </button>
          <button
            v-if="
              mode === 'edit' && primaryFile.hashes.sha1 !== file.hashes.sha1
            "
            class="action iconified-button"
          >
            <StarIcon />
            Make primary
          </button>
        </div>
      </section>
    </div>
    <NuxtChild v-show="false" :mode.sync="mode" />
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import ConfirmPopup from '~/components/ui/ConfirmPopup'

import TrashIcon from '~/assets/images/utils/trash.svg?inline'
import EditIcon from '~/assets/images/utils/edit.svg?inline'
import DownloadIcon from '~/assets/images/utils/download.svg?inline'
import ReportIcon from '~/assets/images/utils/report.svg?inline'
import BackIcon from '~/assets/images/utils/left-arrow.svg?inline'
import StarIcon from '~/assets/images/utils/star.svg?inline'
import CheckIcon from '~/assets/images/utils/check.svg?inline'
import VersionBadge from '~/components/ui/VersionBadge'
import Checkbox from '~/components/ui/Checkbox'
import ThisOrThat from '~/components/ui/ThisOrThat'

export default {
  components: {
    ThisOrThat,
    Checkbox,
    VersionBadge,
    DownloadIcon,
    TrashIcon,
    EditIcon,
    ReportIcon,
    BackIcon,
    ConfirmPopup,
    StarIcon,
    CheckIcon,
    Multiselect,
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
      mode: 'normal',
      primaryFile: {},
      version: {},
      filesToUpload: [],
      popup_data: null,
    }
  },
  async fetch() {
    await this.setVersion()
  },
  watch: {
    '$route.path': {
      async handler() {
        await this.setVersion()
      },
    },
  },
  mounted() {
    this.$emit('update:link-bar', [
      ['Versions', 'versions'],
      [this.version.name, 'versions/' + this.version.version_number],
    ])
  },
  methods: {
    async setVersion() {
      if (this.$route.params.mode) this.mode = this.$route.params.mode

      this.version = this.versions.find(
        (x) => x.id === this.$route.params.version
      )

      if (!this.version)
        this.version = this.versions.find(
          (x) => x.version_number === this.$route.params.version
        )

      this.primaryFile = this.version.files.find((file) => file.primary)

      if (!this.primaryFile) {
        this.primaryFile = this.version.files[0]
      }

      if (!this.version.changelog && this.version.changelog_url) {
        this.version.changelog = (
          await this.$axios.get(this.version.changelog_url)
        ).data
      }

      for (const dependency of this.version.dependencies) {
        dependency.project = this.dependencies.projects.find(
          (x) => x.id === dependency.project_id
        )
        dependency.version = this.dependencies.versions.find(
          (x) => x.id === dependency.version_id
        )
      }
    },
    deleteFilePopup(hash) {
      this.popup_data = hash
      this.$refs.delete_file_popup.show()
    },
    async deleteFile(hash) {
      this.$nuxt.$loading.start()

      await this.$axios.delete(`version_file/${hash}`, this.$auth.headers)

      await this.$router.go(null)
      this.$nuxt.$loading.finish()
    },
    async makePrimary(hash) {
      this.$nuxt.$loading.start()

      await this.$axios.patch(
        `version/${this.version.id}`,
        {
          primary_file: ['sha1', hash],
        },
        this.$auth.headers
      )

      await this.$router.go(null)
      this.$nuxt.$loading.finish()
    },
    async addFiles(files) {
      this.filesToUpload = files

      for (let i = 0; i < files.length; i++) {
        this.filesToUpload[i].multipartName = files[i].name.concat('-' + i)
      }

      this.$nuxt.$loading.start()

      const formData = new FormData()

      formData.append('data', JSON.stringify({}))

      for (const fileToUpload of this.filesToUpload) {
        formData.append(
          fileToUpload.multipartName,
          new Blob([fileToUpload]),
          fileToUpload.name
        )
      }

      try {
        await this.$axios({
          url: `version/${this.version.id}/file`,
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: this.$auth.token,
          },
        })

        await this.$router.go(null)
      } catch (err) {
        this.$notify({
          group: 'main',
          title: 'An error occurred',
          text: err.response.data.description,
          type: 'error',
        })
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }

      this.$nuxt.$loading.finish()
    },
    deleteVersionPopup() {
      this.$refs.delete_version_popup.show()
    },
    async deleteVersion() {
      this.$nuxt.$loading.start()

      await this.$axios.delete(`version/${this.version.id}`, this.$auth.headers)

      await this.$router.replace(`/project/${this.project.id}`)
      this.$nuxt.$loading.finish()
    },
  },
}
</script>

<style lang="scss" scoped>
.back-button {
  max-width: 6.25rem;
}

.version-header {
  display: flex;
  align-items: center;
  margin: 1rem 0;

  h2 {
    margin: 0 0.75rem 0 0;
    font-size: var(--font-size-xl);
  }
}

section {
  margin: 1rem 0;

  h3 {
    margin-bottom: 0.5rem;
  }
}

.buttons {
  display: flex;
  flex-wrap: wrap;

  .brand-button-colors {
    font-weight: bold;
  }

  @media screen and (min-width: 1024px) {
    margin-left: auto;
  }

  .action:not(:first-child) {
    margin: 0 0 0 0.5rem;
  }
}

.version-data-inputs {
  margin: 0.5rem 0;
}

.data-wrapper {
  display: flex;
  flex-wrap: wrap;

  .data {
    flex-basis: calc(33.333333% - 0.5rem);

    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: var(--font-size-sm);

    .title {
      font-weight: bold;
      margin-bottom: 0.25rem;
    }

    p {
      margin: 0;
    }
  }

  &.edit {
    .data {
      flex-basis: calc(50% - 0.5rem);

      input {
        margin: 0;
        height: 1.25rem;
        width: calc(100% - 2.25rem);
      }
    }
  }
}

.dependencies {
  display: flex;
  flex-wrap: wrap;

  .dependency {
    display: flex;
    flex-basis: 33.333333%;
    margin-bottom: 0.5rem;

    .icon {
      width: 3rem;
      height: 3rem;
      margin-right: 0.5rem;
      border-radius: var(--size-rounded-icon);
      object-fit: contain;
    }

    .info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 0.25rem;

      p {
        margin: 0;
        font-size: var(--font-size-sm);
      }

      .descriptor {
        display: flex;
        align-items: baseline;

        .title {
          margin: 0 0.25rem 0 0;
        }
      }

      .dependency-type {
        text-transform: capitalize;
      }
    }
  }
}

.file {
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
  font-size: var(--font-size-sm);

  * {
    margin-left: 0.25rem;
  }
  .filename {
    margin: 0;
    font-weight: bold;
  }
}

.featured {
  display: flex;
  align-items: center;

  svg {
    height: 1rem;
    width: auto;
    margin-right: 0.25rem;
  }

  font-size: var(--font-size-sm);
}
</style>
