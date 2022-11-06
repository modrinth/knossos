<template>
  <div class="layout" :class="{ 'expanded-mobile-nav': isBrowseMenuOpen }">
    <header class="site-header" role="presentation">
      <section class="navbar columns" role="navigation">
        <section class="skip column" role="presentation">
          <a href="#main">{{ $t('header.skip-to-content.label') }}</a>
          <a
            v-show="!!registeredSkipLink"
            :href="(registeredSkipLink || {}).id"
            >{{ (registeredSkipLink || {}).text }}</a
          >
        </section>
        <section class="logo column" role="presentation">
          <NuxtLink to="/" :aria-label="$t('header.home-page.aria-label')">
            <ModrinthLogo aria-hidden="true" class="text-logo" />
          </NuxtLink>
        </section>
        <section class="nav-group columns" role="presentation">
          <section class="nav" :aria-label="$t('header.page-links.aria-label')">
            <NavRow
              class="navigation"
              :links="[
                {
                  label: $t('project-type.mod.plural'),
                  href: '/mods',
                },
                {
                  label: $t('project-type.plugin.plural'),
                  href: '/plugins',
                },
                {
                  label: $t('project-type.resourcepack.plural'),
                  href: '/resourcepacks',
                },
                {
                  label: $t('project-type.modpack.plural'),
                  href: '/modpacks',
                },
              ]"
            />
          </section>
          <section class="column-grow user-outer" aria-label="Account links">
            <section class="user-controls">
              <button
                v-if="$auth.user == null"
                :title="$t('layout.action.change-language')"
                @click="showLanguagesModal"
                class="control-button"
              >
                <LanguageIcon aria-hidden="true" />
              </button>
              <nuxt-link
                v-if="$auth.user"
                to="/notifications"
                class="control-button"
                :class="{ bubble: $user.notifications.length > 0 }"
                :title="$t('notifications.title')"
              >
                <NotificationIcon aria-hidden="true" />
              </nuxt-link>
              <button
                v-else
                class="control-button"
                :title="$t('header.theme-swither.title')"
                @click="changeTheme"
              >
                <MoonIcon
                  v-if="$colorMode.value === 'light'"
                  aria-hidden="true"
                />
                <SunIcon v-else aria-hidden="true" />
              </button>
              <div
                v-if="$auth.user"
                class="dropdown"
                :class="{ closed: !isDropdownOpen }"
                tabindex="0"
                @mouseover="isDropdownOpen = true"
                @focus="isDropdownOpen = true"
                @mouseleave="isDropdownOpen = false"
              >
                <button class="control" :value="$t('profile-dropdown.title')">
                  <Avatar
                    :src="$auth.user.avatar_url"
                    class="user-icon"
                    :alt="$t('profile-dropdown.avatar.alt')"
                    aria-hidden="true"
                    circle
                  />
                  <DropdownIcon class="caret" />
                </button>
                <div class="content card">
                  <NuxtLink class="item" :to="`/user/${$auth.user.username}`">
                    <div class="title profile-link">
                      <div class="username">@{{ $auth.user.username }}</div>
                      <div class="prompt">
                        {{ $t('profile-dropdown.links.profile') }}
                      </div>
                    </div>
                  </NuxtLink>
                  <hr class="divider" />
                  <button class="item" @click="$refs.modal_creation.show()">
                    <PlusIcon class="icon" />
                    <span class="title">
                      {{ $t('layout.action.create-project') }}
                    </span>
                  </button>
                  <hr class="divider" />
                  <NuxtLink class="item" to="/notifications">
                    <NotificationIcon class="icon" />
                    <span class="title">
                      {{ $t('notifications.title') }}
                    </span>
                  </NuxtLink>
                  <NuxtLink class="item" to="/settings/follows">
                    <HeartIcon class="icon" />
                    <span class="title">
                      {{ $t('profile-dropdown.links.follows') }}
                    </span>
                  </NuxtLink>
                  <NuxtLink class="item" to="/settings">
                    <SettingsIcon class="icon" />
                    <span class="title">
                      {{ $t('generic.title.settings') }}
                    </span>
                  </NuxtLink>
                  <NuxtLink
                    v-if="
                      $auth.user.role === 'moderator' ||
                      $auth.user.role === 'admin'
                    "
                    class="item"
                    to="/moderation"
                  >
                    <ModerationIcon class="icon" />
                    <span class="title">
                      {{ $t('moderation.title') }}
                    </span>
                  </NuxtLink>
                  <button class="item" @click="changeTheme">
                    <MoonIcon
                      v-if="$colorMode.value === 'light'"
                      class="icon"
                    />
                    <SunIcon v-else class="icon" />
                    <span class="dropdown-item__text">
                      {{ $t('layout.action.change-theme') }}
                    </span>
                  </button>
                  <button class="item" @click="showLanguagesModal">
                    <LanguageIcon aria-hidden="true" class="icon" />
                    <span class="dropdown-item__text">
                      {{ $t('layout.action.change-language') }}
                    </span>
                  </button>
                  <hr class="divider" />
                  <button class="item" @click="logout">
                    <LogOutIcon class="icon" />
                    <span class="dropdown-item__text">
                      {{ $t('profile-dropdown.action.log-out') }}
                    </span>
                  </button>
                </div>
              </div>
              <section v-else class="auth-prompt">
                <a :href="authUrl" class="log-in-button">
                  <GitHubIcon aria-hidden="true" />
                  {{ $t('header.sign-in.lable') }}
                </a>
              </section>
            </section>
          </section>
        </section>
      </section>
      <section class="mobile-navbar" :class="{ expanded: isBrowseMenuOpen }">
        <div class="top-row">
          <NuxtLink to="/" class="tab" @click.native="isBrowseMenuOpen = false">
            <HomeIcon />
          </NuxtLink>
          <div class="spacer"></div>
          <button class="tab browse" @click="toggleBrowseMenu()">
            <DropdownIcon :class="{ closed: !isBrowseMenuOpen }" />
            <span>
              {{ $t('mobile-navbar.browse.label') }}
            </span>
          </button>
          <div class="spacer"></div>
          <button class="tab" @click="toggleMobileMenu()">
            <HamburgerIcon v-if="!isMobileMenuOpen" />
            <CrossIcon v-else />
          </button>
        </div>
        <div
          :class="{ 'disable-childern': !isBrowseMenuOpen }"
          class="project-types"
        >
          <NuxtLink
            :tabindex="isBrowseMenuOpen ? 0 : -1"
            to="/mods"
            class="tab"
            @click.native="isBrowseMenuOpen = false"
          >
            <span>{{ $t('project-type.mod.plural') }}</span>
          </NuxtLink>
          <NuxtLink
            :tabindex="isBrowseMenuOpen ? 0 : -1"
            to="/plugins"
            class="tab"
            @click.native="isBrowseMenuOpen = false"
          >
            <span>{{ $t('project-type.plugin.plural') }}</span>
          </NuxtLink>

          <NuxtLink
            :tabindex="isBrowseMenuOpen ? 0 : -1"
            to="/resourcepacks"
            class="tab"
            @click.native="isBrowseMenuOpen = false"
          >
            <span>{{ $t('project-type.resourcepack.plural') }}</span>
          </NuxtLink>
          <NuxtLink
            :tabindex="isBrowseMenuOpen ? 0 : -1"
            to="/modpacks"
            class="tab"
            @click.native="isBrowseMenuOpen = false"
          >
            <span>{{ $t('project-type.modpack.plural') }}</span>
          </NuxtLink>
        </div>
      </section>
      <section class="mobile-menu" :class="{ active: isMobileMenuOpen }">
        <div class="mobile-menu-wrapper">
          <div class="items-container rows">
            <NuxtLink
              v-if="$auth.user"
              class="item user-item"
              :to="`/user/${$auth.user.username}`"
            >
              <img :src="$auth.user.avatar_url" class="user-icon" />
              <div class="profile-link">
                <div class="username">@{{ $auth.user.username }}</div>
                <div class="prompt">
                  {{ $t('profile-dropdown.links.profile') }}
                </div>
              </div>
            </NuxtLink>
            <button v-if="$auth.user" class="item log-out" @click="logout">
              <LogOutIcon class="icon" />
              <span class="dropdown-item__text">
                {{ $t('profile-dropdown.action.log-out') }}
              </span>
            </button>
            <button
              v-if="$auth.user"
              class="item"
              @click="$refs.modal_creation.show()"
            >
              <PlusIcon class="icon" />
              <span class="title">
                {{ $t('layout.action.create-project') }}
              </span>
            </button>
            <NuxtLink v-if="$auth.user" class="item" to="/settings">
              <SettingsIcon class="icon" />
              <span class="title">
                {{ $t('generic.title.settings') }}
              </span>
            </NuxtLink>
            <NuxtLink
              v-if="
                $auth.user &&
                ($auth.user.role === 'moderator' || $auth.user.role === 'admin')
              "
              class="item"
              to="/moderation"
            >
              <ModerationIcon class="icon" />
              <span class="title">
                {{ $t('moderation.title') }}
              </span>
            </NuxtLink>
            <NuxtLink v-if="$auth.user" class="item" to="/settings/follows">
              <HeartIcon class="icon" />
              <span class="title">
                {{ $t('profile-dropdown.links.follows') }}
              </span>
            </NuxtLink>
            <NuxtLink v-if="$auth.user" class="item" to="/notifications">
              <NotificationIcon class="icon" />
              <span class="title">
                {{ $t('notifications.title') }}
              </span>
            </NuxtLink>
            <button class="item" @click="changeTheme">
              <MoonIcon v-if="$colorMode.value === 'light'" class="icon" />
              <SunIcon v-else class="icon" />
              <span class="dropdown-item__text">
                {{ $t('layout.action.change-theme') }}
              </span>
            </button>
            <button class="item" @click="showLanguagesModal">
              <LanguageIcon aria-hidden="true" class="icon" />
              <span>{{ $t('layout.action.change-language') }}</span>
            </button>
            <a v-if="!$auth.user" :href="authUrl" class="item log-in">
              <GitHubIcon aria-hidden="true" />
              {{ $t('header.sign-in.lable') }}
            </a>
          </div>
        </div>
      </section>
    </header>
    <main>
      <ModalCreation ref="modal_creation" />
      <ModalLanguages />
      <notifications
        group="main"
        position="bottom right"
        :max="5"
        :class="{ 'browse-menu-open': isBrowseMenuOpen }"
        :ignore-duplicates="true"
        :duration="10000"
      />
      <Nuxt id="main" />
    </main>
    <footer>
      <div
        class="logo-info"
        role="region"
        :aria-label="$t('footer.info.aria-label')"
      >
        <ModrinthLogo aria-hidden="true" class="text-logo" />
        <p>
          <IntlFormatted message-id="footer.info.open-source">
            <template #gh-link="{ children }">
              <a
                target="_blank"
                href="https://github.com/modrinth"
                class="text-link"
              >
                <Fragment :of="children" />
              </a>
            </template>
          </IntlFormatted>
        </p>
        <p>
          {{ owner }}/{{ slug }} {{ branch }}@<a
            target="_blank"
            :href="'https://github.com/' + owner + '/' + slug + '/tree/' + hash"
            class="text-link"
            >{{ hash.substring(0, 7) }}</a
          >
        </p>
        <p>© Rinth, Inc.</p>
      </div>
      <div
        class="links links-1"
        role="region"
        :aria-label="$t('footer.legal.title')"
      >
        <h4 aria-hidden="true">{{ $t('footer.legal.title') }}</h4>
        <nuxt-link to="/legal/terms">
          {{ $t('footer.legal.links.terms') }}
        </nuxt-link>
        <nuxt-link to="/legal/privacy">
          {{ $t('footer.legal.links.privacy') }}
        </nuxt-link>
        <nuxt-link to="/legal/rules">
          {{ $t('footer.legal.links.rules') }}
        </nuxt-link>
        <a
          target="_blank"
          href="https://github.com/modrinth/knossos/blob/master/LICENSE.md"
        >
          {{ $t('project-page.technical-info.license') }}
        </a>
      </div>
      <div
        class="links links-2"
        role="region"
        :aria-label="$t('footer.resources.title')"
      >
        <h4 aria-hidden="true">
          {{ $t('footer.resources.title') }}
        </h4>
        <a target="_blank" href="https://blog.modrinth.com">
          {{ $t('footer.resources.links.blog') }}
        </a>
        <a target="_blank" href="https://discord.gg/EUHuJHt">
          {{ $t('project-page.external-resources.discord') }}
        </a>
        <a target="_blank" href="https://github.com/modrinth/knossos">
          {{ $t('footer.resources.links.github') }}
        </a>
        <a target="_blank" href="https://docs.modrinth.com">
          {{ $t('footer.resources.links.docs') }}
        </a>
      </div>
      <div class="buttons">
        <button class="iconified-button" @click="changeTheme">
          <MoonIcon v-if="$colorMode.value === 'light'" aria-hidden="true" />
          <SunIcon v-else aria-hidden="true" />
          {{ $t('layout.action.change-theme') }}
        </button>
        <button class="iconified-button" @click="showLanguagesModal">
          <LanguageIcon aria-hidden="true" />
          {{ $t('layout.action.change-language') }}
        </button>
      </div>
    </footer>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'

