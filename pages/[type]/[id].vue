<template>
  <div :style="`--_accent-color: ${toColor(project.color)}`">
    <Modal
      ref="modalLicense"
      :header="project.license.name ? project.license.name : 'License'"
      :noblur="!$orElse(cosmetics.advancedRendering, true)"
    >
      <div class="modal-license">
        <div class="markdown-body" v-html="renderString(licenseText)" />
      </div>
    </Modal>
    <ModalReport
      v-if="auth.user"
      ref="modal_project_report"
      :item-id="project.id"
      item-type="project"
    />
    <div
      :class="{
        'normal-page': true,
        'alt-layout': $route.name.startsWith('type-id-settings'),
      }"
    >
      <div v-if="false" class="normal-page__sidebar">
        <MessageBanner v-if="project.status === 'draft'" message-type="subtle">
          This project is a
          <Badge v-if="auth.user && currentMember" :type="project.status" class="status-badge" />
          and is not viewable by non-members.
        </MessageBanner>
        <div v-if="false" class="sidebar-section gallery">
          <h2 class="clickable-header">Gallery <ChevronRightIcon /></h2>
          <img
            :src="
              featuredGalleryImage
                ? featuredGalleryImage.url
                : 'https://launcher-files.modrinth.com/assets/maze-bg.png'
            "
            alt="test"
          />
        </div>
        <div v-if="false" class="sidebar-section">
          <h2>Details</h2>
          <div
            v-if="project.status === 'processing' && project.queued"
            v-tooltip="$dayjs(project.queued).format('MMMM D, YYYY [at] h:mm A')"
            class="primary-stat"
          >
            <QueuedIcon class="primary-stat__icon" aria-hidden="true" />
            <div class="primary-stat__text">
              Submitted
              <span class="primary-stat__counter">
                {{ fromNow(project.queued) }}
              </span>
            </div>
          </div>
        </div>
        <div v-if="currentMember && project.moderator_message" class="card moderation-card">
          <h2 class="sidebar-card-header">Message from the moderators:</h2>
          <div v-if="project.moderator_message.body">
            <p v-if="project.moderator_message.message" class="mod-message__title">
              {{ project.moderator_message.message }}
            </p>
          </div>
          <div
            class="markdown-body"
            v-html="
              renderString(
                project.moderator_message.body
                  ? project.moderator_message.body
                  : project.moderator_message.message
              )
            "
          />
          <div class="buttons status-buttons">
            <button
              v-if="tags.approvedStatuses.includes(project.status)"
              class="btn"
              @click="clearMessage"
            >
              <ClearIcon />
              Clear message
            </button>
          </div>
        </div>
      </div>
      <div class="normal-page__header">
        <div class="breadcrumbs">
          <span>Minecraft: Java Edition</span>
          <ChevronRightIcon />
          <nuxt-link :to="`/mods`">Mods</nuxt-link>
          <ChevronRightIcon />
          <span class="current">{{ project.title }}</span>
        </div>
        <div class="proj-header">
          <div class="game-icon">
            <Avatar :src="project.icon_url" class="avatar" no-shadow size="none" />
          </div>
          <div class="game-title">
            <div class="game-name">
              <h1>
                {{ project.title }}
              </h1>
              <Button transparent icon-only>
                <ShareIcon />
              </Button>
            </div>
            <div class="mod-stats">
              <span class="stat">
                <span class="label"><DownloadIcon /></span>
                <span class="value">{{ formatNumber(project.downloads) }}</span>
                <span class="label"> downloads</span>
              </span>
              <span class="stat">
                <span class="label"><HeartIcon /></span>
                <span class="value">{{ formatNumber(project.followers) }}</span>
                <span class="label"> followers</span>
              </span>
              <span class="stat">
                <span class="label"><UpdatedIcon /></span>
                <span class="label">Updated</span>
                <span class="value">{{ fromNow(project.updated) }}</span>
              </span>
            </div>
          </div>
          <div class="mod-buttons">
            <div class="joined-buttons">
              <Button color="primary" large>
                <DownloadIcon />
                Download
              </Button>
              <OverflowMenu
                class="btn btn-primary btn-large"
                :options="[
                  {
                    id: 'install',
                    action: () => {},
                    color: 'green',
                  },
                ]"
              >
                <DropdownIcon />
                <template #install><DownloadIcon /> Install with App</template>
              </OverflowMenu>
            </div>
          </div>
        </div>
        <ProjectMemberHeader
          v-if="currentMember"
          :project="project"
          :versions="versions"
          :current-member="currentMember"
          :is-settings="$route.name.startsWith('type-id-settings')"
          :route-name="$route.name"
          :set-processing="setProcessing"
          :collapsed="collapsedChecklist"
          :toggle-collapsed="() => (collapsedChecklist = !collapsedChecklist)"
          :all-members="allMembers"
          :update-members="updateMembers"
          :auth="auth"
          :tags="tags"
        />
        <MessageBanner v-else-if="project.status === 'withheld'" message-type="warning">
          {{ project.title }} has been removed from search by Modrinth's moderators. Please use
          {{ project.title }} at your own risk.
        </MessageBanner>
        <MessageBanner v-if="project.status === 'archived'" message-type="warning">
          {{ project.title }} has been archived. {{ project.title }} will not receive any further
          updates unless the author decides to unarchive the project.
        </MessageBanner>
        <MessageBanner v-if="project.project_type === 'modpack'" message-type="information">
          To install {{ project.title }}, download
          <nuxt-link to="/app">the Modrinth App</nuxt-link>. For instructions with other launchers,
          please see
          <a href="https://docs.modrinth.com/docs/modpacks/playing_modpacks/" :target="$external()"
            >our documentation</a
          >.
        </MessageBanner>
        <PageBar class="filter-row">
          <nuxt-link
            :to="`/${project.project_type}/${project.slug ? project.slug : project.id}`"
            class="button-base nav-button"
          >
            <DescriptionIcon /> About
          </nuxt-link>
          <nuxt-link
            v-if="project.gallery.length > 0 || currentMember"
            :to="`/${project.project_type}/${project.slug ? project.slug : project.id}/gallery`"
            class="button-base nav-button"
          >
            <GalleryIcon /> Gallery
          </nuxt-link>
          <nuxt-link
            :to="`/${project.project_type}/${project.slug ? project.slug : project.id}/versions`"
            class="button-base nav-button"
          >
            <VersionIcon /> Versions
          </nuxt-link>
          <template #right>
            <nuxt-link
              :to="`/${project.project_type}/${project.slug ? project.slug : project.id}/settings`"
              class="button-base nav-button desktop-settings-button"
            >
              <ManageIcon /> Manage
            </nuxt-link>
          </template>
        </PageBar>
      </div>
      <section class="normal-page__content">
        <Promotion
          v-if="
            tags.approvedStatuses.includes(project.status) &&
            !$route.name.startsWith('type-id-settings')
          "
        />
        <NuxtPage
          v-model:project="project"
          v-model:versions="versions"
          v-model:featured-versions="featuredVersions"
          v-model:members="members"
          v-model:all-members="allMembers"
          v-model:dependencies="dependencies"
          :current-member="currentMember"
          :patch-project="patchProject"
          :patch-icon="patchIcon"
          :update-icon="resetProject"
        />
      </section>
      <div class="normal-page__info">
        <template v-if="$route.name.startsWith('type-id-settings')">
          <h3>Details</h3>
          <NavStack>
            <NavStackItem
              :link="`/${project.project_type}/${
                project.slug ? project.slug : project.id
              }/settings`"
              label="General"
            >
              <SettingsIcon />
            </NavStackItem>
            <NavStackItem
              :link="`/${project.project_type}/${
                project.slug ? project.slug : project.id
              }/settings/tags`"
              label="Tags"
            >
              <TagIcon />
            </NavStackItem>
            <NavStackItem
              :link="`/${project.project_type}/${
                project.slug ? project.slug : project.id
              }/settings/description`"
              label="Description"
            >
              <DescriptionIcon />
            </NavStackItem>
            <NavStackItem
              :link="`/${project.project_type}/${
                project.slug ? project.slug : project.id
              }/settings/license`"
              label="License"
            >
              <LicenseIcon />
            </NavStackItem>
            <NavStackItem
              :link="`/${project.project_type}/${
                project.slug ? project.slug : project.id
              }/settings/links`"
              label="Links"
            >
              <LinksIcon />
            </NavStackItem>
            <NavStackItem
              :link="`/${project.project_type}/${
                project.slug ? project.slug : project.id
              }/settings/members`"
              label="Members"
            >
              <UsersIcon />
            </NavStackItem>
            <h3>Upload</h3>
            <NavStackItem
              :link="`/${project.project_type}/${project.slug ? project.slug : project.id}/gallery`"
              label="Gallery"
              chevron
            >
              <GalleryIcon />
            </NavStackItem>
            <NavStackItem
              :link="`/${project.project_type}/${
                project.slug ? project.slug : project.id
              }/versions`"
              label="Versions"
              chevron
            >
              <VersionIcon />
            </NavStackItem>
          </NavStack>
        </template>
        <template v-else>
          <nuxt-link
            v-if="featuredGalleryImage"
            :to="`${getProjectLink(project)}/gallery`"
            class="featured-gallery-image button-base"
          >
            <img
              :src="
                featuredGalleryImage
                  ? featuredGalleryImage.url
                  : 'https://launcher-files.modrinth.com/assets/maze-bg.png'
              "
              alt="test"
            />
          </nuxt-link>
          <div class="card">
            <h2>Details</h2>
            <div class="supports-details">
              <div class="primary-stat">
                <GameIcon class="primary-stat__icon" aria-hidden="true" />
                <div class="primary-stat__text">
                  Minecraft
                  <span class="primary-stat__counter">
                    {{
                      formats
                        .list(
                          moreVersions > 0
                            ? [...supportsMcVersions, '$$$_REPLACEME_$$$']
                            : supportsMcVersions
                        )
                        .replace('$$$_REPLACEME_$$$', '')
                    }}
                    <template v-if="moreVersions > 0">
                      <NuxtLink :to="`${getProjectLink(project)}/versions`" class="text-link">
                        {{ moreVersions }} more
                      </NuxtLink>
                    </template>
                  </span>
                </div>
              </div>
              <div
                v-if="
                  !(project.loaders.length === 1 && project.loaders[0] === 'datapack') &&
                  project.project_type !== 'resourcepack'
                "
                class="primary-stat"
              >
                <WrenchIcon class="primary-stat__icon" aria-hidden="true" />
                <div class="primary-stat__text">
                  Supports
                  <span class="primary-stat__counter">
                    {{ formats.list(project.loaders.map((x) => $formatCategory(x))) }}
                  </span>
                </div>
              </div>
              <div
                v-if="
                  !['resourcepack', 'shader'].includes(project.project_type) &&
                  !project.loaders.some((x) => tags.loaderData.dataPackLoaders.includes(x))
                "
                class="primary-stat"
              >
                <template
                  v-if="project.client_side === 'optional' && project.server_side === 'optional'"
                >
                  <GlobeIcon class="primary-stat__icon" aria-hidden="true" />
                  <div class="primary-stat__text">
                    Either
                    <span class="primary-stat__counter">client or server-side</span>
                  </div>
                </template>
                <template
                  v-else-if="
                    project.client_side === 'required' && project.server_side === 'required'
                  "
                >
                  <GlobeIcon class="primary-stat__icon" aria-hidden="true" />
                  <div class="primary-stat__text">
                    Both
                    <span class="primary-stat__counter">client and server-side</span>
                  </div>
                </template>
                <template
                  v-else-if="
                    (project.client_side === 'optional' || project.client_side === 'required') &&
                    (project.server_side === 'optional' || project.server_side === 'unsupported')
                  "
                >
                  <ClientIcon class="primary-stat__icon" aria-hidden="true" />
                  <div class="primary-stat__text">
                    <span class="primary-stat__counter">Client-side only</span>
                  </div>
                </template>
                <template
                  v-else-if="
                    (project.server_side === 'optional' || project.client_side === 'required') &&
                    (project.client_side === 'optional' || project.server_side === 'unsupported')
                  "
                >
                  <ServerIcon class="primary-stat__icon" aria-hidden="true" />
                  <div class="primary-stat__text">
                    <span class="primary-stat__counter">Server-side only</span>
                  </div>
                </template>
                <template
                  v-else-if="
                    project.server_side === 'unsupported' && project.client_side === 'unsupported'
                  "
                >
                  <BanIcon class="primary-stat__icon" aria-hidden="true" />
                  <div class="primary-stat__text">
                    <span class="primary-stat__counter">Unsupported</span>
                  </div>
                </template>
              </div>
              <div class="primary-stat">
                <TagIcon class="primary-stat__icon" aria-hidden="true" />
                <div class="primary-stat__text">
                  Tags
                  <Categories
                    :type="project.actualProjectType"
                    :categories="project.categories"
                    class="categories"
                  ></Categories>
                </div>
              </div>
              <div class="primary-stat">
                <LicenseIcon class="primary-stat__icon" aria-hidden="true" />
                <div class="primary-stat__text">
                  Licensed
                  <a
                    v-if="project.license.url"
                    class="text-link"
                    :href="project.license.url"
                    rel="noopener nofollow ugc"
                  >
                    {{ licenseIdDisplay }} <ExternalIcon />
                  </a>
                  <span
                    v-else-if="
                      project.license.id === 'LicenseRef-All-Rights-Reserved' ||
                      !project.license.id.includes('LicenseRef')
                    "
                    class="text-link"
                    @click="getLicenseData()"
                  >
                    {{ licenseIdDisplay }}
                  </span>
                  <span v-else>{{ licenseIdDisplay }}</span>
                </div>
              </div>
            </div>
            <div class="button-group-long">
              <Button>
                <HeartIcon />
                Follow
              </Button>
              <Button>
                <BookmarkIcon />
                Save
              </Button>
              <OverflowMenu
                class="btn icon-only"
                :options="[
                  {
                    id: 'share',
                    action: () => {},
                  },
                  {
                    id: 'report',
                    action: () => {},
                    color: 'red',
                    hoverOnly: true,
                  },
                  { divider: true },
                  { id: 'copy-id', action: () => {} },
                ]"
              >
                <MoreHorizontalIcon />
                <template #share> <ShareIcon /> Share</template>
                <template #report> <ReportIcon /> Report</template>
                <template #copy-id> <ClipboardCopyIcon /> Copy ID</template>
              </OverflowMenu>
            </div>
          </div>
          <div
            v-if="
              project.issues_url ||
              project.source_url ||
              project.wiki_url ||
              project.discord_url ||
              project.donation_urls.length > 0
            "
            class="members card"
          >
            <h2>Links</h2>
            <div class="links">
              <a
                v-if="project.issues_url"
                :href="project.issues_url"
                :target="$external()"
                rel="noopener nofollow ugc"
              >
                <IssuesIcon aria-hidden="true" />
                Report issues
                <ExternalIcon aria-hidden="true" class="external-icon" />
              </a>
              <a
                v-if="project.source_url"
                :href="project.source_url"
                :target="$external()"
                rel="noopener nofollow ugc"
              >
                <CodeIcon aria-hidden="true" />
                View source
                <ExternalIcon aria-hidden="true" class="external-icon" />
              </a>
              <a
                v-if="project.wiki_url"
                :href="project.wiki_url"
                :target="$external()"
                rel="noopener nofollow ugc"
              >
                <WikiIcon aria-hidden="true" />
                Visit wiki
                <ExternalIcon aria-hidden="true" class="external-icon" />
              </a>
              <a
                v-if="project.discord_url"
                :href="project.discord_url"
                :target="$external()"
                rel="noopener nofollow ugc"
              >
                <DiscordIcon class="shrink" aria-hidden="true" />
                Join Discord server
                <ExternalIcon aria-hidden="true" class="external-icon" />
              </a>
              <a
                v-for="(donation, index) in project.donation_urls"
                :key="index"
                :href="donation.url"
                :target="$external()"
                rel="noopener nofollow ugc"
              >
                <BuyMeACoffeeLogo v-if="donation.id === 'bmac'" aria-hidden="true" />
                <PatreonIcon v-else-if="donation.id === 'patreon'" aria-hidden="true" />
                <KoFiIcon v-else-if="donation.id === 'ko-fi'" aria-hidden="true" />
                <PayPalIcon v-else-if="donation.id === 'paypal'" aria-hidden="true" />
                <OpenCollectiveIcon
                  v-else-if="donation.id === 'open-collective'"
                  aria-hidden="true"
                />
                <HeartIcon v-else-if="donation.id === 'github'" />
                <UnknownIcon v-else />
                <span v-if="donation.id === 'bmac'">Buy Me a Coffee</span>
                <span v-else-if="donation.id === 'patreon'">Donate on Patreon</span>
                <span v-else-if="donation.id === 'paypal'">Donate on PayPal</span>
                <span v-else-if="donation.id === 'ko-fi'">Donate on Ko-fi</span>
                <span v-else-if="donation.id === 'github'">Sponsor on GitHub</span>
                <span v-else>Donate</span>
                <ExternalIcon aria-hidden="true" class="external-icon" />
              </a>
            </div>
          </div>
          <div class="members card">
            <h2>Members</h2>
            <nuxt-link
              v-for="member in members"
              :key="member.user.id"
              class="team-member columns button-transparent"
              :to="'/user/' + member.user.username"
            >
              <Avatar :src="member.avatar_url" :alt="member.username" size="sm" circle />

              <div class="member-info">
                <p class="name">{{ member.name }}</p>
                <p class="role">
                  {{ member.role }}
                </p>
              </div>
            </nuxt-link>
          </div>
        </template>
      </div>
      <div v-if="false" class="card">
        <template v-if="featuredVersions.length > 0">
          <div class="featured-header">
            <h2 class="sidebar-card-header">Featured versions</h2>
            <nuxt-link
              v-if="$route.name !== 'type-id-versions' && (versions.length > 0 || currentMember)"
              :to="`/${project.project_type}/${
                project.slug ? project.slug : project.id
              }/versions#all-versions`"
              class="goto-link"
            >
              See all
              <ChevronRightIcon class="featured-header-chevron" aria-hidden="true" />
            </nuxt-link>
          </div>
          <div
            v-for="version in featuredVersions"
            :key="version.id"
            class="featured-version button-transparent"
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
                version.primaryFile.filename + ' (' + $formatBytes(version.primaryFile.size) + ')'
              "
              :href="version.primaryFile.url"
              class="download btn icon-only btn-primary"
              :aria-label="`Download ${version.name}`"
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
              <div v-if="version.game_versions.length > 0" class="game-version item">
                {{ version.loaders.map((x) => $formatCategory(x)).join(', ') }}
                {{ $formatVersion(version.game_versions) }}
              </div>
              <Badge v-if="version.version_type === 'release'" type="release" color="green" />
              <Badge v-else-if="version.version_type === 'beta'" type="beta" color="orange" />
              <Badge v-else-if="version.version_type === 'alpha'" type="alpha" color="red" />
            </div>
          </div>
          <hr class="card-divider" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Avatar,
  Promotion,
  Button,
  ShareIcon,
  ClearIcon,
  DownloadIcon,
  CodeIcon,
  ClientIcon,
  ServerIcon,
  DropdownIcon,
  ClipboardCopyIcon,
  OverflowMenu,
  Modal,
  ListEndIcon as QueuedIcon,
  ExternalIcon,
  ReportIcon,
  MoreHorizontalIcon,
  GlobeIcon,
  HeartIcon,
  BookmarkIcon,
  UpdatedIcon,
  IssuesIcon,
  WikiIcon,
  DiscordIcon,
  BuyMeACoffeeIcon as BuyMeACoffeeLogo,
  PatreonIcon,
  KoFiIcon,
  PayPalIcon,
  OpenCollectiveIcon,
  UnknownIcon,
  ChevronRightIcon,
  Badge,
  CopyCode,
  NavStack,
  NavItem as NavStackItem,
  SettingsIcon,
  ChartIcon,
  UsersIcon,
  TagsIcon as TagIcon,
  AlignLeftIcon as DescriptionIcon,
  LinkIcon as LinksIcon,
  ImageIcon as GalleryIcon,
  VersionIcon,
  Breadcrumbs,
  SearchIcon,
  FilterIcon,
  Categories,
  GridIcon,
  PageBar,
  ListIcon,
  HistoryIcon,
  renderString,
  getProjectLink,
  formatCategory,
  formatNumber,
  SlashIcon as BanIcon,
} from 'omorphia'
import ModalReport from '~/components/ui/ModalReport.vue'

