<template>
  <div class="layout">
    <aside>
      <section class="logo">
        <ModrinthLogo v-if="$colorMode.value === 'light'" />
        <ModrinthLogoWhite v-else />

        <div>
          <button class="theme-changer" @click="changeTheme">
            <MoonIcon v-if="$colorMode.value === 'light'" />
            <SunIcon v-else />
          </button>
          <button class="hamburger" @click="toggleNav">
            <HamburgerIcon v-if="!isNavOpen" />
            <ExitIcon v-else />
          </button>
        </div>
      </section>

      <nav class="visible-md" :class="{ hidden: !isNavOpen }">
        <section class="navigation">
          <section class="links community">
            <NuxtLink to="/modpacks">
              <ModpackIcon />
              <span>Modpacks</span>
            </NuxtLink>
            <NuxtLink to="/mods">
              <ModIcon />
              <span>Mods</span>
            </NuxtLink>
          </section>

          <hr />

          <template v-if="this.$auth.loggedIn">
            <section class="user-controls">
              <div class="avatar">
                <img :src="this.$auth.user.avatar_url" />
                <span>
                  {{ this.$auth.user.username }}
                </span>
              </div>
              <div v-click-outside="hideDropdown" class="dropdown">
                <button class="control" @click="toggleDropdown">
                  <HamburgerIcon v-if="!isDropdownOpen" />
                  <ExitIcon v-else />
                </button>
                <div class="content">
                  <ul v-if="isDropdownOpen" @click="hideDropdown">
                    <li>
                      <NuxtLink :to="userUrl">
                        <UserIcon />
                        <span>Profile</span>
                      </NuxtLink>
                    </li>
                    <li v-tooltip="'Not implemented yet'">
                      <NuxtLink :to="userTeamsUrl" disabled>
                        <UsersIcon />
                        <span>Teams</span>
                      </NuxtLink>
                    </li>
                    <li v-tooltip="'Not implemented yet'">
                      <NuxtLink to="/settings" disabled>
                        <SettingsIcon />
                        <span>Settings</span>
                      </NuxtLink>
                    </li>
                    <hr />
                    <li>
                      <button @click="logout">
                        <LogOutIcon />
                        <span>Log out</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section class="links dashboard">
              <NuxtLink to="/dashboard/projects">
                <ProjectsIcon />
                <span>Projects</span>
              </NuxtLink>
              <NuxtLink to="/dashboard/analytics">
                <AnalyticsIcon />
                <span>Analytics</span>
              </NuxtLink>
              <NuxtLink
                v-if="this.$auth.user.role === 'admin'"
                to="/dashboard/admin"
              >
                <AdminIcon />
                <span>Admin</span>
              </NuxtLink>
            </section>
          </template>
          <template v-else>
            <section class="auth-prompt">
              <a :href="authUrl" class="log-in-button">Log in</a>
              <button
                v-tooltip="'Not implemented yet. Log in via GitHub'"
                class="sign-up-button"
                disabled
              >
                Sign up
              </button>
            </section>
          </template>
        </section>

        <section class="footer">
          <div class="disclosure">
            Modrinth is open source software. You may view the source code at
            our
            <a href="https://github.com/modrinth/knossos">GitHub repository</a>.
          </div>
          <div class="legal">
            <ul>
              <li>
                <NuxtLink to="/tos">Terms</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/privacy">Privacy</NuxtLink>
              </li>
            </ul>
          </div>
          <div class="copyright">© Guavy LLC</div>
        </section>
      </nav>
    </aside>
    <main>
      <notifications group="main" position="bottom right" />
      <notifications
        group="ads"
        position="bottom right"
        :duration="-1"
        :ignore-duplicates="true"
      />
      <div class="alpha-alert hidden">
        <div class="wrapper">
          Modrinth is in early alpha. Beware of many bugs and broken and
          unimplemented features. Join our
          <a class="text-link" href="https://discord.gg/gFRbNQ2">Discord</a>
          for updates!
        </div>
      </div>
      <Nuxt />
    </main>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'

import ModrinthLogo from '~/assets/images/text-logo.svg?inline'
import ModrinthLogoWhite from '~/assets/images/text-logo-white.svg?inline'

