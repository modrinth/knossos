<template>
  <div class="layout">
    <aside>
      <section class="logo">
        <ModrinthLogo v-if="$colorMode.value === 'light'" />
        <ModrinthLogoWhite v-else />

        <button class="hamburger" @click="toggleNav">
          <HamburgerIcon v-if="!isNavOpen" />
          <ExitIcon v-else />
        </button>
      </section>

      <nav class="visible-md" :class="{ hidden: !isNavOpen }">
        <section class="links">
          <section class="links community">
            <NuxtLink to="/modpacks">
              <ModpackIcon />
              <span>Modpacks</span>
            </NuxtLink>
            <NuxtLink to="/new">
              <ModIcon />
              <span>Mods</span>
            </NuxtLink>
          </section>

          <template v-if="this.$auth.loggedIn">
            <hr />

            <section class="links dashboard">
              <NuxtLink to="/dashboard/projects">
                <ProjectsIcon />
                <span>My projects</span>
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
      <div class="alpha-alert">
        <div class="wrapper">
          Modrinth is in early alpha. Beware of many bugs and broken and
          unimplemented features. Join our
          <a class="text-link" href="https://discord.gg/gFRbNQ2">Discord</a>
          for updates!
        </div>
      </div>
      <MoonIcon v-if="$colorMode.value === 'light'" @click="changeTheme" />
      <SunIcon v-else @click="changeTheme" />
      <Nuxt />
    </main>
  </div>
</template>

<script>
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
  },
  data() {
    return {
      isNavOpen: false,
    }
  },
  methods: {
    toggleNav() {
      this.isNavOpen = !this.isNavOpen
    },
    changeTheme() {
      this.$colorMode.preference =
        this.$colorMode.value === 'dark' ? 'light' : 'dark'

      // this.themeAds()
    },
  },
}
</script>

<style lang="scss">
.layout {
  background-color: var(--color-grey-2);
  display: block;
  height: 100vh;

  aside {
    background-color: var(--color-bg);
    display: flex;
    flex-direction: column;
    grid-area: 'aside';

    section.logo {
      align-items: center;
      display: flex;
      justify-content: space-between;
      padding: 1rem 2rem;

      svg {
        height: 2rem;
        width: auto;
      }

      button {
        background: none;
        border: none;

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
        font-size: 1.25rem;
        margin: 0.25rem 0;
        padding: 1rem 2rem;

        svg {
          height: 1.5rem;
          width: 1.5rem;
        }

        span {
          margin-left: 1rem;
        }

        &:hover,
        &:focus,
        &.nuxt-link-active {
          background-color: var(--color-grey-0);
          color: var(--color-grey-7);
        }

        &.nuxt-link-active {
          background-color: var(--color-grey-1);
          border-right-color: var(--color-brand);
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
        display: block;
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
        padding: 2rem 3rem;
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