import ProjectMemberHeader from '~/components/ui/ProjectMemberHeader.vue'
import MessageBanner from '~/components/ui/MessageBanner.vue'

import ManageIcon from '~/assets/images/utils/settings-2.svg'
import LicenseIcon from '~/assets/images/utils/book-text.svg'
import WrenchIcon from '~/assets/images/utils/wrench.svg'
import GameIcon from '~/assets/images/utils/game.svg'

const data = useNuxtApp()
const route = useRoute()
const config = useRuntimeConfig()

const auth = await useAuth()
const user = await useUser()
const cosmetics = useCosmetics()
const tags = useTags()
const vintl = useVIntl()
const { formats } = vintl

if (
  !route.params.id ||
  !(
    tags.value.projectTypes.find((x) => x.id === route.params.type) ||
    route.params.type === 'project'
  )
) {
  throw createError({
    fatal: true,
    statusCode: 404,
    message: 'The page could not be found',
  })
}

let project, allMembers, dependencies, featuredVersions, versions
try {
  ;[
    { data: project },
    { data: allMembers },
    { data: dependencies },
    { data: featuredVersions },
    { data: versions },
  ] = await Promise.all([
    useAsyncData(`project/${route.params.id}`, () => useBaseFetch(`project/${route.params.id}`), {
      transform: (project) => {
        if (project) {
          project.actualProjectType = JSON.parse(JSON.stringify(project.project_type))
          project.project_type = data.$getProjectTypeForUrl(
            project.project_type,
            project.loaders,
            tags.value
          )

          if (process.client && history.state && history.state.overrideProjectType) {
            project.project_type = history.state.overrideProjectType
          }
        }

        return project
      },
    }),
    useAsyncData(
      `project/${route.params.id}/members`,
      () => useBaseFetch(`project/${route.params.id}/members`),
      {
        transform: (members) => {
          members.forEach((it, index) => {
            members[index].avatar_url = it.user.avatar_url
            members[index].name = it.user.username
          })

          return members
        },
      }
    ),
    useAsyncData(`project/${route.params.id}/dependencies`, () =>
      useBaseFetch(`project/${route.params.id}/dependencies`)
    ),
    useAsyncData(`project/${route.params.id}/version?featured=true`, () =>
      useBaseFetch(`project/${route.params.id}/version?featured=true`)
    ),
    useAsyncData(`project/${route.params.id}/version`, () =>
      useBaseFetch(`project/${route.params.id}/version`)
    ),
  ])

  versions = shallowRef(toRaw(versions))
  featuredVersions = shallowRef(toRaw(featuredVersions))
} catch (error) {
  throw createError({
    fatal: true,
    statusCode: 404,
    message: 'Project not found',
  })
}

