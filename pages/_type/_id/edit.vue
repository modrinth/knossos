<template>
  <div class="page-contents">
    <header class="card">
      <div class="columns">
        <h3 class="column-grow-1">Edit project</h3>
        <nuxt-link
          :to="`/${project.project_type}/${
            project.slug ? project.slug : project.id
          }/settings`"
          class="iconified-button column"
        >
          <CrossIcon /> {{ $t('project.edit.actions.cancel') }}
        </nuxt-link>
        <button
          v-if="
            project.status === 'rejected' ||
            project.status === 'draft' ||
            project.status === 'unlisted'
          "
          class="iconified-button column"
          :disabled="!$nuxt.$loading"
          @click="saveProjectReview"
        >
          <CheckIcon /> {{ $t('project.edit.actions.submit-for-review') }}
        </button>
        <button
          class="iconified-button brand-button column"
          :disabled="!$nuxt.$loading"
          @click="saveProjectNotForReview"
        >
          <SaveIcon /> {{ $t('project.edit.actions.save') }}
        </button>
      </div>
      <div v-if="showKnownErrors" class="known-errors">
        <ul>
          <li v-if="newProject.title === ''">
            {{ $t('project.edit.error.no-title') }}
          </li>
          <li v-if="newProject.description === ''">
            {{ $t('project.edit.error.no-description') }}
          </li>
          <li v-if="newProject.slug === ''">
            {{ $t('project.edit.error.no-slug') }}
          </li>
          <li v-if="!savingAsDraft && newProject.body === ''">
            {{ $t('project.edit.error.no-body') }}
          </li>
          <li v-if="!savingAsDraft && project.versions.length < 1">
            {{ $t('project.edit.error.no-versions') }}
          </li>
          <li
            v-if="
              license === null || license_url === null || license_url === ''
            "
          >
            {{ $t('project.edit.error.no-license') }}
          </li>
        </ul>
      </div>
    </header>
    <section class="card essentials">
      <label>
        <span>
          <h3>
            <i18n-formatted message-id="project.edit.name.title">
              <span v-i18n:wrap="'required'" class="required" />
            </i18n-formatted>
          </h3>
          <span>
            {{ $t('project.edit.name.description') }}
          </span>
        </span>
        <input
          v-model="newProject.title"
          :class="{ 'known-error': newProject.title === '' && showKnownErrors }"
          type="text"
          :placeholder="$t('project.edit.name.placeholder')"
          maxlength="64"
          :disabled="
            (currentMember.permissions & EDIT_DETAILS) !== EDIT_DETAILS
          "
        />
      </label>
      <label>
        <span>
          <h3>
            <i18n-formatted message-id="project.edit.description.title">
              <span v-i18n:wrap="'required'" class="required" />
            </i18n-formatted>
          </h3>
          <span>
            {{ $t('project.edit.description.description') }}
          </span>
        </span>
        <input
          v-model="newProject.description"
          :class="{
            'known-error': newProject.description === '' && showKnownErrors,
          }"
          type="text"
          :placeholder="$t('project.edit.description.placeholder')"
          maxlength="256"
          :disabled="
            (currentMember.permissions & EDIT_DETAILS) !== EDIT_DETAILS
          "
        />
      </label>
      <label>
        <span>
          <h3>{{ $t('project.edit.categories.title') }}</h3>
          <span class="no-padding">
            {{ $t('project.edit.categories.description') }}
          </span>
        </span>
        <Multiselect
          id="categories"
          v-model="newProject.categories"
          :options="selectableCategories"
          :custom-label="(value) => $translateCategory(value)"
          :loading="$tag.categories.length === 0"
          :multiple="true"
          :searchable="true"
          :show-no-results="false"
          :close-on-select="false"
          :clear-on-select="false"
          :show-labels="false"
          :max="3"
          :limit="6"
          :hide-selected="true"
          :placeholder="$t('project.edit.categories.placeholder')"
          :disabled="
            (currentMember.permissions & EDIT_DETAILS) !== EDIT_DETAILS
          "
          @input="setCategories"
        />
      </label>
      <label>
        <span>
          <h3>{{ $t('project.edit.additional-categories.title') }}</h3>
          <span class="no-padding">{{
            $t('project.edit.additional-categories.description')
          }}</span>
        </span>
        <Multiselect
          id="additional_categories"
          v-model="newProject.additional_categories"
          :options="selectableAdditionalCategories"
          :custom-label="(value) => $translateCategory(value)"
          :loading="$tag.categories.length === 0"
          :multiple="true"
          :searchable="true"
          :show-no-results="false"
          :close-on-select="false"
          :clear-on-select="false"
          :show-labels="false"
          :max="255"
          :limit="6"
          :hide-selected="true"
          :placeholder="$t('project.edit.additional-categories.placeholder')"
          :disabled="
            (currentMember.permissions & EDIT_DETAILS) !== EDIT_DETAILS
          "
          @input="setCategories"
        />
      </label>
      <label class="vertical-input no-margin">
        <span>
          <h3>
            <i18n-formatted message-id="project.edit.slug.title">
              <span v-i18n:wrap="'required'" class="required" />
            </i18n-formatted>
          </h3>
          <span class="slug-description"
            >https://modrinth.com/{{ project.project_type.toLowerCase() }}/{{
              newProject.slug ? newProject.slug : 'your-slug'
            }}
          </span>
        </span>
        <input
          id="name"
          v-model="newProject.slug"
          :class="{ 'known-error': newProject.slug === '' && showKnownErrors }"
          type="text"
          :placeholder="$t('project.edit.slug.placeholder')"
          maxlength="64"
          :disabled="
            (currentMember.permissions & EDIT_DETAILS) !== EDIT_DETAILS
          "
        />
      </label>
    </section>
    <section class="card project-icon">
      <h3>{{ $t('project.edit.icon.title') }}</h3>
      <Avatar
        size="lg"
        :src="
          previewImage
            ? previewImage
            : newProject.icon_url && !iconChanged
            ? newProject.icon_url
            : null
        "
        alt="preview-image"
      />
      <FileInput
        :max-size="262144"
        :show-icon="true"
        accept="image/png,image/jpeg,image/gif,image/webp"
        class="choose-image"
        :prompt="$t('project.edit.icon.label')"
        :disabled="(currentMember.permissions & EDIT_DETAILS) !== EDIT_DETAILS"
        @change="showPreviewImage"
      />
      <button
        class="iconified-button"
        :disabled="(currentMember.permissions & EDIT_DETAILS) !== EDIT_DETAILS"
        @click="
          icon = null
          previewImage = null
          iconChanged = true
        "
      >
        <TrashIcon /> {{ $t('project.edit.actions.reset-icon') }}
      </button>
    </section>
    <section
      v-if="project.project_type !== 'resourcepack'"
      class="card game-sides"
    >
      <div class="columns">
        <div>
          <h3>{{ $t('project.edit.supported-environments.title') }}</h3>
          <span>
            {{ $t('project.edit.supported-environments.description') }}
          </span>
        </div>
        <div class="labeled-control">
          <h3>
            <i18n-formatted
              message-id="project.edit.supported-environments-client.title"
            >
              <span v-i18n:wrap="'required'" class="required" />
            </i18n-formatted>
          </h3>
          <Multiselect
            v-model="clientSideType"
            :placeholder="$t('project.edit.supported-environments.placeholder')"
            :options="sideTypes"
            :custom-label="(value) => $t(`project.environment-status.${value}`)"
            :searchable="false"
            :close-on-select="true"
            :show-labels="false"
            :allow-empty="false"
            :disabled="
              (currentMember.permissions & EDIT_DETAILS) !== EDIT_DETAILS
            "
          />
        </div>
        <div class="labeled-control">
          <h3>
            <i18n-formatted
              message-id="project.edit.supported-environments-server.title"
            >
              <span v-i18n:wrap="'required'" class="required" />
            </i18n-formatted>
          </h3>
          <Multiselect
            v-model="serverSideType"
            :placeholder="$t('project.edit.supported-environments.placeholder')"
            :options="sideTypes"
            :custom-label="(value) => $t(`project.environment-status.${value}`)"
            :searchable="false"
            :close-on-select="true"
            :show-labels="false"
            :allow-empty="false"
            :disabled="
              (currentMember.permissions & EDIT_DETAILS) !== EDIT_DETAILS
            "
          />
        </div>
      </div>
    </section>
    <section class="card description">
      <h3>
        <label for="body">
          <i18n-formatted message-id="project.edit.body.title">
            <span v-i18n:wrap="'required'" class="required" />
          </i18n-formatted>
        </label>
      </h3>
      <span>
        <i18n-formatted message-id="project.edit.body.description">
          <a
            v-i18n:wrap="'md-help-link'"
            class="text-link"
            href="https://guides.github.com/features/mastering-markdown/"
            target="_blank"
            rel="noopener noreferrer"
          />
        </i18n-formatted>
      </span>
      <Chips
        v-model="bodyViewMode"
        class="separator"
        :items="['source', 'preview']"
        :custom-label="(item) => $t(`project.edit.body.tab.${item}`)"
      />
      <div class="edit-wrapper">
        <div v-if="bodyViewMode === 'source'" class="textarea-wrapper">
          <textarea
            id="body"
            v-model="newProject.body"
            :class="{
              'known-error': newProject.body === '' && showKnownErrors,
            }"
            :disabled="(currentMember.permissions & EDIT_BODY) !== EDIT_BODY"
          />
        </div>
        <div
          v-if="bodyViewMode === 'preview' && newProject.body"
          v-highlightjs
          class="markdown-body"
          v-html="
            newProject.body
              ? $xss($md.render(newProject.body))
              : 'No body specified.'
          "
        ></div>
        <div
          v-if="bodyViewMode === 'preview' && !newProject.body"
          class="markdown-body"
        >
          {{ $t('project.edit.body.preview.no-body') }}
        </div>
      </div>
    </section>
    <section class="card extra-links">
      <div class="title">
        <h3>{{ $t('project.edit.external-links.title') }}</h3>
      </div>
      <label :title="$t('project.edit.issue-tracker.description')">
        <span>{{ $t('project.edit.issue-tracker.title') }}</span>
        <input
          v-model="newProject.issues_url"
          type="url"
          :placeholder="$t('project.edit.generic-url-placeholder')"
          maxlength="2048"
          :disabled="
            (currentMember.permissions & EDIT_DETAILS) !== EDIT_DETAILS
          "
        />
      </label>
      <label :title="$t('project.edit.source-code.description')">
        <span>{{ $t('project.edit.source-code.title') }}</span>
        <input
          v-model="newProject.source_url"
          type="url"
          maxlength="2048"
          :placeholder="$t('project.edit.generic-url-placeholder')"
        />
      </label>
      <label :title="$t('project.edit.wiki.description')">
        <span>{{ $t('project.edit.wiki.title') }}</span>
        <input
          v-model="newProject.wiki_url"
          type="url"
          maxlength="2048"
          :placeholder="$t('project.edit.generic-url-placeholder')"
          :disabled="
            (currentMember.permissions & EDIT_DETAILS) !== EDIT_DETAILS
          "
        />
      </label>
      <label class="no-margin" :title="$t('project.edit.discord.description')">
        <span>{{ $t('project.edit.discord.title') }}</span>
        <input
          v-model="newProject.discord_url"
          type="url"
          maxlength="2048"
          :placeholder="$t('project.edit.generic-url-placeholder')"
          :disabled="
            (currentMember.permissions & EDIT_DETAILS) !== EDIT_DETAILS
          "
        />
      </label>
    </section>
    <section class="card license">
      <div class="title">
        <h3>
          <i18n-formatted message-id="project.edit.license.title">
            <span v-i18n:wrap="'required'" class="required" />
          </i18n-formatted>
        </h3>
      </div>
      <label>
        <span class="pre">
          <i18n-formatted message-id="project.edit.license.description">
            <a
              v-i18n:wrap="'guide-link'"
              href="https://blog.modrinth.com/licensing-guide/"
              target="_blank"
              rel="noopener noreferrer"
              class="text-link"
            />
          </i18n-formatted>
        </span>
        <div class="input-group">
          <Multiselect
            v-model="license"
            :placeholder="$t('project.edit.license.placeholder')"
            track-by="short"
            label="short"
            :options="$tag.licenses"
            :custom-label="(value) => value.short.toUpperCase()"
            :searchable="true"
            :close-on-select="true"
            :show-labels="false"
            :disabled="
              (currentMember.permissions & EDIT_DETAILS) !== EDIT_DETAILS
            "
          />
          <input
            v-model="license_url"
            type="url"
            maxlength="2048"
            :placeholder="$t('project.edit.license-url.placeholder')"
            :disabled="
              (currentMember.permissions & EDIT_DETAILS) !== EDIT_DETAILS
            "
          />
        </div>
      </label>
    </section>
    <section class="card donations">
      <div class="title">
        <h3>{{ $t('project.edit.donation-links.title') }}</h3>
        <button
          class="iconified-button"
          :disabled="false"
          @click="
            donationPlatforms.push({})
            donationLinks.push('')
          "
        >
          <PlusIcon /> {{ $t('project.edit.donation-links.actions.add-link') }}
        </button>
      </div>
      <div v-for="(item, index) in donationPlatforms" :key="index">
        <label>
          <span>{{ $t('project.edit.donation-links.link.title') }}</span>
          <input
            v-model="donationLinks[index]"
            type="url"
            :placeholder="$t('project.edit.generic-url-placeholder')"
          />
        </label>
        <label title="The donation platform of the link.">
          <span>{{ $t('project.edit.donation-links.platform.title') }}</span>
          <Multiselect
            v-model="donationPlatforms[index]"
            :placeholder="
              $t('project.edit.donation-links.platform.placeholder')
            "
            track-by="short"
            label="name"
            :options="$tag.donationPlatforms"
            :searchable="false"
            :close-on-select="true"
            :show-labels="false"
          />
        </label>
        <button
          class="iconified-button"
          @click="
            donationPlatforms.splice(index, 1)
            donationLinks.splice(index, 1)
          "
        >
          <TrashIcon />
          {{ $t('project.edit.donation-links.actions.remove-link') }}
        </button>
        <hr
          v-if="
            donationPlatforms.length > 0 &&
            index !== donationPlatforms.length - 1
          "
        />
      </div>
    </section>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'

import CrossIcon from '~/assets/images/utils/x.svg?inline'
import CheckIcon from '~/assets/images/utils/check.svg?inline'
import PlusIcon from '~/assets/images/utils/plus.svg?inline'
import SaveIcon from '~/assets/images/utils/save.svg?inline'
import TrashIcon from '~/assets/images/utils/trash.svg?inline'

import Chips from '~/components/ui/Chips'
import FileInput from '~/components/ui/FileInput'
import Avatar from '~/components/ui/Avatar'

export default {
  components: {
    Avatar,
    FileInput,
    Chips,
    Multiselect,
    CrossIcon,
    CheckIcon,
    PlusIcon,
    SaveIcon,
    TrashIcon,
  },
  props: {
    project: {
      type: Object,
      default() {
        return {}
      },
    },
    currentMember: {
      type: Object,
      default() {
        return null
      },
    },
  },
  data() {
    return {
      newProject: {},

      clientSideType: '',
      serverSideType: '',

      license: { short: '', name: '' },
      license_url: '',

      donationPlatforms: [],
      donationLinks: [],

      selectableCategories: [],
      selectableAdditionalCategories: [],

      isProcessing: false,
      previewImage: null,
      compiledBody: '',

      icon: null,
      iconChanged: false,

      sideTypes: ['required', 'optional', 'unsupported'],

      isEditing: true,
      bodyViewMode: 'source',

      showKnownErrors: false,
      savingAsDraft: false,
    }
  },
  fetch() {
    this.newProject = this.project

    this.newProject.license.short = this.newProject.license.id

    if (this.newProject.donation_urls) {
      for (const platform of this.newProject.donation_urls) {
        this.donationPlatforms.push({
          short: platform.id,
          name: platform.platform,
        })
        this.donationLinks.push(platform.url)
      }
    }

    this.license = {
      short: this.newProject.license.id,
      name: this.newProject.license.name,
    }

    this.license_url = this.newProject.license.url

    this.clientSideType = this.newProject.client_side
    this.serverSideType = this.newProject.server_side

    this.setCategories()
  },
  watch: {
    license(newValue, oldValue) {
      if (newValue == null) {
        this.license_url = ''
        return
      }

      switch (newValue.short) {
        case 'custom':
          if (oldValue === null || oldValue.short !== '') {
            this.license_url = ''
          }
          break
        default:
          this.license_url = `https://cdn.modrinth.com/licenses/${newValue.short}.txt`
      }
    },
  },
  created() {
    this.UPLOAD_VERSION = 1 << 0
    this.DELETE_VERSION = 1 << 1
    this.EDIT_DETAILS = 1 << 2
    this.EDIT_BODY = 1 << 3
    this.MANAGE_INVITES = 1 << 4
    this.REMOVE_MEMBER = 1 << 5
    this.EDIT_MEMBER = 1 << 6
    this.DELETE_PROJECT = 1 << 7
  },
  methods: {
    setCategories() {
      this.selectableCategories = this.$tag.categories
        .filter(
          (x) =>
            x.project_type === this.project.actualProjectType &&
            !this.newProject.additional_categories.includes(x.name)
        )
        .map((it) => it.name)

      this.selectableAdditionalCategories = this.$tag.categories
        .filter(
          (x) =>
            x.project_type === this.project.actualProjectType &&
            !this.newProject.categories.includes(x.name)
        )
        .map((it) => it.name)
    },
    checkFields() {
      const reviewConditions =
        this.newProject.body !== '' && this.newProject.versions.length > 0
      if (
        this.newProject.name !== '' &&
        this.newProject.description !== '' &&
        this.newProject.slug !== '' &&
        this.license.short !== null &&
        this.license_url !== null &&
        this.license_url !== ''
      ) {
        if (this.savingAsDraft) {
          return true
        } else if (reviewConditions) {
          return true
        }
      }
      this.showKnownErrors = true
      return false
    },
    async saveProjectReview() {
      this.savingAsDraft = false
      if (this.checkFields()) {
        this.isProcessing = true
        await this.saveProject()
      }
    },
    async saveProjectNotForReview() {
      this.savingAsDraft = true
      if (this.checkFields()) {
        await this.saveProject()
      }
    },
    async saveProject() {
      this.$nuxt.$loading.start()

      try {
        const data = {
          title: this.newProject.title,
          description: this.newProject.description,
          body: this.newProject.body,
          categories: this.newProject.categories,
          additional_categories: this.newProject.additional_categories,
          issues_url: this.newProject.issues_url
            ? this.newProject.issues_url
            : null,
          source_url: this.newProject.source_url
            ? this.newProject.source_url
            : null,
          wiki_url: this.newProject.wiki_url ? this.newProject.wiki_url : null,
          license_url: this.license_url,
          discord_url: this.newProject.discord_url
            ? this.newProject.discord_url
            : null,
          license_id: this.license.short,
          client_side: this.clientSideType,
          server_side: this.serverSideType,
          slug: this.newProject.slug,
          license: this.license.short,
          donation_urls: this.donationPlatforms.map((it, index) => {
            return {
              id: it.short,
              platform: it.name,
              url: this.donationLinks[index],
            }
          }),
        }

        if (this.isProcessing) {
          data.status = 'processing'
        }

        await this.$axios.patch(
          `project/${this.newProject.id}`,
          data,
          this.$defaultHeaders()
        )

        if (this.iconChanged) {
          await this.$axios.patch(
            `project/${this.newProject.id}/icon?ext=${
              this.icon.type.split('/')[this.icon.type.split('/').length - 1]
            }`,
            this.icon,
            this.$defaultHeaders()
          )
        }

        this.newProject.license = {
          id: this.newProject.license.short,
          url: this.newProject.license.url,
        }

        this.$emit('update:project', this.newProject)

        this.isEditing = false

        await this.$router.replace(
          `/${this.project.project_type}/${
            this.newProject.slug ? this.newProject.slug : this.newProject.id
          }`
        )
      } catch (err) {
        this.$notify({
          group: 'main',
          title: this.$t('error.generic'),
          text: err.response.data.description,
          type: 'error',
        })

        window.scrollTo({ top: 0, behavior: 'smooth' })
      }

      this.$nuxt.$loading.finish()
    },
    showPreviewImage(files) {
      const reader = new FileReader()
      this.iconChanged = true
      this.icon = files[0]
      reader.readAsDataURL(this.icon)

      reader.onload = (event) => {
        this.previewImage = event.target.result
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;

  h3 {
    margin-top: 0;
  }
}

.pre {
  white-space: pre-wrap;
}

label {
  display: flex;

  span {
    flex: 2;
  }

  input,
  .multiselect,
  .input-group {
    flex: 3;
    height: fit-content;
  }
}

.input-group {
  display: flex;
  flex-direction: column;

  * {
    margin-bottom: var(--spacing-card-sm);
  }
}

.textarea-wrapper {
  display: flex;
  flex-direction: column;
  align-items: stretch;

  textarea {
    flex: 1;
    overflow-y: auto;
    resize: none;
    max-width: 100%;
  }
}

.page-contents {
  display: grid;
  grid-template:
    'header' auto
    'essentials' auto
    'project-icon' auto
    'game-sides' auto
    'description' auto
    'extra-links' auto
    'license' auto
    'donations' auto
    'footer' auto
    / 1fr;

  @media screen and (min-width: 1024px) {
    grid-template:
      'header       header       header' auto
      'essentials   essentials   project-icon' auto
      'game-sides   game-sides   game-sides' auto
      'description  description  description' auto
      'extra-links  extra-links  extra-links' auto
      'license      license      license' auto
      'donations    donations    donations' auto
      'footer       footer       footer' auto
      / 4fr 1fr 2fr;
  }
  column-gap: var(--spacing-card-md);
  row-gap: var(--spacing-card-md);
}

header {
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

section.essentials {
  grid-area: essentials;

  @media screen and (min-width: 1024px) {
    input {
      margin-left: 1.5rem;
    }
  }
}

section.project-icon {
  grid-area: project-icon;

  img {
    margin-bottom: 0.25rem;
  }

  .iconified-button {
    margin-top: 0.5rem;
  }
}

section.game-sides {
  grid-area: game-sides;

  .columns {
    flex-wrap: wrap;

    div {
      flex: 2;
    }

    .labeled-control {
      margin-left: var(--spacing-card-lg);

      h3 {
        margin-bottom: var(--spacing-card-sm);
      }
    }
  }
}

section.description {
  grid-area: description;

  .separator {
    margin: var(--spacing-card-sm) 0;
  }

  .edit-wrapper * {
    min-height: 10rem;
    max-height: 40rem;
  }

  .markdown-body {
    overflow-y: auto;
    padding: 0 var(--spacing-card-sm);
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

  button {
    margin: 0.5rem 0;
  }
}

.footer {
  grid-area: footer;
}

.choose-image {
  cursor: pointer;
}

.card {
  margin-bottom: 0;
}

.required {
  color: var(--color-badge-red-bg);
}

.vertical-input {
  flex-direction: column;
  justify-content: left;
  align-items: unset;
  gap: 0.5rem;

  input {
    margin-left: 0 !important;
  }
}
</style>
