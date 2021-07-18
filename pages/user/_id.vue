<template>
  <div class="page-container">
    <div class="page-contents">
      <div class="sidebar-l">
        <div class="card">
          <div class="user-info">
            <img :src="user.avatar_url" :alt="user.username" />
            <div class="text">
              <h2>{{ user.username }}</h2>
              <p v-if="user.role === 'admin'" class="badge red">Admin</p>
              <p v-if="user.role === 'moderator'" class="badge yellow">
                Moderator
              </p>
              <p v-if="user.role === 'developer'" class="badge green">
                Developer
              </p>
            </div>
          </div>
          <p v-if="user.bio" class="bio">{{ user.bio }}</p>
          <div class="buttons">
            <nuxt-link
              v-if="$auth.user && $auth.user.id != user.id"
              :to="`/create/report?id=${user.id}&t=user`"
              class="iconified-button"
            >
              <ReportIcon />
              Report
            </nuxt-link>
          </div>
        </div>
        <div class="card stats">
          <div class="stat">
            <CalendarIcon />
            <div class="info">
              <h4>Joined</h4>
              <p
                v-tooltip="
                  $dayjs(user.created).format(
                    '[Joined] YYYY-MM-DD [at] HH:mm A'
                  )
                "
                class="value"
              >
                {{ $dayjs(user.created).fromNow() }}
              </p>
            </div>
          </div>
          <div class="stat">
            <DownloadIcon />
            <div class="info">
              <h4>Downloads</h4>
              <p class="value">
                {{ sumDownloads() }}
              </p>
            </div>
          </div>
        </div>
        <Advertisement
          type="square"
          small-screen="square"
          ethical-ads-big
          ethical-ads-small
          ethical-ad-type="image"
        />
      </div>
      <div class="content">
        <Advertisement type="banner" small-screen="destroy" />
        <div class="projects">
          <ProjectCard
            v-for="project in projects"
            :id="project.slug || project.id"
            :key="project.id"
            :name="project.title"
            :description="project.description"
            :created-at="project.published"
            :updated-at="project.updated"
            :downloads="project.downloads.toString()"
            :icon-url="project.icon_url"
            :author-url="project.author_url"
            :categories="project.categories"
            :is-modrinth="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProjectCard from '~/components/ui/ProjectCard'

import ReportIcon from '~/assets/images/utils/report.svg?inline'
import CalendarIcon from '~/assets/images/utils/calendar.svg?inline'
import DownloadIcon from '~/assets/images/utils/download.svg?inline'
import Advertisement from '~/components/ads/Advertisement'

export default {
  auth: false,
  components: {
    ProjectCard,
    Advertisement,
    CalendarIcon,
    DownloadIcon,
    ReportIcon,
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
  },
}
</script>

<style lang="scss" scoped>
.sidebar-l {
  @media screen and (min-width: 1024px) {
    min-width: 21rem;
  }

  .user-info {
    @extend %row;
    img {
      width: 6rem;
      height: 6rem;
      margin-right: var(--spacing-card-md);
      border-radius: var(--size-rounded-icon);
    }
    .text {
      h2 {
        margin: 0;
        color: var(--color-text-dark);
        font-size: var(--font-size-lg);
      }
      .badge {
        display: inline-block;
      }
    }
  }
  .buttons {
    @extend %column;

    margin-top: 16px;

    .iconified-button {
      max-width: 4.5rem;
    }
  }
  .stats {
    display: flex;
    flex-wrap: wrap;
    .stat {
      @extend %stat;

      svg {
        padding: 0.25rem;
        border-radius: 50%;
        background-color: var(--color-button-bg);
      }
    }
  }
}
</style>
