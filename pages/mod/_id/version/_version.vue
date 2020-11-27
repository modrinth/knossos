<template>
  <ModPage :mod="mod" :versions="versions" :members="members">
    <div class="version">
      <div class="header">
        <h3>{{ version.name }}</h3>
        <div
          v-if="
            this.$auth.loggedIn &&
            members.find((x) => x.user_id === this.$auth.user.id)
          "
          class="user-actions"
        >
          <button class="trash red">
            <TrashIcon />
          </button>
          <button class="upload" @click="showPopup = !showPopup">
            <UploadIcon />
          </button>
        </div>
      </div>
      <div v-compiled-markdown="changelog" class="markdown-body"></div>
      <hr />
      <div class="columns metadata">
        <div class="author">
          <img :src="version.author.avatar_url" />
          <p>{{ version.author.name }}</p>
        </div>
        <p>{{ version.downloads }} Downloads</p>
        <div>
          <FabricIcon
            v-if="version.loaders.includes('fabric')"
            stroke="#AC6C3A"
          />
          <ForgeIcon
            v-if="version.loaders.includes('forge')"
            stroke="#8B81E6"
          />
        </div>
        <div class="game-versions">
          <p v-for="gameVersion in version.game_versions" :key="gameVersion">
            {{ gameVersion }}
          </p>
        </div>
      </div>
      <hr />
      <div class="files">
        <div v-for="file in version.files" :key="file.hashes.sha1">
          <p>{{ file.filename }}</p>
          <a :href="file.url" download>
            <DownloadIcon />
          </a>
        </div>
      </div>
    </div>
    <Popup :show-popup="showPopup">
      <h3 class="popup-title">Upload Files</h3>
      <FileInput
        input-id="version-files"
        input-accept="application/*"
        default-text="Upload Files"
        :input-multiple="true"
        @change="addFiles"
      >
        <label class="required" title="The files associated with the version">
          Version Files
        </label>
      </FileInput>
      <div class="popup-buttons">
        <button
          class="trash-button"
          @click="
            showPopup = false
            filesToUpload = []
          "
        >
          <TrashIcon />
        </button>
        <button class="default-button" @click="uploadFiles">Upload</button>
      </div>
    </Popup>
  </ModPage>
</template>
<script>
import axios from 'axios'

import ModPage from '@/components/ModPage'

import Popup from '@/components/Popup'
import DownloadIcon from '~/assets/images/utils/download.svg?inline'
import UploadIcon from '~/assets/images/utils/upload.svg?inline'
import TrashIcon from '~/assets/images/utils/trash.svg?inline'

import ForgeIcon from '~/assets/images/categories/forge.svg?inline'
import FabricIcon from '~/assets/images/categories/fabric.svg?inline'

