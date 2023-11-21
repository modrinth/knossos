<template>
  <div ref="main_page" class="page-container" :class="{ 'expanded-mobile-nav': mobileBrowseOpen }">
    <header class="site-header" role="presentation">
      <section class="mobile-navigation">
        <div
          class="nav-menu nav-menu-browse"
          :class="{ expanded: mobileBrowseOpen }"
          @focusin="mobileBrowseOpen = true"
          @focusout="mobileBrowseOpen = false"
        >
          <div class="links cascade-links">
            <NuxtLink
              v-for="navRoute in navRoutes"
              :key="navRoute.href"
              :to="navRoute.href"
              class="iconified-button"
            >
              {{ navRoute.label }}
            </NuxtLink>
          </div>
        </div>
        <div
          class="nav-menu nav-menu-mobile"
          :class="{ expanded: mobileUserOpen }"
          @focusin="mobileUserOpen = true"
          @focusout="mobileUserOpen = false"
        >
          <div class="account-container">
            <NuxtLink
              v-if="auth.user"
              :to="`/user/${auth.user.username}`"
              class="iconified-button account-button"
            >
              <Avatar
                v-if="false"
                :src="auth.user.avatar_url"
                class="user-icon"
                alt="Your avatar"
                aria-hidden="true"
                circle
              />
              <div class="account-text">
                <div>@{{ auth.user.username }}</div>
                <div>Visit your profile</div>
              </div>
            </NuxtLink>
            <nuxt-link v-else class="iconified-button brand-button" to="/auth/sign-in">
              <LogInIcon /> Sign in
            </nuxt-link>
          </div>
          <div class="links">
            <template v-if="auth.user">
              <button class="iconified-button danger-button" @click="logoutUser()">
                <LogOutIcon aria-hidden="true" />
                Log out
              </button>
              <button class="iconified-button" @click="$refs.modal_creation.show()">
                <PlusIcon aria-hidden="true" />
                Create a project
              </button>
              <NuxtLink class="iconified-button" to="/follows">
                <HeartIcon aria-hidden="true" />
                Following
              </NuxtLink>
              <NuxtLink
                v-if="auth.user && (auth.user.role === 'moderator' || auth.user.role === 'admin')"
                class="iconified-button"
                to="/moderation"
              >
                <ModerationIcon aria-hidden="true" />
                Moderation
              </NuxtLink>
            </template>
            <NuxtLink class="iconified-button" to="/settings">
              <SettingsIcon aria-hidden="true" />
              Settings
            </NuxtLink>
            <button class="iconified-button" @click="changeTheme($colorMode.value)">
              <MoonIcon v-if="$colorMode.value === 'light'" class="icon" />
              <SunIcon v-else class="icon" />
              <span class="dropdown-item__text">Change theme</span>
            </button>
          </div>
        </div>
        <div class="mobile-navbar" :class="{ expanded: mobileBrowseOpen || mobileUserOpen }">
          <NuxtLink to="/" class="tab button-animation" title="Home">
            <ModrinthIcon />
          </NuxtLink>
          <button
            class="tab button-animation"
            :class="{ 'router-link-exact-active': mobileBrowseOpen }"
            title="Search"
            @click="toggleBrowseMenu()"
          >
            <template v-if="auth.user">
              <SearchIcon />
            </template>
            <template v-else>
              <SearchIcon class="smaller" />
              Search
            </template>
          </button>
          <template v-if="auth.user">
            <NuxtLink
              to="/inbox"
              class="tab button-animation"
              :class="{
                bubble: user.notifications.length > 0,
                'no-active': mobileUserOpen || mobileBrowseOpen,
              }"
              title="Notifications"
              @click="
                () => {
                  mobileUserOpen = false
                  mobileBrowseOpen = false
                }
              "
            >
              <NotificationIcon />
            </NuxtLink>
            <NuxtLink to="/" class="tab button-animation" title="Dashboard">
              <ChartIcon />
            </NuxtLink>
          </template>
          <button
            class="tab button-animation"
            title="Toggle Mobile Menu"
            @click="toggleMobileMenu()"
          >
            <template v-if="!auth.user">
              <HamburgerIcon v-if="!mobileUserOpen" />
              <CrossIcon v-else />
            </template>
            <template v-else>
              <Avatar
                v-if="false"
                :src="auth.user.avatar_url"
                class="user-icon"
                :class="{ expanded: mobileUserOpen }"
                alt="Your avatar"
                aria-hidden="true"
                circle
              />
            </template>
          </button>
        </div>
      </section>
    </header>
    <div class="page-layout">
      <nav>
        <div class="navbar-brand">
          <NuxtLink to="/" class="button-base logo-button" aria-label="Modrinth home page">
            <BrandTextLogo aria-hidden="true" />
          </NuxtLink>
        </div>
        <div class="navbar-links">
          <NuxtLink class="btn btn-transparent" to="/home">
            <span class="title">Home</span>
          </NuxtLink>
          <OverflowMenu
            class="btn btn-transparent btn-dropdown-animation"
            :class="{
              'visibly-active': route.name.startsWith('search-'),
            }"
            position="bottom"
            direction="right"
            :options="[
              {
                id: 'mods',
                link: '/mods',
              },
              {
                id: 'modpacks',
                link: '/modpacks',
              },
              {
                id: 'datapacks',
                link: '/datapacks',
              },
              {
                id: 'resourcepacks',
                link: '/resourcepacks',
              },
              {
                id: 'worlds',
                link: '/worlds',
              },
              {
                id: 'shaders',
                link: '/shaders',
              },
              {
                id: 'plugins',
                link: '/plugins',
              },
            ]"
          >
            Browse <DropdownIcon />
            <template #mods> <BoxIcon /> Mods </template>
            <template #modpacks> <PackageIcon /> Modpacks </template>
            <template #datapacks> <BracesIcon /> Data Packs </template>
            <template #resourcepacks> <ImageIcon /> Resource Packs </template>
            <template #worlds> <WorldIcon /> Worlds </template>
            <template #shaders> <GlassesIcon /> Shaders </template>
            <template #plugins> <ServerIcon /> Plugins </template>
          </OverflowMenu>

          <OverflowMenu
            class="btn btn-transparent btn-dropdown-animation"
            position="bottom"
            direction="right"
            :options="[
              {
                id: 'new-project',
                action: () => $refs.modal_creation.show(),
              },
              // {
              //   id: 'import-project',
              //   action: () => {},
              // },
              {
                id: 'new-collection',
                action: () => {},
              },
              { divider: true },
              {
                id: 'new-organization',
                action: () => {},
              },
            ]"
          >
            Create <DropdownIcon />
            <template #new-project> <BoxIcon /> New project </template>
            <template #import-project> <BoxImportIcon /> Import project </template>
            <template #new-collection> <CollectionIcon /> New collection </template>
            <template #new-organization> <OrganizationIcon /> New organization </template>
          </OverflowMenu>
          <nuxt-link class="btn btn-transparent btn-primary" to="/app"> Modrinth App </nuxt-link>
        </div>
        <div class="navbar-user">
          <button class="btn btn-transparent icon-only" @click="changeTheme($colorMode.value)">
            <MoonIcon v-if="$colorMode.value === 'light'" class="icon" />
            <SunIcon v-else class="icon" />
          </button>
          <OverflowMenu
            v-if="auth.user"
            class="btn btn-transparent btn-dropdown-animation"
            aria-label="User menu"
            position="bottom"
            direction="left"
            :options="[
              {
                id: 'profile',
                action: () => {
                  router.push(`/user/${auth.user.username}`)
                },
              },
              {
                id: 'saved',
                action: () => {
                  router.push(`/follows`)
                },
              },
              {
                id: 'projects',
                action: () => {
                  router.push(`/projects`)
                },
              },
              {
                id: 'collections',
                action: () => {
                  router.push(`/collections`)
                },
              },
              {
                id: 'reports',
                action: () => {
                  router.push(`/reports`)
                },
              },
              { divider: true },
              {
                id: 'sign-out',
                color: 'danger',
                action: () => logoutUser(),
                hoverFilled: true,
              },
            ]"
          >
            <Avatar
              :src="auth.user.avatar_url"
              class="user-avatar"
              alt="Your avatar"
              aria-hidden="true"
              circle
            />
            {{ auth.user.username }}
            <DropdownIcon />

            <template #profile>
              <UserIcon aria-hidden="true" />
              Profile
            </template>

            <template #saved>
              <BookmarkIcon aria-hidden="true" />
              Saved
            </template>

            <template #projects>
              <ListIcon aria-hidden="true" />
              Projects
            </template>

            <template #collections>
              <DashboardIcon aria-hidden="true" />
              Collections
            </template>

            <template #create-project>
              <PlusIcon aria-hidden="true" />
              Create a project
            </template>

            <template #reports>
              <ReportIcon aria-hidden="true" />
              Reports
            </template>
          </OverflowMenu>
          <template v-else>
            <nuxt-link class="btn" to="/auth/sign-in"> <LogInIcon /> Sign in </nuxt-link>
          </template>
        </div>
      </nav>
      <main>
        <ModalCreation v-if="auth.user" ref="modal_creation" />
        <section v-if="displayWarning" class="warning-banner universal-card">
          <IssuesIcon class="warning-icon" />
          <template v-if="auth.user.email">
            <span> For security purposes, please verify your email address on Modrinth. </span>
            <button class="btn" @click="resendVerifyEmail">Re-send verification email</button>
          </template>
          <template v-else>
            <span>For security purposes, please enter your email on Modrinth.</span>
            <nuxt-link class="btn btn-highlight" to="/settings/account">
              Visit account settings
            </nuxt-link>
          </template>
        </section>
        <slot id="main" />
      </main>
      <footer>
        <div class="logo-info" role="region" aria-label="Modrinth information">
          <BrandTextLogo
            aria-hidden="true"
            class="text-logo button-base"
            @click="developerModeIncrement()"
          />
          <p>
            Modrinth is
            <a
              :target="$external()"
              href="https://github.com/modrinth"
              class="text-link"
              rel="noopener"
            >
              open source</a
            >.
          </p>
          <p>
            {{ config.public.owner }}/{{ config.public.slug }} {{ config.public.branch }}@<a
              :target="$external()"
              :href="
                'https://github.com/' +
                config.public.owner +
                '/' +
                config.public.slug +
                '/tree/' +
                config.public.hash
              "
              class="text-link"
              rel="noopener"
              >{{ config.public.hash.substring(0, 7) }}</a
            >
          </p>
          <p>© Rinth, Inc.</p>
        </div>
        <div class="links links-1" role="region" aria-label="Legal">
          <h4 aria-hidden="true">Company</h4>
          <nuxt-link to="/legal/terms"> Terms</nuxt-link>
          <nuxt-link to="/legal/privacy"> Privacy</nuxt-link>
          <nuxt-link to="/legal/rules"> Rules</nuxt-link>
          <a :target="$external()" href="https://careers.modrinth.com"
            >Careers <span class="count-bubble">1</span></a
          >
        </div>
        <div class="links links-2" role="region" aria-label="Resources">
          <h4 aria-hidden="true">Resources</h4>
          <a :target="$external()" href="https://blog.modrinth.com">Blog</a>
          <a :target="$external()" href="https://docs.modrinth.com">Docs</a>
          <a :target="$external()" href="https://status.modrinth.com">Status</a>
          <a rel="noopener" :target="$external()" href="https://github.com/modrinth">GitHub</a>
        </div>
        <div class="links links-3" role="region" aria-label="Interact">
          <h4 aria-hidden="true">Interact</h4>
          <a rel="noopener" :target="$external()" href="https://discord.gg/EUHuJHt"> Discord </a>
          <a rel="noopener" :target="$external()" href="https://x.com/modrinth"> X (Twitter) </a>
          <a rel="noopener" :target="$external()" href="https://floss.social/@modrinth">
            Mastodon
          </a>
          <a rel="noopener" :target="$external()" href="https://crowdin.com/project/modrinth">
            Crowdin
          </a>
        </div>
        <div class="buttons">
          <nuxt-link class="btn btn-outline btn-primary" to="/app">
            <DownloadIcon aria-hidden="true" />
            Get Modrinth App
          </nuxt-link>
          <button class="iconified-button raised-button" @click="changeTheme($colorMode.value)">
            <MoonIcon v-if="$colorMode.value === 'light'" aria-hidden="true" />
            <SunIcon v-else aria-hidden="true" />
            Change theme
          </button>
          <nuxt-link class="iconified-button raised-button" to="/settings">
            <SettingsIcon aria-hidden="true" />
            Settings
          </nuxt-link>
        </div>
        <div class="not-affiliated-notice">
          NOT AN OFFICIAL MINECRAFT PRODUCT. NOT APPROVED BY OR ASSOCIATED WITH MOJANG.
        </div>
      </footer>
    </div>
  </div>
