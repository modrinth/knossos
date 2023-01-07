<template>
  <div
    v-if="
      $auth.user &&
      currentMember &&
      nags.filter((x) => x.condition).length > 0 &&
      project.status === 'draft'
    "
    class="author-actions universal-card"
  >
    <h2>Publishing checklist</h2>
    <div class="grid-display width-16">
      <div
        v-for="nag in nags.filter((x) => x.condition)"
        :key="nag.id"
        class="grid-display__item"
      >
        <span class="label">
          <RequiredIcon
            v-if="nag.status === 'required'"
            v-tooltip="'Required'"
            :class="nag.status"
          />
          <SuggestionIcon
            v-else-if="nag.status === 'suggestion'"
            v-tooltip="'Suggestion'"
            :class="nag.status"
          />
          <ModerationIcon
            v-else-if="nag.status === 'review'"
            v-tooltip="'Review'"
            :class="nag.status"
          />{{ nag.title }}</span
        >
        {{ nag.description }}
        <NuxtLink
          v-if="nag.link"
          :class="{ invisible: nag.link.hide }"
          class="goto-link"
          :to="`/${project.project_type}/${
            project.slug ? project.slug : project.id
          }/${nag.link.path}`"
        >
          {{ nag.link.title }}
          <ChevronRightIcon
            class="featured-header-chevron"
            aria-hidden="true"
          />
        </NuxtLink>
        <button
          v-else-if="nag.action"
          class="iconified-button moderation-button"
          :disabled="nag.action.disabled()"
          @click="nag.action.onClick"
        >
          <SendIcon />
          {{ nag.action.title }}
        </button>
      </div>
    </div>
    <div class="checklist">
      <div
        v-for="nag in nags"
        :key="`checklist-${nag.id}`"
        v-tooltip="nag.title"
        class="circle"
        :class="'circle ' + (!nag.condition ? 'done ' : '') + nag.status"
      >
        <CheckIcon v-if="!nag.condition" />
        <RequiredIcon v-else-if="nag.status === 'required'" />
        <SuggestionIcon v-else-if="nag.status === 'suggestion'" />
        <ModerationIcon v-else-if="nag.status === 'review'" />
      </div>
    </div>
  </div>
</template>

<script>
import ChevronRightIcon from '~/assets/images/utils/chevron-right.svg?inline'
import CheckIcon from '~/assets/images/utils/check.svg?inline'
import RequiredIcon from '~/assets/images/utils/asterisk.svg?inline'
import SuggestionIcon from '~/assets/images/utils/lightbulb.svg?inline'
import ModerationIcon from '~/assets/images/sidebar/admin.svg?inline'
import SendIcon from '~/assets/images/utils/send.svg?inline'

export default {
  name: 'ProjectPublishingChecklist',
  components: {
    ChevronRightIcon,
    CheckIcon,
    RequiredIcon,
    SuggestionIcon,
    ModerationIcon,
    SendIcon,
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
    versions: {
      type: Array,
      required: true,
    },
    currentMember: {
      type: Object,
      required: true,
    },
    isSettings: {
      type: Boolean,
      default: false,
    },
    routeName: {
      type: String,
      default: '',
    },
    setProcessing: {
      type: Function,
      default() {
        return () => {
          this.$notify({
            group: 'main',
            title: 'An error occurred',
            text: 'setProcessing function not found',
            type: 'error',
          })
        }
      },
    },
  },
  computed: {
    featuredGalleryImage() {
      return this.project.gallery.find((img) => img.featured)
    },
    nags() {
      return [
        {
          condition:
            this.project.body === '' ||
            this.project.body.startsWith('# Placeholder description'),
          title: 'Add a description',
          id: 'add-description',
          description:
            "A description that clearly describes the project's purpose and function is required.",
          status: 'required',
          link: {
            path: 'settings/description',
            title: 'Visit description settings',
            hide: this.routeName === 'type-id-settings-description',
          },
        },
        {
          condition: !this.project.icon_url,
          title: 'Add an icon',
          id: 'add-icon',
          description:
            'Your project should have a nice-looking icon to uniquely identify your project at a glance.',
          status: 'suggestion',
          link: {
            path: 'settings',
            title: 'Visit general settings',
            hide: this.routeName === 'type-id-settings',
          },
        },
        {
          condition: !this.featuredGalleryImage,
          title: 'Feature a gallery image',
          id: 'feature-gallery-image',
          description:
            'Featured gallery images may be the first impression of many users.',
          status: 'suggestion',
          link: {
            path: 'gallery',
            title: 'Visit gallery page',
            hide: this.routeName === 'type-id-gallery',
          },
        },
        {
          condition: this.versions.length < 1,
          title: 'Upload a version',
          id: 'upload-version',
          description:
            'At least one version is required for a project to be submitted.',
          status: 'required',
          link: {
            path: 'versions',
            title: 'Visit versions page',
            hide: this.routeName === 'type-id-versions',
          },
        },
        {
          condition: this.project.categories.length < 1,
          title: 'Select tags',
          id: 'select-tags',
          description: 'Select all tags that apply to your project.',
          status: 'suggestion',
          link: {
            path: 'settings/tags',
            title: 'Visit tag settings',
            hide: this.routeName === 'type-id-settings-tags',
          },
        },
        {
          condition:
            this.project.client_side === 'unknown' ||
            this.project.server_side === 'unknown',
          title: 'Select supported environments',
          id: 'select-environments',
          description: `Select if the ${this.$formatProjectType(
            this.project.project_type
          ).toLowerCase()} functions on the client-side and/or server-side.`,
          status: 'required',
          link: {
            path: 'settings',
            title: 'Visit general settings',
            hide: this.routeName === 'type-id-settings',
          },
        },
        {
          condition: this.project.status === 'draft',
          title: 'Submit for review',
          id: 'submit-for-review',
          description:
            'Your project is only viewable by members of the project. It must be reviewed by moderators in order to be published.',
          status: 'review',
          link: null,
          action: {
            onClick: this.submitForReview,
            title: 'Submit for review',
            disabled: () =>
              this.nags.filter((x) => x.condition && x.status === 'required')
                .length > 0,
          },
        },
      ].sort((a, b) =>
        this.sortByTrue(
          !a.condition,
          !b.condition,
          this.sortByTrue(
            a.status === 'required',
            b.status === 'required',
            this.sortByFalse(a.status === 'review', b.status === 'review')
          )
        )
      )
    },
  },
  methods: {
    sortByTrue(a, b, ifEqual = 0) {
      if (a === b) {
        return ifEqual
      } else if (a) {
        return -1
      } else {
        return 1
      }
    },
    sortByFalse(a, b, ifEqual = 0) {
      if (a === b) {
        return ifEqual
      } else if (b) {
        return -1
      } else {
        return 1
      }
    },
    async submitForReview() {
      if (
        this.nags.filter((x) => x.condition && x.status === 'required')
          .length === 0
      ) {
        await this.setProcessing()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.author-actions {
  &:empty {
    display: none;
  }

  .invisible {
    visibility: hidden;
  }

  .grid-display__item .label {
    display: flex;
    gap: var(--spacing-card-xs);
    align-items: center;

    .required {
      color: var(--color-special-red);
    }

    .suggestion {
      color: var(--color-special-purple);
    }

    .review {
      color: var(--color-special-orange);
    }
  }

  .checklist {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: var(--spacing-card-md);
    margin-top: var(--spacing-card-lg);
    flex-wrap: wrap;

    .circle {
      --circle-size: 3.25rem;
      --background-color: var(--color-bg);
      --content-color: var(--color-special-gray);
      --border-color: var(--content-color);
      width: var(--circle-size);
      height: var(--circle-size);
      border-radius: 50%;
      background-color: var(--background-color);
      display: flex;
      justify-content: center;
      align-items: center;
      border: 3px solid var(--border-color);

      svg {
        color: var(--content-color);
        width: calc(var(--circle-size) / 2);
        height: calc(var(--circle-size) / 2);
      }

      &.required {
        --content-color: var(--color-special-red);
      }

      &.suggestion {
        --content-color: var(--color-special-purple);
      }

      &.review {
        --content-color: var(--color-special-orange);
      }

      &.done {
        --background-color: var(--color-special-green);
        --border-color: var(--color-special-green);
        --content-color: var(--color-brand-inverted);
      }
    }
  }
}
</style>
