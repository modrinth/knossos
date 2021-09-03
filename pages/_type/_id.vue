<template>
  <div class="page-container">
    <div class="page-contents">
      <section class="project-info">
        <div class="header">
          <nuxt-link
            :to="
              '/' +
              project.project_type +
              '/' +
              (project.slug ? project.slug : project.id)
            "
          >
            <img
              class="icon"
              :src="
                project.icon_url
                  ? project.icon_url
                  : 'https://cdn.modrinth.com/placeholder.svg?inline'
              "
              alt="project - icon"
          /></nuxt-link>
          <nuxt-link
            :to="
              '/' +
              project.project_type +
              '/' +
              (project.slug ? project.slug : project.id)
            "
          >
            <h1 class="title">{{ project.title }}</h1>
          </nuxt-link>
          <div
            v-if="
              project.client_side === 'optional' &&
              project.server_side === 'optional'
            "
            class="side-descriptor"
          >
            <InfoIcon />
            Universal {{ project.project_type }}
          </div>
          <div
            v-else-if="
              (project.client_side === 'optional' ||
                project.client_side === 'required') &&
              (project.server_side === 'optional' ||
                project.server_side === 'unsupported')
            "
            class="side-descriptor"
          >
            <InfoIcon />
            Client {{ project.project_type }}
          </div>
          <div
            v-else-if="
              (project.server_side === 'optional' ||
                project.server_side === 'required') &&
              (project.client_side === 'optional' ||
                project.client_side === 'unsupported')
            "
            class="side-descriptor"
          >
            <InfoIcon />
            Server {{ project.project_type }}
          </div>
          <div class="buttons">
            <nuxt-link
              v-if="$auth.user"
              :to="`/create/report?id=${project.id}&t=project`"
              class="iconified-button"
            >
              <ReportIcon />
              Report
            </nuxt-link>
            <button
              v-if="
                $auth.user && !$user.follows.find((x) => x.id === project.id)
              "
              class="iconified-button"
              @click="$store.dispatch('user/followProject', project)"
            >
              <FollowIcon />
              Follow
            </button>
            <button
              v-if="
                $auth.user && $user.follows.find((x) => x.id === project.id)
              "
              class="iconified-button"
              @click="$store.dispatch('user/unfollowProject', project)"
            >
              <FollowIcon fill="currentColor" />
              Unfollow
            </button>
          </div>
          <p class="description">
            {{ project.description }}
          </p>
          <p class="categories">
            <span
              v-for="(category, index) in project.categories"
              :key="category"
            >
              {{
                index === project.categories.length - 1
                  ? category.charAt(0).toUpperCase() + category.slice(1)
                  : category.charAt(0).toUpperCase() + category.slice(1) + ' · '
              }}
            </span>
          </p>
          <div class="stats">
            <span class="stat">{{ formatNumber(project.downloads) }}</span>
            <span class="label">downloads</span>
            <span class="stat">{{ formatNumber(project.followers) }}</span>
            <span class="label">followers</span>
          </div>
          <div class="dates">
            <div class="date">
              <CalendarIcon />
              <span class="label">Created</span>
              <span class="value">{{
                $dayjs(project.published).fromNow()
              }}</span>
            </div>
            <div class="date">
              <UpdateIcon />
              <span class="label">Updated</span>
              <span class="value">{{ $dayjs(project.updated).fromNow() }}</span>
            </div>
          </div>
        </div>
        <div v-if="featuredVersions.length > 0" class="section">
          <h3 class="section-title">Featured versions</h3>
          <div
            v-for="version in featuredVersions"
            :key="version.id"
            class="featured-version"
          >
            <a
              :href="findPrimary(version).url"
              class="download"
              @click.prevent="
                downloadFile(
                  findPrimary(version).hashes.sha1,
                  findPrimary(version).url
                )
              "
            >
              <DownloadIcon />
            </a>
            <div class="info">
              <div class="top">
                <nuxt-link
                  :to="`/${project.project_type}/${
                    project.slug ? project.slug : project.id
                  }/version/${encodeURIComponent(version.version_number)}`"
                >
                  {{ version.name }}
                </nuxt-link>
              </div>
              <div class="bottom">
                <VersionBadge :type="version.version_type" />
                <span class="divider" />
                <span
                  v-if="version.game_versions.length > 0"
                  class="game-version"
                >
                  {{
                    version.loaders
                      .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
                      .join(', ')
                  }}
                  {{ version.game_versions[version.game_versions.length - 1] }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="
            project.issues_url ||
            project.source_url ||
            project.wiki_url ||
            project.discord_url
          "
          class="section"
        >
          <h3>External resources</h3>
          <div class="links">
            <a
              v-if="project.issues_url"
              :href="project.issues_url"
              class="title"
              target="_blank"
            >
              <IssuesIcon />
              <p>Issues</p>
            </a>
            <a
              v-if="project.source_url"
              :href="project.source_url"
              class="title"
              target="_blank"
            >
              <CodeIcon />
              <p>Source</p>
            </a>
            <a
              v-if="project.wiki_url"
              :href="project.wiki_url"
              class="title"
              target="_blank"
            >
              <WikiIcon />
              <p>Wiki</p>
            </a>
            <a
              v-if="project.discord_url"
              :href="project.discord_url"
              target="_blank"
            >
              <DiscordIcon v-if="$colorMode.value === 'light'" class="shrink" />
              <DiscordIconWhite v-else class="shrink" />
              <p>Discord</p>
            </a>
            <a
              v-for="(donation, index) in project.donation_urls"
              :key="index"
              :href="donation.url"
              target="_blank"
            >
              <BuyMeACoffeeLogo
                v-if="donation.id === 'bmac' && $colorMode.value === 'light'"
              />
              <BuyMeACoffeeLogoWhite
                v-else-if="
                  donation.id === 'bmac' && $colorMode.value === 'dark'
                "
              />
              <img
                v-else-if="
                  donation.id === 'patreon' && $colorMode.value === 'light'
                "
                class="shrink"
                alt="patreon"
                src="~/assets/images/external/patreon.png"
              />
              <img
                v-else-if="
                  donation.id === 'patreon' && $colorMode.value === 'dark'
                "
                class="shrink"
                alt="patreon"
                src="~/assets/images/external/patreon-white.png"
              />
              <img
                v-else-if="
                  donation.id === 'paypal' && $colorMode.value === 'light'
                "
                class="shrink"
                alt="paypal"
                src="~/assets/images/external/paypal.png"
              />
              <img
                v-else-if="
                  donation.id === 'paypal' && $colorMode.value === 'dark'
                "
                class="shrink"
                alt="paypal"
                src="~/assets/images/external/paypal-white.png"
              />
              <img
                v-else-if="
                  donation.id === 'ko-fi' && $colorMode.value === 'light'
                "
                alt="kofi"
                src="~/assets/images/external/kofi.png"
              />
              <img
                v-else-if="
                  donation.id === 'ko-fi' && $colorMode.value === 'dark'
                "
                alt="kofi"
                src="~/assets/images/external/kofi-white.png"
              />
              <FollowIcon v-else-if="donation.id === 'github'" />
              <UnknownIcon v-else />
              <p v-if="donation.id === 'bmac'">Buy Me a Coffee</p>
              <p v-else-if="donation.id === 'patreon'">Patreon</p>
              <p v-else-if="donation.id === 'paypal'">PayPal</p>
              <p v-else-if="donation.id === 'ko-fi'">Ko-fi</p>
              <p v-else-if="donation.id === 'github'">GitHub Sponsors</p>
              <p v-else>Donate</p>
            </a>
          </div>
        </div>
        <div class="section">
          <h3>Project members</h3>
          <div
            v-for="member in members"
            :key="member.user_id"
            class="team-member columns"
          >
            <img :src="member.avatar_url" alt="profile-picture" />
            <div class="member-info">
              <nuxt-link :to="'/user/' + member.user.username" class="name">
                <p>{{ member.name }}</p>
              </nuxt-link>
              <p class="role">{{ member.role }}</p>
            </div>
          </div>
        </div>
        <div class="section">
          <h3>Technical information</h3>
          <div class="infos">
            <div class="info">
              <div class="key">License</div>
              <div class="value uppercase">
                <a class="text-link" :href="project.license.url || null">{{
                  project.license.id
                }}</a>
              </div>
            </div>
            <div class="info">
              <div class="key">Client side</div>
              <div class="value">
                {{ project.client_side }}
              </div>
            </div>
            <div class="info">
              <div class="key">Server side</div>
              <div class="value">
                {{ project.server_side }}
              </div>
            </div>
            <div class="info">
              <div class="key">Project ID</div>
              <div class="value">
                {{ project.id }}
              </div>
            </div>
          </div>
        </div>
        <Advertisement
          v-if="project.status === 'approved' || project.status === 'unlisted'"
          type="square"
          small-screen="destroy"
        />
      </section>
      <div class="content">
        <div class="project-main">
          <div class="tabs">
            <nuxt-link
              :to="`/${project.project_type}/${
                project.slug ? project.slug : project.id
              }`"
              class="tab"
            >
              <span>Description</span>
            </nuxt-link>
            <nuxt-link
              v-if="project.gallery.length > 0 || currentMember"
              :to="`/${project.project_type}/${
                project.slug ? project.slug : project.id
              }/gallery`"
              class="tab"
            >
              <span>Gallery</span>
            </nuxt-link>
            <nuxt-link
              v-if="project.versions.length > 0"
              :to="`/${project.project_type}/${
                project.slug ? project.slug : project.id
              }/changelog`"
              class="tab"
            >
              <span>Changelog</span>
            </nuxt-link>
            <nuxt-link
              v-if="project.versions.length > 0"
              :to="`/${project.project_type}/${
                project.slug ? project.slug : project.id
              }/versions`"
              class="tab"
            >
              <span>Versions</span>
            </nuxt-link>
            <nuxt-link
              v-if="currentMember"
              :to="`/${project.project_type}/${
                project.slug ? project.slug : project.id
              }/settings`"
              class="tab"
            >
              <span>Settings</span>
            </nuxt-link>
          </div>
          <div class="project-content">
            <NuxtChild
              :project="project"
              :versions.sync="versions"
              :featured-versions.sync="featuredVersions"
              :members="members"
              :current-member="currentMember"
              :all-members="allMembers"
              :dependencies.sync="dependencies"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CalendarIcon from '~/assets/images/utils/calendar.svg?inline'
import DownloadIcon from '~/assets/images/utils/download.svg?inline'
import UpdateIcon from '~/assets/images/utils/updated.svg?inline'
import CodeIcon from '~/assets/images/sidebar/mod.svg?inline'
import ReportIcon from '~/assets/images/utils/report.svg?inline'
import FollowIcon from '~/assets/images/utils/heart.svg?inline'
import InfoIcon from '~/assets/images/utils/info.svg?inline'
import IssuesIcon from '~/assets/images/utils/issues.svg?inline'
import WikiIcon from '~/assets/images/utils/wiki.svg?inline'
import DiscordIcon from '~/assets/images/external/discord.svg?inline'
import DiscordIconWhite from '~/assets/images/external/discord-white.svg?inline'
import BuyMeACoffeeLogo from '~/assets/images/external/bmac.svg?inline'
import BuyMeACoffeeLogoWhite from '~/assets/images/external/bmac-white.svg?inline'
import UnknownIcon from '~/assets/images/utils/unknown.svg?inline'

import Advertisement from '~/components/ads/Advertisement'
import VersionBadge from '~/components/ui/VersionBadge'

export default {
  components: {
    VersionBadge,
    Advertisement,
    IssuesIcon,
    DownloadIcon,
    CalendarIcon,
    UpdateIcon,
    CodeIcon,
    ReportIcon,
    FollowIcon,
    InfoIcon,
    WikiIcon,
    DiscordIcon,
    DiscordIconWhite,
    BuyMeACoffeeLogo,
    BuyMeACoffeeLogoWhite,
    UnknownIcon,
  },
  async asyncData(data) {
    const projectTypes = ['mod', 'modpack']

    try {
      if (
        !data.params.id ||
        !projectTypes.includes(data.params.type.toLowerCase())
      ) {
        data.error({
          statusCode: 404,
          message: 'The page could not be found',
        })

        return
      }

      const [project, members, dependencies, versions, featuredVersions] = (
        await Promise.all([
          data.$axios.get(`project/${data.params.id}`, data.$auth.headers),
          data.$axios.get(
            `project/${data.params.id}/members`,
            data.$auth.headers
          ),
          data.$axios.get(`project/${data.params.id}/dependencies`),
          data.$axios.get(`project/${data.params.id}/version`),
          data.$axios.get(`project/${data.params.id}/version?featured=true`),
        ])
      ).map((it) => it.data)

      if (project.project_type !== data.params.type) {
        data.error({
          statusCode: 404,
          message: 'Project not found',
        })

        return
      }

      members.forEach((it, index) => {
        members[index].avatar_url = it.user.avatar_url
        members[index].name = it.user.username
      })

      const currentMember = data.$auth.user
        ? members.find((x) => x.user.id === data.$auth.user.id)
        : null

      if (project.body_url && !project.body) {
        project.body = (await data.$axios.get(project.body_url)).data
      }

      return {
        project,
        versions,
        featuredVersions,
        members: members.filter((x) => x.accepted),
        allMembers: members,
        currentMember,
        dependencies,
      }
    } catch {
      data.error({
        statusCode: 404,
        message: 'Project not found',
      })
    }
  },
  head() {
    return {
      title: this.project.title + ' - Modrinth',
      meta: [
        {
          hid: 'og:type',
          name: 'og:type',
          content: 'website',
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: this.project.title,
        },
        {
          hid: 'apple-mobile-web-app-title',
          name: 'apple-mobile-web-app-title',
          content: this.project.title,
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.project.description,
        },
        {
          hid: 'description',
          name: 'description',
          content: `${this.project.title}: ${this.project.description} View other minecraft mods on Modrinth today! Modrinth is a new and modern Minecraft modding platform supporting both the Forge and Fabric mod loaders.`,
        },
        {
          hid: 'og:url',
          name: 'og:url',
          content: `https://modrinth.com/project/${this.project.id}`,
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: this.project.icon_url
            ? this.project.icon_url
            : 'https://cdn.modrinth.com/placeholder.png',
        },
        {
          hid: 'robots',
          name: 'robots',
          content: this.project.status !== 'approved' ? 'noindex' : 'all',
        },
      ],
    }
  },
  methods: {
    formatNumber(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    findPrimary(version) {
      let file = version.files.find((x) => x.primary)

      if (!file) {
        file = version.files[0]
      }

      if (!file) {
        file = { url: `/project/${this.project.id}/version/${version.id}` }
      }

      return file
    },
    async downloadFile(hash, url) {
      await this.$axios.get(`version_file/${hash}/download`)

      const elem = document.createElement('a')
      elem.download = hash
      elem.href = url
      elem.click()
    },
  },
}
</script>
<style lang="scss" scoped>
.header {
  align-items: center;
  padding: 1rem 1.5rem;

  @extend %card-spaced-b;

  .icon {
    width: 6rem;
    height: 6rem;
    object-fit: contain;
    border-radius: var(--size-rounded-icon);
  }

  .title {
    margin: 0.25rem 0;
    color: var(--color-text-dark);
    font-size: var(--font-size-2xl);
  }

  .side-descriptor {
    display: flex;
    align-items: center;
    color: var(--color-text-dark);
    font-weight: bold;
    font-size: var(--font-size-sm);
    margin-bottom: 0.5rem;

    svg {
      height: 1.25rem;
      margin-right: 0.125rem;
    }
  }

  .buttons {
    @extend %row;

    button,
    a {
      display: flex;
    }
  }

  .description {
    margin-top: var(--spacing-card-sm);
    margin-bottom: 0.5rem;
    color: var(--color-text-dark);
    font-size: var(--font-size-sm);
  }

  .categories {
    margin: 0.75rem 0;
    font-size: var(--font-size-sm);
    font-weight: bold;
  }

  .stats {
    .stat {
      font-size: var(--font-size-xl);
      font-weight: bold;
    }
    .label {
      margin-right: 0.125rem;
    }
  }

  .dates {
    margin-top: 0.75rem;
    .date {
      font-size: var(--font-size-sm);
      display: flex;
      align-items: center;
      margin-bottom: 0.25rem;

      .label {
        font-weight: lighter;
        margin-right: 0.25rem;
      }

      .value {
        font-weight: bold;
      }

      svg {
        height: 1.25rem;
        margin-right: 0.25rem;
      }
    }
  }
}