</template>
<script setup>
import {
  LogInIcon,
  DownloadIcon,
  BoxIcon,
  ServerIcon,
  ImageIcon,
  DropdownIcon,
  OverflowMenu,
  DashboardIcon,
  PopoutMenu,
} from 'omorphia'
import HamburgerIcon from '~/assets/images/utils/hamburger.svg'
import CrossIcon from '~/assets/images/utils/x.svg'
import SearchIcon from '~/assets/images/utils/search.svg'

import NotificationIcon from '~/assets/images/utils/bell.svg'
import SettingsIcon from '~/assets/images/utils/settings.svg'
import ModerationIcon from '~/assets/images/utils/moderation.svg'
import ModrinthIcon from '~/assets/images/utils/modrinth.svg'

import CompassIcon from '~/assets/images/utils/compass.svg'
import HomeIcon from '~/assets/images/utils/home.svg'
import MoonIcon from '~/assets/images/utils/moon.svg'
import SunIcon from '~/assets/images/utils/sun.svg'
import PlusIcon from '~/assets/images/utils/plus.svg'
import LogOutIcon from '~/assets/images/utils/log-out.svg'
import ReportIcon from '~/assets/images/utils/report.svg'
import BookmarkIcon from '~/assets/images/utils/bookmark.svg'
import HeartIcon from '~/assets/images/utils/heart.svg'
import ChartIcon from '~/assets/images/utils/chart.svg'
import PackageIcon from '~/assets/images/utils/package-open.svg'
import BlocksIcon from '~/assets/images/utils/blocks.svg'
import WorldIcon from '~/assets/images/utils/world.svg'
import GlassesIcon from '~/assets/images/utils/glasses.svg'
import BracesIcon from '~/assets/images/utils/braces.svg'
import OrganizationIcon from '~/assets/images/utils/organization.svg'
import CollectionIcon from '~/assets/images/utils/collection.svg'
import BoxImportIcon from '~/assets/images/utils/box-import.svg'
import ListIcon from '~/assets/images/utils/list.svg'
import UserIcon from '~/assets/images/utils/user.svg'
import ArrowRightLeftIcon from '~/assets/images/utils/arrow-right-left.svg'
import MoreHorizontalIcon from '~/assets/images/utils/more-horizontal.svg'
import MessagesSquareIcon from '~/assets/images/utils/messages-square.svg'
import InboxIcon from '~/assets/images/utils/inbox.svg'
import IssuesIcon from '~/assets/images/utils/issues.svg'

