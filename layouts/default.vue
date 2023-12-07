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
              class="btn"
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
              class="btn account-button"
            >
              <Avatar
                v-if="false"
                :src="auth.user.avatar_url"
                class="user-icon"
                alt="Your avatar"
                aria-hidden="true"
                circle
                :size="'none'"
              />
              <div class="account-text">
                <div>@{{ auth.user.username }}</div>
                <div>Visit your profile</div>
              </div>
            </NuxtLink>
            <nuxt-link v-else class="btn btn-primary" to="/auth/sign-in">
              <LogInIcon /> Sign in
            </nuxt-link>
          </div>
          <div class="links">
            <template v-if="auth.user">
              <button class="btn btn-red" @click="logoutUser()">
                <LogOutIcon aria-hidden="true" />
                Log out
              </button>
              <button class="btn" @click="$refs.modal_creation.show()">
                <PlusIcon aria-hidden="true" />
                Create a project
              </button>
              <NuxtLink class="btn" to="/settings/follows">
                <HeartIcon aria-hidden="true" />
                Following
              </NuxtLink>
              <NuxtLink
                v-if="auth.user && (auth.user.role === 'moderator' || auth.user.role === 'admin')"
                class="btn"
                to="/moderation"
              >
                <ModerationIcon aria-hidden="true" />
                Moderation
              </NuxtLink>
            </template>
            <NuxtLink class="btn" to="/settings">
              <SettingsIcon aria-hidden="true" />
              Settings
            </NuxtLink>
            <button class="btn" @click="changeTheme(colorMode.value)">
              <MoonIcon v-if="colorMode.value === 'light'" class="icon" />
              <SunIcon v-else class="icon" />
              <span class="dropdown-item__text">Change theme</span>
            </button>
          </div>
        </div>
        <div class="mobile-navbar" :class="{ expanded: mobileBrowseOpen || mobileUserOpen }">
          <NuxtLink
            to="/"
            class="tab button-animation"
            title="Home"
            :class="{
              bubble: auth.user && user.notifications.some((notif) => !notif.read),
              'no-active': mobileUserOpen || mobileBrowseOpen,
              'router-link-exact-active': route.name === 'home',
            }"
          >
            <ModrinthIcon /> Home
          </NuxtLink>
          <button
            class="tab button-animation"
            :class="{ 'router-link-exact-active': mobileBrowseOpen }"
            title="Search"
            @click="toggleBrowseMenu()"
          >
            <SearchIcon /> Browse
          </button>
          <template v-if="auth.user">
            <NuxtLink
              to="/creations"
              class="tab button-animation"
              title="Dashboard"
              :class="{
                'no-active': mobileUserOpen || mobileBrowseOpen,
              }"
            >
              <ListIcon /> Creations
            </NuxtLink>
          </template>
          <button
            class="tab button-animation"
            title="Toggle Mobile Menu"
            @click="toggleMobileMenu()"
          >
            <template v-if="!auth.user">
              <template v-if="!mobileUserOpen">
                <HamburgerIcon />
                More
              </template>
              <template v-else>
                <CrossIcon />
                Less
              </template>
            </template>
            <template v-else>
              <Avatar
                :src="auth.user.avatar_url"
                class="user-icon"
                :class="{ expanded: mobileUserOpen }"
                alt="Your avatar"
                aria-hidden="true"
                circle
                :size="'none'"
              />
              <template v-if="!mobileUserOpen"> More </template>
              <template v-else> Less </template>
            </template>
          </button>
        </div>
      </section>
    </header>
    <div class="page-layout">
      <nav>
        <div class="navbar-brand">
          <NuxtLink to="/" class="btn btn-transparent logo-button" aria-label="Modrinth home page">
            <TextLogo :animate="loading" aria-hidden="true" />
          </NuxtLink>
        </div>
        <div class="navbar-links">
          <OverflowMenu
            class="btn btn-transparent btn-header btn-dropdown-animation small-width-displayed"
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
            <template #shaders> <GlassesIcon /> Shaders </template>
            <template #plugins> <ServerIcon /> Plugins </template>
          </OverflowMenu>
          <nuxt-link class="btn btn-transparent btn-header small-width-hidden" :to="`/mods`">
            Mods
          </nuxt-link>
          <nuxt-link class="btn btn-transparent btn-header small-width-hidden" :to="`/modpacks`">
            Modpacks
          </nuxt-link>
          <nuxt-link class="btn btn-transparent btn-header small-width-hidden" :to="`/datapacks`">
            Data Packs
          </nuxt-link>
          <nuxt-link
            class="btn btn-transparent btn-header small-width-hidden"
            :to="`/resourcepacks`"
          >
            Resource Packs
          </nuxt-link>
          <nuxt-link class="btn btn-transparent btn-header small-width-hidden" :to="`/shaders`">
            Shaders
          </nuxt-link>
          <nuxt-link class="btn btn-transparent btn-header small-width-hidden" :to="`/plugins`">
            Plugins
          </nuxt-link>
        </div>
        <div class="navbar-user">
          <nuxt-link
            v-if="!cosmetics.hideModrinthAppPromos"
            class="btn btn-outline btn-primary modrinth-app-promo"
            to="/app"
          >
            <DownloadIcon /> Get Modrinth App
          </nuxt-link>
          <OverflowMenu
            v-if="auth.user"
            title="Create new..."
            class="btn btn-transparent icon-only btn-dropdown-animation"
            position="bottom"
            direction="right"
            :options="[
              {
                id: 'new-project',
                action: () => $refs.modal_creation.show(),
              },
              {
                id: 'import-project',
                disabled: true,
                action: () => {},
              },
              {
                id: 'new-collection',
                disabled: true,
                action: () => {},
              },
              { divider: true },
              {
                id: 'new-organization',
                disabled: true,
                action: () => {},
              },
            ]"
          >
            <PlusIcon /> <DropdownIcon />
            <template #new-project> <BoxIcon /> New project </template>
            <template #import-project> <BoxImportIcon /> Import project </template>
            <template #new-collection> <CollectionIcon /> New collection </template>
            <template #new-organization> <OrganizationIcon /> New organization </template>
          </OverflowMenu>
          <OverflowMenu
            v-if="auth.user"
            class="btn btn-transparent btn-dropdown-animation profile-button"
            aria-label="User menu"
            position="bottom"
            direction="left"
            allow-hover
            :options="[
              {
                id: 'profile',
                link: `/user/${auth.user.username}`,
              },
              {
                id: 'notifications',
                link: `/home`,
              },
              {
                id: 'saved',
                link: `/creations/collections`,
              },
              {
                id: 'creations',
                link: `/creations`,
              },
              {
                id: 'reports',
                link: `/reports`,
              },
              { divider: true },
              {
                id: 'moderation',
                link: `/moderation`,
              },
              {
                id: 'settings',
                link: `/settings`,
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
              size="none"
            />

            <template #profile>
              <UserIcon aria-hidden="true" />
              Profile
            </template>

            <template #notifications>
              <NotificationIcon aria-hidden="true" />
              Notifications
            </template>

            <template #saved>
              <BookmarkIcon aria-hidden="true" />
              Saved
            </template>

            <template #reports>
              <ReportIcon aria-hidden="true" />
              Reports
            </template>

            <template #creations>
              <ListIcon aria-hidden="true" />
              Creations
            </template>

            <template #moderation>
              <ModerationIcon aria-hidden="true" />
              Moderation
            </template>

            <template #settings>
              <SettingsIcon aria-hidden="true" />
              Settings
            </template>

            <template #sign-out>
              <LogOutIcon aria-hidden="true" />
              Sign out
            </template>
          </OverflowMenu>
          <template v-else>
            <nuxt-link class="btn" to="/auth/sign-in"> <LogInIcon /> Sign in </nuxt-link>
          </template>
        </div>
      </nav>
      <main>
        <ModalCreation v-if="auth.user" ref="modal_creation" />
        <section v-if="displayWarning" class="warning-banner card">
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
          <TextLogo
            :animate="loading"
            aria-hidden="true"
            class="text-logo button-base"
            @click="developerModeIncrement()"
          />
          <p>
            Modrinth is
            <a
              :target="external()"
              href="https://github.com/modrinth"
              class="text-link"
              rel="noopener"
            >
              open source</a
            >.
          </p>
          <p>
            {{ config.public.owner }}/{{ config.public.slug }} {{ config.public.branch }}@<a
              :target="external()"
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
          <a :target="external()" href="https://careers.modrinth.com"
            >Careers <span class="count-bubble">1</span></a
          >
        </div>
        <div class="links links-2" role="region" aria-label="Resources">
          <h4 aria-hidden="true">Resources</h4>
          <a :target="external()" href="https://blog.modrinth.com">Blog</a>
          <a :target="external()" href="https://docs.modrinth.com">Docs</a>
          <a :target="external()" href="https://status.modrinth.com">Status</a>
          <a rel="noopener" :target="external()" href="https://github.com/modrinth">GitHub</a>
        </div>
        <div class="links links-3" role="region" aria-label="Interact">
          <h4 aria-hidden="true">Interact</h4>
          <a rel="noopener" :target="external()" href="https://discord.gg/EUHuJHt"> Discord </a>
          <a rel="noopener" :target="external()" href="https://x.com/modrinth"> X (Twitter) </a>
          <a rel="noopener" :target="external()" href="https://floss.social/@modrinth">
            Mastodon
          </a>
          <a rel="noopener" :target="external()" href="https://crowdin.com/project/modrinth">
            Crowdin
          </a>
        </div>
        <div class="buttons">
          <nuxt-link class="btn btn-outline btn-primary" to="/app">
            <DownloadIcon aria-hidden="true" />
            Get Modrinth App
          </nuxt-link>
          <button class="btn raised" @click="changeTheme(colorMode.value)">
            <MoonIcon v-if="colorMode.value === 'light'" aria-hidden="true" />
            <SunIcon v-else aria-hidden="true" />
            Change theme
          </button>
          <nuxt-link class="btn raised" to="/settings">
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
  HamburgerIcon,
  XIcon as CrossIcon,
  SearchIcon,
  BellIcon as NotificationIcon,
  SettingsIcon,
  ScaleIcon as ModerationIcon,
  ModrinthIcon,
  MoonIcon,
  SunIcon,
  PlusIcon,
  LogOutIcon,
  ReportIcon,
  BookmarkIcon,
  HeartIcon,
  ChartIcon,
  ListIcon,
  UserIcon,
  IssuesIcon,
  Avatar,
  TextLogo,
  CurrencyIcon,
} from 'omorphia'
import PackageIcon from '~/assets/images/utils/package-open.svg'
import GlassesIcon from '~/assets/images/utils/glasses.svg'
import BracesIcon from '~/assets/images/utils/braces.svg'
import OrganizationIcon from '~/assets/images/utils/organization.svg'
import CollectionIcon from '~/assets/images/utils/collection.svg'
import BoxImportIcon from '~/assets/images/utils/box-import.svg'

