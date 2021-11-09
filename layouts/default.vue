<template>
  <div class="layout">
    <AppHeader class="layout__header" />
    <main>
      <CookieConsent />
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
          <ShieldIcon />
          Set privacy settings
        </nuxt-link>
        <button class="iconified-button" @click="changeTheme">
          <MoonIcon v-if="$colorMode.value === 'light'" />
          <SunIcon v-else />
          Change theme
        </button>
      </div>
    </footer>
  </div>
</template>

<script>
import ModrinthLogo from '~/assets/images/text-logo.svg?inline'

import ShieldIcon from '~/assets/images/utils/shield.svg?inline'
import MoonIcon from '~/assets/images/utils/moon.svg?inline'
import SunIcon from '~/assets/images/utils/sun.svg?inline'

import CookieConsent from '~/components/ads/CookieConsent'

export default {
  components: {
    ModrinthLogo,
    MoonIcon,
    SunIcon,
    CookieConsent,
    ShieldIcon,
  },
  data() {
    return {
      version: process.env.version || 'unknown',
    }
  },
  async fetch() {
    await Promise.all([
      this.$store.dispatch('user/fetchAll', { force: true }),
      this.$store.dispatch('tag/fetchAllTags'),
    ])
  },
  watch: {
    $route() {
      this.$store.dispatch('user/fetchAll')
    },
  },
  beforeCreate() {
    if (this.$route.query.code) {
      this.$router.push(this.$route.path)
    }
  },
  methods: {
    changeTheme() {
      this.$colorMode.preference =
        this.$colorMode.value === 'dark' ? 'light' : 'dark'
    },
  },
}
</script>

<style lang="scss">
.layout__header {
  margin: 0 auto;
  max-width: 80rem;
}

.layout {
  min-height: 100vh;
  background-color: var(--color-bg);
  display: block;

  @media screen and (min-width: 1024px) {
    min-height: calc(100vh - var(--spacing-card-bg));
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
