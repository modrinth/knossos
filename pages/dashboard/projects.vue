<template>
  <div>
    <div class="section-header columns">
      <h3 class="column-grow-1">My projects</h3>
      <nuxt-link class="brand-button column" to="/create/project">
        Create a project
      </nuxt-link>
    </div>
    <div v-if="projects.length !== 0">
      <ProjectCard
        v-for="project in projects"
        :id="project.slug ? project.slug : project.id"
        :key="project.id"
        :author="project.author"
        :name="project.title"
        :description="project.description"
        :project-type="project.project_type"
        :latest-version="project.latest_version"
        :created-at="project.published"
        :updated-at="project.updated"
        :downloads="project.downloads.toString()"
        :icon-url="project.icon_url"
        :author-url="project.author_url"
        :page-url="project.page_url"
        :categories="project.categories"
        :edit-mode="true"
        :status="project.status"
        :is-modrinth="true"
      >
        <nuxt-link
          class="button column edit-button"
          :to="`/${project.project_type}/${
            project.slug ? project.slug : project.id
          }/settings`"
        >
          Settings
        </nuxt-link>
      </ProjectCard>
    </div>
    <div v-else class="error">
      <UpToDate class="icon"></UpToDate><br />
      <span class="text"
        >You don't have any projects.<br />
        Would you like to
        <nuxt-link class="link" to="/create/project">create one</nuxt-link
        >?</span
      >
    </div>
  </div>
</template>

<script>
import ProjectCard from '~/components/ui/ProjectCard'
import UpToDate from '~/assets/images/illustrations/up_to_date.svg?inline'

export default {
  components: {
    ProjectCard,
    UpToDate,
  },
  async asyncData(data) {
    const res = await data.$axios.get(
      `user/${data.$auth.user.id}/projects`,
      data.$auth.headers
    )

    return {
      projects: res.data,
    }
  },
  head: {
    title: 'My projects - Modrinth',
  },
}
</script>

<style lang="scss" scoped>
.project-name {
  font-weight: bold;
}

.edit-button {
  align-self: flex-end;
  margin-right: 2rem;
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
    text-align: center;
    margin-bottom: 2rem;
    font-size: 1.25rem;
  }

  .link {
    text-decoration: underline;
  }
}

// .buttonse {
//   margin-left: 4.5rem;
//   padding: 0.5rem 2rem 0.5rem 2rem;
// }
</style>
