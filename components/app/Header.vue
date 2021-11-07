<template>
  <header class="header">
    <!-- This wrapper is neccessary because flexbox doesn't account for padding in its calculations. Hence we have to use margin with flexbox, unfortunately -->
    <div class="header__wrapper">
      <div class="header__collapsible">
        <nav class="header__mobile-nav dropdown dropdown_align_left">
          <button class="dropdown__control">
            <HamburgerIcon />
          </button>
          <ul class="dropdown__content card" @click="removeFocus">
            <li>
              <NuxtLink to="/mods" class="dropdown-item">
                <span class="dropdown-item__text">Mods</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/modpacks" class="dropdown-item">
                <span class="dropdown-item__text">Modpacks</span>
              </NuxtLink>
            </li>
          </ul>
        </nav>
        <NuxtLink class="header__logo-wrapper" to="/">
          <ModrinthIcon class="header__icon" />
          <ModrinthLogo class="header__logo" />
        </NuxtLink>
        <nav class="header__desktop-nav styled-tabs">
          <NuxtLink to="/mods" class="tab">
            <span>Mods</span>
          </NuxtLink>
          <NuxtLink to="/modpacks" class="tab">
            <span>Modpacks</span>
          </NuxtLink>
        </nav>
      </div>
      <div class="header__user-controls">
        <button class="header__user-control user-control" @click="changeTheme">
          <MoonIcon v-if="$colorMode.value === 'light'" />
          <SunIcon v-else />
        </button>
        <NuxtLink to="/notifications" class="header__user-control user-control">
          <NotificationIcon />
          <div
            v-if="$user.notifications.length > 0"
            class="user-control__bubble"
          >
            {{ $user.notifications.length }}
          </div>
        </NuxtLink>
        <div v-if="$auth.user" class="header__user-dropdown dropdown">
          <button class="dropdown__control">
            <img :src="$auth.user.avatar_url" class="dropdown__control-image" />
          </button>
          <ul class="dropdown__content card" @click="removeFocus">
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
                  $auth.user.role === 'moderator' || $auth.user.role === 'admin'
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
        <a v-else :href="authUrl" class="iconified-button">
          <GitHubIcon />
          <div>
            <span>Sign in</span>
            <span>with GitHub</span>
          </div>
        </a>
      </div>
    </div>
  </header>
</template>

<script>
import ModrinthLogo from '~/assets/images/text-logo.svg?inline'
import ModrinthIcon from '~/assets/images/logo.svg?inline'

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
    ModrinthIcon,
    MoonIcon,
    SunIcon,
    LogOutIcon,
    GitHubIcon,
    NotificationIcon,
    HamburgerIcon,
    SettingsIcon,
    ModerationIcon,
  },
  computed: {
    authUrl() {
      return `${this.$axios.defaults.baseURL}auth/init?url=${process.env.domain}${this.$route.path}`
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
    removeFocus() {
      document.activeElement.blur()
    },
  },
}
</script>

<style scoped>
.header__wrapper {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 1rem 2rem;
}

.header__collapsible,
.header__logo-wrapper {
  align-items: center;
  display: flex;
}

.header__icon,
.header__logo {
  height: 2rem;
  width: auto;
}

.header__icon {
  margin-left: 1rem;
}

.header__logo {
  display: none;
}

.header__desktop-nav {
  display: none;
  margin-left: 2rem;
}

.header__user-controls {
  align-items: center;
  display: flex;
}

.header__user-control {
  margin-left: 0.5rem;
}

.header__user-dropdown {
  margin-left: 1rem;
}

.user-control {
  align-items: center;
  background: none;
  border-radius: 100%;
  display: flex;
  height: 2.5rem;
  justify-content: center;
  padding: 0;
  position: relative;
  width: 2.5rem;
}

.user-control__bubble {
  position: absolute;
  top: 0;
  right: -0.3rem;
  border-radius: 1rem;
  padding: 0.1rem 0.25rem;
  font-size: 0.75rem;
  background-color: var(--color-brand);
  color: var(--color-brand-inverted);
}

.user-control:hover {
  background-color: var(--color-button-bg-hover);
}

.dropdown {
  position: relative;
}

.dropdown:hover .dropdown__control-image,
.dropdown:focus .dropdown__control-image,
.dropdown:focus-within .dropdown__control-image {
  outline-color: var(--color-brand);
}

.dropdown:hover .dropdown__content,
.dropdown:focus .dropdown__content,
.dropdown:focus-within .dropdown__content {
  opacity: 1;
  transform: scaleY(1);
  visibility: visible;
}

.dropdown__control {
  align-items: center;
  background: none;
  display: flex;
  justify-content: center;
  padding: 0;
}

.dropdown__control-image {
  border-radius: 100%;
  height: 2.5rem;
  outline: 2px solid transparent;
  width: 2.5rem;
}

.dropdown__content {
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
  transition: all 0.1s ease-in-out 0.05s;
  visibility: hidden;
  width: max-content;
  z-index: 1;
}

.dropdown_align_left .dropdown__content {
  right: auto;
  left: -1rem;
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

.dropdown-item:hover,
.dropdown-item:focus {
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
  .header__mobile-nav {
    display: none;
  }

  .header__icon {
    display: none;
  }

  .header__logo {
    display: block;
  }

  .header__desktop-nav {
    display: inherit;
  }
}
</style>
