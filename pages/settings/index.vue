<template>
  <div>
    <section id="display-settings" class="universal-card">
      <h2>Display settings</h2>
      <div class="adjacent-input">
        <label for="theme-selector">
          <span class="label__title">Theme</span>
          <span class="label__description">Change the global site theme.</span>
        </label>
        <Multiselect
          id="theme-selector"
          v-model="$colorMode.preference"
          :options="['system', 'light', 'dark', 'oled']"
          :custom-label="
            (value) =>
              value === 'oled'
                ? 'OLED'
                : value.charAt(0).toUpperCase() + value.slice(1)
          "
          :searchable="false"
          :close-on-select="true"
          :show-labels="false"
          :allow-empty="false"
        />
      </div>

      <div class="adjacent-input small">
        <label for="search-layout-toggle">
          <span class="label__title">Search sidebar on the right</span>
          <span class="label__description"
            >Enabling this will put the search page's filters sidebar on the
            right side.</span
          >
        </label>
        <input
          id="search-layout-toggle"
          v-model="searchLayout"
          class="switch stylized-toggle"
          type="checkbox"
          @change="saveCosmeticSettings"
        />
      </div>
      <div class="adjacent-input small">
        <label for="project-layout-toggle">
          <span class="label__title">Project sidebar on the right</span>
          <span class="label__description"
            >Enabling this will put the project pages' info sidebars on the
            right side.</span
          >
        </label>
        <input
          id="project-layout-toggle"
          v-model="projectLayout"
          class="switch stylized-toggle"
          type="checkbox"
          @change="saveCosmeticSettings"
        />
      </div>
    </section>
    <section id="warning-notices" class="universal-card">
      <h2>Warning notices</h2>
      <div class="adjacent-input small">
        <label for="modpacks-alpha-notice">
          <span class="label__title">Modpacks alpha notice</span>
          <span class="label__description"
            >Shows a banner stating that modpacks are in alpha.</span
          >
        </label>
        <input
          id="modpacks-alpha-notice"
          v-model="modpacksAlphaNotice"
          class="switch stylized-toggle"
          type="checkbox"
          @change="saveCosmeticSettings"
        />
      </div>
    </section>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  components: {
    Multiselect,
  },
  data() {
    return {
      searchLayout: false,
      projectLayout: false,
      modpacksAlphaNotice: true,
    }
  },
  fetch() {
    this.searchLayout =
      this.$store.state.cosmetics.searchLayout ?? this.searchLayout
    this.projectLayout =
      this.$store.state.cosmetics.projectLayout ?? this.projectLayout
    this.modpacksAlphaNotice =
      this.$store.state.cosmetics.modpacksAlphaNotice ??
      this.modpacksAlphaNotice
  },
  head: {
    title: 'Display settings - Modrinth',
  },
  methods: {
    async saveCosmeticSettings() {
      await this.$store.dispatch('cosmetics/save', {
        searchLayout: this.searchLayout,
        projectLayout: this.projectLayout,
        modpacksAlphaNotice: this.modpacksAlphaNotice,
        $cookies: this.$cookies,
      })
    },
    changeTheme() {
      const shift = event.shiftKey
      switch (this.$colorMode.preference) {
        case 'dark':
          this.$colorMode.preference = shift ? 'light' : 'oled'
          break
        case 'oled':
          this.$colorMode.preference = shift ? 'dark' : 'light'
          break
        default:
          this.$colorMode.preference = shift ? 'oled' : 'dark'
      }
    },
  },
}
</script>
<style lang="scss" scoped></style>
