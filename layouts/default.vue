<template>
  <div class="layout">
    <header class="site-header">
      <section class="navbar columns">
        <section class="logo column">
          <NuxtLink to="/">
            <ModrinthLogoSmall aria-label="modrinth" class="small-logo" />
            <ModrinthLogo aria-label="modrinth" class="text-logo" />
          </NuxtLink>
        </section>
        <section class="menu-icon">
          <button @click="toggleNavBar">
            <IconMenu />
          </button>
        </section>
        <section ref="nav" class="right-group columns">
          <section class="column-grow-5 nav">
            <div class="styled-tabs">
              <NuxtLink to="/mods" class="tab">
                <span>Mods</span>
              </NuxtLink>
              <NuxtLink to="/modpacks" class="tab">
                <span>Modpacks</span>
              </NuxtLink>
            </div>
          </section>
          <section class="column-grow user-outer">
            <section class="user-controls">
              <button class="control-button" @click="changeTheme">
                <IconMoon v-if="$colorMode.value === 'light'" />
                <IconSun v-else />
              </button>
              <nuxt-link to="/notifications" class="control-button">
                <IconBell />
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
                  <IconChevronDown class="dropdown-icon" />
                </button>
                <div class="content">
                  <ul v-if="isDropdownOpen" @click="hideDropdown">
                    <li>
                      <NuxtLink :to="`/user/${$auth.user.username}`">
                        <IconUser />
                        <span>Profile</span>
                      </NuxtLink>
                    </li>
                    <li>
                      <NuxtLink to="/settings">
                        <IconSettings />
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
                        <IconFlag />
                        <span>Moderation</span>
                      </NuxtLink>
                    </li>
                    <hr />
                    <li>
                      <button @click="logout">
                        <IconLogOut />
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
      </section>
    </header>
    <main>
      <AdsCookieConsent />
      <notifications
        group="main"
        position="bottom right"
        :max="5"
        :ignore-duplicates="true"
      />
      <Nuxt />
    </main>
    <footer>
      <div class="logo-info">
        <ModrinthLogo aria-label="modrinth" class="text-logo" />
        <p>
          Modrinth is open source software. You may view the source code at
          <a
            target="_blank"
            href="https://github.com/modrinth/knossos"
            class="text-link"
          >
            our GitHub page</a
          >
        </p>
        <p>modrinth/knossos {{ version }}</p>
        <p>© Guavy LLC</p>
      </div>
      <div class="links">
        <h4>Legal</h4>
        <nuxt-link to="/legal/terms">Terms</nuxt-link>
        <nuxt-link to="/legal/privacy">Privacy</nuxt-link>
        <nuxt-link to="/legal/rules">Content</nuxt-link>
        <a
          target="_blank"
          href="https://github.com/modrinth/knossos/blob/master/LICENSE.md"
        >
          License
        </a>
      </div>
      <div class="links">
        <h4>Resources</h4>
        <a target="_blank" href="https://blog.modrinth.com">Blog</a>
        <a target="_blank" href="https://discord.gg/EUHuJHt">Discord</a>
        <a target="_blank" href="https://github.com/modrinth/knossos">GitHub</a>
        <a target="_blank" href="https://docs.modrinth.com">Docs</a>
      </div>
      <div class="buttons">
        <nuxt-link to="/settings/privacy" class="iconified-button">
          <IconShield />
          Set privacy settings
        </nuxt-link>
        <button class="iconified-button" @click="changeTheme">
          <IconMoon v-if="$colorMode.value === 'light'" />
          <IconSun v-else />
          Change theme
        </button>
      </div>
    </footer>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'

import ModrinthLogo from '~/assets/images/text-logo.svg?inline'
import ModrinthLogoSmall from '~/assets/images/logo.svg?inline'

import GitHubIcon from '~/assets/images/external/github.svg?inline'

export default {
  components: {
    ModrinthLogo,
    ModrinthLogoSmall,
    GitHubIcon,
  },
  directives: {
    ClickOutside,
  },
  data() {
    return {
      isDropdownOpen: false,
      version: process.env.version || 'unknown',
    }
  },
  async fetch() {
    await Promise.all([
      this.$store.dispatch('user/fetchAll', { force: true }),
      this.$store.dispatch('tag/fetchAllTags'),
    ])
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
  beforeCreate() {
    if (this.$route.query.code) {
      this.$router.push(this.$route.path)
    }
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

<style lang="scss">
.layout {
  min-height: 100vh;
  background-color: var(--color-bg);
  display: block;

  @media screen and (min-width: 1024px) {
    min-height: calc(100vh - var(--spacing-card-bg));
  }

  .site-header {
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
    max-width: 100vw;

    @media screen and (min-width: 1024px) {
      border-radius: var(--size-rounded-sm);
      max-width: 1280px;
      margin-left: auto;
      margin-right: auto;
    }

    .navbar {
      margin: 0 0.5rem;
      @media screen and (min-width: 450px) {
        margin: 0 var(--spacing-card-lg);
      }
      section.logo {
        align-items: center;
        display: flex;
        justify-content: space-between;
        color: var(--color-text-dark);
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

      section.menu-icon {
        display: flex;
        margin-left: auto;
        align-items: center;
        margin-right: 1rem;
      }

      section.right-group {
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

        section.nav {
          .styled-tabs {
            display: flex;
            flex-direction: column;

            a {
              margin-left: auto;
              margin-right: auto;
              margin-bottom: 5px;

              &:hover,
              &:focus,
              &.nuxt-link-exact-active,
              &.active-path {
                margin-bottom: 0;
              }
            }
          }
        }

        .user-outer {
          z-index: 20;
        }

        section.user-controls {
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

        section.auth-prompt {
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

        section.menu-icon {
          display: none;
        }

        section.mobile-header-mode-switch {
          display: none;
        }

        section.right-group {
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

          section.user-controls {
            width: unset;
            margin: unset;
          }

          section.auth-prompt {
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
  }

  main {
    grid-area: main;
  }

  footer {
    margin: 6rem 0 2rem 0;
    display: flex;
    flex-wrap: wrap;

    .logo-info {
      margin-left: auto;
      margin-right: 2rem;
      max-width: 22rem;

      .text-logo {
        width: 10rem;
        height: auto;
      }
    }

    .links {
      display: flex;
      flex-direction: column;
      margin-right: 2rem;

      h4 {
        color: var(--color-text-dark);
        margin: 0 0 1rem 0;
      }

      a {
        margin: 0 0 1rem 0;
      }
    }

    .buttons {
      margin-right: auto;

      button,
      a {
        background-color: var(--color-raised-bg);

        margin-bottom: 0.5rem;
        margin-left: auto;

        &:hover,
        &:focus {
          background-color: var(--color-button-bg-hover);
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
