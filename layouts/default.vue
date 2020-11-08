<template>
  <div class="layout">
    <aside>
      <label class="hidden" for="toggle-nav-menu">Toggle Nav Menu</label>
      <input
        id="toggle-nav-menu"
        class="hamburger-button"
        alt="Open navigation menu"
        type="checkbox"
        @click="toggleNavMenu()"
      />
      <div class="hamburger-icon">
        <HamburgerIcon />
      </div>
      <nuxt-link to="/" class="logo-wrapper">
        <img class="logo" src="~/assets/images/logo.svg" alt="modrinth-logo" />
        <span class="name">modrinth</span>
      </nuxt-link>
      <nav>
        <section class="links">
          <h3>Projects</h3>
          <section>
            <nuxt-link to="/modpacks">
              <ModpackIcon />
              <span>Modpacks</span>
            </nuxt-link>
            <nuxt-link to="/mods">
              <ModIcon />
              <span>Mods</span>
            </nuxt-link>
          </section>

          <h3 v-if="this.$auth.loggedIn">Dashboard</h3>
          <section v-if="this.$auth.loggedIn">
            <nuxt-link to="/dashboard/projects">
              <ProjectsIcon />
              <span>My projects</span>
            </nuxt-link>
            <nuxt-link to="/dashboard/analytics">
              <AnalyticsIcon />
              <span>Analytics</span>
            </nuxt-link>
            <nuxt-link
              v-if="this.$auth.user.role === 'admin'"
              to="/dashboard/admin"
            >
              <AdminIcon />
              <span>Admin</span>
            </nuxt-link>
          </section>
        </section>
        <div class="disclosure">
          <span>
            Modrinth is open source software. You may view the source code at
            our
            <a href="https://github.com/modrinth/knossos">GitHub Repository</a>.
          </span>
        </div>
        <section class="user-actions">
          <a
            v-if="!this.$auth.loggedIn"
            :href="
              'https://api.modrinth.com/api/v1/auth/init?url=http://modrinth.com' +
              this.$route.path
            "
            class="log-in-button"
          >
            Log In
          </a>
          <div v-if="this.$auth.loggedIn" class="avatar">
            <img :src="this.$auth.user.avatar_url" alt="avatar" />
            <span> {{ this.$auth.user.username }} </span>
          </div>
          <div v-if="this.$auth.loggedIn" class="notifications">
            <div v-if="showPopup" class="user-actions-popup">
              <div class="popup-inner">
                <p>
                  Modrinth ID: <strong>{{ this.$auth.user.id }}</strong>
                </p>
                <hr />
                <p class="hover">
                  <nuxt-link :to="'/user/' + this.$auth.user.id">
                    My profile
                  </nuxt-link>
                </p>
                <p class="hover">My teams</p>
                <hr />
                <p class="hover" @click="logout">Logout</p>
              </div>
            </div>
            <SettingsIcon @click="showPopup = !showPopup" />
            <MoonIcon
              v-if="$colorMode.value === 'light'"
              @click="changeTheme"
            />
            <SunIcon v-else @click="changeTheme" />
          </div>
        </section>
      </nav>
    </aside>
    <main>
      <Notifications group="main" position="bottom right" />
      <Notifications
        group="ads"
        position="bottom right"
        :duration="-1"
        :ignore-duplicates="true"
      />
      <div class="alpha-alert">
        Modrinth is in early alpha. You can join our
        <a href="https://discord.gg/gFRbNQ2">discord</a> for updates!
      </div>
      <nuxt />
    </main>
  </div>
</template>

<script>
import ModpackIcon from '~/assets/images/sidebar/modpack.svg?inline'
import ModIcon from '~/assets/images/sidebar/mod.svg?inline'
import ProjectsIcon from '~/assets/images/sidebar/projects.svg?inline'
import AnalyticsIcon from '~/assets/images/sidebar/analytics.svg?inline'
import AdminIcon from '~/assets/images/sidebar/admin.svg?inline'