if (!project.value) {
  throw createError({
    fatal: true,
    statusCode: 404,
    message: 'Project not found',
  })
}

if (project.value.project_type !== route.params.type || route.params.id !== project.value.slug) {
  let path = route.fullPath.split('/')
  path.splice(0, 3)
  path = path.filter((x) => x)

  await navigateTo(
    `/${project.value.project_type}/${project.value.slug}${
      path.length > 0 ? `/${path.join('/')}` : ''
    }`,
    { redirectCode: 301, replace: true }
  )
}

const members = ref(allMembers.value.filter((x) => x.accepted))
const currentMember = ref(
  auth.value.user ? allMembers.value.find((x) => x.user.id === auth.value.user.id) : null
)

if (
  !currentMember.value &&
  auth.value.user &&
  tags.value.staffRoles.includes(auth.value.user.role)
) {
  currentMember.value = {
    team_id: project.team_id,
    user: auth.value.user,
    role: auth.value.role,
    permissions: auth.value.user.role === 'admin' ? 1023 : 12,
    accepted: true,
    payouts_split: 0,
    avatar_url: auth.value.user.avatar_url,
    name: auth.value.user.username,
  }
}

versions.value = data.$computeVersions(versions.value, allMembers.value)

// Q: Why do this instead of computing the versions of featuredVersions?
// A: It will incorrectly generate the version slugs because it doesn't have the full context of
//    all the versions. For example, if version 1.1.0 for Forge is featured but 1.1.0 for Fabric
//    is not, but the Fabric one was uploaded first, the Forge version would link to the Fabric
///   version
const featuredIds = featuredVersions.value.map((x) => x.id)
featuredVersions.value = versions.value.filter((version) => featuredIds.includes(version.id))

