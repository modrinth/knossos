<template>
  <header class="site-header">
    <section class="logo">
      <NuxtLink to="/">
        <ModrinthLogoSmall aria-label="modrinth" class="small-logo" />
        <ModrinthLogo aria-label="modrinth" class="text-logo" />
      </NuxtLink>
    </section>
    <section class="menu-icon">
      <button @click="toggleNavBar">
        <HamburgerIcon />
      </button>
    </section>
    <section ref="nav" class="right-group">
      <section class="nav">
        <div class="styled-tabs">
          <NuxtLink to="/mods" class="tab">
            <span>Mods</span>
          </NuxtLink>
          <NuxtLink to="/modpacks" class="tab">
            <span>Modpacks</span>
          </NuxtLink>
        </div>
      </section>
      <section class="user-outer">
        <section class="user-controls">
          <button class="control-button" @click="changeTheme">
            <MoonIcon v-if="$colorMode.value === 'light'" />
            <SunIcon v-else />
          </button>
          <nuxt-link to="/notifications" class="control-button">
            <NotificationIcon />
            <div v-if="$user.notifications.length > 0" class="bubble">
              {{ $user.notifications.length }}
            </div>
          </nuxt-link>
          <div
            v-if="$auth.user"
            v-click-outside="hideDropdown"
            class="dropdown"
            :class="{ open: isDropdownOpen }"
          >
            <button class="control" @click="toggleDropdown">
              <div class="avatar">
                <img :src="$auth.user.avatar_url" class="icon" />
                <span>{{ $auth.user.username }}</span>
              </div>
              <DropdownIcon class="dropdown-icon" />
            </button>
            <div class="content">
              <ul v-if="isDropdownOpen" @click="hideDropdown">
                <li>
                  <NuxtLink :to="`/user/${$auth.user.username}`">
                    <UserIcon />
                    <span>Profile</span>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/settings">
                    <SettingsIcon />
                    <span>Settings</span>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink
                    v-if="
                      $auth.user.role === 'moderator' ||
                      $auth.user.role === 'admin'
                    "
                    to="/moderation"
                  >
                    <ModerationIcon />
                    <span>Moderation</span>
                  </NuxtLink>
                </li>
                <hr />
                <li>
                  <button @click="logout">
                    <LogOutIcon />
                    <span>Log Out</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <section v-else class="auth-prompt">
            <a :href="authUrl" class="log-in-button"
              ><GitHubIcon aria-hidden="true" />Sign In with GitHub</a
            >
          </section>
        </section>
      </section>
    </section>
  </header>
</template>

<script>
import ClickOutside from 'vue-click-outside'

import ModrinthLogo from '~/assets/images/text-logo.svg?inline'
import ModrinthLogoSmall from '~/assets/images/logo.svg?inline'

import HamburgerIcon from '~/assets/images/utils/hamburger.svg?inline'

import NotificationIcon from '~/assets/images/sidebar/notifications.svg?inline'
import SettingsIcon from '~/assets/images/sidebar/settings.svg?inline'
import ModerationIcon from '~/assets/images/sidebar/admin.svg?inline'

import DropdownIcon from '~/assets/images/utils/dropdown.svg?inline'
import MoonIcon from '~/assets/images/utils/moon.svg?inline'
import SunIcon from '~/assets/images/utils/sun.svg?inline'

import UserIcon from '~/assets/images/utils/user.svg?inline'
import LogOutIcon from '~/assets/images/utils/log-out.svg?inline'
import GitHubIcon from '~/assets/images/utils/github.svg?inline'

