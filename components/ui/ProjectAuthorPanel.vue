<template>
  <div
    v-if="$auth.user && $auth.user.username.toLowerCase() === 'prospector'"
    class="author-actions universal-card grid-display width-16"
  >
    <div
      v-if="project.body.startsWith('# Placeholder description')"
      class="grid-display__item"
    >
      <span class="label">Add a description</span>
      A description that clearly describes the project's purpose and function is
      required.
      <NuxtLink
        :class="{ invisible: routeName === 'type-id-settings-description' }"
        class="goto-link"
        :to="`/${project.project_type}/${
          project.slug ? project.slug : project.id
        }/settings/description`"
        >Visit <span v-if="isSettings">description </span>settings
        <ChevronRightIcon class="featured-header-chevron" aria-hidden="true"
      /></NuxtLink>
    </div>
    <div v-if="!project.icon_url" class="grid-display__item">
      <span class="label">Add an icon</span>Your project should have a
      nice-looking icon to uniquely identify your project at a glance.
      <NuxtLink
        :class="{ invisible: routeName === 'type-id-settings' }"
        class="goto-link"
        :to="`/${project.project_type}/${
          project.slug ? project.slug : project.id
        }/settings`"
        >Visit <span v-if="isSettings">general </span>settings
        <ChevronRightIcon class="featured-header-chevron" aria-hidden="true"
      /></NuxtLink>
    </div>
    <div v-if="!featuredGalleryImage" class="grid-display__item">
      <span class="label">Feature a gallery image</span>Featured gallery images
      may be the first impression of many users.
      <NuxtLink
        :class="{ invisible: routeName === 'type-id-gallery' }"
        class="goto-link"
        :to="`/${project.project_type}/${
          project.slug ? project.slug : project.id
        }/gallery`"
        >View gallery
        <ChevronRightIcon class="featured-header-chevron" aria-hidden="true"
      /></NuxtLink>
    </div>
    <div v-if="versions.length === 0" class="grid-display__item">
      <span class="label">Upload a version</span>At least one version is
      required for a project to be submitted.
      <NuxtLink
        :class="{ invisible: routeName === 'type-id-versions' }"
        class="goto-link"
        :to="`/${project.project_type}/${
          project.slug ? project.slug : project.id
        }/versions`"
        >View versions
        <ChevronRightIcon class="featured-header-chevron" aria-hidden="true"
      /></NuxtLink>
    </div>
  </div>
</template>

<script>
import ChevronRightIcon from '~/assets/images/utils/chevron-right.svg?inline'

export default {
  name: 'ProjectAuthorPanel',
  components: {
    ChevronRightIcon,
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
  },
  computed: {
    featuredGalleryImage() {
      return this.project.gallery.find((img) => img.featured)
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
}
</style>