import ModpackIcon from '~/assets/images/sidebar/modpack.svg?inline'
import ModIcon from '~/assets/images/sidebar/mod.svg?inline'
import ProjectsIcon from '~/assets/images/sidebar/projects.svg?inline'
import AnalyticsIcon from '~/assets/images/sidebar/analytics.svg?inline'
import AdminIcon from '~/assets/images/sidebar/admin.svg?inline'

import HamburgerIcon from '~/assets/images/utils/hamburger.svg?inline'
import ExitIcon from '~/assets/images/utils/exit.svg?inline'
import MoonIcon from '~/assets/images/utils/moon.svg?inline'
import SunIcon from '~/assets/images/utils/sun.svg?inline'

import UserIcon from '~/assets/images/utils/user.svg?inline'
import UsersIcon from '~/assets/images/utils/users.svg?inline'
import SettingsIcon from '~/assets/images/utils/settings.svg?inline'
import LogOutIcon from '~/assets/images/utils/log-out.svg?inline'

export default {
  components: {
    ModrinthLogo,
    ModrinthLogoWhite,
    ModpackIcon,
    ModIcon,
    ProjectsIcon,
    AnalyticsIcon,
    AdminIcon,
    HamburgerIcon,
    ExitIcon,
    MoonIcon,
    SunIcon,
    UserIcon,
    UsersIcon,
    SettingsIcon,
    LogOutIcon,
  },
  directives: {
    ClickOutside,
  },
  async fetch() {
    if (this.$route.query.code) {
      await this.$auth.setUserToken(this.$route.query.code)
    }
  },
  data() {
    return {
      isNavOpen: false,
      isDropdownOpen: false,
    }
  },
  computed: {
    authUrl() {
      return `https://api.modrinth.com/api/v1/auth/init?url=http://localhost:3000${this.$route.path}`
    },
    userUrl() {
      return `/user/${this.$auth.user.id}`
    },
    userTeamsUrl() {
      return `${this.userUrl}/teams`
    },
  },
  mounted() {
    this.themeAds()
  },
  methods: {
    toggleNav() {
      this.isNavOpen = !this.isNavOpen
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen
    },
    hideDropdown() {
      this.isDropdownOpen = false
    },
    logout() {
      this.$auth.setToken('local', false)
      this.$router.go(null)
    },
    changeTheme() {
      this.$colorMode.preference =
        this.$colorMode.value === 'dark' ? 'light' : 'dark'

      this.themeAds()
    },
    themeAds() {
      const elements = document.getElementsByClassName('ethical-ad')
      for (const elem of elements) {
        elem.className = 'ethical-ad loaded ' + this.$colorMode.preference
      }
    },
  },
}
</script>