export default {
  components: {
    ModrinthLogo,
    ModrinthLogoSmall,
    DropdownIcon,
    MoonIcon,
    SunIcon,
    UserIcon,
    LogOutIcon,
    GitHubIcon,
    NotificationIcon,
    HamburgerIcon,
    SettingsIcon,
    ModerationIcon,
  },
  directives: {
    ClickOutside,
  },
  data() {
    return {
      isDropdownOpen: false,
    }
  },
  computed: {
    authUrl() {
      return `${this.$axios.defaults.baseURL}auth/init?url=${process.env.domain}${this.$route.path}`
    },
  },
  watch: {
    $route() {
      this.$refs.nav.className = 'right-group'
      document.body.style.overflow = 'auto'
      this.$store.dispatch('user/fetchAll')
    },
  },
  methods: {
    toggleNavBar() {
      window.scrollTo(0, 0)
      const currentlyActive = this.$refs.nav.className === 'right-group active'
      this.$refs.nav.className = `right-group${
        currentlyActive ? '' : ' active'
      }`
      document.body.scrollTop = 0
      document.body.style.overflow =
        document.body.style.overflow !== 'hidden' ? 'hidden' : 'auto'
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen
    },
    hideDropdown() {
      this.isDropdownOpen = false
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
  },
}
</script>

<style lang="scss" scoped>
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

  .logo {
    align-items: center;
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
      display: none;
      height: 1.75rem;
      width: auto;
    }
    @media screen and (min-width: 350px) {
      .small-logo {
        display: none;
      }
      svg {
        display: unset;
      }
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

  .menu-icon {
    display: flex;
    margin-left: auto;
    align-items: center;
    margin-right: 1rem;
  }

  .right-group {
    display: flex;
    flex-grow: 5;
    flex-direction: column-reverse;

    overflow-y: auto;
    position: fixed;
    width: 100vw;
    top: var(--size-navbar-height);
    height: calc(100vh - var(--size-navbar-height));
    right: -100vw;
    background-color: var(--color-raised-bg);
    transition: right 150ms;
    z-index: 100;

    &.active {
      right: 0;
    }

    .user-outer {
      z-index: 20;
    }

    .user-controls {
      align-items: center;
      display: flex;
      justify-content: space-between;
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      min-width: 12rem;

      margin: 0 auto;

      .control-button {
        max-width: 2rem;
        padding: 0.5rem;
        background-color: var(--color-raised-bg);
        border-radius: var(--size-rounded-max);
        margin: 0 0.5rem 0 0;
        display: flex;

        svg {
          height: 1rem;
          width: 1rem;
        }

        .bubble {
          position: absolute;
          margin-left: 0.5rem;
          bottom: 1rem;
          border-radius: 0.9rem;
          height: 0.8rem;
          padding: 0 0.25rem;
          display: flex;
          justify-content: center;
          align-items: center;

          font-size: 0.6rem;
          background-color: var(--color-brand);
          color: var(--color-brand-inverted);
        }
      }

      .dropdown {
        position: relative;
        display: inline-block;
        flex-grow: 1;
        &:hover .control {
          background: var(--color-button-bg-hover);
        }
        &.open {
          .control {
            background: var(--color-button-bg);
            border-radius: 1.25rem 1.25rem 0 0;
            .dropdown-icon {
              transform: rotate(180deg);
            }
          }
          .content {
            display: unset;
          }
        }
        .control {
          background-color: var(--color-raised-bg);
          border-radius: var(--size-rounded-max);
          align-items: center;
          display: flex;
          padding: 0.25rem;
          position: relative;
          z-index: 11;
          width: 100%;

          .avatar {
            align-items: center;
            display: flex;
            flex-grow: 1;

            img {
              height: 1.5rem;
              width: 1.5rem;
              border-radius: 50%;
            }

            span {
              display: block;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              color: var(--color-text-dark);
              font-size: var(--font-size-nm);
              font-weight: var(--font-weight-medium);
              margin: 0 1.5rem 0 0.25rem;
            }
          }
          .dropdown-icon {
            transition: 150ms ease transform;
            margin-right: 0.25rem;
          }
        }
        .content {
          margin: 0 0 0 0;
          width: calc(100% - 5rem);
          position: fixed;
          display: none;
        }
        button {
          background-color: transparent;
          margin: 0;
          padding: 0;
          font-weight: var(--font-weight-medium);
        }
        ul {
          background-color: var(--color-button-bg);
          border-radius: 0 0 var(--size-rounded-control)
            var(--size-rounded-control);
          box-shadow: var(--shadow-dropdown);
          display: flex;
          flex-direction: column;
          margin: 0;
          list-style: none;
          padding: 0.5rem 0;
          z-index: 1;
          hr {
            background-color: var(--color-divider-dark);
            border: none;
            color: var(--color-divider-dark);
            height: 2px;
            margin: 0.5rem 0;
          }
          li {
            margin: 0;
            &:hover,
            &:focus {
              background-color: var(--color-button-bg-hover);
              color: var(--color-text-dark);
            }
            &:active {
              background-color: var(--color-button-bg-active);
            }
            a,
            button {
              align-items: center;
              display: flex;
              padding: 0.75rem 1.5rem;
              svg {
                color: inherit;
                height: 1rem;
                width: 1rem;
              }
              span {
                margin-left: 0.5rem;
              }
            }
          }
        }
      }
    }

    .auth-prompt {
      display: flex;
      align-items: center;
      height: 100%;

      .log-in-button {
        margin: 0 auto;

        text-align: center;
        border-radius: var(--size-rounded-max);
        background-color: var(--color-brand);
        white-space: nowrap;
        outline: none;
        color: var(--color-brand-inverted);
        display: block;
        padding: 0.5rem 0.75rem;
        svg {
          vertical-align: middle;
          margin-right: 0.5rem;
        }
        &:hover,
        &:focus {
          background-color: var(--color-brand-2);
        }
      }
    }
  }
  @media screen and (min-width: 1024px) {
    max-width: 1280px;
    margin-left: auto;
    margin-right: auto;

    .menu-icon {
      display: none;
    }

    .mobile-header-mode-switch {
      display: none;
    }

    .right-group {
      flex-direction: unset;
      overflow-y: unset;
      position: unset;
      width: unset;
      top: unset;
      height: unset;
      right: unset;
      background-color: unset;
      transition: unset;
      z-index: unset;

      section.nav {
        .styled-tabs {
          flex-direction: unset;
          position: relative;
          top: 50%;
          transform: translateY(-50%);
          margin-top: 3px;
          margin-left: 2rem;

          a {
            margin-left: 0;
          }

          a.tab {
            padding: 0;
            margin-right: 1rem;
          }
        }
      }

      .user-controls {
        width: unset;
        margin: unset;
      }

      .auth-prompt {
        margin: 0;
      }
    }
  }
  @media only screen and (max-width: 1024px) {
    .desktop-header-mode-switch {
      display: none;
    }
  }
}
</style>