export default {
  components: {
    Popup,
    ModPage,
    ForgeIcon,
    FabricIcon,
    DownloadIcon,
    UploadIcon,
    TrashIcon,
  },
  auth: false,
  async asyncData(data) {
    let res = await axios.get(
      `https://api.modrinth.com/api/v1/mod/${data.params.id}`
    )
    const mod = res.data

    res = await axios.get(
      `https://api.modrinth.com/api/v1/team/${mod.team}/members`
    )
    const members = res.data
    for (let i = 0; i < members.length; i++) {
      res = await axios.get(
        `https://api.modrinth.com/api/v1/user/${members[i].user_id}`
      )
      members[i].avatar_url = res.data.avatar_url
    }

    const versions = []
    for (const version of mod.versions) {
      res = await axios.get(
        `https://api.modrinth.com/api/v1/version/${version}`
      )

      versions.push(res.data)
    }

    const version = versions.find((x) => x.id === data.params.version)

    version.author = members.find((x) => x.user_id === version.author_id)

    let changelog = ''
    if (version.changelog_url) {
      changelog = await axios.get(version.changelog_url)
    }

    return {
      mod,
      versions,
      members,
      version,
      changelog,
    }
  },
  data() {
    return {
      showPopup: false,
      filesToUpload: [],
    }
  },
  methods: {
    addFiles(e) {
      this.filesToUpload = e.target.files

      for (let i = 0; i < e.target.files.length; i++) {
        this.filesToUpload[i].multipartName = e.target.files[i].name.concat(
          '-' + i
        )
      }
    },
    async uploadFiles() {
      this.$nuxt.$loading.start()

      const formData = new FormData()

      formData.append('data', JSON.stringify({}))

      for (const fileToUpload in this.filesToUpload) {
        formData.append(
          fileToUpload.multipartName,
          new Blob([fileToUpload]),
          fileToUpload.name
        )
      }

      try {
        await axios({
          url: `https://api.modrinth.com/api/v1/version/${this.version.id}/file`,
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: this.$auth.getToken('local'),
          },
        })

        await this.$router.go(null)
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
  },
  head() {
    return {
      title: this.mod.title + ' - Modrinth - Files',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            this.mod.description +
            ' View other minecraft mods on Modrinth today! Modrinth is a new and modern Minecraft modding platform that is compatible with CurseForge too!',
        },

        {
          hid: 'apple-mobile-web-app-title',
          name: 'apple-mobile-web-app-title',
          content: this.mod.title,
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: this.mod.title,
        },
        {
          hid: 'og:url',
          name: 'og:url',
          content: `https://modrinth.com/mod/${this.mod.id}`,
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.mod.description,
        },
        { hid: 'og:type', name: 'og:type', content: 'website' },
        {
          hid: 'og:image',
          name: 'og:image',
          content: this.mod.icon_url
            ? this.mod.icon_url
            : 'https://cdn.modrinth.com/placeholder.png',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.version {
  margin-bottom: var(--spacing-card-md);
  background: var(--color-raised-bg);
  border-radius: var(--size-rounded-card);
  padding: 1rem;

  .header {
    h3 {
      display: inline-block;
    }
    .user-actions {
      float: right;

      button {
        cursor: pointer;
        margin-right: 10px;
        padding: 5px;
        border: none;
      }

      .trash {
        background-color: #fae5e5;
        color: #9b2c2c;
      }

      .upload {
        * {
          margin: auto 0;
        }
      }
    }
  }

  hr {
    margin: 20px 0;
    background-color: var(--color-divider);
    border: none;
    height: 1px;
  }

  .metadata {
    align-items: center;
    justify-content: space-between;

    .author {
      display: flex;
      align-items: center;
      img {
        height: 50px;
        width: 50px;
        margin-right: 10px;
        border-radius: var(--size-rounded-icon);
      }
    }
  }

  .game-versions {
    max-width: 200px;
    p {
      margin: 0 0 0 10px;
      padding: 4px;
      font-size: 15px;
      color: var(--color-text);
      background-color: var(--color-grey-1);
      display: inline-block;
    }
  }

  .files {
    display: flex;

    div {
      display: flex;
      margin-right: 10px;
      background: var(--color-bg);
      border-radius: var(--size-rounded-control);

      p {
        margin-left: 10px;
        margin-right: 10px;
      }

      a {
        display: table-cell;
        margin-left: auto;
        width: 40px;
        height: 60px;

        svg {
          margin-top: 15px;
          height: 30px;
          width: 40px;
        }

        &:hover,
        &:focus {
          background-color: var(--color-button-bg-hover);
          color: var(--color-button-text-hover);
          border-radius: 0 var(--size-rounded-control)
            var(--size-rounded-control) 0;
        }
      }
    }
  }
}

.popup-title {
  margin-bottom: 40px;
}

.popup-buttons {
  margin-top: 40px;
  display: flex;
  justify-content: left;
  align-items: center;

  .default-button {
    border-radius: var(--size-rounded-sm);
    cursor: pointer;
    border: none;
    padding: 10px;
    background-color: var(--color-grey-1);
    color: var(--color-grey-5);

    &:hover,
    &:focus {
      color: var(--color-grey-4);
    }
  }

  .trash-button {
    cursor: pointer;
    margin-right: 10px;
    padding: 5px;
    border: none;
    border-radius: var(--size-rounded-sm);
    color: #9b2c2c;
    background-color: var(--color-bg);
  }
}
</style>
