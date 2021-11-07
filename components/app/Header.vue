<template>
  <header class="header">
    <!-- This wrapper is neccessary because flexbox doesn't account for padding in its calculations. Hence we have to use margin with flexbox, unfortunately -->
    <div class="header__wrapper">
      <NuxtLink to="/">
        <ModrinthLogo class="header__logo" />
      </NuxtLink>
      <button class="header__mobile-toggle" @click="navbarOpen = !navbarOpen">
        <HamburgerIcon />
      </button>
      <div
        class="header__collapsible"
        :class="{ header__collapsible_open: navbarOpen }"
      >
        <section class="header__nav styled-tabs">
          <NuxtLink to="/mods" class="tab">
            <span>Mods</span>
          </NuxtLink>
          <NuxtLink to="/modpacks" class="tab">
            <span>Modpacks</span>
          </NuxtLink>
        </section>
        <section class="header__user-controls">
          <button
            class="header__user-control control-button"
            @click="changeTheme"
          >
            <MoonIcon v-if="$colorMode.value === 'light'" />
            <SunIcon v-else />
          </button>
          <NuxtLink
            to="/notifications"
            class="header__user-control control-button"
          >
            <NotificationIcon />
            <div
              v-if="$user.notifications.length > 0"
              class="control-button__bubble"
            >
              {{ $user.notifications.length }}
            </div>
          </NuxtLink>
          <div v-if="$auth.user" class="header__user-control dropdown">
            <button class="dropdown__control">
              <img
                :src="$auth.user.avatar_url"
                class="dropdown__control-image"
              />
            </button>
            <ul class="dropdown__content card">
              <li>
                <NuxtLink
                  class="dropdown-item"
                  :to="`/user/${$auth.user.username}`"
                >
                  <div class="dropdown-item__text dropdown-profile">
                    <div class="dropdown-profile__username">
                      @{{ $auth.user.username }}
                    </div>
                    <div class="dropdown-profile__prompt">Go to my profile</div>
                  </div>
                </NuxtLink>
              </li>
              <hr class="dropdown__divider" />
              <li>
                <NuxtLink class="dropdown-item" to="/notifications">
                  <NotificationIcon class="dropdown-item__icon" />
                  <span class="dropdown-item__text">Notifications</span>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink class="dropdown-item" to="/settings">
                  <SettingsIcon class="dropdown-item__icon" />
                  <span class="dropdown-item__text">Settings</span>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  v-if="
                    $auth.user.role === 'moderator' ||
                    $auth.user.role === 'admin'
                  "
                  class="dropdown-item"
                  to="/moderation"
                >
                  <ModerationIcon class="dropdown-item__icon" />
                  <span class="dropdown-item__text">Moderation</span>
                </NuxtLink>
              </li>
              <li>
                <button class="dropdown-item" @click="changeTheme">
                  <MoonIcon
                    v-if="$colorMode.value === 'light'"
                    class="dropdown-item__icon"
                  />
                  <SunIcon v-else class="dropdown-item__icon" />
                  <span class="dropdown-item__text">Change theme</span>
                </button>
              </li>
              <hr class="dropdown__divider" />
              <li>
                <button class="dropdown-item" @click="logout">
                  <LogOutIcon class="dropdown-item__icon" />
                  <span class="dropdown-item__text">Log out</span>
                </button>
              </li>
            </ul>
          </div>
          <a v-else :href="authUrl" class="auth-prompt log-in-button">
            <GitHubIcon />
            <span>Sign in with GitHub</span>
          </a>
        </section>
      </div>
    </div>
  </header>
</template>

<script>
import ModrinthLogo from '~/assets/images/text-logo.svg?inline'

import HamburgerIcon from '~/assets/images/utils/hamburger.svg?inline'

import NotificationIcon from '~/assets/images/sidebar/notifications.svg?inline'
import SettingsIcon from '~/assets/images/sidebar/settings.svg?inline'
import ModerationIcon from '~/assets/images/sidebar/admin.svg?inline'

import MoonIcon from '~/assets/images/utils/moon.svg?inline'
import SunIcon from '~/assets/images/utils/sun.svg?inline'

import LogOutIcon from '~/assets/images/utils/log-out.svg?inline'
import GitHubIcon from '~/assets/images/utils/github.svg?inline'

export default {
  components: {
    ModrinthLogo,
    MoonIcon,
    SunIcon,
    LogOutIcon,
    GitHubIcon,
    NotificationIcon,
    HamburgerIcon,
    SettingsIcon,
    ModerationIcon,
  },
  data() {
    return {
      navbarOpen: false,
    }
  },
  computed: {
    authUrl() {
      return `${this.$axios.defaults.baseURL}auth/init?url=${process.env.domain}${this.$route.path}`
    },
  },
  watch: {
    $route() {
      document.activeElement.blur()
    },
  },
  methods: {
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

<style scoped>
.header__wrapper {
  align-items: center;
  display: flex;
  margin: 1rem;
}

.header__logo {
  height: 2rem;
  width: auto;
}

.header__collapsible {
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: space-between;
}

.header__user-controls {
  align-items: center;
  display: flex;
}

.header__user-control {
  margin-left: 1rem;
}

.dropdown:hover .dropdown__control-image,
.dropdown:focus .dropdown__control-image,
.dropdown:focus-within .dropdown__control-image {
  outline-color: var(--color-brand);
}

.dropdown:hover .dropdown__content,
.dropdown:focus .dropdown__content,
.dropdown:focus-within .dropdown__content {
  display: block;
}

.dropdown {
  position: relative;
}

.dropdown__control {
  padding: 0;
}

.dropdown__control-image {
  border-radius: 100%;
  height: 2rem;
  outline: 2px solid transparent;
  width: 2rem;
}

.dropdown__content {
  border: 1px solid var(--color-divider-dark);
  display: none;
  list-style: none;
  margin: 0;
  max-width: 25rem;
  min-width: 12rem;
  padding: 1rem;
  position: absolute;
  right: -1rem;
  width: max-content;
  z-index: 1;
}

.dropdown__divider {
  background-color: var(--color-divider-dark);
  border: none;
  color: var(--color-divider-dark);
  height: 1px;
  margin: 0.5rem 0;
}

.dropdown-item {
  align-items: center;
  background: none;
  border-radius: 0.5rem;
  box-sizing: border-box;
  color: inherit;
  display: flex;
  padding: 0.5rem;
  width: 100%;
}

.dropdown-item:hover {
  background-color: var(--color-bg);
}

.dropdown-item__icon {
  margin-right: 0.5rem;
  height: var(--size-icon);
  width: var(--size-icon);
}

.dropdown-profile__prompt {
  margin-top: 0.25rem;
  color: var(--color-text-secondary);
}

@media screen and (min-width: 1024px) {
  .header__mobile-toggle {
    display: none;
  }
}
</style>
