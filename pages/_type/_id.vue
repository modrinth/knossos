<template>
  <div class="page-container">
    <ModalReport
      ref="modal_project_report"
      :item-id="project.id"
      item-type="project"
    />
    <div
      :class="{
        'page-contents': true,
        'alt-layout': $store.state.cosmetics.projectLayout,
      }"
    >
      <div class="header card">
        <nuxt-link
          :to="
            '/' +
            project.project_type +
            '/' +
            (project.slug ? project.slug : project.id)
          "
        >
          <Avatar :src="project.icon_url" :alt="project.title" size="md" />
        </nuxt-link>
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
        <div v-if="sideTip != null">
          <div class="side-descriptor">
            <InfoIcon aria-hidden="true" />
            {{ sideTip }}
          </div>
        </div>

        <p class="description">
          {{ project.description }}
        </p>
        <Categories
          :categories="project.categories"
          :type="project.actualProjectType"
          class="categories"
        />
        <hr class="card-divider" />
        <div class="stats">
          <span>
            <!-- FIXME: use computed values below -->
            <IntlFormatted
              message-id="project.stats.downloads"
              :values="
                $deunionize(
                  $fmt.compactNumber(project.downloads),
                  '$counter',
                  'downloads'
                )
              "
            >
              <template #~counter="{ values: { $counter } }">
                <span class="stat">{{ $counter }}</span>
              </template>
            </IntlFormatted>
          </span>
          <span>
            <IntlFormatted
              message-id="project.stats.followers"
              :values="
                $deunionize(
                  $fmt.compactNumber(project.followers),
                  '$counter',
                  'followers'
                )
              "
            >
              <template #~counter="{ values: { $counter } }">
                <span class="stat">{{ $counter }}</span>
              </template>
            </IntlFormatted>
          </span>
        </div>
        <div class="dates">
          <div
            v-tooltip="
              $fmt.date(new Date(project.published), {
                dateStyle: 'long',
                timeStyle: 'medium',
              })
            "
            class="date"
          >
            <CalendarIcon aria-hidden="true" />
            {{
              $t('project.stats.created', {
                ago: $fmt.timeDifference(project.published),
                projectType: safeProjectType,
              })
            }}
          </div>
          <div
            v-tooltip="
              $fmt.date(new Date(project.updated), {
                dateStyle: 'long',
                timeStyle: 'medium',
              })
            "
            class="date"
          >
            <UpdateIcon aria-hidden="true" />
            {{
              $t('project.stats.updated', {
                ago: $fmt.timeDifference(project.updated),
                projectType: safeProjectType,
              })
            }}
          </div>
        </div>
        <hr class="card-divider" />
        <div class="buttons">
          <template v-if="$auth.user">
            <button
              class="iconified-button"
              @click="$refs.modal_project_report.show()"
            >
              <ReportIcon aria-hidden="true" />
              {{ $t('generic.action.report') }}
            </button>
            <button
              v-if="!$user.follows.find((x) => x.id === project.id)"
              class="iconified-button"
              @click="$store.dispatch('user/followProject', project)"
            >
              <FollowIcon aria-hidden="true" />
              {{ $t('project-page.action.follow') }}
            </button>
            <button
              v-if="$user.follows.find((x) => x.id === project.id)"
              class="iconified-button"
              @click="$store.dispatch('user/unfollowProject', project)"
            >
              <FollowIcon fill="currentColor" aria-hidden="true" />
              {{ $t('generic.action.unfollow') }}
            </button>
          </template>
          <template v-else>
            <a class="iconified-button" :href="authUrl">
              <ReportIcon aria-hidden="true" />
              {{ $t('generic.action.report') }}
            </a>
            <a class="iconified-button" :href="authUrl">
              <FollowIcon fill="currentColor" aria-hidden="true" />
              {{ $t('project-page.action.follow') }}
            </a>
          </template>
        </div>
      </div>
      <div
        v-if="
          currentMember &&
          (project.status !== 'approved' ||
            (project.moderator_message &&
              (project.moderator_message.message ||
                project.moderator_message.body)))
        "
        class="project-status card"
      >
        <h3 class="card-header">{{ $t('project-page.status.title') }}</h3>
        <div class="status-info"></div>
        <p>
          {{ $t('project-page.status.description') }}
          <VersionBadge
            v-if="project.status === 'approved'"
            color="green"
            :type="$t('project-status.approved')"
          />
          <VersionBadge
            v-else-if="
              project.status === 'processing' || project.status === 'archived'
            "
            color="yellow"
            :type="$t(`project-status.${project.status}`)"
          />
          <VersionBadge
            v-else-if="project.status === 'rejected'"
            color="red"
            :type="$t('project-status.rejected')"
          />
          <VersionBadge
            v-else
            color="gray"
            :type="$t(`project-status.${project.status}`)"
          />
        </p>
        <div class="message">
          <p v-if="project.status === 'processing'">
            <IntlFormatted message-id="project-page.status.messages.processing">
              <template #rules-link="{ children }">
                <nuxt-link to="/legal/rules">
                  <Fragment :of="children" />
                </nuxt-link>
              </template>
            </IntlFormatted>
          </p>
          <p v-if="project.status === 'draft'">
            {{ $t('project-page.status.messages.draft') }}
          </p>
          <p v-if="project.moderator_message">
            {{ project.moderator_message.message }}
          </p>
          <div
            v-if="project.moderator_message && project.moderator_message.body"
            v-highlightjs
            class="markdown-body"
            v-html="$xss($md.render(project.moderator_message.body))"
          ></div>
        </div>
        <div class="buttons">
          <button
            v-if="
              project.status === 'rejected' ||
              project.status === 'unlisted' ||
              project.status === 'abandoned'
            "
            class="iconified-button brand-button"
            @click="submitForReview"
          >
            <CheckIcon />
            {{ $t('project-page.action.resubmit-for-review') }}
          </button>
          <button
            v-if="project.status === 'draft'"
            class="iconified-button brand-button"
            @click="submitForReview"
          >
            <CheckIcon />
            {{ $t('project.action.submit-for-review') }}
          </button>
          <button
            v-if="project.status === 'approved'"
            class="iconified-button"
            @click="clearMessage"
          >
            <ClearIcon />
            {{ $t('project-page.action.clear-message') }}
          </button>
        </div>
        <div v-if="showKnownErrors" class="known-errors">
          <ul>
            <li v-if="project.body === ''">
              {{ $t('project.submit-error.no-body') }}
            </li>
            <li v-if="project.versions.length < 1">
              {{ $t('project.submit-error.no-versions') }}
            </li>
          </ul>
        </div>
        <p v-if="project.status === 'rejected'">
          {{ $t('project-page.notice.no-resubmit') }}
        </p>
      </div>
      <div class="extra-info card">
        <template
          v-if="
            project.issues_url ||
            project.source_url ||
            project.wiki_url ||
            project.discord_url ||
            project.donation_urls.length > 0
          "
        >
          <h3 class="card-header">
            {{ $t('project-page.external-resources.title') }}
          </h3>
          <div class="links">
            <a
              v-if="project.issues_url"
              :href="project.issues_url"
              class="title"
              target="_blank"
            >
              <IssuesIcon aria-hidden="true" />
              <span>{{ $t('project-page.external-resources.issues') }}</span>
            </a>
            <a
              v-if="project.source_url"
              :href="project.source_url"
              class="title"
              target="_blank"
            >
              <CodeIcon aria-hidden="true" />
              <span>{{ $t('project-page.external-resources.source') }}</span>
            </a>
            <a
              v-if="project.wiki_url"
              :href="project.wiki_url"
              class="title"
              target="_blank"
            >
              <WikiIcon aria-hidden="true" />
              <span>{{ $t('project-page.external-resources.wiki') }}</span>
            </a>
            <a
              v-if="project.discord_url"
              :href="project.discord_url"
              target="_blank"
            >
              <DiscordIcon class="shrink" aria-hidden="true" />
              <span>{{ $t('project-page.external-resources.discord') }}</span>
            </a>
            <a
              v-for="(donation, index) in project.donation_urls"
              :key="index"
              :href="donation.url"
              target="_blank"
            >
              <BuyMeACoffeeLogo
                v-if="donation.id === 'bmac'"
                aria-hidden="true"
              />
              <PatreonIcon
                v-else-if="donation.id === 'patreon'"
                aria-hidden="true"
              />
              <KoFiIcon
                v-else-if="donation.id === 'ko-fi'"
                aria-hidden="true"
              />
              <PayPalIcon
                v-else-if="donation.id === 'paypal'"
                aria-hidden="true"
              />
              <OpenCollectiveIcon
                v-else-if="donation.id === 'open-collective'"
                aria-hidden="true"
              />
              <FollowIcon v-else-if="donation.id === 'github'" />
              <UnknownIcon v-else />
              <span v-if="donation.id === 'bmac'">{{
                $t('project-page.external-resources.buy-me-a-coffee')
              }}</span>
              <span v-else-if="donation.id === 'patreon'">{{
                $t('project-page.external-resources.patreon')
              }}</span>
              <span v-else-if="donation.id === 'paypal'">{{
                $t('project-page.external-resources.paypal')
              }}</span>
              <span v-else-if="donation.id === 'ko-fi'">{{
                $t('project-page.external-resources.kofi')
              }}</span>
              <span v-else-if="donation.id === 'github'">{{
                $t('project-page.external-resources.github-sponsors')
              }}</span>
              <span v-else>{{
                $t('project-page.external-resources.donate')
              }}</span>
            </a>
          </div>
          <hr class="card-divider" />
        </template>
        <template v-if="featuredVersions.length > 0">
          <div class="featured-header">
            <h3 class="card-header">
              {{ $t('project-page.featured-versions.title') }}
            </h3>
            <nuxt-link
              v-if="project.versions.length > 0 || currentMember"
              :to="`/${project.project_type}/${
                project.slug ? project.slug : project.id
              }/versions`"
              class="all-link"
            >
              {{ $t('project-page.featured-versions.see-all') }}
              <ChevronRightIcon
                class="featured-header-chevron"
                aria-hidden="true"
              />
            </nuxt-link>
          </div>
          <div
            v-for="version in featuredVersions"
            :key="version.id"
            class="featured-version"
            @click="
              $router.push(
                `/${project.project_type}/${
                  project.slug ? project.slug : project.id
                }/version/${encodeURI(version.displayUrlEnding)}`
              )
            "
          >
            <a
              v-tooltip="
                ((primary) =>
                  $t('project.versions.download.tooltip', {
                    fileName: primary.filename,
                    size: $formatBytes(primary.size),
                  }))(findPrimary(version))
              "
              :href="findPrimary(version).url"
              class="download"
              :title="
                $t('generic.action.download-file', {
                  fileName: findPrimary(version).filename,
                })
              "
              @click.stop="(event) => event.stopPropagation()"
            >
              <DownloadIcon aria-hidden="true" />
            </a>
            <div class="info">
              <nuxt-link
                :to="`/${project.project_type}/${
                  project.slug ? project.slug : project.id
                }/version/${encodeURI(version.displayUrlEnding)}`"
                class="top"
              >
                {{ version.name }}
              </nuxt-link>
              <div
                v-if="version.game_versions.length > 0"
                class="game-version item"
              >
                {{
                  $fmt.list(
                    version.loaders.map((x) => $formatLoader(x)),
                    { type: 'unit' }
                  )
                }}
                {{ $formatVersion(version.game_versions) }}
              </div>
              <VersionBadge
                v-if="version.version_type === 'release'"
                :type="$t('release-channel.release')"
                color="green"
              />
              <VersionBadge
                v-else-if="version.version_type === 'beta'"
                :type="$t('release-channel.beta')"
                color="yellow"
              />
              <VersionBadge
                v-else-if="version.version_type === 'alpha'"
                :type="$t('release-channel.alpha')"
                color="red"
              />
            </div>
          </div>
          <hr class="card-divider" />
        </template>
        <h3 class="card-header">{{ $t('project-page.members.title') }}</h3>
        <div
          v-for="member in members"
          :key="member.user.id"
          class="team-member columns"
          @click="$router.push('/user/' + member.user.username)"
        >
          <Avatar
            :src="member.avatar_url"
            :alt="member.username"
            size="sm"
            circle
          />

          <div class="member-info">
            <nuxt-link :to="'/user/' + member.user.username" class="name">
              <p>{{ member.name }}</p>
            </nuxt-link>
            <p class="role">
              {{ member.role }}
            </p>
          </div>
        </div>
        <hr class="card-divider" />
        <h3 class="card-header">
          {{ $t('project-page.technical-info.title') }}
        </h3>
        <div class="infos">
          <div class="info">
            <div class="key">
              {{ $t('project-page.technical-info.license') }}
            </div>
            <div class="value uppercase">
              <a class="text-link" :href="project.license.url || null">
                {{ project.license.id }}
              </a>
            </div>
          </div>
          <div
            v-if="
              project.project_type !== 'resourcepack' &&
              project.project_type !== 'plugin'
            "
            class="info"
          >
            <div class="key">
              {{ $t('project-page.technical-info.client-side') }}
            </div>
            <div class="value">
              {{ $t(`project.environment-status.${project.client_side}`) }}
            </div>
          </div>
          <div
            v-if="
              project.project_type !== 'resourcepack' &&
              project.project_type !== 'plugin'
            "
            class="info"
          >
            <div class="key">
              {{ $t('project-page.technical-info.server-side') }}
            </div>
            <div class="value">
              {{ $t(`project.environment-status.${project.server_side}`) }}
            </div>
          </div>
          <div class="info">
            <div class="key">
              {{ $t('project-page.technical-info.project-id') }}
            </div>
            <div class="value lowercase">
              <CopyCode :text="project.id" />
            </div>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="project-main">
          <div v-if="project.status === 'unlisted'" class="card warning">
            <IntlFormatted
              message-id="project-page.notice.unlisted"
              :values="{ project: project.title }"
            >
              <template #sr-only="{ children }">
                <div class="sr-only"><Fragment :of="children" /></div>
              </template>
              <template #rules-link="{ children }">
                <nuxt-link to="/legal/rules">
                  <Fragment :of="children" />
                </nuxt-link>
              </template>
            </IntlFormatted>
          </div>
          <div v-if="project.status === 'archived'" class="card warning">
            <IntlFormatted
              message-id="project-page.notice.archived"
              :values="{ project: project.title }"
            >
              <template #sr-only="{ children }">
                <div class="sr-only">
                  <Fragment :of="children" />
                </div>
              </template>
            </IntlFormatted>
          </div>
          <div v-if="project.status === 'abandoned'" class="card warning">
            <IntlFormatted
              message-id="project-page.notice.abandoned"
              :values="{ project: project.title }"
            >
              <template #sr-only="{ children }">
                <div class="sr-only">
                  <Fragment :of="children" />
                </div>
              </template>
            </IntlFormatted>
          </div>
          <div v-if="project.project_type === 'modpack'" class="card warning">
            <IntlFormatted
              message-id="project-page.notice.modpacks-preview"
              :values="{ project: project.title }"
            >
              <template #sr-only="{ children }">
                <div class="sr-only">
                  <Fragment :of="children" />
                </div>
              </template>
              <template
                v-for="(url, key) in {
                  docs: 'https://docs.modrinth.com/docs/modpacks/playing_modpacks/',
                  atl: 'https://atlauncher.com/about',
                  mmc: 'https://multimc.org/',
                  pmc: 'https://polymc.org/',
                }"
                #[`${key}-link`]="{ children }"
              >
                <a :key="key" :href="url" target="_blank">
                  <Fragment :of="children" />
                </a>
              </template>
            </IntlFormatted>
          </div>
          <Advertisement
            v-if="
              project.status === 'approved' || project.status === 'unlisted'
            "
            type="banner"
            small-screen="square"
            ethical-ads-small
            ethical-ads-big
          />
          <NavRow
            :links="[
              {
                label: $t('project-page.tabs.description'),
                href: `/${project.project_type}/${
                  project.slug ? project.slug : project.id
                }`,
              },
              {
                label: $t('project-page.tabs.gallery'),
                href: `/${project.project_type}/${
                  project.slug ? project.slug : project.id
                }/gallery`,
                shown: project.gallery.length > 0 || !!currentMember,
              },
              {
                label: $t('project-page.tabs.changelog'),
                href: `/${project.project_type}/${
                  project.slug ? project.slug : project.id
                }/changelog`,
                shown: project.versions.length > 0,
              },
              {
                label: $t('project-page.tabs.versions'),
                href: `/${project.project_type}/${
                  project.slug ? project.slug : project.id
                }/versions`,
                shown: project.versions.length > 0 || !!currentMember,
              },
              {
                label: $t('generic.title.settings'),
                href: `/${project.project_type}/${
                  project.slug ? project.slug : project.id
                }/settings`,
                shown: !!currentMember,
              },
            ]"
            class="card"
          />
          <div class="project-content">
            <NuxtChild
              :project.sync="project"
              :versions.sync="versions"
              :featured-versions.sync="featuredVersions"
              :members.sync="members"
              :current-member="currentMember"
              :all-members.sync="allMembers"
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
import CheckIcon from '~/assets/images/utils/check.svg?inline'
import ClearIcon from '~/assets/images/utils/clear.svg?inline'
import DownloadIcon from '~/assets/images/utils/download.svg?inline'
import UpdateIcon from '~/assets/images/utils/updated.svg?inline'
import CodeIcon from '~/assets/images/sidebar/mod.svg?inline'
import ReportIcon from '~/assets/images/utils/report.svg?inline'
import FollowIcon from '~/assets/images/utils/heart.svg?inline'
import InfoIcon from '~/assets/images/utils/info.svg?inline'
import IssuesIcon from '~/assets/images/utils/issues.svg?inline'
import WikiIcon from '~/assets/images/utils/wiki.svg?inline'
import DiscordIcon from '~/assets/images/external/discord.svg?inline'
import BuyMeACoffeeLogo from '~/assets/images/external/bmac.svg?inline'
import PatreonIcon from '~/assets/images/external/patreon.svg?inline'
import KoFiIcon from '~/assets/images/external/kofi.svg?inline'
import PayPalIcon from '~/assets/images/external/paypal.svg?inline'
import OpenCollectiveIcon from '~/assets/images/external/opencollective.svg?inline'
import UnknownIcon from '~/assets/images/utils/unknown-donation.svg?inline'
import ChevronRightIcon from '~/assets/images/utils/chevron-right.svg?inline'
import Advertisement from '~/components/ads/Advertisement'
import VersionBadge from '~/components/ui/Badge'
import Categories from '~/components/ui/search/Categories'
import ModalReport from '~/components/ui/ModalReport'
import NavRow from '~/components/ui/NavRow'
import CopyCode from '~/components/ui/CopyCode'
import Avatar from '~/components/ui/Avatar'

export default {
  components: {
    Avatar,
    CopyCode,
    NavRow,
    VersionBadge,
    Advertisement,
    ModalReport,
    IssuesIcon,
    DownloadIcon,
    CalendarIcon,
    CheckIcon,
    ClearIcon,
    UpdateIcon,
    CodeIcon,
    ReportIcon,
    FollowIcon,
    InfoIcon,
    WikiIcon,
    DiscordIcon,
    BuyMeACoffeeLogo,
    PayPalIcon,
    OpenCollectiveIcon,
    UnknownIcon,
    Categories,
    PatreonIcon,
    KoFiIcon,
    ChevronRightIcon,
  },
  async asyncData(data) {
    try {
      if (
        !data.params.id ||
        !data.$tag.projectTypes.find((x) => x.id === data.params.type)
      ) {
        data.error({
          statusCode: 404,
          message: data.$t('project.version.not-found'),
        })

        return
      }

      const [project, members, dependencies, versions, featuredVersions] = (
        await Promise.all([
          data.$axios.get(`project/${data.params.id}`, data.$defaultHeaders()),
          data.$axios.get(
            `project/${data.params.id}/members`,
            data.$defaultHeaders()
          ),
          data.$axios.get(
            `project/${data.params.id}/dependencies`,
            data.$defaultHeaders()
          ),
          data.$axios.get(
            `project/${data.params.id}/version`,
            data.$defaultHeaders()
          ),
          data.$axios.get(
            `project/${data.params.id}/version?featured=true`,
            data.$defaultHeaders()
          ),
        ])
      ).map((it) => it.data)

      const projectLoaders = {}

      for (const version of versions) {
        for (const loader of version.loaders) {
          projectLoaders[loader] = true
        }
      }

      project.actualProjectType = JSON.parse(
        JSON.stringify(project.project_type)
      )

      project.project_type = data.$getProjectTypeForUrl(
        project.project_type,
        Object.keys(projectLoaders)
      )

      if (
        project.project_type !== data.params.type ||
        data.params.id !== project.slug
      ) {
        const route = data.route.fullPath.split('/')
        route.splice(0, 3)

        data.redirect(
          301,
          `/${project.project_type}/${project.slug}/${route.join('/')}`
        )

        return
      }

      members.forEach((it, index) => {
        members[index].avatar_url = it.user.avatar_url
        members[index].name = it.user.username
      })

      let currentMember = data.$auth.user
        ? members.find((x) => x.user.id === data.$auth.user.id)
        : null

      if (
        !currentMember &&
        data.$auth.user &&
        (data.$auth.user.role === 'admin' ||
          data.$auth.user.role === 'moderator')
      ) {
        currentMember = {
          team_id: project.team_id,
          user: data.$auth.user,
          role: data.$auth.role,
          permissions: data.$auth.user.role === 'admin' ? 1023 : 12,
          accepted: true,
          payouts_split: 0,
          avatar_url: data.$auth.user.avatar_url,
          name: data.$auth.user.username,
        }
      }

      if (project.body_url && !project.body) {
        project.body = (await data.$axios.get(project.body_url)).data
      }

      const loaders = []

      versions.forEach((version) => {
        version.loaders.forEach((loader) => {
          if (!loaders.includes(loader)) {
            loaders.push(loader)
          }
        })
      })

      return {
        project,
        versions,
        featuredVersions,
        members: members.filter((x) => x.accepted),
        allMembers: members,
        currentMember,
        dependencies,
        loaders,
      }
    } catch {
      data.error({
        statusCode: 404,
        message: data.$t('project-page.errors.not-found'),
      })
    }
  },
  data() {
    return {
      showKnownErrors: false,
    }
  },
  fetch() {
    this.versions = this.$computeVersions(this.versions)
    this.featuredVersions = this.$computeVersions(this.featuredVersions)
  },
  head() {
    const title = this.$t('project-page.meta.title', {
      project: this.project.title,
      projectType: this.coercedProjectType?.replace(/-/g, '_') ?? '',
    })

    const description = this.$t('project-page.meta.description', {
      projectDescription: this.project.description,
      projectType: this.coercedProjectType?.replace(/-/g, '_') ?? '',
      owner: this.members.find((x) => x.role === 'Owner').user.username,
    })

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
          content:
            this.project.status === 'approved' ||
            this.project.status === 'archived'
              ? 'all'
              : 'noindeex',
        },
      ],
    }
  },
  computed: {
    authUrl() {
      return `${process.env.authURLBase}auth/init?url=${process.env.domain}${this.$route.path}`
    },
    coercedProjectType() {
      return /** @type {import('vue/types/vue').Vue} */ (
        this
      ).$coerceProjectType(this.project.project_type, this.loaders)
    },
    safeProjectType() {
      return this.coercedProjectType.replace(/-/g, '_')
    },
    projectSide() {
      return /** @type {import('vue/types/vue').Vue} */ (
        this
      ).$computeProjectSide(this.project.client_side, this.project.server_side)
    },
    sideTip() {
      return /** @type {import('vue/types/vue').Vue} */ (
        this
      ).$computeProjectTypeDisplay(this.projectSide, this.coercedProjectType)
    },
  },
  methods: {
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
    async clearMessage() {
      this.$nuxt.$loading.start()

      try {
        await this.$axios.patch(
          `project/${this.project.id}`,
          {
            moderation_message: null,
            moderation_message_body: null,
          },
          this.$defaultHeaders()
        )

        this.project.moderator_message = null
      } catch (err) {
        this.$notify({
          group: 'main',
          title: 'An error occurred',
          text: err.response.data.description,
          type: 'error',
        })
      }

      this.$nuxt.$loading.finish()
    },
    async submitForReview() {
      if (this.project.body === '' || this.project.versions.length < 1) {
        this.showKnownErrors = true
      } else {
        this.$nuxt.$loading.start()

        try {
          await this.$axios.patch(
            `project/${this.project.id}`,
            {
              status: 'processing',
            },
            this.$defaultHeaders()
          )

          this.project.status = 'processing'
        } catch (err) {
          this.$notify({
            group: 'main',
            title: 'An error occurred',
            text: err.response.data.description,
            type: 'error',
          })
        }

        this.$nuxt.$loading.finish()
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.page-contents {
  display: grid;

  grid-template:
    'header'
    'project-status'
    'content'
    'extra-info'
    / 100%;

  @media screen and (min-width: 1024px) {
    grid-template:
      'header       content' auto
      'project-status      content' auto
      'extra-info       content' auto
      'dummy content' 1fr
      / 20rem calc(100% - 20rem);

    &.alt-layout {
      grid-template:
        'content       header' auto
        'content      project-status' auto
        'content       extra-info' auto
        'content       dummy' 1fr
        / 1fr 20rem;
    }
  }

  column-gap: var(--spacing-card-md);
}

.header {
  grid-area: header;

  .title {
    margin: 0.25rem 0;
    color: var(--color-text-dark);
    font-size: var(--font-size-xl);
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
    display: flex;
    flex-wrap: wrap;
    column-gap: 5px;
    row-gap: 5px;

    button,
    a {
      display: flex;
    }
  }

  .description {
    line-height: 1.3;

    margin-top: var(--spacing-card-sm);
    margin-bottom: 0.5rem;
    font-size: var(--font-size-nm);
  }

  .categories {
    margin: 0.25rem 0;
    color: var(--color-text-secondary);
    font-size: var(--font-size-nm);
  }

  .stats {
    display: flex;
    flex-wrap: wrap;
    column-gap: 10px;
    row-gap: 5px;

    .stat {
      font-size: var(--font-size-lg);
      font-weight: bold;
    }
  }

  .dates {
    margin: 0.75rem 0;

    .date {
      color: var(--color-text-secondary);
      font-size: var(--font-size-nm);
      display: flex;
      align-items: center;
      margin-bottom: 0.25rem;
      cursor: default;

      .label {
        margin-right: 0.25rem;
      }

      svg {
        height: 1rem;
        margin-right: 0.25rem;
      }
    }
  }
}

.project-status {
  grid-area: project-status;
}

.extra-info {
  grid-area: extra-info;
}

.content {
  grid-area: content;
}

.project-info {
  height: auto;
  overflow: hidden;
}

.card-header {
  font-weight: bold;
  color: var(--color-heading);
  margin-bottom: 0.3rem;
  width: fit-content;
}

.featured-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;

  .card-header {
    height: 23px;
  }

  .all-link {
    display: flex;
    margin-bottom: 0.3rem;
    align-items: center;
    gap: 3px;

    color: var(--color-link);
  }

  .all-link:hover,
  .all-link:focus-visible {
    color: var(--color-link-hover);
  }

  .all-link:active {
    color: var(--color-link-active);
  }
}

.featured-version {
  display: flex;
  flex-direction: row;
  padding: 0.5rem;
  border-radius: var(--size-rounded-sm);

  transition: background-color 0.1s ease-in-out;

  &:hover {
    background-color: var(--color-button-bg);
    cursor: pointer;
  }

  .download {
    display: flex;
    align-items: center;
    height: 2.5rem;
    width: 2.5rem;
    border-radius: 1.5rem;
    color: var(--color-brand-inverted);
    background-color: var(--color-brand);
    margin-right: 0.75rem;

    &:hover {
      background-color: var(--color-brand-hover);
    }

    &:active {
      background-color: var(--color-brand-active);
    }

    svg {
      width: 1.5rem;
      margin: auto;
    }

    flex-shrink: 0;
  }

  .info {
    display: flex;
    flex-direction: column;

    .top {
      font-weight: bold;
      word-wrap: break-word;
      overflow-wrap: anywhere;
    }
  }
}

.links {
  a {
    display: inline-flex;
    align-items: center;
    border-radius: 1rem;

    svg,
    img {
      height: 1rem;
      width: 1rem;
    }

    span {
      margin-left: 0.25rem;
      text-decoration: underline;
      line-height: 2rem;
    }

    &:focus-visible,
    &:hover {
      svg,
      img,
      span {
        color: var(--color-heading);
      }
    }

    &:active {
      svg,
      img,
      span {
        color: var(--color-text-dark);
      }
    }

    &:not(:last-child)::after {
      content: '•';
      margin: 0 0.25rem;
    }
  }
}

.team-member {
  align-items: center;

  padding: 0.25rem 0.5rem;
  border-radius: var(--size-rounded-sm);

  transition: background-color 0.1s ease-in-out;

  &:hover {
    background-color: var(--color-button-bg);
    cursor: pointer;
  }

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

.infos {
  .info {
    display: flex;
    margin: 0.5rem 0;

    .key {
      font-weight: bold;
      color: var(--color-text-secondary);
      width: 40%;
    }

    // TODO: CAPITALIZE IDS!!!!!!!

    .uppercase {
      text-transform: uppercase;
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

@media screen and (min-width: 1024px) {
  .content {
    max-width: calc(1280px - 21rem);
  }
}
</style>
