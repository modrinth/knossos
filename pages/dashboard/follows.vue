<template>
  <div v-if="user.follows.length > 0" class="project-list display-mode--list">
    <ProjectCard
      v-for="project in user.follows"
      :id="project.id"
      :key="project.id"
      :type="project.project_type"
      :categories="project.categories"
      :created-at="project.published"
      :updated-at="project.updated"
      :description="project.description"
      :downloads="project.downloads ? project.downloads.toString() : '0'"
      :icon-url="project.icon_url"
      :name="project.title"
      :client-side="project.client_side"
      :server-side="project.server_side"
      :color="project.color"
      :show-updated-date="false"
    >
      <button class="iconified-button" @click="userUnfollowProject(project)">
        <HeartIcon />
        {{ formatMessage(messages.unfollowButton) }}
      </button>
    </ProjectCard>
  </div>
  <div v-else class="error">
    <FollowIllustration class="icon" />
    <br />
    <span class="preserve-lines text">
      <IntlFormatted :message-id="messages.noProjectsLabel">
        <template #search-link="{ children }">
          <nuxt-link class="link" to="/mods">
            <component :is="() => children" />
          </nuxt-link>
        </template>
      </IntlFormatted>
    </span>
  </div>
</template>

<script setup>
import ProjectCard from '~/components/ui/ProjectCard.vue'

import HeartIcon from 'assets/images/utils/heart.svg'
import FollowIllustration from 'assets/images/illustrations/follow_illustration.svg'

const user = await useUser()
if (process.client) {
  await initUserFollows()
}

const { formatMessage } = useVIntl()

const messages = defineMessages({
  followsLongTitle: {
    id: 'dashboard.follows.long-title',
    defaultMessage: 'Followed review',
  },
  noProjectsLabel: {
    id: 'dashboard.follows.label.no-projects',
    defaultMessage:
      "You don't have any followed projects.\nWhy don't you <search-link>search</search-link> for new ones?",
  },
  unfollowButton: {
    id: 'dashboard.follows.button.unfollow',
    defaultMessage: 'Unfollow',
  },
})

useHead({
  title() {
    return `${formatMessage(messages.followsLongTitle)} - Modrinth`
  },
})

definePageMeta({
  middleware: 'auth',
})
</script>