import ModrinthLogo from '~/assets/images/text-logo.svg?inline'

import HamburgerIcon from '~/assets/images/utils/hamburger.svg?inline'
import CrossIcon from '~/assets/images/utils/x.svg?inline'

import NotificationIcon from '~/assets/images/sidebar/notifications.svg?inline'
import SettingsIcon from '~/assets/images/sidebar/settings.svg?inline'
import ModerationIcon from '~/assets/images/sidebar/admin.svg?inline'
import HomeIcon from '~/assets/images/sidebar/home.svg?inline'

import MoonIcon from '~/assets/images/utils/moon.svg?inline'
import SunIcon from '~/assets/images/utils/sun.svg?inline'
import LanguageIcon from '~/assets/images/utils/language.svg?inline'
import PlusIcon from '~/assets/images/utils/plus.svg?inline'
import DropdownIcon from '~/assets/images/utils/dropdown.svg?inline'
import LogOutIcon from '~/assets/images/utils/log-out.svg?inline'
import HeartIcon from '~/assets/images/utils/heart.svg?inline'

import GitHubIcon from '~/assets/images/utils/github.svg?inline'
import NavRow from '~/components/ui/NavRow'
import ModalCreation from '~/components/ui/ModalCreation'
import Avatar from '~/components/ui/Avatar'
import ModalLanguages from '~/components/ui/ModalLanguages.vue'