import MinecraftIcon from '~/assets/images/games/minecraft.svg'

import NavRow from '~/components/ui/NavRow.vue'
import ModalCreation from '~/components/ui/ModalCreation.vue'
import Avatar from '~/components/ui/Avatar.vue'
import Checkbox from '~/components/ui/Checkbox.vue'

const app = useNuxtApp()
const auth = await useAuth()
const user = await useUser()
const cosmetics = useCosmetics()
const tags = useTags()

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const link = config.public.siteUrl + route.path.replace(/\/+$/, '')
useHead({
  meta: [{ name: 'og:url', content: link }],
  link: [
    {
      rel: 'canonical',
      href: link,
    },
  ],
})

const displayWarning = computed(
  () => auth.value.user && !auth.value.user.email_verified && route.path !== '/auth/verify-email'
)

let developerModeCounter = 0

const selectedProjectType = ref('mods')

function setProjectType(type) {
  selectedProjectType.value = type
}

// replace - with space
const prettyProjectType = computed(() => selectedProjectType.value.replace('-', ' '))
const selectedRoute = computed(() => selectedProjectType.value.replace('-', ''))

function developerModeIncrement() {
  if (developerModeCounter >= 5) {
    cosmetics.value.developerMode = !cosmetics.value.developerMode
    saveCosmetics()
    developerModeCounter = 0
    if (cosmetics.value.developerMode) {
      app.$notify({
        group: 'main',
        title: 'Developer mode activated',
        text: 'Developer mode has been enabled',
        type: 'success',
      })
    } else {
      app.$notify({
        group: 'main',
        title: 'Developer mode deactivated',
        text: 'Developer mode has been disabled',
        type: 'success',
      })
    }
  } else {
    developerModeCounter++
  }
}

