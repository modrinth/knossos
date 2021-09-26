<template>
  <div class="page-container">
    <div class="page-contents">
      <div class="sidebar-l">
        <div class="card">
          <img :src="user.avatar_url" :alt="user.username" />
          <h1>{{ user.username }}</h1>
          <div class="buttons section">
            <nuxt-link
              v-if="$auth.user && $auth.user.id !== user.id"
              :to="`/create/report?id=${user.id}&t=user`"
              class="iconified-button"
            >
              <ReportIcon />
              Report
            </nuxt-link>
            <nuxt-link
              v-if="$auth.user && $auth.user.id === user.id"
              to="/settings"
              class="iconified-button"
            >
              <EditIcon />
              Edit
            </nuxt-link>
          </div>

          <div class="about section">
            <h3>About me</h3>
            <Badge v-if="user.role === 'admin'" type="admin" color="red" />
            <Badge
              v-else-if="user.role === 'moderator'"
              type="moderator"
              color="yellow"
            />
            <Badge v-else type="developer" color="green" />
            <p v-if="user.bio" class="bio">{{ user.bio }}</p>
            <p class="joined">
              <SunriseIcon />
              Joined {{ $dayjs(user.created).fromNow() }}
            </p>
            <p class="joined">
              <UserIcon />
              User ID: {{ user.id }}
            </p>
            <div class="stats">
              <div>
                <DownloadIcon />
                <p>
                  <strong>{{ sumDownloads() }}</strong> downloads
                </p>
              </div>
              <div>
                <HeartIcon />
                <p>
                  <strong>{{ sumFollows() }}</strong> followers of projects
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="tabs">
          <ThisOrThat v-model="selectedProjectType" :items="projectTypes" />
          <nuxt-link
            v-if="$auth.user && $auth.user.id === user.id"
            to="/create/project"
            class="iconified-button brand-button-colors"
          >
            <PlusIcon />
            Create a project
          </nuxt-link>
        </div>
        <div v-if="projects.length > 0" class="projects">
          <ProjectCard
            v-for="project in selectedProjectType !== 'all'
              ? projects.filter((x) => x.project_type === selectedProjectType)
              : projects"
            :id="project.slug || project.id"
            :key="project.id"
            :name="project.title"
            :description="project.description"
            :created-at="project.published"
            :updated-at="project.updated"
            :downloads="project.downloads.toString()"
            :follows="project.followers.toString()"
            :icon-url="project.icon_url"
            :categories="project.categories"
            :client-side="project.client_side"
            :server-side="project.server_side"
            :status="project.status"
            :type="project.project_type"
          >
            <nuxt-link
              v-if="$auth.user && $auth.user.id === user.id"
              class="iconified-button"
              :to="`/${project.project_type}/${
                project.slug ? project.slug : project.id
              }/settings`"
            >
              <SettingsIcon />
              Settings
            </nuxt-link>
          </ProjectCard>
        </div>
        <div v-else class="error">
          <UpToDate class="icon" /><br />
          <span v-if="$auth.user && $auth.user.id === user.id" class="text"
            >You don't have any projects.<br />
            Would you like to
            <nuxt-link class="link" to="/create/project">create one</nuxt-link
            >?</span
          >
          <span v-else class="text">This user has no projects!</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProjectCard from '~/components/ui/ProjectCard'
import ThisOrThat from '~/components/ui/ThisOrThat'
import Badge from '~/components/ui/Badge'

import ReportIcon from '~/assets/images/utils/report.svg?inline'
import EditIcon from '~/assets/images/utils/edit.svg?inline'
import SunriseIcon from '~/assets/images/utils/sunrise.svg?inline'
import DownloadIcon from '~/assets/images/utils/download-alt.svg?inline'
import HeartIcon from '~/assets/images/utils/heart.svg?inline'
import SettingsIcon from '~/assets/images/utils/settings.svg?inline'
import PlusIcon from '~/assets/images/utils/plus.svg?inline'
import UpToDate from '~/assets/images/illustrations/up_to_date.svg?inline'
import UserIcon from '~/assets/images/utils/user.svg?inline'

export default {
  auth: false,
  components: {
    ProjectCard,
    SunriseIcon,
    DownloadIcon,
    ReportIcon,
    EditIcon,
    HeartIcon,
    Badge,
    SettingsIcon,
    PlusIcon,
    ThisOrThat,
    UpToDate,
    UserIcon,
  },
  async asyncData(data) {
    try {
      const [user, projects] = (
        await Promise.all([
          data.$axios.get(`user/${data.params.id}`),
          data.$axios.get(`user/${data.params.id}/projects`),
        ])
      ).map((it) => it.data)

      return {
        selectedProjectType: 'all',
        user,
        projects,
      }
    } catch {
      data.error({
        statusCode: 404,
        message: 'User not found',
      })
    }
  },
  head() {
    return {
      title: this.user.username + ' - Modrinth',
      meta: [
        {
          hid: 'og:type',
          name: 'og:type',
          content: 'website',
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: this.user.username,
        },
        {
          hid: 'apple-mobile-web-app-title',
          name: 'apple-mobile-web-app-title',
          content: this.user.username,
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.user.bio,
        },
        {
          hid: 'description',
          name: 'description',
          content:
            this.user.bio +
            ' - View minecraft mods on Modrinth today! Modrinth is a new and modern Minecraft modding platform that is compatible with CurseForge too!',
        },
        {
          hid: 'og:url',
          name: 'og:url',
          content: `https://modrinth.com/user/${this.user.id}`,
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content:
            this.user.avatar_url || 'https://cdn.modrinth.com/placeholder.png',
        },
      ],
    }
  },
  computed: {
    projectTypes() {
      const obj = { all: true }

      for (const project of this.projects) {
        obj[project.project_type] = true
      }

      return Object.keys(obj)
    },
  },
  methods: {
    formatNumber(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    sumDownloads() {
      let sum = 0

      for (const projects of this.projects) {
        sum += projects.downloads
      }

      return this.formatNumber(sum)
    },
    sumFollows() {
      let sum = 0

      for (const projects of this.projects) {
        sum += projects.followers
      }

      return this.formatNumber(sum)
    },
  },
}
</script>