export default {
  components: {
    Avatar,
    ModalCreation,
    ModalLanguages,
    NavRow,
    ModrinthLogo,
    LanguageIcon,
    MoonIcon,
    SunIcon,
    LogOutIcon,
    GitHubIcon,
    NotificationIcon,
    HomeIcon,
    CrossIcon,
    HamburgerIcon,
    SettingsIcon,
    ModerationIcon,
    PlusIcon,
    DropdownIcon,
    HeartIcon,
  },
  directives: {
    ClickOutside,
  },
  data() {
    return {
      isDropdownOpen: false,
      owner: process.env.owner || 'modrinth',
      slug: process.env.slug || 'knossos',
      branch: process.env.branch || 'master',
      hash: process.env.hash || 'unknown',
      isMobileMenuOpen: false,
      isBrowseMenuOpen: false,
      registeredSkipLink: null,
      hideDropdown: false,
    }
  },
  async fetch() {
    await Promise.all([
      this.$store.dispatch('user/fetchAll', { force: true }),
      this.$store.dispatch('cosmetics/fetchCosmetics', this.$cookies),
    ])
  },
  head() {
    const link = process.env.domain + this.$route.path.replace(/\/+$/, '')

    return {
      link: [
        {
          rel: 'canonical',
          href: link,
        },
      ],
      meta: [
        {
          hid: 'og:url',
          name: 'og:url',
          content: link,
        },
      ],
    }
  },
  computed: {
    authUrl() {
      return `${process.env.authURLBase}auth/init?url=${process.env.domain}${this.$route.path}`
    },
  },
  watch: {
    $route() {
      this.isMobileMenuOpen = false
      document.body.style.overflowY = 'scroll'

      this.$store.dispatch('user/fetchAll')

      document.body.setAttribute('tabindex', '-1')
      document.body.focus()
      document.body.removeAttribute('tabindex')
    },
  },
  beforeCreate() {
    if (this.$route.query.code) {
      this.$router.push(this.$route.path)
    }
  },
  created() {
    this.$nuxt.$on('registerSkipLink', (data) => {
      this.registeredSkipLink = data
    })
  },
  methods: {
    toggleMobileMenu() {
      window.scrollTo(0, 0)
      document.body.scrollTop = 0

      this.isMobileMenuOpen = !this.isMobileMenuOpen

      if (this.isMobileMenuOpen) {
        document.body.style.overflowY = 'hidden'
        this.isBrowseMenuOpen = false
      } else {
        document.body.style.overflowY = 'scroll'
      }
    },
    toggleBrowseMenu() {
      this.isBrowseMenuOpen = !this.isBrowseMenuOpen

      if (this.isBrowseMenuOpen) {
        this.isMobileMenuOpen = false
      }
    },
    async logout() {
      this.$cookies.set('auth-token-reset', true)
      // If users logs out on dashboard, force redirect on the home page to clear cookies
      if (this.$route.path.startsWith('/settings')) {
        window.location.href = '/'
      } else {
        await this.$router.go(null)

        this.$notify({
          group: 'main',
          title: 'Logged Out',
          text: 'You have logged out successfully!',
          type: 'success',
        })
      }
    },
    changeTheme() {
      this.$colorMode.preference =
        this.$colorMode.value === 'dark' ? 'light' : 'dark'
    },
    showLanguagesModal() {
      this.$store.dispatch('i18n/toggleLanguageModal', true)
    },
  },
}
</script>