async function logoutUser() {
  await logout()
}
// const handleClickOutside = (event) => {
//   const elements = document.elementsFromPoint(event.clientX, event.clientY)
//   if (
//     dropdown.value.$el !== event.target &&
//     !elements.includes(dropdown.value.$el) &&
//     !dropdown.value.contains(event.target)
//   ) {
//     dropdownVisible.value = false
//   }
// }

function changeTheme(value) {
  updateTheme(
    ['dark', 'oled', 'retro'].includes(value) ? 'light' : this.cosmetics.preferredDarkTheme,
    true
  )
}
</script>
<script>
export default defineNuxtComponent({
  data() {
    return {
      desktopBrowseOpen: true,
      desktopUserMenu: false,
      mobileUserOpen: false,
      mobileBrowseOpen: false,
      registeredSkipLink: null,
      navRoutes: [
        {
          label: 'Discover Mods',
          href: '/mods',
        },
        {
          label: 'Dashboard',
          href: '/',
        },
        {
          label: 'Inbox',
          href: '/inbox',
        },
      ],
    }
  },
  computed: {
    isOnSearchPage() {
      return this.navRoutes.some((route) => this.$route.path.startsWith(route.href))
    },
  },
  watch: {
    '$route.path'() {
      this.mobileUserOpen = false
      this.mobileBrowseOpen = false

      if (process.client) {
        document.body.style.overflowY = 'scroll'
        document.body.setAttribute('tabindex', '-1')
        document.body.removeAttribute('tabindex')
      }

      updateCurrentDate()
      this.runAnalytics()
    },
  },
  mounted() {
    if (process.client && window) {
      window.history.scrollRestoration = 'auto'
    }

    this.runAnalytics()
  },
  methods: {
    runAnalytics() {
      const config = useRuntimeConfig()
      const replacedUrl = config.public.apiBaseUrl.replace('v2/', '')

      setTimeout(() => {
        $fetch(`${replacedUrl}analytics/view`, {
          method: 'POST',
          body: {
            url: window.location.href,
          },
        })
          .then(() => {})
          .catch(() => {})
      })
    },
    toggleMobileMenu() {
      this.mobileUserOpen = !this.mobileUserOpen
      if (this.mobileUserOpen) {
        this.mobileBrowseOpen = false
      }
    },
    toggleBrowseMenu() {
      this.mobileBrowseOpen = !this.mobileBrowseOpen

      if (this.mobileBrowseOpen) {
        this.mobileUserOpen = false
      }
    },
  },
})
</script>

