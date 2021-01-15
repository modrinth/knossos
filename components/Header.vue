<template>
  <header class="container header">
    <div class="header__header">
      <Logo class="header__logo" />
      <button class="header__menu-button" @click="toggleMenu">
        <IconMenu class="header__menu-icon" />
      </button>
    </div>
    <div
      class="header__collapsible"
      :class="{ header__collapsible_open: isMenuOpen }"
    >
      <nav class="header__nav">
        <NuxtLink to="/mods" class="link header__link">Mods</NuxtLink>
      </nav>
      <div class="user-controls header__user-controls">
        <button class="user-controls__control">
          <img
            class="user-controls__avatar"
            src="~/assets/images/sparrow.jpg"
            alt="User avatar"
          />
          <span class="user-controls__nickname">falseresync</span>
          <IconDropdown class="user-controls__dropdown-icon" />
        </button>
        <ul class="user-controls__content">
          <li>
            <NuxtLink to="/user/123456" class="link user-controls__link">
              <IconUser class="user-controls__link-icon" />
              <span class="user-controls__link-text">Profile</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/notifications" class="link user-controls__link">
              <IconNotifications class="user-controls__link-icon" />
              <span class="user-controls__link-text">Notifications</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/settings" class="link user-controls__link">
              <IconSettings class="user-controls__link-icon" />
              <span class="user-controls__link-text">Settings</span>
            </NuxtLink>
          </li>
          <li>
            <ClientOnly>
              <button class="link user-controls__link" @click="changeTheme">
                <IconSun
                  v-if="$colorMode.value === 'dark'"
                  class="user-controls__link-icon"
                />
                <IconMoon v-else class="user-controls__link-icon" />
                <span class="user-controls__link-text">Change theme</span>
              </button>
            </ClientOnly>
          </li>
          <hr class="divider user-controls__divider" />
          <li>
            <button class="link user-controls__link" @click="logout">
              <IconLogout class="user-controls__link-icon" />
              <span class="user-controls__link-text">Log out</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script>
import Logo from '@/components/Logo'
import IconMenu from '@/assets/images/icons/menu.svg?inline'
import IconDropdown from '@/assets/images/icons/dropdown.svg?inline'
import IconUser from '@/assets/images/icons/user.svg?inline'
import IconNotifications from '@/assets/images/icons/notifications.svg?inline'
import IconSettings from '@/assets/images/icons/settings.svg?inline'
import IconSun from '@/assets/images/icons/sun.svg?inline'
import IconMoon from '@/assets/images/icons/moon.svg?inline'
import IconLogout from '@/assets/images/icons/logout.svg?inline'

export default {
  components: {
    Logo,
    IconMenu,
    IconDropdown,
    IconUser,
    IconNotifications,
    IconSettings,
    IconSun,
    IconMoon,
    IconLogout,
  },
  data() {
    return {
      isMenuOpen: false,
    }
  },
  watch: {
    $route() {
      this.isMenuOpen = false
    },
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
    changeTheme() {
      this.isMenuOpen = false
      this.$colorMode.preference =
        this.$colorMode.value === 'dark' ? 'light' : 'dark'
    },
    logout() {
      this.isMenuOpen = false
      return 0
    },
  },
}
</script>

<style lang="scss" scoped>
// ===
// TOP-LEVEL BLOCKS
// ===
.header {
  color: var(--color-text);
  display: flex;
  flex-direction: column;
  // Q: Why not `padding: 0.5rem inherit`?
  // A: Because global values like inherit don't work for `padding: x y`; only for `padding: a`;
  padding-bottom: 0.5rem;
  padding-top: 0.5rem;

  @media (min-width: $breakpoint-md) {
    align-items: center;
    flex-direction: row;
  }
}

.header__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.header__logo {
  height: 2rem;
}

.header__menu-button {
  align-items: center;
  background: none;
  border: none;
  margin: 0;
  padding: 0;

  @media (min-width: $breakpoint-md) {
    display: none;
  }
}

.header__menu-icon {
  color: var(--color-text);
  height: var(--icon-size-md);
}

.header__collapsible {
  display: none;
  width: 100%;

  @media (min-width: $breakpoint-md) {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }

  &_open {
    display: block;
  }
}

.header__nav {
  font-size: var(--font-size-lg);
  padding: 0 0.5rem;

  @media (min-width: $breakpoint-md) {
    padding: 0 1rem;
  }
}