<style lang="scss" scoped>
.sidebar-l {
  .card {
    img {
      width: 8rem;
      height: 8rem;
      border-radius: var(--size-rounded-lg);

      object-fit: contain;
    }

    h1 {
      margin: 0 0 0.5rem 0;
      color: var(--color-text-dark);
    }

    .buttons {
      display: flex;
    }

    h3 {
      margin-bottom: 1rem;
    }

    .version-badge {
      margin: 0 0 0.75rem 0;
    }

    .bio {
      overflow-wrap: break-word;
      hyphens: manual;
      margin: 0 0 0.75rem 0;
    }

    .joined {
      margin: 0 0 0.25rem 0;
      display: flex;
      color: var(--color-icon);

      svg {
        width: auto;
        height: 1rem;
        margin-right: 0.25rem;
      }
    }

    .stats {
      margin-top: 0.5rem;
      div {
        display: flex;
        align-items: center;

        svg {
          height: 1.25rem;
          width: auto;
          margin-right: 0.25rem;
        }

        p {
          margin: 0;

          strong {
            font-size: var(--font-size-lg);
          }
        }
      }
    }
  }
}

.content {
  .tabs {
    @extend %card;

    display: flex;
    align-items: center;
    margin-bottom: var(--spacing-card-md);
    overflow-x: auto;

    .iconified-button {
      margin-left: auto;
    }
  }
}

@media screen and (min-width: 1024px) {
  .page-contents {
    max-width: calc(1280px - 8rem);
  }
}
</style>