<style lang="scss">
@import '~/assets/styles/global.scss';
@import 'omorphia/dist/style.css';

.landing-layout {
  display: flex;
  flex-direction: column;
}

.page-layout {
  display: flex;
  flex-direction: column;

  > * {
    width: calc(100%);
    max-width: 80rem;
    margin-inline: auto;
    padding-inline: var(--gap-lg);
  }

  > nav {
    grid-area: nav;
    display: grid;
    padding-block: 1.25rem;
    margin-bottom: 0.5rem;
    align-items: center;
    gap: var(--gap-lg);
    position: relative;
    grid-template: 'brand links user';
    grid-template-columns: min-content 1fr auto;

    @media screen and (max-width: 910px) {
      grid-template: 'brand user' 'links links';
      grid-template-columns: 1fr auto;

      .navbar-links {
        margin-inline: auto;
      }
    }

    @media screen and (max-width: 600px) and (hover: none) {
      display: none;
    }

    .navbar-links,
    .navbar-user {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .navbar-brand {
      grid-area: brand;
    }

    .navbar-user {
      grid-area: user;
    }

    .navbar-links {
      grid-area: links;
      flex-wrap: wrap;
    }

    .user-avatar {
      width: 1.5rem;
      height: 1.5rem;
    }

    .logo-heading {
      display: flex;
      flex-direction: row;
      align-items: center;

      .square-button {
        margin-left: auto;
      }
    }

    .logo-button {
      svg {
        height: 1.8rem;
        width: auto;
        display: block;
        color: var(--color-contrast);
      }
    }

    .btn {
      box-shadow: none;
      color: var(--color);
      font-weight: 600;

      &:not(.square-button) svg {
        color: var(--color-text-secondary);
      }

      > svg {
        flex-shrink: 0;
      }

      &.visibly-active,
      &.allow-non-exact.router-link-active,
      &.router-link-exact-active {
        color: var(--color-brand);
        background-color: var(--color-brand-highlight);

        &:not(.square-button) svg {
          color: var(--color);
        }
      }

      &.danger {
        color: var(--color-red);

        svg {
          color: var(--color-red);
        }
      }
    }

    .page-links {
      margin-top: var(--gap-xs);
      display: flex;
      flex-direction: column;
      flex-grow: 1;

      .btn {
        margin-top: var(--gap-xs);
        text-align: unset;

        &:not(.square-button) {
          width: 100%;
        }
      }

      .game-button {
        border: 1px solid var(--color-divider);

        .game-icon {
          height: 2rem;
          width: 2rem;
          margin-right: 0.5rem;
        }

        .game-title {
          display: flex;
          flex-direction: column;

          .game-title__title {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            flex-shrink: 1;
            width: 7rem;
          }

          .game-title__subtitle {
            font-size: 0.8rem;
            color: var(--color-text-secondary);
          }
        }

        .switch-icon {
          margin-left: auto;
        }
      }

      .top-links {
        display: flex;
        flex-direction: column;
        flex-grow: 1;

        .game-button {
          margin-bottom: var(--gap-sm);
        }
      }

      .bottom-links {
        display: flex;
        flex-direction: column;
        margin-top: auto;

        .btn-primary {
          color: var(--color-accent-contrast);

          svg {
            color: var(--color-accent-contrast);
          }
        }

        .sign-in.router-link-exact-active {
          visibility: hidden;
        }

        .get-app-button {
          color: var(--color-brand);

          svg {
            color: var(--color-brand);
          }
        }

        .game-button {
          margin-top: var(--gap-sm);
        }
      }
    }
  }
}

.layout {
  min-height: 100vh;
  background-color: var(--color-bg);
  display: flex;
  justify-content: center;
  padding-top: var(--gap-lg);

  main {
    grid-area: main;
  }
}

.site-header {
  max-width: 100vw;

  @media screen and (min-width: 1280px) {
    border-radius: var(--size-rounded-sm);
    max-width: 1280px;
  }

  .mobile-navigation {
    display: none;

    .nav-menu {
      width: 100%;
      position: fixed;
      bottom: calc(var(--size-mobile-navbar-height) - var(--size-rounded-card));
      padding-bottom: var(--size-rounded-card);
      left: 0;
      background-color: var(--color-raised-bg);
      z-index: 6;
      transform: translateY(100%);
      transition: transform 0.4s cubic-bezier(0.54, 0.84, 0.42, 1);
      border-radius: var(--size-rounded-card) var(--size-rounded-card) 0 0;
      box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0);

      .links,
      .account-container {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        grid-gap: 1rem;
        justify-content: center;
        padding: 1rem;

        .iconified-button {
          width: 100%;
          max-width: 500px;
          padding: 0.75rem;
          justify-content: center;
          font-weight: 600;
          font-size: 1rem;
          margin: 0 auto;
        }
      }

      .cascade-links {
        @media screen and (min-width: 354px) {
          grid-template-columns: repeat(2, 1fr);
        }
        @media screen and (min-width: 674px) {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      &-browse {
        &.expanded {
          transform: translateY(0);
          box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.3);
        }
      }

      &-mobile {
        .account-container {
          padding-bottom: 0;

          .account-button {
            padding: var(--spacing-card-md);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;

            .user-icon {
              width: 2.25rem;
              height: 2.25rem;
            }

            .account-text {
              flex-grow: 0;
            }
          }
        }

        &.expanded {
          transform: translateY(0);
          box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.3);
        }
      }
    }

    .mobile-navbar {
      display: flex;
      height: calc(var(--size-mobile-navbar-height) + env(safe-area-inset-bottom));
      border-radius: var(--size-rounded-card) var(--size-rounded-card) 0 0;
      padding-bottom: env(safe-area-inset-bottom);
      position: fixed;
      left: 0;
      bottom: 0;
      background-color: var(--color-raised-bg);
      box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.3);
      z-index: 7;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      transition: border-radius 0.3s ease-out;
      border-top: 2px solid rgba(0, 0, 0, 0);
      box-sizing: border-box;

      &.expanded {
        box-shadow: none;
        border-radius: 0;
      }

      .tab {
        position: relative;
        background: none;
        display: flex;
        flex-basis: 0;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        gap: 0.25rem;
        font-weight: bold;
        padding: 0;
        transition: color ease-in-out 0.15s;
        color: var(--color-text-inactive);
        text-align: center;

        &.browse {
          svg {
            transform: rotate(180deg);
            transition: transform ease-in-out 0.3s;

            &.closed {
              transform: rotate(0deg);
            }
          }
        }

        &.bubble {
          &::after {
            background-color: var(--color-brand);
            border-radius: var(--size-rounded-max);
            content: '';
            height: 0.5rem;
            position: absolute;
            left: 1.5rem;
            top: 0;
            width: 0.5rem;
          }
        }

        svg {
          height: 1.75rem;
          width: 1.75rem;

          &.smaller {
            width: 1.25rem;
            height: 1.25rem;
          }
        }

        .user-icon {
          width: 2rem;
          height: 2rem;
          transition: border ease-in-out 0.15s;
          border: 0 solid var(--color-brand);
          box-sizing: border-box;

          &.expanded {
            border: 2px solid var(--color-brand);
          }
        }

        &:hover,
        &:focus {
          color: var(--color-text);
        }

        &:first-child {
          margin-left: 2rem;
        }

        &:last-child {
          margin-right: 2rem;
        }

        &.router-link-exact-active:not(&.no-active) {
          svg {
            color: var(--color-brand);
          }

          color: var(--color-brand);
        }
      }
    }

    @media screen and (max-width: 600px) and (hover: none) {
      display: flex;
    }
  }

  div {
    flex-grow: 1;
    justify-content: end;
    align-items: center;
    row-gap: 1rem;
  }

  &.active {
    display: flex;

    @media screen and (min-width: 1095px) {
      display: none;
    }
  }
}

