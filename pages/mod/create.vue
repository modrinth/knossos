<template>
  <div class="page-container">
    <div class="page-contents">
      <header class="columns">
        <h2 class="column-grow-1">Create a mod</h2>
        <button
          title="Save draft"
          class="button column"
          :disabled="!this.$nuxt.$loading"
        >
          Save draft
        </button>
        <button
          title="Create"
          class="brand-button column"
          :disabled="!this.$nuxt.$loading"
          @click="createMod"
        >
          Create
        </button>
      </header>
      <EthicalAd class="advert" />
      <section class="essentials">
        <h3>Name</h3>
        <label>
          <span>
            Be creative. TechCraft v7 won't be searchable and won't be clicked
            on
          </span>
          <input v-model="name" type="text" />
        </label>
        <h3>Summary</h3>
        <label>
          <span>
            Give a quick description to your mod. It will appear in the search
          </span>
          <input v-model="description" type="text" />
        </label>
        <h3>Categories</h3>
        <label>
          <span>
            Select up to 3 categories. They will help to find your mod
          </span>
          <multiselect
            id="categories"
            v-model="categories"
            :options="selectableCategories"
            :loading="selectableCategories.length === 0"
            :multiple="true"
            :searchable="false"
            :show-no-results="false"
            :close-on-select="false"
            :clear-on-select="false"
            :show-labels="false"
            :max="3"
            :limit="6"
            :hide-selected="true"
            placeholder="Choose categories..."
          />
        </label>
        <h3>Vanity URL</h3>
        <label>
          <span>
            Set this to something pretty, so URLs to your mod are more readable
          </span>
          <input id="name" type="text" name="name" />
        </label>
      </section>
      <section class="mod-icon">
        <h3>Mod icon</h3>
        <div class="columns">
          <div class="column-grow-1">
            <div class="rows">
              <FileInput
                input-id="icon-file"
                input-accept="image/*"
                default-text="Choose image or drag it here"
                :input-multiple="false"
                @change="showPreviewImage"
              />
              <ul>
                <li>Must be a square</li>
                <li>Minimum size is 100x100</li>
                <li>Acceptable formats are PNG, JPEG and GIF</li>
              </ul>
              <button class="transparent-button">Reset icon</button>
            </div>
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
        <h3>Game sides</h3>
        <div class="columns">
          <span>
            Let others know if your mod is for clients, servers or universal.
            For example, IC2 will be required + required, while OptiFine will be
            required + no functionality
          </span>
          <div class="labeled-control">
            <h3>Client side</h3>
            <Multiselect
              v-model="clientSide"
              class="sort-types"
              placeholder="Select one"
              track-by="display"
              label="display"
              :options="sideTypes"
              :searchable="false"
              :close-on-select="true"
              :show-labels="false"
              :allow-empty="false"
            >
              <template slot="singleLabel" slot-scope="{ option }">{{
                option.display
              }}</template>
            </Multiselect>
          </div>
          <div class="labeled-control">
            <h3>Server side</h3>
            <Multiselect
              v-model="serverSide"
              class="sort-types"
              placeholder="Select one"
              track-by="display"
              label="display"
              :options="sideTypes"
              :searchable="false"
              :close-on-select="true"
              :show-labels="false"
              :allow-empty="false"
            >
              <template slot="singleLabel" slot-scope="{ option }">{{
                option.display
              }}</template>
            </Multiselect>
          </div>
        </div>
      </section>
      <section class="description">
        <h3>
          <label
            for="body"
            title="You can type the of the long form of your description here."
          >
            Mod Body
          </label>
        </h3>
        <span>
          You can type the of the long form of your description here. This
          editor supports markdown. You can find the syntax
          <a
            href="https://guides.github.com/features/mastering-markdown/"
            target="_blank"
            rel="noopener noreferrer"
            >here</a
          >.
        </span>
        <div class="columns">
          <textarea id="body" v-model="body"></textarea>
          <div v-compiled-markdown="body"></div>
        </div>
      </section>
      <section class="versions">
        <Popup
          v-if="currentVersionIndex > -1"
          :show-popup="currentVersionIndex > -1"
          class="create-version-popup-body"
        >
          <div class="versions-header">
            <h3>New Version</h3>

            <div class="popup-icons">
              <button title="Discard Version" @click="deleteVersion">
                <TrashIcon />
              </button>
              <button title="Exit Version" @click="currentVersionIndex = -1">
                <SaveIcon />
              </button>
            </div>
          </div>
          <label
            for="version-title"
            class="required"
            title="The title of your version"
          >
            Version Title
          </label>
          <input
            id="version-title"
            v-model="versions[currentVersionIndex].version_title"
            required
            type="text"
            placeholder="Combat Update"
          />
          <label
            for="version-number"
            class="required"
            title="The version number of this version. Preferably following semantic versioning"
          >
            Version Number
          </label>
          <input
            id="version-number"
            v-model="versions[currentVersionIndex].version_number"
            required
            type="text"
            placeholder="v1.9"
          />
          <label class="required" title="The release channel of this version.">
            Release Channel
          </label>
          <Multiselect
            v-model="versions[currentVersionIndex].release_channel"
            class="categories-input"
            placeholder="Select one"
            :options="['release', 'beta', 'alpha']"
            :searchable="false"
            :close-on-select="true"
            :show-labels="false"
            :allow-empty="false"
          />
          <label
            title="The version number of this version. Preferably following semantic versioning"
          >
            Loaders
          </label>
          <multiselect
            v-model="versions[currentVersionIndex].loaders"
            class="categories-input"
            :options="selectableLoaders"
            :loading="selectableLoaders.length === 0"
            :multiple="true"
            :searchable="false"
            :show-no-results="false"
            :close-on-select="true"
            :clear-on-select="false"
            :show-labels="false"
            :limit="6"
            :hide-selected="true"
            placeholder="Choose loaders..."
          />
          <label
            title="The versions of minecraft that this mod version supports"
          >
            Game Versions
          </label>
          <multiselect
            v-model="versions[currentVersionIndex].game_versions"
            class="categories-input"
            :options="selectableVersions"
            :loading="selectableVersions.length === 0"
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
          <label for="version-body" title="A list of changes for this version">
            Changelog
          </label>
          <textarea
            id="version-body"
            v-model="versions[currentVersionIndex].version_body"
            class="changelog-editor"
          />
          <FileInput
            input-id="version-files"
            input-accept="application/*"
            :input-multiple="true"
            default-text="Upload Files"
            @change="updateVersionFiles"
          >
            <label
              class="required"
              title="The files associated with the version"
            >
              Version Files
            </label>
          </FileInput>
        </Popup>
        <div class="versions-header">
          <h3>Versions</h3>
          <button
            title="New Version"
            class="new-version"
            @click="createVersion"
          >
            <PlusIcon />
          </button>
        </div>
        <div v-for="(value, index) in versions" :key="index" class="version">
          <p>{{ value.version_number }}</p>
          <p class="column-grow-4">{{ value.version_title }}</p>
          <p>{{ value.loaders.join(', ') }}</p>
          <p v-if="value.release_channel === 'beta'" class="badge yellow">
            Beta
          </p>
          <p v-if="value.release_channel === 'release'" class="badge green">
            Release
          </p>
          <p v-if="value.release_channel === 'alpha'" class="badge red">
            Alpha
          </p>
          <div>
            <button title="Delete Version" @click="versions.splice(index, 1)">
              <TrashIcon />
            </button>
            <button title="Edit Version" @click="currentVersionIndex = index">
              <EditIcon />
            </button>
          </div>
        </div>
      </section>
      <section class="extra-links">
        <h3>Extras</h3>
        <div class="extras">
          <label
            title="A link where users can go to report bugs, issues, and concerns about your mod."
          >
            Issues URL
            <input v-model="issues_url" type="text" placeholder="Optional" />
          </label>
          <label
            title="A link to a page/repository containing the source code "
          >
            Source Code Link
            <input v-model="source_url" type="text" placeholder="Optional" />
          </label>
          <label
            title="A link to a page containing information, documentation, and help for the mod. (Optional)"
          >
            Wiki Link
            <input v-model="wiki_url" type="text" placeholder="Optional" />
          </label>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Multiselect from 'vue-multiselect'