featuredVersions.value.sort((a, b) => {
  const aLatest = a.game_versions[a.game_versions.length - 1]
  const bLatest = b.game_versions[b.game_versions.length - 1]
  const gameVersions = tags.value.gameVersions.map((e) => e.version)
  return gameVersions.indexOf(aLatest) - gameVersions.indexOf(bLatest)
})

const selectedGameVersion = ref('1.20.2')
const selectedLoader = ref('Fabric')

const licenseIdDisplay = computed(() => {
  const id = project.value.license.id

  if (id === 'LicenseRef-All-Rights-Reserved') {
    return 'ARR'
  } else if (id.includes('LicenseRef')) {
    return id.replaceAll('LicenseRef-', '').replaceAll('-', ' ')
  } else {
    return id
  }
})
const featuredGalleryImage = computed(() => project.value.gallery.find((img) => img.featured))
const extraGalleryImages = computed(() =>
  project.value.gallery.filter((img) => !img.featured).slice(0, 2)
)
function toColor(color) {
  color >>>= 0
  const b = color & 0xff
  const g = (color & 0xff00) >>> 8
  const r = (color & 0xff0000) >>> 16
  return 'rgba(' + [r, g, b, 0.5].join(',') + ')'
}

const projectTypeDisplay = data.$formatProjectType(
  data.$getProjectTypeForDisplay(project.value.project_type, project.value.loaders)
)
const title = `${project.value.title} - Minecraft ${projectTypeDisplay}`
const description = `${project.value.description} - Download the Minecraft ${projectTypeDisplay} ${
  project.value.title
} by ${members.value.find((x) => x.role === 'Owner').user.username} on Modrinth`