footer {
  margin-block: 6rem;
  text-align: center;
  display: grid;
  grid-template:
    'logo-info  logo-info  logo-info' auto
    'links-1    links-2    links-3' auto
    'buttons    buttons    buttons' auto
    'notice     notice     notice' auto
    / 1fr 1fr 1fr;

  .logo-info {
    margin-left: auto;
    margin-right: auto;
    max-width: 15rem;
    margin-bottom: 1rem;
    grid-area: logo-info;

    .text-logo {
      width: 10rem;
      height: auto;
    }
  }

  .links {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;

    h4 {
      color: var(--color-text-dark);
      margin: 0 0 1rem 0;
    }

    a {
      margin: 0 0 1rem 0;
    }

    &.links-1 {
      grid-area: links-1;
    }

    &.links-2 {
      grid-area: links-2;
    }

    &.links-3 {
      grid-area: links-3;
    }

    .count-bubble {
      font-size: 1rem;
      border-radius: 5rem;
      background: var(--color-brand);
      color: var(--color-text-inverted);
      padding: 0 0.35rem;
      margin-left: 0.25rem;
    }
  }

  .buttons {
    margin-left: auto;
    margin-right: auto;
    grid-area: buttons;

    button,
    a {
      margin-bottom: 0.5rem;
      margin-left: auto;
      margin-right: auto;
    }
  }

  .not-affiliated-notice {
    grid-area: notice;
    font-size: var(--font-size-xs);
    text-align: center;
    font-weight: 500;
    margin-top: var(--spacing-card-md);
  }

  @media screen and (min-width: 1024px) {
    display: grid;
    grid-template:
      'logo-info  links-1 links-2 links-3 buttons' auto
      'notice     notice  notice  notice  notice' auto;
    text-align: unset;

    .logo-info {
      margin-right: 4rem;
    }

    .links {
      margin-right: 4rem;
    }

    .buttons {
      width: unset;
      margin-left: 0;

      button,
      a {
        margin-right: unset;
      }
    }

    .not-affiliated-notice {
      margin-top: 0;
    }
  }
}

@media (min-width: 1024px) {
  .layout {
    main {
      .alpha-alert {
        margin: 1rem;

        .wrapper {
          padding: 1rem 2rem 1rem 1rem;
        }
      }
    }
  }
}

.warning-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--gap-sm);
  padding: 0.5rem 1rem;
  height: 4rem;
  max-height: 4rem;
  margin-bottom: var(--gap-lg);
  border-color: var(--color-orange);
  background-color: rgba(255, 163, 71, 0.15);

  .warning-icon {
    color: var(--color-orange);
  }
}

.profile-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--size-rounded-md);
  background-color: var(--color-raised-bg);
  transition: background-color ease-in-out 0.15s;

  &:hover,
  &:focus {
    background-color: var(--color-raised-bg-hover);
  }

  .user-icon {
    width: 2rem;
    height: 2rem;
    transition: border ease-in-out 0.15s;
    border: 0 solid var(--color-brand);
    box-sizing: border-box;

    &.expanded {
      border: 2px solid var(--color-brand);
    }
  }
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