.project-main {
  .tabs {
    @extend %card-spaced-b;
    padding: var(--spacing-card-md) var(--spacing-card-lg);

    overflow-x: auto;
    font-size: var(--font-size-sm);
    font-weight: bold;
    margin-bottom: var(--spacing-card-md);

    .tab {
      padding: 0;
      margin: 0 1rem;
      &:first-child {
        margin-left: 0;
      }
      &:last-child {
        margin-right: 0;
      }
    }
    a.tab {
      span {
        margin-bottom: 3px;
      }

      &:hover,
      &:focus,
      &.nuxt-link-exact-active,
      &.active-path {
        span {
          display: table;
          margin-left: auto;
          margin-right: auto;
          border: none;
          margin-bottom: 0;
        }

        span::after {
          border-bottom: 3px solid var(--color-brand-disabled);
          content: '';
          display: block;
          width: 85%;
          margin-top: 3px;
          margin-left: auto;
          margin-right: auto;
        }
      }

      &.nuxt-link-exact-active,
      &.active-path {
        span::after {
          border-bottom: 3px solid var(--color-brand);
        }
      }
    }
  }
}

.project-info {
  height: auto;
  overflow: hidden;

  @media screen and (min-width: 1024px) {
    min-width: 21rem;
    margin-right: var(--spacing-card-md);
  }

  .section {
    @extend %card-spaced-b;
    padding: var(--spacing-card-bg) var(--spacing-card-lg);
  }

  h3 {
    @extend %new-label;
  }

  .featured-version {
    @extend %row;
    padding-top: var(--spacing-card-sm);
    padding-bottom: var(--spacing-card-sm);
    .download {
      display: flex;
      align-items: center;
      height: 1.75rem;
      width: 1.75rem;
      border-radius: 1.5rem;
      background-color: var(--color-button-bg);
      margin-right: var(--spacing-card-sm);
      &:hover {
        background-color: var(--color-button-bg-hover);
      }
      svg {
        width: 1.25rem;
        margin: auto;
      }
      flex-shrink: 0;
    }
    .info {
      @extend %column;
      font-size: var(--font-size-xs);
      .top {
        font-weight: bold;
      }
      .bottom {
        @extend %row;
        align-items: center;
        text-overflow: ellipsis;
        margin-top: 0.25rem;

        .divider {
          width: 0.25rem;
          height: 0.25rem;
          border-radius: 50%;
          display: inline-block;
          margin: 0 0.25rem;
          background-color: var(--color-text);
        }
      }
    }
  }

  .links {
    display: flex;
    flex-wrap: wrap;

    a {
      display: flex;
      align-items: center;
      padding: 0.25rem 1rem;
      background-color: var(--color-button-bg);
      border-radius: 1.5rem;
      margin: 0 0.25rem 0.5rem 0;

      svg,
      img {
        height: 1.25rem;
        width: auto;
      }
      .shrink {
        height: 1rem;
        padding: 0.125rem 0;
      }
      p {
        font-size: var(--font-size-sm);
        margin: 0 0 0 0.25rem;

        .no-margin {
          margin: 0;
        }
      }
    }
  }

  .team-member {
    align-items: center;
    margin-bottom: 0.25rem;

    img {
      border-radius: var(--size-rounded-icon);
      height: 50px;
      width: 50px;
    }
    .member-info {
      overflow: hidden;
      margin: auto 0 auto 0.5rem;
      .name {
        font-weight: bold;
      }
      p {
        font-size: var(--font-size-sm);
        margin: 0.2rem 0;
      }
    }
  }

  .infos {
    .info {
      display: flex;
      font-size: var(--font-size-sm);
      margin: 0.5rem 0;

      .key {
        font-weight: bold;
        width: 40%;
      }
      .value {
        width: 50%;
        text-transform: capitalize;
      }
      .uppercase {
        text-transform: uppercase;
      }
    }
  }
}

@media screen and (max-width: 550px) {
  .title a {
    display: none;
  }
}

@media screen and (max-width: 800px) {
  .project-navigation {
    display: block;
    overflow-x: auto;
    overflow-wrap: break-word;
    overflow-y: hidden;
  }
}
</style>