import ModalCreation from '~/components/ui/ModalCreation.vue'

const loading = useLoading()

const auth = await useAuth()
const user = await useUser()
const cosmetics = useCosmetics()
const colorMode = useTheme()

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const link = config.public.siteUrl + route.path.replace(/\/+$/, '')
useHead({
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

const description =
  'Download Minecraft mods, plugins, datapacks, shaders, resourcepacks, and modpacks on Modrinth. ' +
  'Discover and publish projects on Modrinth with a modern, easy to use interface and API.'

useSeoMeta({
  title: 'Modrinth',
  description,
  publisher: 'Modrinth',
  themeColor: [{ color: '#1bd96a' }],
  colorScheme: 'dark light',

  // OpenGraph
  ogTitle: 'Modrinth',
  ogSiteName: 'Modrinth',
  ogDescription: 'Discover and publish Minecraft content!',
  ogType: 'website',
  ogImage: 'https://cdn.modrinth.com/modrinth-new.png',
  ogUrl: link,

  // Twitter
  twitterCard: 'summary',
  twitterSite: '@modrinth',
})

let developerModeCounter = 0

function developerModeIncrement() {
  if (developerModeCounter >= 5) {
    cosmetics.value.developerMode = !cosmetics.value.developerMode
    saveCosmetics()
    developerModeCounter = 0
    if (cosmetics.value.developerMode) {
      addNotification({
        group: 'main',
        title: 'Developer mode activated',
        text: 'Developer mode has been enabled',
        type: 'success',
      })
    } else {
      addNotification({
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

function changeTheme(value) {
  updateTheme(
    ['dark', 'oled', 'retro'].includes(value) ? 'light' : cosmetics.value.preferredDarkTheme,
    true
  )
}

const mobileUserOpen = ref(false)
const mobileBrowseOpen = ref(false)

const navRoutes = ref([
  {
    label: 'Mods',
    href: '/mods',
  },
  {
    label: 'Modpacks',
    href: '/modpacks',
  },
  {
    label: 'Data Packs',
    href: '/datapacks',
  },
  {
    label: 'Resource Packs',
    href: '/resourcepacks',
  },
  {
    label: 'Shaders',
    href: '/shaders',
  },
  {
    label: 'Plugins',
    href: '/plugins',
  },
])

watch(
  () => route.path,
  () => {
    mobileUserOpen.value = false
    mobileBrowseOpen.value = false

    if (process.client) {
      document.body.style.overflowY = 'scroll'
      document.body.setAttribute('tabindex', '-1')
      document.body.removeAttribute('tabindex')
    }

    updateCurrentDate()
    runAnalytics()
  }
)

onMounted(() => {
  if (process.client && window) {
    window.history.scrollRestoration = 'auto'
  }

  runAnalytics()
})

function runAnalytics() {
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
}

function toggleMobileMenu() {
  mobileUserOpen.value = !mobileUserOpen.value
  if (mobileUserOpen.value) {
    mobileBrowseOpen.value = false
  }
}

function toggleBrowseMenu() {
  mobileBrowseOpen.value = !mobileBrowseOpen.value

  if (mobileBrowseOpen.value) {
    mobileUserOpen.value = false
  }
}
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

  > main {
    @media screen and (max-width: 600px) and (hover: none) {
      margin-top: var(--gap-lg);
    }
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
    grid-template-columns: auto 1fr auto;
    z-index: 3;
    padding-left: 0.75rem;
    padding-right: 0.75rem;

    .small-width-displayed {
      display: none;
    }

    @media screen and (min-width: 1280px) {
      max-width: 1280px;
      width: 1280px;
      margin-left: auto;
      margin-right: auto;
    }

    @media screen and (max-width: 1250px) {
      .small-width-displayed {
        display: flex;
      }

      .small-width-hidden {
        display: none;
      }
    }

    @media screen and (max-width: 700px) and (hover: none) {
      .modrinth-app-promo {
        display: none;
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
      --size: 2.5rem !important;
    }

    .logo-heading {
      display: flex;
      flex-direction: row;
      align-items: center;

      .icon-only {
        margin-left: auto;
      }
    }

    .logo-button {
      margin: calc(-1 * var(--gap-sm)) calc(-1 * var(--gap-md));
      svg {
        height: 1.8rem;
        width: auto;
        display: block;
        color: var(--color-contrast);
      }
    }

    .btn-header,
    :deep(.popup-menu) .btn {
      box-shadow: none;
      font-weight: 600;

      > svg {
        color: var(--color-secondary);
        flex-shrink: 0;
      }

      &.visibly-active,
      &.allow-non-exact.router-link-active,
      &.router-link-exact-active {
        color: var(--color-brand);
        background-color: var(--color-brand-highlight);
        pointer-events: none;

        &:not(.icon-only) svg {
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
  }
}

.site-header {
  @media screen and (min-width: 1280px) {
    border-radius: var(--radius-sm);
    max-width: 1280px;
  }

  .mobile-navigation {
    display: none;

    .nav-menu {
      width: 100%;
      position: fixed;
      bottom: calc(var(--size-mobile-navbar-height) - var(--round-card));
      padding-bottom: var(--round-card);
      left: 0;
      background-color: var(--color-raised-bg);
      z-index: 6;
      transform: translateY(100%);
      transition: transform 0.4s cubic-bezier(0.54, 0.84, 0.42, 1);
      border-radius: var(--round-card) var(--round-card) 0 0;
      box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0);

      .links,
      .account-container {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        grid-gap: 1rem;
        justify-content: center;
        padding: 1rem;

        .btn {
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
            padding: var(--gap-md);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;

            .user-icon {
              --size: 2.25rem;
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
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      height: calc(var(--size-mobile-navbar-height) + env(safe-area-inset-bottom));
      border-radius: var(--round-card) var(--round-card) 0 0;
      padding-bottom: env(safe-area-inset-bottom);
      position: fixed;
      left: 0;
      bottom: 0;
      background-color: var(--color-raised-bg);
      box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.3);
      z-index: 7;
      width: 100%;
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
        flex-direction: column;
        gap: 0.25rem;
        font-weight: 600;
        padding: 0;
        transition: color ease-in-out 0.15s;
        color: var(--color-secondary);
        text-align: center;
        font-size: var(--font-size-sm);
        height: 100%;

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
            border-radius: var(--radius-max);
            content: '';
            height: 0.5rem;
            position: absolute;
            left: 1.5rem;
            top: 0;
            width: 0.5rem;
          }
        }

        svg {
          height: 1.5rem;
          width: 1.5rem;
        }

        .user-icon {
          --size: 2rem;
          transition: border ease-in-out 0.15s;
          border: 0 solid var(--color-brand);
          box-sizing: border-box;

          &.expanded {
            border: 2px solid var(--color-brand);
          }
        }

        &:hover,
        &:focus {
          color: var(--color-base);
        }

        &.router-link-exact-active:not(&.no-active) {
          svg {
            color: var(--color-contrast);
          }

          color: var(--color-contrast);

          &::before {
            content: '';
            inset: 0.25rem;
            position: absolute;
            background-color: var(--color-brand-highlight);
            z-index: -1;
            border-radius: 1rem;
          }
        }
      }
    }

    @media screen and (max-width: 600px) and (hover: none) {
      display: flex;
    }
  }

  div {
    flex-grow: 1;
    justify-content: flex-end;
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
      color: var(--color-contrast);
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
      color: var(--color-bg);
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
    margin-top: var(--gap-md);
  }

  @media screen and (min-width: 1024px) {
    margin-left: auto;
    margin-right: auto;

    max-width: 80rem;
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

.profile-button {
  padding: 0;
  background-color: transparent !important;

  .user-avatar {
    border: 2px solid transparent;
    transition: border-color 100ms ease-out;
  }

  &.popout-open {
    .user-avatar {
      border-color: var(--color-brand);
    }
  }
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