.header__link {
  color: var(--color-text);
  display: inline-block;
  margin-top: 1.5rem;
  position: relative;

  &::before {
    background-color: var(--color-brand);
    bottom: 0;
    content: '';
    height: 3px;
    left: 50%;
    margin-bottom: -6px;
    position: absolute;
    transition: all 0.3s var(--timing-function-sharp-ease) 0s;
    width: 0;
  }

  &.nuxt-link-exact-active::before,
  &:hover::before,
  &:focus::before {
    left: 0;
    width: 100%;
  }

  &:not(:last-child) {
    margin-right: 1rem;
  }

  &:hover::before,
  &:focus::before {
    background-color: var(--color-brand);
  }

  @media (min-width: $breakpoint-md) {
    margin: 0;

    &::before {
      background-color: var(--color-brand-unfocused);
    }

    &:not(:last-child) {
      margin-right: 0.5rem;
    }
  }
}

.header__user-controls {
  margin-top: 1.5rem;

  @media (min-width: $breakpoint-md) {
    margin-top: 0;
  }
}

// ===
// BOTTOM-LEVEL BLOCKS
// ===
.user-controls {
  position: relative;
  min-width: 12rem;
}

.user-controls__control {
  align-items: center;
  background-color: var(--color-bg);
  border: solid transparent;
  border-radius: 0.5rem;
  border-width: 1px 1px 0 1px;
  color: var(--color-text);
  display: flex;
  margin: 0;
  min-width: 100%;
  padding: 0.3rem 0.75rem;
  position: relative;
  transition: all 0.3s ease;
  width: 100%;
}

@media (min-width: $breakpoint-md) {
  .user-controls:hover .user-controls__control,
  .user-controls:focus-within .user-controls__control {
    background-color: var(--color-bg-raised);
    border-color: var(--color-divider);
    border-radius: 0.5rem 0.5rem 0 0;
  }
}

.user-controls__nickname {
  margin: 0 0.25rem 0 0.5rem;
}

.user-controls__avatar {
  border-radius: 100%;
  height: 1.5rem;
  width: 1.5rem;
}

.user-controls__dropdown-icon {
  display: none;
  height: var(--icon-size-md);
  margin-left: auto;
  transition: transform 0.2s var(--timing-function-sharp-ease);
  width: var(--icon-size-md);

  @media (min-width: $breakpoint-md) {
    display: block;
  }
}

.user-controls:hover .user-controls__dropdown-icon,
.user-controls:focus-within .user-controls__dropdown-icon {
  transform: rotate(180deg);
}

.user-controls__content {
  box-sizing: border-box;
  border: solid transparent;
  border-radius: 0.5rem;
  border-width: 0 1px 1px 1px;
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
  transform-origin: top;
  transition: all 0.1s ease-in;
  width: 100%;

  @media (min-width: $breakpoint-md) {
    background-color: var(--color-bg);
    display: block;
    position: absolute;
    transform: scaleY(0.75);
    visibility: hidden;
  }
}

@media (min-width: $breakpoint-md) {
  .user-controls:hover .user-controls__content,
  .user-controls:focus-within .user-controls__content {
    background-color: var(--color-bg-raised);
    border-color: var(--color-divider);
    border-radius: 0 0 0.5rem 0.5rem;
    transform: scaleY(1);
    visibility: visible;
  }
}

.user-controls__divider {
  display: none;

  @media (min-width: $breakpoint-md) {
    display: block;
  }
}

.user-controls__link {
  align-items: center;
  background-color: transparent;
  box-sizing: border-box;
  border: none;
  border-radius: 0.5rem;
  color: var(--color-text);
  cursor: pointer;
  display: inline-flex;
  margin-top: 0.5rem;
  padding: 0.75rem 0.75rem 0.75rem 0.25rem;
  text-align: start;
  transition: all 0.1s ease;
  width: 100%;

  &:hover,
  &:focus {
    background-color: var(--color-hover-raised);
  }

  @media (min-width: $breakpoint-md) {
    border-radius: 0;
    display: flex;
    margin: 0.25rem 0;
    padding: 0.5rem 0.25rem;
  }
}

.user-controls__link-icon {
  height: var(--icon-size-sm);
  margin: 0 0.5rem;
  // minimals are set so when the text wraps, it doesn't shrink the icon
  min-height: var(--icon-size-sm);
  min-width: 1.5rem;
  width: 1.5rem;
}

.user-controls__link-text {
  flex: 0 0 100%;
  text-align: left;
}
</style>