<style lang="scss">
.layout {
  background-color: var(--color-bg);
  display: block;
  height: 100vh;

  aside {
    background-color: var(--color-raised-bg);
    display: flex;
    flex-direction: column;
    grid-area: 'aside';

    section.logo {
      align-items: center;
      display: flex;
      justify-content: space-between;
      padding: 1rem 2rem;

      svg {
        height: 1.75rem;
        width: auto;
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

    hr {
      background-color: var(--color-grey-2);
      border: none;
      color: var(--color-grey-2);
      height: 0.2rem;
      margin: 0.5rem 2rem;
    }

    section.links {
      a {
        align-items: center;
        border-right: 0.33rem solid transparent;
        color: var(--color-grey-6);
        display: flex;
        font-size: var(--font-size-md);
        margin: 0.25rem 0;
        padding: 1rem 2rem;

        span {
          margin-left: 1rem;
        }

        &:hover,
        &:focus,
        &.nuxt-link-active {
          background-color: var(--color-grey-2);
          color: var(--color-text);
        }

        &.nuxt-link-active {
          background-color: var(--color-brand-3);
          border-right-color: var(--color-brand);
          color: var(--color-text);
        }
      }
    }

    section.user-controls {
      align-items: center;
      background-color: var(--color-grey-2);
      border-radius: var(--size-rounded-sm);
      display: flex;
      justify-content: space-between;
      margin: 0.5rem;
      padding: 0.75rem 1rem;

      .avatar {
        align-items: center;
        display: flex;

        img {
          border-radius: 50%;
          height: 2rem;
          width: 2rem;
        }

        span {
          display: block;
          margin-left: 0.5rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .dropdown {
        position: relative;
        display: inline-block;

        .control {
          align-items: center;
          display: flex;
        }

        .content {
          margin: 0.5rem 0 0 -5rem;
          min-width: 10rem;
          position: fixed;
        }

        button {
          background-color: transparent;
          color: inherit;
          margin: 0;
          padding: 0;
        }

        ul {
          background-color: var(--color-bg);
          border: 1px solid var(--color-grey-2);
          border-radius: var(--size-rounded-xs);
          color: var(--color-grey-6);
          display: flex;
          flex-direction: column;
          margin: 0;
          list-style: none;
          padding: 0.5rem 0;

          hr {
            background-color: var(--color-grey-2);
            border: none;
            color: var(--color-grey-2);
            height: 1px;
            margin: 0.5rem 0;
          }

          li {
            margin: 0;
            padding: 0.75rem 1.5rem;

            &:hover,
            &:focus {
              background-color: var(--color-grey-0);
              color: var(--color-text);
            }

            &:active {
              background-color: var(--color-grey-1);
            }

            a,
            button {
              align-items: center;
              display: flex;

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

      svg {
        color: var(--color-grey-6);

        &:hover,
        &:focus {
          color: var(--color-text);
        }
      }
    }

    section.auth-prompt {
      display: flex;
      flex-direction: column;

      .log-in-button,
      .sign-up-button {
        border: none;
        border-radius: var(--size-rounded-sm);
        color: var(--color-grey-7);
        display: block;
        margin: 0.5rem 3rem;
        padding: 0.75rem 1rem;
        text-align: center;
      }

      .log-in-button {
        background-color: var(--color-brand);
        color: var(--color-brand-inverted);

        &:hover,
        &:focus {
          background-color: var(--color-brand-2);
        }
      }

      .sign-up-button {
        background-color: var(--color-grey-2);

        &:hover,
        &:focus {
          background-color: var(--color-grey-1);
          color: var(--color-text);
        }
      }
    }

    section.footer {
      color: var(--color-grey-5);
      padding: 0.5rem 2rem;

      a {
        text-decoration: underline;
      }

      ul {
        list-style: none;
        margin: 1rem 0;
        padding: 0;

        li {
          display: inline;
          margin: auto 0;

          &:not(:last-child):after {
            content: '•';
            margin-left: 0.25rem;
          }
        }
      }
    }
  }

  main {
    grid-area: 'main';

    .alpha-alert {
      background-color: var(--color-bg);
      border-radius: var(--size-rounded-md);
      margin: 0.5rem;
      overflow: hidden;
      width: fit-content;

      .wrapper {
        border-left: 0.5rem solid var(--color-brand);
        padding: 0.75rem 1rem;
      }
    }
  }
}

@media (min-width: 1024px) {
  .layout {
    display: grid;
    grid-template-columns: 1fr 9fr;
    grid-template-rows: auto;
    grid-template-areas: 'aside main';

    aside {
      height: 100vh;
      max-height: 100vh;

      nav {
        display: flex;
        flex-direction: column;
        height: 100vh;
        justify-content: space-between;
        max-height: 100vh;
      }

      section.logo {
        padding: 2rem;

        button.hamburger {
          display: none;
        }
      }

      hr {
        margin: 1rem 2rem;
      }

      section.links {
        a {
          padding: 1rem 2rem;
        }
      }

      section.user-controls {
        margin: 1rem;
      }

      section.footer {
        padding: 1rem 2rem;
      }
    }

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

@media (min-width: 1280px) {
  .layout {
    grid-template-columns: 1fr 7fr;

    aside {
      section.logo {
        padding: 2rem;
      }

      hr {
        margin: 1rem 3rem;
      }

      section.links {
        a {
          padding: 1rem 3rem;
        }
      }

      section.footer {
        padding: 1rem 3rem;
      }
    }
  }
}
</style>