import Popup from '@/components/Popup'
import FileInput from '@/components/FileInput'
import EthicalAd from '@/components/EthicalAd'
import SaveIcon from '~/assets/images/utils/save.svg?inline'
import TrashIcon from '~/assets/images/utils/trash.svg?inline'
import EditIcon from '~/assets/images/utils/edit.svg?inline'
import PlusIcon from '~/assets/images/utils/plus.svg?inline'

export default {
  components: {
    FileInput,
    Popup,
    EthicalAd,
    Multiselect,
    TrashIcon,
    EditIcon,
    PlusIcon,
    SaveIcon,
  },
  async asyncData() {
    let res = await axios.get(`https://api.modrinth.com/api/v1/tag/category`)
    const categories = res.data

    res = await axios.get(`https://api.modrinth.com/api/v1/tag/loader`)
    const loaders = res.data

    res = await axios.get(`https://api.modrinth.com/api/v1/tag/game_version`)
    const versions = res.data

    return {
      selectableCategories: categories,
      selectableLoaders: loaders,
      selectableVersions: versions,
    }
  },
  data() {
    return {
      previewImage: null,
      compiledBody: '',
      releaseChannels: ['beta', 'alpha', 'release'],
      currentVersionIndex: -1,

      name: '',
      description: '',
      clientSide: '',
      serverSide: '',
      body: '',
      versions: [],
      categories: [],
      issues_url: null,
      source_url: null,
      wiki_url: null,
      icon: null,

      sideTypes: [
        { display: 'Required', name: 'required' },
        { display: 'No functionality', name: 'no_functionality' },
        { display: 'Unsupported', name: 'unsupported' },
      ],
    }
  },
  methods: {
    async createMod() {
      this.$nuxt.$loading.start()

      const formData = new FormData()

      formData.append(
        'data',
        JSON.stringify({
          mod_name: this.name,
          mod_namespace: this.namespace,
          mod_description: this.description,
          mod_body: this.body,
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
        })
      )

      if (this.icon)
        formData.append('icon', new Blob([this.icon]), this.icon.name)

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
        await axios({
          url: 'https://api.modrinth.com/api/v1/mod',
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: this.$auth.getToken('local'),
          },
        })

        await this.$router.replace('/dashboard/projects')
      } catch (err) {
        this.$notify({
          group: 'main',
          title: 'An Error Occurred',
          text: err.response.data.description,
          type: 'error',
        })

        window.scrollTo({ top: 0, behavior: 'smooth' })
      }

      this.$nuxt.$loading.finish()
    },

    showPreviewImage(e) {
      const reader = new FileReader()
      this.icon = e.target.files[0]
      reader.readAsDataURL(this.icon)

      reader.onload = (event) => {
        this.previewImage = event.target.result
      }
    },

    updateVersionFiles(e) {
      this.versions[this.currentVersionIndex].raw_files = e.target.files

      const newFileParts = []
      for (let i = 0; i < e.target.files.length; i++) {
        newFileParts.push(e.target.files[i].name.concat('-' + i))
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
.page-contents {
  display: grid;
  grid-template:
    'header       header            header' auto
    'advert       advert            advert' auto
    'essentials   essentials        mod-icon' auto
    'game-sides   game-sides        game-sides' auto
    'description  description       description' auto
    'versions     versions          versions' auto
    'extra-links  license-donations license-donations' auto
    / 4fr 1fr 4fr;
  column-gap: var(--spacing-card-md);
  row-gap: var(--spacing-card-md);
}

header {
  @extend %card;

  grid-area: header;
  padding: var(--spacing-card-md) var(--spacing-card-lg);

  h2 {
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

section.mod-icon {
  grid-area: mod-icon;

  img {
    max-width: 50%;
    margin-left: var(--spacing-card-lg);
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

  textarea {
    width: 50%;
  }
}

section.versions {
  grid-area: versions;
}

section.extra-links {
  grid-area: extra-links;
}

section.license-donations {
  grid-area: license-donations;
}

label {
  display: flex;

  span {
    flex: 2;
    padding-right: var(--spacing-card-lg);
  }

  input,
  .multiselect {
    flex: 3;
  }
}
</style>
