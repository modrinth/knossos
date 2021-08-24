<template>
  <div class="page-container">
    <div class="page-contents">
      <header class="columns">
        <h3 class="column-grow-1">{{ $t('creation.project.create') }}</h3>
        <button
          title="Save draft"
          class="button column"
          :disabled="!$nuxt.$loading"
          @click="createDraft"
        >
          {{ $t('creation.project.saveDraft') }}
        </button>
        <button
          title="Submit for review"
          class="brand-button column"
          :disabled="!$nuxt.$loading"
          @click="createProject"
        >
          {{ $t('creation.project.submit') }}
        </button>
      </header>
      <section class="essentials">
        <h3>{{ $t('generic.name') }}</h3>
        <label>
          <span>{{ $t('creation.project.nameDescription') }}</span>
          <input v-model="name" type="text" placeholder="Enter the name" />
        </label>
        <h3>{{ $t('generic.description') }}</h3>
        <label>
          <span>{{ $t('creation.project.descriptionDescription') }}</span>
          <input
            v-model="description"
            type="text"
            placeholder="Enter the summary"
          />
        </label>
        <h3>{{ $t('generic.categories') }}</h3>
        <label>
          <span>{{ $t('creation.project.categoriesDescription') }}</span>
          <multiselect
            id="categories"
            v-model="categories"
            :options="
              $tag.categories
                .filter((x) => x.project_type === projectType.toLowerCase())
                .map((it) => it.name)
            "
            :loading="$tag.categories.length === 0"
            :multiple="true"
            :searchable="false"
            :show-no-results="false"
            :close-on-select="false"
            :clear-on-select="false"
            :show-labels="false"
            :max="3"
            :limit="6"
            :hide-selected="true"
            placeholder="Choose categories"
          />
        </label>
        <h3>{{ $t('generic.slug') }}</h3>
        <label>
          <span>{{ $t('creation.project.slugDescription') }}</span>
          <input
            id="name"
            v-model="slug"
            type="text"
            placeholder="Enter the vanity URL slug"
          />
        </label>
        <h3>{{ $t('project.type') }}</h3>
        <label>
          <span>{{ $t('creation.project.typeDescription') }}</span>
          <Multiselect
            v-model="projectType"
            placeholder="Select one"
            :options="projectTypes"
            :searchable="false"
            :close-on-select="true"
            :show-labels="false"
            :allow-empty="false"
          />
        </label>
      </section>
      <section class="project-icon rows">
        <h3>{{ $t('generic.icon') }}</h3>
        <div class="columns row-grow-1">
          <div class="column-grow-1 rows">
            <file-input
              accept="image/png,image/jpeg,image/gif,image/webp"
              class="choose-image"
              prompt="Choose image or drag it here"
              @change="showPreviewImage"
            />
            <ul class="row-grow-1">
              <li>{{ $t('creation.project.icon.square') }}</li>
              <li>{{ $t('creation.project.icon.minimumSize') }}</li>
              <li>{{ $t('creation.project.icon.formats') }}</li>
            </ul>
            <button
              class="transparent-button"
              @click="
                icon = null
                previewImage = null
              "
            >
              {{ $t('creation.project.icon.reset') }}
            </button>
          </div>
          <img
            :src="
              previewImage
                ? previewImage
                : 'https://cdn.modrinth.com/placeholder.svg'
            "
            alt="preview-image"
          />
        </div>
      </section>
      <section class="game-sides">
        <h3>{{ $t('generic.environments') }}</h3>
        <div class="columns">
          <span>{{ $t('creation.project.environmentDescription') }}</span>
          <div class="labeled-control">
            <h3>{{ $t('generic.client') }}</h3>
            <Multiselect
              v-model="clientSideType"
              placeholder="Select one"
              :options="sideTypes"
              :searchable="false"
              :close-on-select="true"
              :show-labels="false"
              :allow-empty="false"
            />
          </div>
          <div class="labeled-control">
            <h3>{{ $t('generic.server') }}</h3>
            <Multiselect
              v-model="serverSideType"
              placeholder="Select one"
              :options="sideTypes"
              :searchable="false"
              :close-on-select="true"
              :show-labels="false"
              :allow-empty="false"
            />
          </div>
        </div>
      </section>
      <section class="description">
        <h3>
          <label
            for="body"
            title="You can type an extended description of your project here."
          >
            {{ $t('generic.body') }}
          </label>
        </h3>
        <span>
          {{ $t('creation.project.bodyDescription.preLink')
          }}<a
            href="https://guides.github.com/features/mastering-markdown/"
            target="_blank"
            rel="noopener noreferrer"
            >{{ $t('creation.project.bodyDescription.link') }}</a
          >{{ $t('creation.project.bodyDescription.postLink') }}
        </span>
        <div class="columns">
          <div class="textarea-wrapper">
            <textarea id="body" v-model="body"></textarea>
          </div>
          <div class="markdown-body" v-html="$xss($md.render(body))"></div>
        </div>
      </section>
      <section class="versions">
        <div class="title">
          <h3>{{ $t('generic.version') }}</h3>
          <button
            title="Add a version"
            class="button"
            :disabled="currentVersionIndex !== -1"
            @click="createVersion"
          >
            {{ $t('creation.version.add') }}
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>{{ $t('generic.name') }}</th>
              <th>{{ $t('generic.version') }}</th>
              <th>{{ $t('generic.loaders') }}</th>
              <th>{{ $t('generic.mcVersions') }}</th>
              <th>{{ $t('generic.channel') }}</th>
              <th>{{ $t('generic.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(version, index) in versions.filter((it) =>
                currentVersionIndex !== -1
                  ? it !== versions[currentVersionIndex]
                  : true
              )"
              :key="version.id"
            >
              <td>{{ version.version_title }}</td>
              <td>{{ version.version_number }}</td>
              <td>{{ version.loaders.join(', ') }}</td>
              <td>{{ version.game_versions.join(', ') }}</td>
              <td>
                <span
                  v-if="version.release_channel === 'release'"
                  class="badge green"
                >
                  {{ $t('project.channel.release') }}
                </span>
                <span
                  v-if="version.release_channel === 'beta'"
                  class="badge yellow"
                >
                  {{ $t('project.channel.beta') }}
                </span>
                <span
                  v-if="version.release_channel === 'alpha'"
                  class="badge red"
                >
                  {{ $t('project.channel.alpha') }}
                </span>
              </td>
              <td>
                <button
                  title="Delete version"
                  @click="versions.splice(index, 1)"
                >
                  {{ $t('generic.delete') }}
                </button>
                <button
                  title="Edit version"
                  @click="currentVersionIndex = index"
                >
                  {{ $t('generic.edit') }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <hr v-if="currentVersionIndex !== -1" />
        <div v-if="currentVersionIndex !== -1" class="new-version">
          <div class="controls">
            <button
              class="brand-button"
              title="Save version"
              @click="currentVersionIndex = -1"
            >
              {{ $t('creation.version.save') }}
            </button>
            <button title="Discard version" @click="deleteVersion">
              {{ $t('generic.discard') }}
            </button>
          </div>
          <div class="main">
            <h3>{{ $t('generic.name') }}</h3>
            <label>
              <span>{{ $t('creation.version.nameDescription') }}</span>
              <input
                v-model="versions[currentVersionIndex].version_title"
                type="text"
                placeholder="Enter the name"
              />
            </label>
            <h3>{{ $t('generic.number') }}</h3>
            <label>
              <span>{{ $t('creation.version.numberDescription') }}</span>
              <input
                v-model="versions[currentVersionIndex].version_number"
                type="text"
                placeholder="Enter the number"
              />
            </label>
            <h3>{{ $t('generic.channel') }}</h3>
            <label>
              <span>{{ $t('creation.version.channe;Description') }}</span>
              <multiselect
                v-model="versions[currentVersionIndex].release_channel"
                placeholder="Select one"
                :options="['release', 'beta', 'alpha']"
                :searchable="false"
                :close-on-select="true"
                :show-labels="false"
                :allow-empty="false"
              />
            </label>
            <h3>Mod loaders</h3>
            <label>
              <span>{{ $t('creation.version.loaderDescription') }}</span>
              <multiselect
                v-model="versions[currentVersionIndex].loaders"
                :options="
                  $tag.loaders
                    .filter((x) =>
                      x.supported_project_types.includes(
                        projectType.toLowerCase()
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
            </label>
            <h3>{{ $t('generic.mcVersions') }}</h3>
            <label>
              <span>
                {{ $t('creation.version.mcVersionDescription') }}
              </span>
              <multiselect
                v-model="versions[currentVersionIndex].game_versions"
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
            </label>
            <h3>{{ $t('generic.files') }}</h3>
            <label>
              <span>{{ $t('creation.version.fileDescription') }}</span>
              <FileInput
                accept=".jar,application/java-archive,.zip,application/zip"
                multiple
                @change="updateVersionFiles"
              />
            </label>
          </div>
          <div class="changelog">
            <h3>{{ $t('generic.changelog') }}</h3>
            <span>{{ $t('creation.version.changelogDescription') }}</span>
            <div class="textarea-wrapper">
              <textarea
                v-model="versions[currentVersionIndex].changelog"
              ></textarea>
            </div>
          </div>
        </div>
      </section>
      <section class="extra-links">
        <div class="title">
          <h3>{{ $t('generic.externalResources') }}</h3>
          <i>{{ $t('creation.project.optional') }}</i>
        </div>
        <label
          title="A place for users to report bugs, issues, and concerns about your project."
        >
          <span>{{ $t('generic.issueTracker') }}</span>
          <input
            v-model="issues_url"
            type="url"
            placeholder="Enter a valid URL"
          />
        </label>
        <label
          title="A page/repository containing the source code for your project"
        >
          <span>{{ $t('generic.sourceCode') }}</span>
          <input
            v-model="source_url"
            type="url"
            placeholder="Enter a valid URL"
          />
        </label>
        <label
          title="A page containing information, documentation, and help for the project."
        >
          <span>{{ $t('generic.wikiPage') }}</span>
          <input
            v-model="wiki_url"
            type="url"
            placeholder="Enter a valid URL"
          />
        </label>
        <label title="An invitation link to your Discord server.">
          <span>{{ $t('generic.discord') }}</span>
          <input
            v-model="discord_url"
            type="url"
            placeholder="Enter a valid URL"
          />
        </label>
      </section>
      <section class="license">
        <div class="title">
          <h3>{{ $t('generic.license') }}</h3>
          <i>{{ $t('creation.project.optional') }}</i>
        </div>
        <label>
          <span>
            {{ $t('creation.project.licenseDescription.description') }}
            <br />
            {{ $t('creation.project.licenseDescription.preLink')
            }}<a
              href="https://blog.modrinth.com/licensing-guide/"
              target="_blank"
              rel="noopener noreferrer"
              >{{ $t('creation.project.licenseDescription.link') }}</a
            >{{ $t('creation.project.licenseDescription.postLink') }}
          </span>
          <div class="input-group">
            <Multiselect
              v-model="license"
              placeholder="Select one"
              track-by="short"
              label="name"
              :searchable="true"
              :options="$tag.licenses"
              :close-on-select="true"
              :show-labels="false"
            />
            <input v-model="license_url" type="url" placeholder="License URL" />
          </div>
        </label>
      </section>
      <section class="donations">
        <div class="title">
          <h3>{{ $t('generic.donationLinks') }}</h3>
          <i>{{ $t('creation.project.optional') }}</i>
          <button
            title="Add a link"
            class="button"
            :disabled="false"
            @click="
              donationPlatforms.push({})
              donationLinks.push('')
            "
          >
            {{ $t('generic.addLink') }}
          </button>
        </div>
        <div v-for="(item, index) in donationPlatforms" :key="index">
          <label title="The donation link.">
            <span>{{ $t('generic.link') }}</span>
            <input
              v-model="donationLinks[index]"
              type="url"
              placeholder="Enter a valid URL"
            />
          </label>
          <label title="The donation platform of the link.">
            <span>{{ $t('generic.platform') }}</span>
            <Multiselect
              v-model="donationPlatforms[index]"
              placeholder="Select one"
              track-by="short"
              label="name"
              :options="$tag.donationPlatforms"
              :searchable="false"
              :close-on-select="true"
              :show-labels="false"
            />
          </label>
          <button
            class="button"
            @click="
              donationPlatforms.splice(index, 1)
              donationLinks.splice(index, 1)
            "
          >
            {{ $t('generic.removeLink') }}
          </button>
          <hr />
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'

import FileInput from '~/components/ui/FileInput'

export default {
  components: {
    FileInput,
    Multiselect,
  },
  beforeRouteLeave(to, from, next) {
    if (
      this.isEditing &&
      !window.confirm(this.$i18n.t('creation.areYouSure'))
    ) {
      return
    }
    next()
  },
  data() {
    return {
      previewImage: null,
      compiledBody: '',
      releaseChannels: ['beta', 'alpha', 'release'],
      currentVersionIndex: -1,
      name: '',
      slug: '',
      draft: false,
      description: '',
      body: '',
      versions: [],
      categories: [],
      issues_url: null,
      source_url: null,
      wiki_url: null,
      discord_url: null,
      icon: null,
      license: null,
      license_url: null,

      projectTypes: ['Mod', 'Modpack'],
      projectType: 'Mod',

      sideTypes: ['Required', 'Optional', 'Unsupported'],
      clientSideType: 'Required',
      serverSideType: 'Required',

      donationLinks: [],
      donationPlatforms: [],

      isEditing: true,
    }
  },
  watch: {
    license(newValue, oldValue) {
      if (newValue == null) {
        this.license_url = ''
        return
      }

      switch (newValue.short) {
        case 'custom':
          this.license_url = ''
          break
        default:
          this.license_url = `https://cdn.modrinth.com/licenses/${newValue.short}.txt`
      }
    },
  },
  mounted() {
    function preventLeave(e) {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', preventLeave)
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('beforeunload', preventLeave)
    })
  },
  methods: {
    async createDraft() {
      this.draft = true
      await this.createProject()
    },
    async createProject() {
      this.$nuxt.$loading.start()

      for (const version of this.versions) {
        if (!version.version_title) {
          version.version_title = version.version_number
        }
      }

      const formData = new FormData()

      formData.append(
        'data',
        JSON.stringify({
          title: this.name,
          project_type: this.projectType.toLowerCase(),
          slug: this.slug,
          description: this.description,
          body: this.body,
          initial_versions: this.versions,
          team_members: [
            {
              user_id: this.$auth.user.id,
              name: this.$auth.user.username,
              role: 'Owner',
            },
          ],
          categories: this.categories,
          issues_url: this.issues_url,
          source_url: this.source_url,
          wiki_url: this.wiki_url,
          discord_url: this.discord_url,
          client_side: this.clientSideType.toLowerCase(),
          server_side: this.serverSideType.toLowerCase(),
          license_id: this.license ? this.license.short : 'arr',
          license_url: this.license_url,
          is_draft: this.draft,
          donation_urls: this.donationPlatforms.map((it, index) => {
            return {
              id: it.short,
              platform: it.name,
              url: this.donationLinks[index],
            }
          }),
          gallery_items: [],
        })
      )

      if (this.icon) {
        formData.append('icon', new Blob([this.icon]), this.icon.name)
      }

      for (const version of this.versions) {
        for (let i = 0; i < version.raw_files.length; i++) {
          formData.append(
            version.file_parts[i],
            new Blob([version.raw_files[i]]),
            version.raw_files[i].name
          )
        }
      }

      try {
        await this.$axios({
          url: 'project',
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: this.$auth.token,
          },
        })

        this.isEditing = false
        await this.$store.dispatch('user/fetchAll', { force: true })

        await this.$router.replace('/dashboard/projects')
      } catch (err) {
        let description = err.response.data.description

        if (description.includes('JSON')) {
          description = 'Please fill in missing required fields.'
        }

        this.$notify({
          group: 'main',
          title: this.$i18n.t('error.error'),
          text: description,
          type: 'error',
        })

        window.scrollTo({ top: 0, behavior: 'smooth' })
      }

      this.$nuxt.$loading.finish()
    },

    showPreviewImage(files) {
      const reader = new FileReader()
      this.icon = files[0]

      if (this.icon instanceof Blob) {
        reader.readAsDataURL(this.icon)

        reader.onload = (event) => {
          this.previewImage = event.target.result
        }
      }
    },

    updateVersionFiles(files) {
      this.versions[this.currentVersionIndex].raw_files = files

      const newFileParts = []
      for (let i = 0; i < files.length; i++) {
        newFileParts.push(files[i].name.concat('-' + i))
      }

      this.versions[this.currentVersionIndex].file_parts = newFileParts
    },

    createVersion() {
      this.versions.push({
        raw_files: [],
        file_parts: [],
        version_number: '',
        version_title: '',
        version_body: '',
        dependencies: [],
        game_versions: [],
        release_channel: 'release',
        loaders: [],
        featured: false,
      })

      this.currentVersionIndex = this.versions.length - 1
    },

    deleteVersion() {
      this.versions.splice(this.currentVersionIndex, 1)
      this.currentVersionIndex = -1
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

.page-contents {
  display: grid;
  grid-template:
    'header       header       header' auto
    'advert       advert       advert' auto
    'essentials   essentials   essentials' auto
    'project-icon project-icon project-icon' auto
    'game-sides   game-sides   game-sides' auto
    'description  description  description' auto
    'versions     versions     versions' auto
    'extra-links  extra-links  extra-links' auto
    'license      license      license' auto
    'donations    donations    donations' auto
    'footer       footer       footer' auto
    / 4fr 1fr 4fr;

  @media screen and (min-width: 1024px) {
    grid-template:
      'header       header      header' auto
      'advert       advert      advert' auto
      'essentials   essentials  project-icon' auto
      'game-sides   game-sides  game-sides' auto
      'description  description description' auto
      'versions     versions    versions' auto
      'extra-links  license     license' auto
      'donations    donations   donations' auto
      'footer       footer      footer' auto
      / 4fr 1fr 4fr;
  }

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

.advert {
  grid-area: advert;
}

section {
  @extend %card;

  padding: var(--spacing-card-md) var(--spacing-card-lg);
}

section.essentials {
  grid-area: essentials;
}

section.project-icon {
  grid-area: project-icon;

  img {
    align-self: flex-start;
    max-width: 50%;
    margin-left: var(--spacing-card-lg);
    border-radius: var(--size-rounded-lg);
  }
}

section.game-sides {
  grid-area: game-sides;

  .columns {
    flex-wrap: wrap;

    span {
      flex: 2;
    }

    .labeled-control {
      flex: 2;
      margin-left: var(--spacing-card-lg);
    }
  }
}

section.description {
  grid-area: description;

  span a {
    text-decoration: underline;
  }

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

section.versions {
  grid-area: versions;

  table {
    border-collapse: collapse;
    margin-bottom: var(--spacing-card-md);
    background: var(--color-raised-bg);
    border-radius: var(--size-rounded-card);
    table-layout: fixed;
    width: 100%;

    * {
      text-align: left;
    }

    tr:not(:last-child),
    tr:first-child {
      th,
      td {
        border-bottom: 1px solid var(--color-divider);
      }
    }

    th,
    td {
      &:first-child {
        text-align: center;
        width: 7%;

        svg {
          color: var(--color-text);

          &:hover,
          &:focus {
            color: var(--color-text-hover);
          }
        }
      }

      &:nth-child(2),
      &:nth-child(5) {
        padding-left: 0;
        width: 12%;
      }
    }

    th {
      color: var(--color-heading);
      font-size: 0.8rem;
      letter-spacing: 0.02rem;
      margin-bottom: 0.5rem;
      margin-top: 1.5rem;
      padding: 0.75rem 1rem;
      text-transform: uppercase;
    }

    td {
      overflow: hidden;
      padding: 0.75rem 1rem;

      img {
        height: 3rem;
        width: 3rem;
      }
    }
  }

  hr {
    background-color: var(--color-divider);
    border: none;
    color: var(--color-divider);
    height: 2px;
    margin: 0.5rem 0;
  }

  .new-version {
    display: grid;
    grid-template:
      'controls controls' auto
      'main changelog' auto
      / 5fr 4fr;
    column-gap: var(--spacing-card-md);

    .controls {
      grid-area: controls;
      display: flex;
      flex-direction: row-reverse;
    }

    .main {
      grid-area: main;
    }

    .changelog {
      grid-area: changelog;
      display: flex;
      flex-direction: column;

      .textarea-wrapper {
        flex: 1;
      }
    }
  }
}

section.extra-links {
  grid-area: extra-links;

  label {
    align-items: center;
    margin-top: var(--spacing-card-sm);

    span {
      flex: 1;
    }
  }
}

section.license {
  grid-area: license;

  label {
    margin-top: var(--spacing-card-sm);
  }
}

section.donations {
  grid-area: donations;

  label {
    align-items: center;
    margin-top: var(--spacing-card-sm);

    span {
      flex: 1;
    }
  }
}

.footer {
  grid-area: footer;
}

.choose-image {
  cursor: pointer;
}

a {
  text-decoration: underline;
  color: var(--color-link);
}
</style>