if (!route.name.startsWith('type-id-settings')) {
  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: project.value.description,
    ogImage: project.value.icon_url ?? 'https://cdn.modrinth.com/placeholder.png',
    robots:
      project.value.status === 'approved' || project.value.status === 'archived'
        ? 'all'
        : 'noindex',
  })
}

async function resetProject() {
  const newProject = await useBaseFetch(`project/${project.value.id}`)

  newProject.actualProjectType = JSON.parse(JSON.stringify(newProject.project_type))

  newProject.project_type = data.$getProjectTypeForUrl(newProject.project_type, newProject.loaders)

  project.value = newProject
}

async function clearMessage() {
  startLoading()

  try {
    await useBaseFetch(`project/${project.value.id}`, {
      method: 'PATCH',
      body: {
        moderation_message: null,
        moderation_message_body: null,
      },
    })

    project.value.moderator_message = null
  } catch (err) {
    data.$notify({
      group: 'main',
      title: 'An error occurred',
      text: err.data.description,
      type: 'error',
    })
  }

  stopLoading()
}

async function setProcessing() {
  startLoading()

  try {
    await useBaseFetch(`project/${project.value.id}`, {
      method: 'PATCH',
      body: {
        status: 'processing',
      },
    })

    project.value.status = 'processing'
  } catch (err) {
    data.$notify({
      group: 'main',
      title: 'An error occurred',
      text: err.data.description,
      type: 'error',
    })
  }

  stopLoading()
}