import HamburgerIcon from '~/assets/images/utils/hamburger.svg?inline'
import SettingsIcon from '~/assets/images/utils/settings.svg?inline'
import MoonIcon from '~/assets/images/utils/moon.svg?inline'
import SunIcon from '~/assets/images/utils/sun.svg?inline'

export default {
  components: {
    ModpackIcon,
    ModIcon,
    ProjectsIcon,
    AnalyticsIcon,
    AdminIcon,

    HamburgerIcon,
    SettingsIcon,
    MoonIcon,
    SunIcon,
  },
  async fetch() {
    if (this.$route.query.code)
      await this.$auth.setUserToken(this.$route.query.code)
  },
  data() {
    return {
      showPopup: false,
    }
  },
  mounted() {
    this.themeAds()
  },
  methods: {
    toggleNavMenu() {
      document.body.style.overflow =
        document.body.style.overflow !== 'hidden' ? 'hidden' : 'auto'
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

<style lang="scss" scoped>
.layout {
  background-color: var(--color-grey-0);
  display: flex;
  flex-flow: column;
  min-height: 100vh;
  width: 100%;

  // Desktop
  @media screen and (min-width: 1145px) {
    flex-flow: row;
  }

  aside {
    top: 0;
    position: sticky;
    border-right: 0;
    display: flex; // Flex here to safely expand navigation height
    flex-direction: column;
    width: 100vw;
    max-height: 100vh;
    z-index: 10;

    .logo-wrapper {
      align-items: center;
      display: flex;
      height: 3.5rem;
      width: 100vw;
      font-family: 'Montserrat', sans-serif;

      .logo {
        height: 2rem;
        width: auto;
        margin-left: 2.5rem;
      }

      .name {
        font-family: 'Montserrat Alternates', serif;
        margin-left: 0.4rem;
        font-size: 1.3rem;
      }
    }

    .hamburger-button {
      position: absolute;
      display: block;
      left: 10px;
      opacity: 0;
      margin: 0;
      top: 1.2rem;
      width: 30px;
      height: 30px;
      cursor: pointer;
    }

    .hamburger-icon {
      display: block;
      position: absolute;
      left: 15px;
      top: 1.2rem;
      pointer-events: none;
    }

    .hamburger-button:checked ~ nav {
      left: 0;
    }

    nav {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      justify-content: space-between;
      position: absolute;
      height: calc(100vh - 3.5rem);
      width: 100vw;
      left: -100vw;
      top: 3.5rem;
      transition: left 150ms;
      overflow-y: auto;
      z-index: 10;

      // Larger screens that still need a collapsed menu
      @media screen and (min-width: 900px) {
        width: 300px;
        left: -300px;
      }

      & > * {
        padding: 0 0.75rem;
      }

      .links {
        h3 {
          color: #718096;
          font-size: 0.8rem;
          letter-spacing: 0.02rem;
          margin-bottom: 0.5rem;
          margin-top: 1.5rem;
          text-transform: uppercase;
        }

        section {
          border-left: 4px solid var(--color-grey-3);

          a {
            align-items: center;
            border-radius: 0 0.25rem 0.25rem 0;
            color: var(--color-grey-5);
            display: flex;
            margin-bottom: 0.25rem;
            padding: 0.5rem 1rem;

            &:hover,
            &:focus,
            &.nuxt-link-active {
              background-color: var(--color-grey-1);
              color: var(--color-text);
            }

            &.nuxt-link-active {
              box-shadow: -4px 0 0 0 var(--color-brand);
            }

            svg {
              height: 1rem;
              width: 1rem;
              flex-shrink: 0;
            }

            span {
              margin-left: 0.5rem;
            }
          }
        }
      }
      .user-actions {
        align-items: center;
        border-top: 2px solid var(--color-grey-2);
        display: flex;
        justify-content: space-between;
        margin-top: 1rem;
        padding-bottom: 1rem;
        padding-top: 1rem;

        & > * {
          align-items: center;
          display: flex;
        }

        svg {
          color: var(--color-grey-5);

          &:hover,
          &:focus {
            color: inherit;
          }
        }

        .avatar {
          img {
            border-radius: 50%;
            height: 2rem;
            margin-right: 0.5rem;
            width: 2rem;
          }
        }

        .log-in-button {
          text-align: center;
          padding: 8px 40px;
          border-radius: 5px;
          color: var(--color-grey-5);
          background-color: var(--color-grey-1);
          margin-left: 2.5rem;
        }

        .notifications {
          & > * {
            margin-left: 1rem;
          }

          svg {
            cursor: pointer;
          }
        }

        .user-actions-popup {
          position: relative;

          .popup-inner {
            width: 120px;
            border: 2px var(--color-grey-2) solid;
            background-color: var(--color-bg);
            color: var(--color-grey-5);
            font-size: 15px;
            padding: 8px 0;
            position: absolute;
            z-index: 1;
            margin-bottom: 20px;
            bottom: 100%;
            margin-left: -50px;

            hr {
              color: var(--color-grey-2);
              height: 1px;
            }
            p {
              padding: 8px;
              margin: 0;
            }

            .hover {
              cursor: pointer;

              &:hover,
              &:focus {
                background-color: var(--color-brand);
                color: #fff;
              }
            }
          }
          .popup-inner::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 45%;
            border-width: 7px;
            border-style: solid;
            border-color: var(--color-grey-2) transparent transparent
              transparent;
          }
        }
      }
    }

    // Desktop
    @media screen and (min-width: 1145px) {
      border-right: 1px solid var(--color-grey-2);
      min-width: 300px;
      max-width: 300px;

      nav {
        height: 100%;
        left: 0;
        width: 100%;
        transition: none;
        position: static;
      }

      .logo-wrapper {
        padding: 0 0 0 1.5rem;
        width: 100%;
        .logo {
          margin: 0;
        }
      }

      .hamburger-button,
      .hamburger-icon {
        display: none;
      }
    }
  }
  main {
    background-color: var(--color-grey-0);
    flex-grow: 1;

    header {
      align-items: center;
      background-color: var(--color-bg);
      box-shadow: 0 1px 1px 0 var(--color-grey-2);
      display: flex;
      height: 3.5rem;
      justify-content: space-between;
      padding: 0 3rem 0 1rem;

      .search-wrapper {
        align-items: center;
        display: flex;
        flex-direction: row-reverse;
        width: 100%;

        input {
          border: none;
          font-size: 1rem;
          padding: 1rem;
          width: 100%;

          &::placeholder {
            color: var(--color-grey-5);
          }

          &:hover,
          &:focus {
            & + svg {
              color: inherit;
            }

            &::placeholder {
              color: var(--color-grey-7);
            }
          }
        }

        svg {
          color: var(--color-grey-5);
        }
      }
    }

    .content {
      // Default is for small phone sizes (like iPhone 5/SE)
      padding: 0.5rem 0.35rem 0.5rem 0.35rem;

      // Larger phones
      @media screen and (min-width: 500px) {
        padding: 1rem 0.5rem 1rem 0.5rem;
      }

      // Desktop
      @media screen and (min-width: 1145px) {
        padding: 1rem;
      }
    }
  }
}

.alpha-alert {
  text-align: center;
  padding: 1em;
  background-color: var(--color-grey-1);

  a {
    text-decoration: underline;
    color: var(--color-grey-5);
  }
}

.disclosure {
  margin-top: auto;
  max-width: 250px;
  color: var(--color-grey-3);

  a {
    text-decoration: var(--color-grey-2) underline;
  }
}

// Hack for very small (iPhone 5/SE) sized phones
// an x overflow existed and I was unable to figure out why
@media screen and (max-width: 360px) {
  body {
    overflow-x: hidden !important;
  }
}
</style>
