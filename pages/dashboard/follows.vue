<template>
  <div>
    <div class="section-header">
      <h3 class="column-grow-1">Followed projects</h3>
    </div>
    <div v-if="projects.length !== 0">
      <ProjectCard
        v-for="(project, index) in projects"
        :id="project.id"
        :key="project.id"
        :author="project.author"
        :author-url="project.author_url"
        :categories="project.categories"
        :created-at="project.published"
        :description="project.description"
        :downloads="project.downloads.toString()"
        :edit-mode="true"
        :icon-url="project.icon_url"
        :is-modrinth="true"
        :latest-version="project.latest_version"
        :name="project.title"
        :page-url="project.page_url"
        :updated-at="project.updated"
      >
        <div class="buttons">
          <button
            class="button column unfav-button iconified-button"
            @click="unfavProject(index)"
          >
            <FollowIcon />
            Unfollow
          </button>
        </div>
      </ProjectCard>
    </div>
    <div v-else class="error">
      <FollowIllustration class="icon"></FollowIllustration>
      <br />
      <span class="text"
        >You don't have any followed projects. <br />
        Why don't you <nuxt-link class="link" to="/mods">search</nuxt-link> for
        new ones?</span
      >
    </div>
  </div>
</template>

<script>
import ProjectCard from '~/components/ui/ProjectCard'
import FollowIcon from '~/assets/images/utils/heart.svg?inline'
import FollowIllustration from '~/assets/images/illustrations/follow_illustration.svg?inline'

export default {
  components: {
    ProjectCard,
    FollowIcon,
    FollowIllustration,
  },
  async asyncData(data) {
    const projects = await data.$axios
      .get(`user/${data.$auth.user.id}/follows`, data.$auth.headers)
      .then((res) => res.data.sort((a, b) => a.title > b.title))

    return {
      projects,
    }
  },
  methods: {
    async unfavProject(index) {
      await this.$axios.delete(
        `project/${this.projects[index].id}/follow`,
        this.$auth.headers
      )

      this.projects.splice(index, 1)
    },
  },
  head: {
    title: 'Followed projects - Modrinth',
  },
}
</script>

<style lang="scss" scoped>
.button {
  margin: 0.25rem 2rem 0.25rem 0;
}

.buttons {
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.unfav-button {
  margin-left: auto;
  padding: 0.5rem;
}

.error {
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;

  .icon {
    width: 8rem;
    height: 8rem;
    margin: 1.5rem 0;
  }

  .text {
    margin-bottom: 2rem;
    font-size: 1.25rem;
    text-align: center;
  }

  .link {
    text-decoration: underline;
  }
}
</style>
