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
        <h2>
          <template v-if="isEditing">
            <input v-model="version.name" type="text" />
          </template>
          <template v-else>
            {{ version.name }}
          </template>
        </h2>
        <div v-if="version.featured" class="featured">
          <StarIcon aria-hidden="true" />
          Featured
        </div>
        <div
          v-else-if="featuredVersions.find((x) => x.id === version.id)"
          class="featured"
        >
          <StarIcon aria-hidden="true" />
          Auto-featured
        </div>
      </div>
      <div v-if="isCreating" class="button-group"></div>
      <div v-else-if="isEditing" class="button-group">
        <button
          class="iconified-button brand-button"
          @click="saveEditedVersion"
        >
          <SaveIcon aria-hidden="true" />
          Save
        </button>
        <button
          class="iconified-button"
          @click="version.featured = !version.featured"
        >
          <StarIcon aria-hidden="true" />
          <template v-if="!version.featured"> Feature version </template>
          <template v-else> Unfeature version </template>
        </button>
        <nuxt-link
          v-if="currentMember"
          class="action iconified-button"
          :to="`/${project.project_type}/${
            project.slug ? project.slug : project.id
          }/version/${encodeURI(version.displayUrlEnding)}`"
        >
          <CrossIcon aria-hidden="true" />
          Discard changes
        </nuxt-link>
      </div>
      <div v-else class="button-group">
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
      <template v-if="isEditing">
        <span
          >This editor supports
          <a
            class="text-link"
            href="https://guides.github.com/features/mastering-markdown/"
            target="_blank"
            rel="noopener noreferrer"
            >Markdown</a
          >. HTML can also be used inside your changelog, not including styles,
          scripts, and iframes.
        </span>
        <Chips
          v-model="changelogViewMode"
          class="separator"
          :items="['source', 'preview']"
        />
        <div
          v-if="changelogViewMode === 'source'"
          class="resizable-textarea-wrapper"
        >
          <textarea id="body" v-model="version.changelog" />
        </div>
        <div
          v-if="changelogViewMode === 'preview'"
          v-highlightjs
          class="markdown-body"
          v-html="
            version.changelog
              ? $xss($md.render(version.changelog))
              : 'No changelog specified.'
          "
        ></div>
      </template>
      <div
        v-else
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
      v-if="version.dependencies.length > 0 || isEditing"
      class="version-page__dependencies card"
    >
      <h3>Dependencies</h3>
      <div
        v-for="(dependency, index) in version.dependencies.filter(
          (x) => !x.file_name
        )"
        :key="index"
        class="dependency"
        :class="{ 'button-transparent': !isEditing }"
        @click="!isEditing ? $router.push(dependency.link) : {}"
      >
        <Avatar
          :src="dependency.project ? dependency.project.icon_url : null"
          alt="dependency-icon"
          size="sm"
        />
        <nuxt-link :to="!isEditing ? dependency.link : '#'" class="info">
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
        <button
          v-if="isEditing"
          class="iconified-button"
          @click="version.dependencies.splice(index, 1)"
        >
          <TrashIcon />
          Remove
        </button>
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
      <div
        v-if="isEditing && project.project_type !== 'modpack'"
        class="add-dependency"
      >
        <h4>Add dependency</h4>
        <div class="input-group">
          <Multiselect
            v-model="dependencyAddMode"
            class="input"
            :options="['project', 'version']"
            :custom-label="
              (value) => value.charAt(0).toUpperCase() + value.slice(1)
            "
            :searchable="false"
            :close-on-select="true"
            :show-labels="false"
            :allow-empty="false"
          />
          <input
            v-model="newDependencyId"
            type="text"
            :placeholder="`Enter the ${dependencyAddMode} ID${
              dependencyAddMode === 'project' ? '/slug' : ''
            }`"
            @keyup.enter="addDependency"
          />
          <Multiselect
            v-model="newDependencyType"
            class="input"
            :options="['required', 'optional', 'incompatible', 'embedded']"
            :custom-label="
              (value) => value.charAt(0).toUpperCase() + value.slice(1)
            "
            :searchable="false"
            :close-on-select="true"
            :show-labels="false"
            :allow-empty="false"
          />
        </div>
        <div class="button-group">
          <button class="iconified-button brand-button" @click="addDependency">
            <PlusIcon />
            Add dependency
          </button>
        </div>
      </div>
    </div>
    <div class="version-page__files card">
      <h3>Files</h3>
      <div v-if="isEditing && replaceFile" class="file primary">
        <FileIcon />
        <span>
          <strong>{{ replaceFile.name }}</strong>
          <span class="file-size">({{ $formatBytes(replaceFile.size) }})</span>
        </span>
        <FileInput
          class="iconified-button raised-button"
          prompt="Replace"
          :accept="fileInputAccept"
          :max-size="524288000"
          should-always-reset
          @change="(x) => (replaceFile = x[0])"
        >
          <TransferIcon />
        </FileInput>
      </div>
      <div
        v-for="(file, index) in version.files"
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
        <FileInput
          v-if="isEditing && primaryFile.hashes.sha1 === file.hashes.sha1"
          class="iconified-button raised-button"
          prompt="Replace"
          :accept="fileInputAccept"
          :max-size="524288000"
          should-always-reset
          @change="
            (x) => {
              deleteFiles.push(file.hashes.sha1)
              version.files.splice(index, 1)
              replaceFile = x[0]
            }
          "
        >
          <TransferIcon />
        </FileInput>
        <button
          v-else-if="isEditing"
          class="iconified-button raised-button"
          @click="
            deleteFiles.push(file.hashes.sha1)
            version.files.splice(index, 1)
          "
        >
          <TrashIcon />
          Remove
        </button>
        <a
          v-else
          :href="file.url"
          class="iconified-button raised-button"
          :title="`Download ${file.filename}`"
          tabindex="0"
        >
          <DownloadIcon />
          Download
        </a>
      </div>
      <template v-if="isEditing">
        <div v-for="(file, index) in newFiles" :key="index" class="file">
          <FileIcon />
          <span>
            <strong>{{ file.name }}</strong>
            <span class="file-size">({{ $formatBytes(file.size) }})</span>
          </span>
          <button
            class="iconified-button raised-button"
            @click="newFiles.splice(index, 1)"
          >
            <TrashIcon />
            Remove
          </button>
        </div>
        <div class="additional-files">
          <h4>Upload additional files</h4>
          <span>Used for files such as sources or Javadocs.</span>
          <FileInput
            prompt="Drag and drop to upload or click to select"
            multiple
            long-style
            :accept="fileInputAccept"
            :max-size="524288000"
            @change="(x) => x.forEach((y) => newFiles.push(y))"
          >
            <UploadIcon />
          </FileInput>
        </div>
      </template>
    </div>
    <div class="version-page__metadata">
      <div class="card">
        <h3>Metadata</h3>
        <div>
          <h4>Release channel</h4>
          <Multiselect
            v-if="isEditing"
            v-model="version.version_type"
            class="input"
            placeholder="Select one"
            :options="['release', 'beta', 'alpha']"
            :custom-label="
              (value) => value.charAt(0).toUpperCase() + value.slice(1)
            "
            :searchable="false"
            :close-on-select="true"
            :show-labels="false"
            :allow-empty="false"
          />
          <template v-else>
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
          </template>
        </div>
        <div>
          <h4>Version number</h4>
          <div v-if="isEditing" class="iconified-input">
            <label class="hidden" for="version-number">Version number</label>
            <HashIcon aria-hidden="true" />
            <input
              id="version-number"
              v-model="version.version_number"
              type="text"
              autocomplete="off"
            />
          </div>
          <span v-else>{{ version.version_number }}</span>
        </div>
        <div v-if="project.project_type !== 'resourcepack'">
          <h4>Loaders</h4>
          <Multiselect
            v-if="isEditing"
            v-model="version.loaders"
            :options="
              $tag.loaders
                .filter((x) =>
                  x.supported_project_types.includes(
                    project.actualProjectType.toLowerCase()
                  )
                )
                .map((it) => it.name)
            "
            :custom-label="(value) => $formatCategory(value)"
            :loading="$tag.loaders.length === 0"
            :multiple="true"
            :searchable="false"
            :show-no-results="false"
            :close-on-select="false"
            :clear-on-select="false"
            :show-labels="false"
            :limit="6"
            :hide-selected="true"
            placeholder="Choose loaders..."
          />
          <Categories v-else :categories="version.loaders" />
        </div>
        <div>
          <h4>Game versions</h4>
          <template v-if="isEditing">
            <multiselect
              v-model="version.game_versions"
              :options="
                showSnapshots
                  ? $tag.gameVersions.map((x) => x.version)
                  : $tag.gameVersions
                      .filter((it) => it.version_type === 'release')
                      .map((x) => x.version)
              "
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
            <Checkbox
              v-model="showSnapshots"
              label="Include snapshots"
              description="Include snapshots"
              style="margin-top: 0.5rem"
              :border="false"
            />
          </template>
          <span v-else>{{ $formatVersion(version.game_versions) }}</span>
        </div>
        <div v-if="!isEditing">
          <h4>Downloads</h4>
          <span>{{ version.downloads }}</span>
        </div>
        <div v-if="!isEditing">
          <h4>Publication date</h4>
          <span>
            {{
              $dayjs(version.date_published).format(
                'MMMM D, YYYY [at] h:mm:ss A'
              )
            }}
          </span>
        </div>
        <div v-if="!isEditing">
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
        <div v-if="!isEditing">
          <h4>Version ID</h4>
          <CopyCode :text="version.id" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import VersionBadge from '~/components/ui/Badge'
import Avatar from '~/components/ui/Avatar'
import CopyCode from '~/components/ui/CopyCode'
import Categories from '~/components/ui/search/Categories'
import ModalConfirm from '~/components/ui/ModalConfirm'
import ModalReport from '~/components/ui/ModalReport'
import Chips from '~/components/ui/Chips'
import Checkbox from '~/components/ui/Checkbox'
import FileInput from '~/components/ui/FileInput'

import FileIcon from '~/assets/images/utils/file.svg?inline'
import TrashIcon from '~/assets/images/utils/trash.svg?inline'
import EditIcon from '~/assets/images/utils/edit.svg?inline'
import DownloadIcon from '~/assets/images/utils/download.svg?inline'
import StarIcon from '~/assets/images/utils/star.svg?inline'
import ReportIcon from '~/assets/images/utils/report.svg?inline'
import SaveIcon from '~/assets/images/utils/save.svg?inline'
import CrossIcon from '~/assets/images/utils/x.svg?inline'
import HashIcon from '~/assets/images/utils/hash.svg?inline'
import PlusIcon from '~/assets/images/utils/plus.svg?inline'
import TransferIcon from '~/assets/images/utils/transfer.svg?inline'
import UploadIcon from '~/assets/images/utils/upload.svg?inline'

export default {
  components: {
    FileInput,
    Checkbox,
    Chips,
    Categories,
    DownloadIcon,
    EditIcon,
    TrashIcon,
    StarIcon,
    FileIcon,
    ReportIcon,
    SaveIcon,
    CrossIcon,
    HashIcon,
    PlusIcon,
    TransferIcon,
    UploadIcon,
    VersionBadge,
    Avatar,
    CopyCode,
    ModalConfirm,
    ModalReport,
    Multiselect,
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

      isEditing: false,
      isCreating: false,

      dependencyAddMode: 'project',
      newDependencyType: 'required',
      newDependencyId: '',

      changelogViewMode: 'source',
      showSnapshots: false,

      newFiles: [],
      deleteFiles: [],
      replaceFile: null,
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
      this.isCreating ? 'Create Version' : this.version.name
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
  computed: {
    fileInputAccept() {
      return this.project.actualProjectType.toLowerCase() === 'modpack'
        ? '.mrpack,application/x-modrinth-modpack+zip'
        : this.project.project_type.toLowerCase() === 'mod'
        ? '.jar,actualProjectType/java-archive'
        : '*'
    },
  },
  watch: {
    '$route.path': {
      handler() {
        this.setVersion()
      },
    },
  },
  methods: {
    reset() {
      this.primaryFile = {}
      this.version = {}

      this.changelogViewMode = 'source'

      this.showSnapshots = false

      this.dependencyAddMode = 'project'
      this.newDependencyId = ''
      this.newDependencyType = 'required'

      this.newFiles = []
      this.deleteFiles = []
      this.replaceFile = null

      this.isEditing = false
      this.isCreating = false
    },
    setVersion() {
      this.reset()

      const path = this.$route.name.split('-')
      const mode = path[path.length - 1]

      if (mode === 'create') {
        this.isCreating = true
        this.isEditing = true

        this.version = {
          id: 'none',
          project_id: this.project.id,
          author_id: this.currentMember.user.id,
          name: '',
          version_number: '',
          changelog: '',
          date_published: Date.now(),
          downloads: 0,
          version_type: 'release',
          files: [],
          dependencies: [],
          game_versions: [],
          loaders: [],
          featured: false,
        }
        return
      } else if (mode === 'edit') {
        this.isEditing = true
      }

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
    async addDependency() {
      try {
        if (this.dependencyAddMode === 'project') {
          const project = (
            await this.$axios.get(`project/${this.newDependencyId}`)
          ).data

          this.version.dependencies.push({
            project,
            project_id: project.id,
            dependency_type: this.newDependencyType,
            link: `/${project.project_type}/${project.slug ?? project.id}`,
          })

          this.$emit('update:dependencies', {
            projects: this.dependencies.projects.concat([project]),
            versions: this.dependencies.versions,
          })
        } else if (this.dependencyAddMode === 'version') {
          const version = (
            await this.$axios.get(`version/${this.newDependencyId}`)
          ).data

          const project = (
            await this.$axios.get(`project/${version.project_id}`)
          ).data

          this.version.dependencies.push({
            version,
            project,
            version_id: version.id,
            project_id: project.id,
            dependency_type: this.newDependencyType,
            link: `/${project.project_type}/${
              project.slug ?? project.id
            }/version/${encodeURI(version.version_number)}`,
          })

          this.$emit('update:dependencies', {
            projects: this.dependencies.projects.concat([project]),
            versions: this.dependencies.versions.concat([version]),
          })
        }

        this.newDependencyId = ''
      } catch {
        this.$notify({
          group: 'main',
          title: 'Invalid Dependency',
          text: 'The specified dependency could not be found',
          type: 'error',
        })
      }
    },
    async saveEditedVersion() {
      this.$nuxt.$loading.start()

      try {
        if (this.replaceFile) {
          const reader = new FileReader()
          reader.onloadend = async function (event) {
            const hash = await crypto.subtle.digest(
              'SHA-1',
              event.target.result
            )
            this.primaryFile.hashes.sha1 = [...new Uint8Array(hash)]
              .map((x) => x.toString(16).padStart(2, '0'))
              .join('')
          }

          reader.readAsArrayBuffer(this.replaceFile)
        }

        if (this.newFiles.length > 0 || this.replaceFile) {
          const formData = new FormData()

          formData.append('data', JSON.stringify({}))

          for (let i = 0; i < this.newFiles.length; i++) {
            formData.append(
              this.newFiles[i].name.concat('-' + i),
              new Blob([this.newFiles[i]]),
              this.newFiles[i].name
            )
          }

          if (this.replaceFile) {
            formData.append(
              this.replaceFile.name.concat('-' + this.newFiles.length),
              new Blob([this.replaceFile]),
              this.replaceFile.name
            )
          }

          await this.$axios({
            url: `version/${this.version.id}/file`,
            method: 'POST',
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: this.$auth.token,
            },
          })
        }

        await this.$axios.patch(
          `version/${this.version.id}`,
          {
            name: this.version.name || this.version.version_number,
            version_number: this.version.version_number,
            changelog: this.version.changelog,
            version_type: this.version.version_type,
            dependencies: this.version.dependencies,
            game_versions: this.version.game_versions,
            loaders: this.version.loaders,
            primary_file: ['sha1', this.primaryFile.hashes.sha1],
            featured: this.version.featured,
          },
          this.$defaultHeaders()
        )

        for (const hash of this.deleteFiles) {
          await this.$axios.delete(
            `version_file/${hash}`,
            this.$defaultHeaders()
          )
        }

        const [versions, featuredVersions] = (
          await Promise.all([
            this.$axios.get(
              `project/${this.version.project_id}/version`,
              this.$defaultHeaders()
            ),
            this.$axios.get(
              `project/${this.version.project_id}/version?featured=true`,
              this.$defaultHeaders()
            ),
          ])
        ).map((it) => it.data)

        const newEditedVersions = this.$computeVersions(versions)
        this.$emit('update:versions', newEditedVersions)
        this.$emit('update:featuredVersions', featuredVersions)

        await this.$router.replace(
          `/${this.project.project_type}/${
            this.project.slug ? this.project.slug : this.project.id
          }/version/${encodeURI(
            newEditedVersions.find((x) => x.id === this.version.id)
              .displayUrlEnding
          )}`
        )
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
        font-weight: bold;

        input[type='text'] {
          font-weight: bold;
        }
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

      button {
        margin-left: auto;
      }
    }

    .add-dependency {
      h4 {
        margin-bottom: 0.5rem;
      }

      .input-group {
        margin-bottom: 0.5rem;

        .multiselect {
          width: 8rem;
        }

        input {
          flex-grow: 1;
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

    .additional-files {
      h4 {
        margin-bottom: 0.5rem;
      }
      label {
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

.separator {
  margin: var(--spacing-card-sm) 0;
}
</style>
