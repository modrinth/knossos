<template>
  <div v-if="$route.name.startsWith('type-id-settings')" class="normal-page">
    <div class="normal-page__sidebar">
      <aside class="universal-card">
        <div class="settings-header">
          <Avatar
            :src="project.icon_url"
            :alt="project.title"
            size="sm"
            class="settings-header__icon"
          />
          <div class="settings-header__text">
            <h1 class="wrap-as-needed">
              {{ project.title }}
            </h1>
            <Badge :type="project.status" />
          </div>
        </div>
        <h2>Project settings</h2>
        <NavStack>
          <NavStackItem :link="`/${project.project_type}/${project.slug}/settings`" label="General">
            <SettingsIcon />
          </NavStackItem>
          <NavStackItem
            :link="`/${project.project_type}/${project.slug}/settings/tags`"
            label="Tags"
          >
            <CategoriesIcon />
          </NavStackItem>
          <NavStackItem
            :link="`/${project.project_type}/${project.slug}/settings/description`"
            label="Description"
          >
            <DescriptionIcon />
          </NavStackItem>
          <NavStackItem
            :link="`/${project.project_type}/${project.slug}/settings/license`"
            label="License"
          >
            <LicenseIcon />
          </NavStackItem>
          <NavStackItem
            :link="`/${project.project_type}/${project.slug}/settings/links`"
            label="Links"
          >
            <LinksIcon />
          </NavStackItem>
          <NavStackItem
            :link="`/${project.project_type}/${project.slug}/settings/members`"
            label="Members"
          >
            <UsersIcon />
          </NavStackItem>
          <h3>Relevant pages</h3>
          <NavStackItem
            :link="`/${project.project_type}/${project.slug}`"
            label="View project"
            chevron
          >
            <EyeIcon />
          </NavStackItem>
          <NavStackItem
            :link="`/${project.project_type}/${project.slug}/gallery`"
            label="Gallery"
            chevron
          >
            <GalleryIcon />
          </NavStackItem>
          <NavStackItem
            :link="`/${project.project_type}/${project.slug}/versions`"
            label="Versions"
            chevron
          >
            <VersionIcon />
          </NavStackItem>
          <NavStackItem link="/dashboard/projects" label="All projects" chevron>
            <SettingsIcon />
          </NavStackItem>
        </NavStack>
      </aside>
    </div>
    <div class="normal-page__content">
      <ProjectPublishingChecklist
        v-if="currentMember"
        :project="project"
        :current-member="currentMember"
        :is-settings="$route.name.startsWith('type-id-settings')"
        :route-name="$route.name"
        :set-processing="setProcessing"
        :collapsed="collapsedChecklist"
        :toggle-collapsed="toggleChecklistCollapse"
      />
      <NuxtPage
        v-model:project="project"
        v-model:featured-versions="featuredVersions"
        v-model:members="members"
        v-model:all-members="allMembers"
        v-model:dependencies="dependencies"
        :current-member="currentMember"
        :patch-project="patchProject"
        :patch-icon="patchIcon"
        :update-icon="updateIcon"
      />
    </div>
  </div>
  <div v-else>
    <Head>
      <Title> {{ project.title }} - Minecraft {{ projectTypeDisplay }} </Title>
      <Meta name="og:title" :content="`${project.title} - Minecraft ${projectTypeDisplay}`" />
      <Meta
        name="description"
        :content="`${project.description} - Download the Minecraft ${projectTypeDisplay} ${
          project.title
        } by ${members.find((x) => x.role === 'Owner').user.username} on Modrinth`"
      />
      <Meta
        name="apple-mobile-web-app-title"
        :content="`${project.title} - Minecraft ${projectTypeDisplay}`"
      />
      <Meta name="og:description" :content="project.description" />
      <Meta
        name="og:image"
        :content="project.icon_url ? project.icon_url : 'https://cdn.modrinth.com/placeholder.png'"
      />
      <Meta
        name="robots"
        :content="
          project.status === 'approved' || project.status === 'archived' ? 'all' : 'noindex'
        "
      />
    </Head>
    <ModalModeration
      ref="modal_moderation"
      :project="project"
      :status="moderationStatus"
      :on-close="resetProject"
    />
    <Modal ref="modal_license" :header="project.license.name ? project.license.name : 'License'">
      <div class="modal-license">
        <div class="markdown-body" v-html="renderString(licenseText)" />
      </div>
    </Modal>
    <ModalReport
      v-if="$auth.user"
      ref="modal_project_report"
      :item-id="project.id"
      item-type="project"
    />
    <div
      :class="{
        'normal-page': true,
        'alt-layout': $cosmetics.projectLayout,
      }"
    >
      <div class="normal-page__sidebar">
        <div
          class="header project__header base-card padding-0"
          :class="{ 'has-featured-image': featuredGalleryImage }"
        >
          <nuxt-link
            class="project__gallery"
            tabindex="-1"
            :to="
              '/' +
              project.project_type +
              '/' +
              (project.slug ? project.slug : project.id) +
              '/gallery'
            "
          >
            <img
              v-if="featuredGalleryImage"
              :src="featuredGalleryImage.url"
              :alt="
                featuredGalleryImage.description
                  ? featuredGalleryImage.description
                  : featuredGalleryImage.title
              "
            />
          </nuxt-link>
          <div class="project__header__content universal-card full-width-inputs">
            <Avatar
              :src="project.icon_url"
              :alt="project.title"
              size="md"
              class="project__icon"
              no-shadow
            />
            <h1 class="title">
              {{ project.title }}
            </h1>
            <Badge v-if="$auth.user && currentMember" :type="project.status" class="status-badge" />
            <p class="description">
              {{ project.description }}
            </p>
            <Categories
              :categories="project.categories"
              :type="project.actualProjectType"
              class="categories"
            >
              <EnvironmentIndicator
                :client-side="project.client_side"
                :server-side="project.server_side"
                :type="project.project_type"
              />
            </Categories>
            <hr class="card-divider" />
            <div class="primary-stat">
              <DownloadIcon class="primary-stat__icon" aria-hidden="true" />
              <div class="primary-stat__text">
                <span class="primary-stat__counter">
                  {{ $formatNumber(project.downloads) }}
                </span>
                download<span v-if="project.downloads !== 1">s</span>
              </div>
            </div>
            <div class="primary-stat">
              <HeartIcon class="primary-stat__icon" aria-hidden="true" />
              <div class="primary-stat__text">
                <span class="primary-stat__counter">
                  {{ $formatNumber(project.followers) }}
                </span>
                follower<span v-if="project.followers !== 1">s</span>
              </div>
            </div>
            <div class="dates">
              <div
                v-tooltip="$dayjs(project.published).format('MMMM D, YYYY [at] h:mm:ss A')"
                class="date"
              >
                <CalendarIcon aria-hidden="true" />
                <span class="label">Created</span>
                <span class="value">{{ fromNow(project.published) }}</span>
              </div>
              <div
                v-tooltip="$dayjs(project.updated).format('MMMM D, YYYY [at] h:mm:ss A')"
                class="date"
              >
                <UpdateIcon aria-hidden="true" />
                <span class="label">Updated</span>
                <span class="value">{{ fromNow(project.updated) }}</span>
              </div>
            </div>
            <hr class="card-divider" />
            <div class="input-group">
              <template v-if="$auth.user">
                <button class="iconified-button" @click="$refs.modal_project_report.show()">
                  <ReportIcon aria-hidden="true" />
                  Report
                </button>
                <button
                  v-if="!$user.value.follows.find((x) => x.id === project.id)"
                  class="iconified-button"
                  @click="userFollowProject(project)"
                >
                  <HeartIcon aria-hidden="true" />
                  Follow
                </button>
                <button
                  v-if="$user.value.follows.find((x) => x.id === project.id)"
                  class="iconified-button"
                  @click="userUnfollowProject(project)"
                >
                  <HeartIcon fill="currentColor" aria-hidden="true" />
                  Unfollow
                </button>
              </template>
              <template v-else>
                <a class="iconified-button" :href="getAuthUrl()">
                  <ReportIcon aria-hidden="true" />
                  Report
                </a>
                <a class="iconified-button" :href="getAuthUrl()">
                  <HeartIcon aria-hidden="true" />
                  Follow
                </a>
              </template>
            </div>
          </div>
        </div>
        <div
          v-if="
            currentMember &&
            ((!$tag.approvedStatuses.includes(project.status) && project.status !== 'processing') ||
              (project.moderator_message &&
                (project.moderator_message.message || project.moderator_message.body)))
          "
          class="universal-card"
        >
          <h3 class="card-header">Moderation status</h3>
          <div class="current-status">
            Project status:
            <Badge :type="project.status" />
          </div>
          <div class="message">
            <p v-if="project.status === 'rejected'">
              Your project has been rejected by Modrinth's staff. In most cases, you can resubmit
              for review after addressing the staff's message, which is below. Do not resubmit until
              you've addressed the message from the moderators!
            </p>
            <div v-if="project.moderator_message">
              <hr class="card-divider" />
              <div v-if="project.moderator_message.body">
                <h3 class="card-header">Message from the moderators:</h3>
                <p v-if="project.moderator_message.message" class="mod-message__title">
                  {{ project.moderator_message.message }}
                </p>
                <div class="markdown-body" v-html="renderString(project.moderator_message.body)" />
              </div>
              <div v-else>
                <h3 class="card-header">Message from the moderators:</h3>
                <p>{{ project.moderator_message.message }}</p>
              </div>
            </div>
          </div>
          <div class="buttons status-buttons">
            <button
              v-if="
                !$tag.approvedStatuses.includes(project.status) && project.status !== 'processing'
              "
              class="iconified-button brand-button"
              @click="submitForReview"
            >
              <CheckIcon />
              Resubmit for review
            </button>
            <button
              v-if="$tag.approvedStatuses.includes(project.status)"
              class="iconified-button"
              @click="clearMessage"
            >
              <ClearIcon />
              Clear message
            </button>
          </div>
          <div v-if="showKnownErrors" class="known-errors">
            <ul>
              <li v-if="project.body === ''">
                Your project must have a body to submit for review.
              </li>
              <li v-if="project.versions.length < 1">
                Your project must have at least one version to submit for review.
              </li>
              <li v-if="project.client_side === 'unknown' || project.server_side === 'unknown'">
                Your project must have the supported environments selected.
              </li>
            </ul>
          </div>
        </div>
        <div
          v-if="$auth.user && ($auth.user.role === 'admin' || $auth.user.role === 'moderator')"
          class="universal-card moderation-card"
        >
          <h3>Moderation actions</h3>
          <div class="input-stack">
            <button
              v-if="
                !$tag.approvedStatuses.includes(project.status) || project.status === 'processing'
              "
              class="iconified-button brand-button"
              @click="
                openModerationModal(
                  project.requested_status ? project.requested_status : 'approved'
                )
              "
            >
              <CheckIcon />
              Approve
            </button>
            <button
              v-if="
                $tag.approvedStatuses.includes(project.status) || project.status === 'processing'
              "
              class="iconified-button danger-button"
              @click="openModerationModal('withheld')"
            >
              <EyeIcon />
              Withhold
            </button>
            <button
              v-if="
                $tag.approvedStatuses.includes(project.status) || project.status === 'processing'
              "
              class="iconified-button danger-button"
              @click="openModerationModal('rejected')"
            >
              <CrossIcon />
              Reject
            </button>
            <button class="iconified-button" @click="openModerationModal(null)">
              <EditIcon />
              Edit message
            </button>
            <nuxt-link class="iconified-button" to="/moderation">
              <ModerationIcon />
              Visit moderation queue
            </nuxt-link>
          </div>
        </div>
      </div>
      <div class="card normal-page__info">
        <template
          v-if="
            project.issues_url ||
            project.source_url ||
            project.wiki_url ||
            project.discord_url ||
            project.donation_urls.length > 0
          "
        >
          <h3 class="card-header">External resources</h3>
          <div class="links">
            <a
              v-if="project.issues_url"
              :href="project.issues_url"
              class="title"
              :target="$external()"
              rel="noopener noreferrer nofollow ugc"
            >
              <IssuesIcon aria-hidden="true" />
              <span>Issues</span>
            </a>
            <a
              v-if="project.source_url"
              :href="project.source_url"
              class="title"
              :target="$external()"
              rel="noopener noreferrer nofollow ugc"
            >
              <CodeIcon aria-hidden="true" />
              <span>Source</span>
            </a>
            <a
              v-if="project.wiki_url"
              :href="project.wiki_url"
              class="title"
              :target="$external()"
              rel="noopener noreferrer nofollow ugc"
            >
              <WikiIcon aria-hidden="true" />
              <span>Wiki</span>
            </a>
            <a
              v-if="project.discord_url"
              :href="project.discord_url"
              :target="$external()"
              rel="noopener noreferrer nofollow ugc"
            >
              <DiscordIcon class="shrink" aria-hidden="true" />
              <span>Discord</span>
            </a>
            <a
              v-for="(donation, index) in project.donation_urls"
              :key="index"
              :href="donation.url"
              :target="$external()"
              rel="noopener noreferrer nofollow ugc"
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
              <span v-else-if="donation.id === 'patreon'">Patreon</span>
              <span v-else-if="donation.id === 'paypal'">PayPal</span>
              <span v-else-if="donation.id === 'ko-fi'">Ko-fi</span>
              <span v-else-if="donation.id === 'github'">GitHub Sponsors</span>
              <span v-else>Donate</span>
            </a>
          </div>
          <hr class="card-divider" />
        </template>
        <template v-if="featuredVersions.length > 0">
          <div class="featured-header">
            <h3 class="card-header">Featured versions</h3>
            <nuxt-link
              v-if="project.versions.length > 0 || currentMember"
              :to="`/${project.project_type}/${project.slug ? project.slug : project.id}/versions`"
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
              class="download download-button square-button brand-button"
              :title="`Download ${version.name}`"
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
        <h3 class="card-header">Project members</h3>
        <div
          v-for="member in members"
          :key="member.user.id"
          class="team-member columns button-transparent"
          @click="$router.push('/user/' + member.user.username)"
        >
          <Avatar :src="member.avatar_url" :alt="member.username" size="sm" circle />

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
        <h3 class="card-header">Technical information</h3>
        <div class="infos">
          <div class="info">
            <div class="key">License</div>
            <div class="value lowercase">
              <a v-if="project.license.url" class="text-link" :href="project.license.url">
                {{ licenseIdDisplay }}
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
          <div
            v-if="
              project.project_type !== 'resourcepack' &&
              project.project_type !== 'plugin' &&
              project.project_type !== 'shader' &&
              project.project_type !== 'datapack'
            "
            class="info"
          >
            <div class="key">Client side</div>
            <div class="value">
              {{ project.client_side }}
            </div>
          </div>
          <div
            v-if="
              project.project_type !== 'resourcepack' &&
              project.project_type !== 'plugin' &&
              project.project_type !== 'shader' &&
              project.project_type !== 'datapack'
            "
            class="info"
          >
            <div class="key">Server side</div>
            <div class="value">
              {{ project.server_side }}
            </div>
          </div>
          <div class="info">
            <div class="key">Project ID</div>
            <div class="value lowercase">
              <CopyCode :text="project.id" />
            </div>
          </div>
        </div>
      </div>
      <section class="normal-page__content">
        <ProjectPublishingChecklist
          v-if="currentMember"
          :project="project"
          :current-member="currentMember"
          :is-settings="$route.name.startsWith('type-id-settings')"
          :route-name="$route.name"
          :set-processing="setProcessing"
          :collapsed="collapsedChecklist"
          :toggle-collapsed="toggleChecklistCollapse"
        />
        <div v-if="project.status === 'withheld'" class="card warning" aria-label="Warning">
          {{ project.title }} is not viewable in search because it has been found to be in violation
          of one of <nuxt-link to="/legal/rules"> Modrinth's content rules </nuxt-link>. Modrinth
          makes no guarantees as to whether {{ project.title }} is safe for use in a multiplayer
          context.
        </div>
        <div v-if="project.status === 'archived'" class="card warning" aria-label="Warning">
          {{ project.title }} has been archived by the project author. {{ project.title }} will not
          receive any further updates unless the author decides to unarchive the project.
        </div>
        <div
          v-if="project.project_type === 'modpack'"
          class="card information"
          aria-label="Information"
        >
          To install {{ project.title }}, visit
          <a href="https://docs.modrinth.com/docs/modpacks/playing_modpacks/" :target="$external()"
            >our documentation</a
          >
          which provides instructions on using
          <a
            href="https://atlauncher.com/about"
            :target="$external()"
            rel="noopener noreferrer nofollow"
          >
            ATLauncher</a
          >,
          <a href="https://multimc.org/" :target="$external()" rel="noopener noreferrer nofollow"
            >MultiMC</a
          >, and
          <a
            href="https://prismlauncher.org"
            :target="$external()"
            rel="noopener noreferrer nofollow"
          >
            Prism Launcher</a
          >.
        </div>
        <Advertisement
          v-if="$tag.approvedStatuses.includes(project.status)"
          type="banner"
          small-screen="square"
        />
        <div class="navigation-card">
          <NavRow
            :links="[
              {
                label: 'Description',
                href: `/${project.project_type}/${project.slug ? project.slug : project.id}`,
              },
              {
                label: 'Gallery',
                href: `/${project.project_type}/${
                  project.slug ? project.slug : project.id
                }/gallery`,
                shown: project.gallery.length > 0 || !!currentMember,
              },
              {
                label: 'Changelog',
                href: `/${project.project_type}/${
                  project.slug ? project.slug : project.id
                }/changelog`,
                shown: project.versions.length > 0,
              },
              {
                label: 'Versions',
                href: `/${project.project_type}/${
                  project.slug ? project.slug : project.id
                }/versions`,
                shown: project.versions.length > 0 || !!currentMember,
              },
            ]"
          />
          <div v-if="$auth.user && currentMember" class="input-group">
            <nuxt-link
              :to="`/${project.project_type}/${project.slug}/settings`"
              class="iconified-button"
            >
              <SettingsIcon /> Settings
            </nuxt-link>
          </div>
        </div>
        <NuxtPage
          v-model:project="project"
          v-model:featured-versions="featuredVersions"
          v-model:members="members"
          v-model:all-members="allMembers"
          v-model:dependencies="dependencies"
          :current-member="currentMember"
        />
      </section>
    </div>
  </div>
</template>

<script>
import CalendarIcon from '~/assets/images/utils/calendar.svg'
import CheckIcon from '~/assets/images/utils/check.svg'
import ClearIcon from '~/assets/images/utils/clear.svg'
import DownloadIcon from '~/assets/images/utils/download.svg'
import UpdateIcon from '~/assets/images/utils/updated.svg'
import CodeIcon from '~/assets/images/sidebar/mod.svg'
import ReportIcon from '~/assets/images/utils/report.svg'
import HeartIcon from '~/assets/images/utils/heart.svg'
import IssuesIcon from '~/assets/images/utils/issues.svg'
import WikiIcon from '~/assets/images/utils/wiki.svg'
import DiscordIcon from '~/assets/images/external/discord.svg'
import BuyMeACoffeeLogo from '~/assets/images/external/bmac.svg'
import PatreonIcon from '~/assets/images/external/patreon.svg'
import KoFiIcon from '~/assets/images/external/kofi.svg'
import PayPalIcon from '~/assets/images/external/paypal.svg'
import OpenCollectiveIcon from '~/assets/images/external/opencollective.svg'
import UnknownIcon from '~/assets/images/utils/unknown-donation.svg'
import ChevronRightIcon from '~/assets/images/utils/chevron-right.svg'
import EyeIcon from '~/assets/images/utils/eye.svg'
import Advertisement from '~/components/ads/Advertisement'
import Badge from '~/components/ui/Badge'
import Categories from '~/components/ui/search/Categories'
import EnvironmentIndicator from '~/components/ui/EnvironmentIndicator'
import Modal from '~/components/ui/Modal'
import ModalReport from '~/components/ui/ModalReport'
import ModalModeration from '~/components/ui/ModalModeration'
import NavRow from '~/components/ui/NavRow'
import CopyCode from '~/components/ui/CopyCode'
import Avatar from '~/components/ui/Avatar'
import NavStack from '~/components/ui/NavStack'
import NavStackItem from '~/components/ui/NavStackItem'
import ProjectPublishingChecklist from '~/components/ui/ProjectPublishingChecklist'
import SettingsIcon from '~/assets/images/utils/settings.svg'
import UsersIcon from '~/assets/images/utils/users.svg'
import CategoriesIcon from '~/assets/images/utils/tags.svg'
import DescriptionIcon from '~/assets/images/utils/align-left.svg'
import LinksIcon from '~/assets/images/utils/link.svg'
import LicenseIcon from '~/assets/images/utils/copyright.svg'
import GalleryIcon from '~/assets/images/utils/image.svg'
import VersionIcon from '~/assets/images/utils/version.svg'
import CrossIcon from '~/assets/images/utils/x.svg'
import EditIcon from '~/assets/images/utils/edit.svg'
import ModerationIcon from '~/assets/images/sidebar/admin.svg'
import { renderString } from '~/helpers/parse'

export default defineNuxtComponent({
  components: {
    Avatar,
    CopyCode,
    NavRow,
    Badge,
    Advertisement,
    Modal,
    ModalReport,
    ModalModeration,
    ProjectPublishingChecklist,
    EnvironmentIndicator,
    IssuesIcon,
    DownloadIcon,
    CalendarIcon,
    CheckIcon,
    ClearIcon,
    UpdateIcon,
    CodeIcon,
    ReportIcon,
    HeartIcon,
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
    NavStack,
    NavStackItem,
    SettingsIcon,
    EyeIcon,
    CrossIcon,
    EditIcon,
    ModerationIcon,
    GalleryIcon,
    VersionIcon,
    UsersIcon,
    CategoriesIcon,
    DescriptionIcon,
    LinksIcon,
    LicenseIcon,
  },
  async setup() {
    const data = useNuxtApp()
    const route = useRoute()

    if (
      !route.params.id ||
      !(
        data.$tag.projectTypes.find((x) => x.id === route.params.type) ||
        route.params.type === 'project'
      )
    ) {
      throw createError({
        fatal: true,
        statusCode: 404,
        message: 'The page could not be found',
      })
    }

    try {
      const [
        { data: project },
        { data: members },
        { data: dependencies },
        { data: featuredVersions },
      ] = await Promise.all([
        useAsyncData(
          `project/${route.params.id}`,
          () => useBaseFetch(`project/${route.params.id}`, data.$defaultHeaders()),
          {
            transform: (project) => {
              project.actualProjectType = JSON.parse(JSON.stringify(project.project_type))

              project.project_type = data.$getProjectTypeForUrl(
                project.project_type,
                project.loaders
              )
              console.log(project.project_type)

              if (process.client && history.state && history.state.overrideProjectType) {
                project.project_type = history.state.overrideProjectType
              }

              return project
            },
          }
        ),
        useAsyncData(
          `project/${route.params.id}/members`,
          () => useBaseFetch(`project/${route.params.id}/members`, data.$defaultHeaders()),
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
          useBaseFetch(`project/${route.params.id}/dependencies`, data.$defaultHeaders())
        ),
        useAsyncData(`project/${route.params.id}/version?featured=true`, () =>
          useBaseFetch(`project/${route.params.id}/version?featured=true`, data.$defaultHeaders())
        ),
      ])

      if (
        project.value.project_type !== route.params.type ||
        route.params.id !== project.value.slug
      ) {
        let path = route.fullPath.split('/')
        path.splice(0, 3)
        path = path.filter((x) => x)

        await navigateTo(
          `/${project.value.project_type}/${project.value.slug}${
            path.length > 0 ? `/${path.join('/')}` : ''
          }`,
          { redirectCode: 301 }
        )
      }

      let currentMember = data.$auth.user
        ? members.value.find((x) => x.user.id === data.$auth.user.id)
        : null

      if (
        !currentMember &&
        data.$auth.user &&
        (data.$auth.user.role === 'admin' || data.$auth.user.role === 'moderator')
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

      featuredVersions.value = data.$computeVersions(featuredVersions.value, members.value)

      featuredVersions.value.sort((a, b) => {
        const aLatest = a.game_versions[a.game_versions.length - 1]
        const bLatest = b.game_versions[b.game_versions.length - 1]
        const gameVersions = data.$tag.gameVersions.map((e) => e.version)
        return gameVersions.indexOf(aLatest) - gameVersions.indexOf(bLatest)
      })

      const projectTypeDisplay = data.$formatProjectType(
        data.$getProjectTypeForDisplay(project.value.project_type, project.value.loaders)
      )

      return {
        project,
        featuredVersions: shallowRef(toRaw(featuredVersions)),
        members: ref(members.value.filter((x) => x.accepted)),
        allMembers: members,
        currentMember: ref(currentMember),
        dependencies,
        projectTypeDisplay: ref(projectTypeDisplay),
      }
    } catch (error) {
      throw createError({
        fatal: true,
        statusCode: 404,
        message: 'Project not found',
      })
    }
  },
  data() {
    return {
      showKnownErrors: false,
      licenseText: '',
      collapsedChecklist: false,
      moderationStatus: null,
    }
  },
  computed: {
    projectTypeDisplay() {
      return this.$getProjectTypeForDisplay(this.project.project_type, this.project.loaders)
    },
    licenseIdDisplay() {
      const id = this.project.license.id

      if (id === 'LicenseRef-All-Rights-Reserved') {
        return 'ARR'
      } else if (id.includes('LicenseRef')) {
        return id.replaceAll('LicenseRef-', '').replaceAll('-', ' ')
      } else {
        return id
      }
    },
    featuredGalleryImage() {
      return this.project.gallery.find((img) => img.featured)
    },
  },
  methods: {
    renderString,
    async resetProject() {
      const project = await useBaseFetch(`project/${this.project.id}`, this.$defaultHeaders())

      project.actualProjectType = JSON.parse(JSON.stringify(project.project_type))

      project.project_type = this.$getProjectTypeForUrl(project.project_type, project.loaders)

      this.project = project
    },
    async clearMessage() {
      startLoading()

      try {
        await useBaseFetch(`project/${this.project.id}`, {
          method: 'PATCH',
          body: {
            moderation_message: null,
            moderation_message_body: null,
          },
          ...this.$defaultHeaders(),
        })

        this.project.moderator_message = null
      } catch (err) {
        this.$notify({
          group: 'main',
          title: 'An error occurred',
          text: err.data.description,
          type: 'error',
        })
      }

      stopLoading()
    },
    async submitForReview() {
      if (
        this.project.body === '' ||
        this.project.body.startsWith('# Placeholder description') ||
        this.project.versions.length < 1 ||
        this.project.client_side === 'unknown' ||
        this.project.server_side === 'unknown'
      ) {
        this.showKnownErrors = true
      } else {
        await this.setProcessing()
      }
    },
    toggleChecklistCollapse() {
      this.collapsedChecklist = !this.collapsedChecklist
    },
    async setProcessing() {
      startLoading()

      try {
        await useBaseFetch(`project/${this.project.id}`, {
          method: 'PATCH',
          body: {
            status: 'processing',
          },
          ...this.$defaultHeaders(),
        })

        this.project.status = 'processing'
      } catch (err) {
        this.$notify({
          group: 'main',
          title: 'An error occurred',
          text: err.data.description,
          type: 'error',
        })
      }

      stopLoading()
    },
    async getLicenseData() {
      try {
        const text = await useBaseFetch(`tag/license/${this.project.license.id}`)
        this.licenseText = text.body
      } catch {
        this.licenseText = 'License text could not be retrieved.'
      }

      this.$refs.modal_license.show()
    },
    async patchProject(data, quiet = false) {
      let result = false
      startLoading()

      try {
        await useBaseFetch(`project/${this.project.id}`, {
          method: 'PATCH',
          body: data,
          ...this.$defaultHeaders(),
        })

        if (this.iconChanged) {
          await useBaseFetch(
            `project/${this.project.id}/icon?ext=${
              this.icon.type.split('/')[this.icon.type.split('/').length - 1]
            }`,
            {
              method: 'PATCH',
              body: this.icon,
              ...this.$defaultHeaders(),
            }
          )
        }

        for (const key in data) {
          this.project[key] = data[key]
        }

        if (data.license_id) {
          this.project.license.id = data.license_id
        }
        if (data.license_url) {
          this.project.license.url = data.license_url
        }

        this.$emit('update:project', this.project)
        result = true
        if (!quiet) {
          this.$notify({
            group: 'main',
            title: 'Project updated',
            text: 'Your project has been updated.',
            type: 'success',
          })
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      } catch (err) {
        this.$notify({
          group: 'main',
          title: 'An error occurred',
          text: err.data.description,
          type: 'error',
        })
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }

      stopLoading()

      return result
    },
    async patchIcon(icon) {
      let result = false
      startLoading()

      try {
        await useBaseFetch(
          `project/${this.project.id}/icon?ext=${
            icon.type.split('/')[icon.type.split('/').length - 1]
          }`,
          {
            method: 'PATCH',
            body: icon,
            ...this.$defaultHeaders(),
          }
        )
        await this.updateIcon()
        result = true
        this.$notify({
          group: 'main',
          title: 'Project icon updated',
          text: "Your project's icon has been updated.",
          type: 'success',
        })
      } catch (err) {
        this.$notify({
          group: 'main',
          title: 'An error occurred',
          text: err.data.description,
          type: 'error',
        })

        window.scrollTo({ top: 0, behavior: 'smooth' })
      }

      stopLoading()
      return result
    },
    async updateIcon() {
      const response = await useBaseFetch(`project/${this.project.id}`, this.$defaultHeaders())
      this.project.icon_url = response.icon_url
    },
    openModerationModal(status) {
      this.moderationStatus = status

      this.$refs.modal_moderation.show()
    },
  },
})
</script>
<style lang="scss" scoped>
.header {
  grid-area: header;
  .title {
    overflow-wrap: break-word;
    margin: var(--spacing-card-xs) 0;
    color: var(--color-text-dark);
    font-size: var(--font-size-xl);
  }

  .status-badge {
    margin-top: var(--spacing-card-sm);
  }

  .description {
    line-height: 1.3;
    overflow-wrap: break-word;

    margin-top: var(--spacing-card-sm);
    margin-bottom: 0.5rem;
    font-size: var(--font-size-nm);
  }

  .categories {
    margin: 0.25rem 0;
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

.project__header {
  overflow: hidden;
  .project__gallery {
    display: none;
  }
  &.has-featured-image {
    .project__gallery {
      display: inline-block;
      width: 100%;
      height: 10rem;
      background-color: var(--color-button-bg-active);
      img {
        width: 100%;
        height: 10rem;
        object-fit: cover;
      }
    }
    .project__icon {
      margin-top: calc(-3rem - var(--spacing-card-lg) - 4px);
      margin-left: -4px;
      z-index: 1;
      border: 4px solid var(--color-raised-bg);
      border-bottom: none;
    }
  }
  .project__header__content {
    margin: 0;
    background: none;
    border-radius: unset;
  }
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

.current-status {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-card-sm);
  margin-top: var(--spacing-card-md);
}

.normal-page__sidebar .mod-button {
  margin-top: var(--spacing-card-sm);
}
</style>