<style lang="scss">
.skip a {
  clip: rect(1px, 1px, 1px, 1px);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}

.skip a:focus {
  clip: auto;
  height: auto;
  overflow: auto;
  position: absolute;
  width: auto;
  padding: 0.5rem 0.75rem;
  background-color: var(--color-brand);
  color: var(--color-brand-inverted);
  border-radius: var(--size-rounded-max);
  margin: 0 0.5rem 0 0;
  box-shadow: inset 0px -1px 1px rgba(17, 24, 39, 0.1);
  z-index: 1;
}

.layout {
  min-height: 100vh;
  background-color: var(--color-bg);
  display: block;

  @media screen and (min-width: 1024px) {
    min-height: calc(100vh - var(--spacing-card-bg));
  }

  @media screen and (max-width: 750px) {
    margin-bottom: calc(var(--size-mobile-navbar-height) + 2rem);
  }

  .site-header {
    margin-top: var(--spacing-card-md);
    margin-bottom: var(--spacing-card-md);
    max-width: 100vw;

    @media screen and (min-width: 1024px) {
      border-radius: var(--size-rounded-sm);
      max-width: 1280px;
      margin-left: auto;
      margin-right: auto;
    }

    .navbar {
      margin: 0 var(--spacing-card-lg);
      padding: 0 var(--spacing-card-lg);
      max-width: 1280px;
      margin-left: auto;
      margin-right: auto;

      @media screen and (max-width: 750px) {
        justify-content: center;
      }

      section.logo {
        display: flex;
        justify-content: space-between;
        color: var(--color-text-dark);

        a {
          align-items: center;
          display: flex;
        }

        .small-logo {
          display: block;
        }

        svg {
          height: 1.75rem;
          width: auto;
        }

        .badge {
          margin-left: 0.25rem;
          display: none;
          @media screen and (min-width: 430px) {
            display: unset;
          }
        }

        button {
          background: none;
          border: none;
          margin: 0 0 0 0.5rem;
          padding: 0;

          svg {
            height: 1.5rem;
            width: 1.5rem;
          }
        }
      }

      section.nav-group {
        display: flex;
        flex-grow: 5;

        section.nav {
          flex-grow: 5;

          .navigation {
            display: flex;
            width: fit-content;
            position: relative;
            top: 50%;
            transform: translateY(-50%);
            margin-left: 2rem;

            a {
              margin-left: 0;
              margin-right: auto;
            }

            a.tab {
              padding: 0;
              margin-right: 1rem;
              display: flex;
              align-items: flex-start;

              &--alpha::after {
                content: 'Alpha';
                background-color: var(--color-warning-bg);
                color: var(--color-warning-text);
                border-radius: 1rem;
                padding: 0.25rem 0.5rem;
                margin-left: 0.4rem;
                font-size: 0.7rem;
              }
            }
          }
        }

        .user-outer {
          z-index: 5;
        }

        section.user-controls {
          align-items: center;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          position: relative;
          top: 50%;
          transform: translateY(-50%);
          min-width: 6rem;

          .control-button {
            position: relative;
            display: flex;
            padding: 0.5rem 0.75rem;
            margin: 0 1rem 0 0;
            background-color: var(--color-bg);
            color: var(--color-text);
            border-radius: 2rem;
            transition: filter 0.1s ease-in-out;

            svg {
              height: 1rem;
              width: 1rem;
            }

            &.bubble {
              &::after {
                background-color: var(--color-brand);
                border-radius: var(--size-rounded-max);
                content: '';
                height: 0.5rem;
                position: absolute;
                right: 0.25rem;
                top: 0.5rem;
                width: 0.5rem;
              }
            }

            &:hover {
              background-color: var(--color-bg);
              filter: brightness(0.85);
            }
          }

          .hide-desktop {
            display: none;
          }

          .dropdown {
            position: relative;

            .control {
              align-items: center;
              background: none;
              display: flex;
              justify-content: center;
              padding: 0;

              .user-icon {
                height: 2rem;
                width: 2rem;
                outline: 2px solid var(--color-raised-bg);
                transition: outline-color 0.1s ease-in-out;
              }

              .caret {
                color: var(--color-button-text);
                margin-left: 0.25rem;
                width: 1rem;
              }
            }

            .content {
              border: 1px solid var(--color-divider-dark);
              list-style: none;
              margin: 0.5rem 0 0 0;
              max-width: 25rem;
              min-width: 12rem;
              opacity: 0;
              padding: 1rem;
              position: absolute;
              right: -1rem;
              transform: scaleY(0.9);
              transform-origin: top;
              transition: all 0.1s ease-in-out 0.05s, color 0s ease-in-out 0s,
                background-color 0s ease-in-out 0s,
                border-color 0s ease-in-out 0s;
              visibility: hidden;
              width: max-content;
              z-index: 1;
              box-shadow: var(--shadow-floating);

              .divider {
                background-color: var(--color-divider-dark);
                border: none;
                color: var(--color-divider-dark);
                height: 1px;
                margin: 0.5rem 0;
              }

              .item {
                align-items: center;
                background: none;
                border-radius: 0.5rem;
                box-sizing: border-box;
                color: inherit;
                display: flex;
                padding: 0.5rem;
                width: 100%;

                .icon {
                  margin-right: 0.5rem;
                  height: 20px;
                  width: 20px;
                }
              }

              .item:hover {
                background-color: var(--color-bg);
              }

              .profile-link {
                .prompt {
                  margin-top: 0.25rem;
                  color: var(--color-text-secondary);
                }
              }
            }

            @media screen and (max-width: 1300px) {
              .content {
                margin-right: 1rem;
              }
            }
          }

          .dropdown:hover .user-icon {
            outline-color: var(--color-brand);
          }

          .dropdown:hover:not(.closed) .content,
          .dropdown:focus:not(.closed) .content,
          .dropdown:focus-within:not(.closed) .content {
            opacity: 1;
            transform: scaleY(1);
            visibility: visible;
          }
        }

        section.auth-prompt {
          display: flex;
          align-items: center;
          height: 100%;
          margin: 0;

          .log-in-button {
            margin: 0 auto;

            display: flex;
            align-items: center;

            text-align: center;
            border-radius: var(--size-rounded-max);
            background-color: var(--color-brand);
            white-space: nowrap;
            color: var(--color-brand-inverted);
            padding: 0.5rem 0.75rem;
            height: 20px;

            svg {
              vertical-align: middle;
              margin-right: 0.5rem;
            }

            &:hover,
            &:focus {
              background-color: var(--color-brand-hover);
            }

            &:active {
              background-color: var(--color-brand-active);
            }
          }
        }
      }

      @media screen and (max-width: 750px) {
        section.nav-group {
          display: none;

          .hide-desktop {
            display: unset;
          }
        }
      }
    }

    .mobile-navbar {
      display: none;
      width: 100%;
      transition: height 0.25s ease-in-out;
      height: var(--size-mobile-navbar-height);
      position: fixed;
      left: 0;
      bottom: 0;
      background-color: var(--color-raised-bg);
      box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.3);
      z-index: 6;
      flex-direction: column;
      border-radius: var(--size-rounded-card) var(--size-rounded-card) 0 0;

      overflow: hidden;

      .tab {
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

        svg {
          height: 1.75rem;
          width: 1.75rem;
        }

        &:hover,
        &:focus {
          color: var(--color-text);
        }

        &.nuxt-link-exact-active {
          svg {
            color: var(--color-brand);
          }

          color: var(--color-text);
        }
      }

      .top-row {
        min-height: var(--size-mobile-navbar-height);
        display: flex;
        width: 100%;

        .browse {
          flex-grow: 10;

          svg {
            transition: transform 0.125s ease-in-out;

            &.closed {
              transform: rotate(180deg);
            }
          }
        }

        .tab {
          &:first-child {
            margin-left: 2rem;
          }

          &:last-child {
            margin-right: 2rem;
          }
        }

        .spacer {
          flex-grow: 1;
        }
      }

      .disable-childern {
        a {
          pointer-events: none;
        }
      }

      .project-types {
        margin-top: 0.5rem;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        row-gap: 0.5rem;

        .tab {
          flex: 0 0 fit-content;
          background-color: var(--color-button-bg);
          padding: 0.5rem 1.25rem;
          margin: 0 0.25rem;
          border-radius: var(--size-rounded-max);

          &.nuxt-link-exact-active {
            background-color: var(--color-brand);
            color: var(--color-brand-inverted);
          }
        }
      }

      @media screen and (max-width: 750px) {
        display: flex;
      }

      &.expanded {
        height: var(--size-mobile-navbar-height-expanded);
      }
    }
  }

  .mobile-menu {
    display: none;
    position: absolute;
    top: 0;
    background-color: var(--color-bg);
    height: 100%;
    width: 100%;
    z-index: 5;

    .mobile-menu-wrapper {
      max-height: calc(100vh - var(--size-mobile-navbar-height));
      margin-bottom: var(--size-mobile-navbar-height);
      overflow-y: auto;
      margin-top: auto;

      .items-container {
        margin: 1rem 2rem;

        button {
          box-sizing: unset;
        }

        .item {
          padding: 1rem 2rem;
          background-color: var(--color-raised-bg);
          border-radius: var(--size-rounded-md);
          align-items: center;
          justify-content: center;
          display: flex;
          column-gap: 0.25rem;
          width: calc(100% - 4rem);
          max-width: 18rem;

          &.nuxt-link-exact-active {
            color: var(--color-button-text-active);

            svg {
              color: var(--color-brand);
            }
          }

          &.log-in {
            color: var(--color-brand-inverted);
            background-color: var(--color-brand);
          }

          &.log-out {
            color: white;
            background-color: var(--color-badge-red-bg);
          }

          &.user-item {
            flex-direction: column;
            row-gap: 0.5rem;
            //width: 8rem;
            max-width: 18rem;
            flex-grow: 0;

            .profile-link {
              text-align: center;

              .prompt {
                color: var(--color-text-secondary);
              }
            }

            .user-icon {
              width: 4rem;
              height: 4rem;
            }
          }
        }
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

      @media screen and (min-width: 750px) {
        display: none;
      }
    }
  }

  main {
    grid-area: main;
  }

  footer {
    margin: 6rem 0 2rem 0;
    text-align: center;
    display: grid;
    grid-template:
      'logo-info logo-info' auto
      'links-1   links-2' auto
      'buttons buttons' auto
      / 1fr 1fr;

    .logo-info {
      margin-left: auto;
      margin-right: auto;
      max-width: 20rem;
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
    }

    .buttons {
      margin-left: auto;
      margin-right: auto;
      grid-area: buttons;

      button,
      a {
        background-color: var(--color-raised-bg);

        margin-bottom: 0.5rem;
        margin-left: auto;
        margin-right: auto;

        &:hover,
        &:focus-visible {
          background-color: var(--color-button-bg-hover);
        }
      }
    }

    @media screen and (min-width: 1024px) {
      display: flex;
      text-align: unset;

      .logo-info {
        margin-right: 2rem;
      }

      .links {
        margin-right: 2rem;
      }

      .buttons {
        width: unset;
        margin-left: 0;

        button,
        a {
          margin-right: unset;
        }
      }
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
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
