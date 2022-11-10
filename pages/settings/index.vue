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
          @change="changeLayout"
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
          @change="changeLayout"
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
    }
  },
  fetch() {
    this.searchLayout = this.$store.state.cosmetics.searchLayout
    this.projectLayout = this.$store.state.cosmetics.projectLayout
  },
  head: {
    title: 'Display settings - Modrinth',
  },
  methods: {
    async changeLayout() {
      await this.$store.dispatch('cosmetics/save', {
        searchLayout: this.searchLayout,
        projectLayout: this.projectLayout,
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
