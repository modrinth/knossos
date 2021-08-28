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
      class="iconified-button back-button"
      :to="`/${project.project_type}/${
        project.slug ? project.slug : project.id
      }/versions`"
    >
      <IconArrowLeft />
      Back to list
    </nuxt-link>
    <div>
      <div class="version-header">
        <h2>{{ version.name }}</h2>
        <div
          v-if="featuredVersions.find((x) => x.id === version.id)"
          class="featured"
        >
          <IconStar />
          Featured
        </div>
      </div>
      <div class="buttons">
        <a
          v-if="primaryFile"
          :href="primaryFile.url"
          class="action iconified-button brand-button-colors"
          @click.prevent="
            $parent.downloadFile(primaryFile.hashes.sha1, primaryFile.url)
          "
        >
          <IconDownload />
          Download
        </a>
        <nuxt-link
          v-if="$auth.user"
          :to="`/create/report?id=${version.id}&t=version`"
          class="action iconified-button"
        >
          <IconFlag />
          Report
        </nuxt-link>
        <button
          v-if="currentMember"
          class="action iconified-button"
          @click="deleteVersionPopup"
        >
          <IconTrash />
          Delete
        </button>
        <nuxt-link
          v-if="currentMember"
          class="action iconified-button"
          :to="version.id + '/edit'"
        >
          <IconEdit />
          Edit
        </nuxt-link>
      </div>
      <section>
        <h3>Changelog</h3>
        <div
          v-compiled-markdown="
            version.changelog ? version.changelog : 'No changelog specified.'
          "
          class="markdown-body"
        ></div>
      </section>
      <section>
        <h3>Metadata</h3>
        <div class="data-wrapper">
          <div class="data">
            <p class="title">Release channel</p>
            <VersionBadge class="value" :type="version.version_type" />
          </div>
          <div class="data">
            <p class="title">Mod loaders</p>
            <p class="value">{{ version.loaders.join(',') }}</p>
          </div>
          <div class="data">
            <p class="title">Downloads</p>
            <p class="value">{{ $parent.formatNumber(version.downloads) }}</p>
          </div>
          <div class="data">
            <p class="title">Version number</p>
            <p class="value">{{ version.version_number }}</p>
          </div>
          <div class="data">
            <p class="title">Game versions</p>
            <p class="value">{{ version.game_versions.join(',') }}</p>
          </div>
          <div class="data">
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
            v-for="(dependency, index) in dependencies[version.id]"
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
              <nuxt-link to="aaaa" class="descriptor">
                <h4 class="title">
                  {{
                    dependency.project
                      ? dependency.project.title
                      : 'Unkown Project'
                  }}
                </h4>
                <p v-if="dependency.version" class="version-number">
                  {{ dependency.version.version_number }}
                </p>
              </nuxt-link>
              <p class="dependency-type">
                {{
                  version.dependencies.find(
                    (x) =>
                      x.version_id ===
                        (dependency.version
                          ? dependency.version.id
                          : undefined) &&
                      x.project_id ===
                        (dependency.project ? dependency.project.id : undefined)
                  ).dependency_type
                }}
              </p>
            </div>
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
            <IconStar />
            Primary
          </div>
          <a
            v-if="primaryFile"
            :href="primaryFile.url"
            class="action iconified-button"
            @click.prevent="$parent.downloadFile(file.hashes.sha1, file.url)"
          >
            <IconDownload />
            Download
          </a>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
export default {
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
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
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
    async $route() {
      await this.setVersion()
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

.data-wrapper {
  display: flex;
  flex-wrap: wrap;

  .data {
    flex-basis: 33.333333%;
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