const modalLicense = ref(null)
const licenseText = ref('')
async function getLicenseData() {
  try {
    const text = await useBaseFetch(`tag/license/${project.value.license.id}`)
    licenseText.value = text.body
  } catch {
    licenseText.value = 'License text could not be retrieved.'
  }

  modalLicense.value.show()
}

async function patchProject(resData, quiet = false) {
  let result = false
  startLoading()

  try {
    await useBaseFetch(`project/${project.value.id}`, {
      method: 'PATCH',
      body: resData,
    })

    for (const key in resData) {
      project.value[key] = resData[key]
    }

    if (resData.license_id) {
      project.value.license.id = resData.license_id
    }
    if (resData.license_url) {
      project.value.license.url = resData.license_url
    }

    result = true
    if (!quiet) {
      data.$notify({
        group: 'main',
        title: 'Project updated',
        text: 'Your project has been updated.',
        type: 'success',
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  } catch (err) {
    data.$notify({
      group: 'main',
      title: 'An error occurred',
      text: err.data.description,
      type: 'error',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  stopLoading()

  return result
}

async function patchIcon(icon) {
  let result = false
  startLoading()

  try {
    await useBaseFetch(
      `project/${project.value.id}/icon?ext=${
        icon.type.split('/')[icon.type.split('/').length - 1]
      }`,
      {
        method: 'PATCH',
        body: icon,
      }
    )
    await resetProject()
    result = true
    data.$notify({
      group: 'main',
      title: 'Project icon updated',
      text: "Your project's icon has been updated.",
      type: 'success',
    })
  } catch (err) {
    data.$notify({
      group: 'main',
      title: 'An error occurred',
      text: err.data.description,
      type: 'error',
    })

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  stopLoading()
  return result
}

async function updateMembers() {
  allMembers.value = await useAsyncData(
    `project/${route.params.id}/members`,
    () => useBaseFetch(`project/${route.params.id}/members`),
    {
      transform: (members) => {
        members.forEach((it, index) => {
          members[index].avatar_url = it.user.avatar_url
          members[index].name = it.user.username
        })

        return members
      },
    }
  )
}

const supportsMcVersions = computed(() => {
  const allMcVersions = tags.value.gameVersions
  const versions = project.value.game_versions.slice().sort((a, b) => {
    return new Date(b.date) - new Date(a.date)
  })
  const display = []
  if (
    versions.length > 0 &&
    allMcVersions.some((v) => v.version === versions[0] && v.version_type !== 'release')
  ) {
    display.push(versions[0])
  }
  display.push(
    ...allMcVersions
      .filter((v) => versions.includes(v.version) && v.major)
      .slice(0, 4)
      .map((v) => v.version)
  )

  return display
})

const moreVersions = computed(() => {
  return project.value.game_versions.length - supportsMcVersions.value.length
})

const collapsedChecklist = ref(false)
</script>
<style lang="scss" scoped>
.card {
  padding: 1.25rem;

  h2:first-child {
    margin-bottom: var(--spacing-card-md);
  }
}

.about {
  padding: var(--gap-xl) calc(var(--gap-xl) - var(--gap-sm));
  grid-area: header;

  p {
    margin: 0;
  }

  > :not(.categories) {
    margin-inline: var(--gap-sm);
  }

  .description {
    line-height: 1.3;
    overflow-wrap: break-word;

    margin-bottom: 0.5rem;
    font-size: var(--font-size-nm);
  }

  .categories {
    margin-bottom: var(--gap-md);
    color: var(--color-text-secondary);
    font-size: var(--font-size-nm);
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

.project-header {
  padding: 0 0 var(--gap-md) 0;
  display: grid;
  grid-template-areas: 'icon text primary-actions gallery' 'user-actions user-actions user-actions gallery';
  grid-template-columns: min-content 2fr auto auto;
  grid-template-rows: min-content 1fr min-content;
  gap: var(--gap-md);
  margin: 0;
  background: none;
  border-radius: unset;

  .project-header__text {
    grid-area: text;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 0.5rem;

    h1,
    p {
      margin: 0;
    }
  }

  .primary-actions {
    grid-area: primary-actions;

    .btn {
      padding: 0.75rem 1.5rem;
    }
  }

  .user-actions {
    grid-area: user-actions;
    display: flex;
    gap: 0.25rem;
  }

  .project__icon {
    grid-area: icon;
    background-color: transparent;
    border: none;
  }

  .button-section {
    grid-area: button-section;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    gap: var(--gap-sm);
    margin-left: auto;

    .group {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: var(--gap-sm);
    }

    .actions {
      .btn {
        color: var(--color-text);
      }
    }

    .server {
      background-color: var(--color-blue);
      color: var(--color-accent-contrast);
    }

    .support {
      background-color: var(--color-purple);
      color: var(--color-accent-contrast);
    }
  }
}

@media screen and (max-width: 768px) {
  .project-header {
    grid-template-areas:
      'icon title'
      'button-section button-section';
    grid-template-columns: 6rem auto;
    grid-template-rows: auto auto;
    gap: var(--gap-sm);

    .title {
      h1 {
        font-size: var(--font-size-lg);
        font-weight: 700;
      }
    }

    .button-section {
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      margin-left: 0;
    }
  }
}

.project-info {
  height: auto;
  overflow: hidden;
}

.featured-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;

  .sidebar-card-header {
    height: 23px;
  }

  .goto-link {
    margin-bottom: 0.3rem;
  }
}

.featured-version {
  display: flex;
  flex-direction: row;
  padding: 0.5rem;

  .download {
    height: 2.5rem;
    width: 2.5rem;
    margin-right: 0.75rem;

    svg {
      width: 1.5rem;
      height: 1.5rem;
    }
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
  display: flex;
  flex-direction: column;
  gap: var(--spacing-card-md);

  a {
    display: inline-flex;
    align-items: center;
    border-radius: 1rem;
    color: var(--color-text);
    font-weight: 500;
    width: fit-content;

    svg,
    img {
      height: 1.1rem;
      width: 1.1rem;
      color: var(--color-text-secondary);
      margin-right: var(--gap-sm);
    }

    .external-icon {
      height: 0.8rem;
      width: 0.8rem;
      margin-left: var(--gap-xs);
      margin-bottom: auto;
    }

    &:focus-visible,
    &:hover {
      &,
      svg,
      img {
        color: var(--color-contrast);
      }
    }

    &:active {
      svg,
      img,
      span {
        color: var(--color-text-dark);
      }
    }
  }
}

.team-member {
  align-items: center;
  padding: 0.25rem 0.5rem;
  margin-left: -0.5rem;

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

    .value {
      width: 50%;

      &::first-letter {
        text-transform: capitalize;
      }

      &.lowercase {
        &::first-letter {
          text-transform: none;
        }
      }
    }

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

.status-buttons {
  margin-top: var(--spacing-card-sm);
}

.mod-message__title {
  font-weight: bold;
  margin-bottom: var(--spacing-card-xs);
  font-size: 1.125rem;
}

.modal-license {
  padding: var(--spacing-card-bg);
}

.settings-header {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-card-sm);
  align-items: center;
  margin-bottom: var(--spacing-card-bg);

  .settings-header__icon {
    flex-shrink: 0;
  }

  .settings-header__text {
    h1 {
      font-size: var(--font-size-md);
      margin-top: 0;
      margin-bottom: var(--spacing-card-sm);
    }
  }
}

.normal-page__sidebar {
  padding-top: 1rem;
}

.normal-page__sidebar .mod-button {
  margin-top: var(--spacing-card-sm);
}

.monthly-table {
  display: flex;
  flex-direction: column;
  gap: var(--gap-sm);

  .monthly-table__row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: var(--gap-sm);
    color: var(--color-contrast);
    border: 2px solid var(--color-red);
    background-color: rgba(#ff496e, 0.25);
    border-radius: var(--radius-md);

    .btn {
      border: 2px solid var(--color-red);
      background-color: rgba(#ff496e, 0.25);
    }
  }
}

.support-card {
  display: flex;
  flex-direction: column;
  gap: var(--gap-md);
  padding-bottom: var(--gap-xl);

  .card-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
  }
}

.one-time-section {
  display: flex;
  flex-direction: column;
  gap: var(--gap-sm);

  .one-time-section__row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--gap-md);
  }
}

.overflow-button {
  padding: var(--gap-sm);

  svg {
    margin: 0;
  }
}

.featured-gallery-image {
  img {
    display: block;
    width: 100%;
    border-radius: 15px;
    aspect-ratio: 2 / 1;
    object-fit: cover;
    border: 1px solid var(--color-divider);
  }
}

.breadcrumbs {
  display: flex;
  align-items: center;
  color: var(--color-secondary);
  margin-bottom: 2rem;
  flex-wrap: wrap;

  span:not(.current) {
    color: var(--color-base);
  }

  svg {
    margin-inline: 0.5rem;
  }
}

.search-row {
  margin-bottom: 1rem;
}

.clickable-header {
  display: flex;
  align-items: center;
}

.sidebar-section {
  margin-bottom: 2rem;
  &.gallery {
    img {
      width: 20rem;
      border-radius: 12px;
      aspect-ratio: 2 / 1;
    }
  }
}

.nav-container {
  margin-bottom: 1rem;
}

.proj-header {
  display: grid;
  grid-template-columns: min-content 1fr auto;
  margin-bottom: 1rem;

  .summary {
    color: var(--color-secondary);
    font-size: var(--font-size-sm);
    margin-right: 5rem;
  }

  @media screen and (max-width: 900px) {
    grid-template-columns: min-content 1fr;

    .mod-buttons {
      margin-top: var(--gap-lg);
      grid-column: span 2;
    }
  }
}

.game-icon {
  width: 5rem;
  height: 5rem;
  margin-right: 1rem;
  box-shadow: none;
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 14px;
  border: 1px solid var(--color-divider);
  background-color: var(--color-raised-bg);

  .avatar {
    --size: 5rem !important;
    background-color: transparent;
    border: none;
    box-shadow: none;
    border-radius: inherit;
  }
}

.game-title {
  display: flex;
  flex-direction: column;

  .game-name {
    display: flex;
    gap: 0.5rem;
    align-items: flex-start;

    h1 {
      margin: 0;
      font-size: var(--font-size-xl);
    }

    .btn {
      margin-top: -0.25rem;
    }
  }

  .game-subtitle {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
    color: var(--color-base);

    span {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-weight: 500;

      svg {
        width: 1.25rem;
        height: 1.25rem;
      }
    }
  }
}

.download-selectors {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  .btn {
    width: 100%;

    .dropdown-icon {
      margin-left: auto;
    }
  }
}

.new-nav {
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid var(--color-divider);
  margin-bottom: var(--gap-lg);

  > div {
    display: flex;
    justify-content: flex-start;
  }

  svg {
    height: 1.2rem;
    width: 1.2rem;
  }

  a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    border-bottom: 3px solid transparent;
    padding: 0.75rem 1rem;
    margin-bottom: -2px;

    &.router-link-exact-active {
      color: var(--color-contrast);
      border-color: var(--color-brand);
    }
  }
}

.supports-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;

  > div {
    margin: 0;
  }
}

.mod-buttons {
  display: flex;
  gap: 0.5rem;
}

.mod-stats {
  display: flex;
  margin-top: 0.5rem;
  gap: 0.75rem;
  flex-wrap: wrap;

  .stat {
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
    justify-content: center;

    .label {
      color: var(--color-secondary);
    }

    .value {
      font-weight: 500;
    }
  }
}

.normal-page__info {
  h2 {
    font-size: var(--font-size-nm) !important;
    font-weight: 700;
    color: var(--color-text-dark);
    //font-family: 'Inter', sans-serif;
  }

  > div {
    margin: 0;
  }

  > div:not(:first-child) {
    margin-top: 1rem;
  }
}

.button-group-long {
  display: flex;
  width: 100%;
  gap: 0.5rem;
  margin-top: 1rem;

  > .btn:not(.icon-only) {
    width: 100%;
  }
}

.primary-stat {
  .primary-stat__text {
    .categories {
      margin-top: 0.5rem;
    }
  }
}

@media screen and (max-width: 900px) {
  .page-bar .desktop-settings-button {
    display: none;
  }
}
</style>
