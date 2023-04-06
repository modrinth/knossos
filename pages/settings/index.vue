<template>
  <div>
    <section class="universal-card">
      <h2>Themes</h2>
      <div class="label">
        <span class="label__title">Color theme</span>
        <span class="label__description">Change the global site color theme.</span>
      </div>
      <div class="color-theme-selector">
        <div
          v-for="theme of themes"
          :key="theme"
          class="color-theme-option"
          :class="{
            selected: theme === $colorMode.preference,
          }"
        >
          <input
            :id="`color-theme-option-${theme}`"
            v-model="$colorMode.preference"
            type="radio"
            name="color-theme-selector"
            :value="theme"
            @click="
              () => {
                if (theme === $colorMode.preference) {
                  counter++
                } else {
                  counter = 0
                }
                if (counter === 69) {
                  updateTheme(`square-${theme}`, false)
                  $colorMode.preference = `square-${theme}`
                  counter = 0
                }
              }
            "
            @update:model-value="
              (value) => {
                if (['dark', 'oled'].includes(value)) {
                  $cosmetics.preferredDarkTheme = value
                }
                updateTheme(value, true)
              }
            "
          />
          <label
            :for="`color-theme-option-${theme}`"
            :class="`${theme}-mode`"
            class="iconified-button"
          >
            <div class="indicator"><CheckIcon /></div>
            <div class="preview universal-card">
              {{
                (theme.charAt(0).toUpperCase() + theme.slice(1))
                  .replace('-', ' ')
                  .replace('Oled', 'OLED')
              }}
            </div>
          </label>
        </div>
      </div>

      <div class="adjacent-input small">
        <label for="search-layout-toggle">
          <span class="label__title">Search sidebar on the right</span>
          <span class="label__description"
            >Enabling this will put the search page's filters sidebar on the right side.</span
          >
        </label>
        <input
          id="search-layout-toggle"
          v-model="$cosmetics.searchLayout"
          class="switch stylized-toggle"
          type="checkbox"
          @change="saveCosmetics"
        />
      </div>
      <div class="adjacent-input small">
        <label for="project-layout-toggle">
          <span class="label__title">Project sidebar on the right</span>
          <span class="label__description"
            >Enabling this will put the project pages' info sidebars on the right side.</span
          >
        </label>
        <input
          id="project-layout-toggle"
          v-model="$cosmetics.projectLayout"
          class="switch stylized-toggle"
          type="checkbox"
          @change="saveCosmetics"
        />
      </div>
    </section>
    <section class="universal-card">
      <h2>Project list display mode</h2>
      <div
        v-for="projectType in listTypes"
        :key="projectType.id + '-display-mode-selector'"
        class="adjacent-input"
      >
        <label :for="projectType.id + '-search-display-mode'">
          <span class="label__title">{{ projectType.name }} display mode</span>
          <span class="label__description"
            >Change the display view for {{ projectType.display }}.</span
          >
        </label>
        <Multiselect
          :id="projectType + '-search-display-mode'"
          v-model="$cosmetics.searchDisplayMode[projectType.id]"
          :options="$tag.projectViewModes"
          :custom-label="$capitalizeString"
          :searchable="false"
          :close-on-select="true"
          :show-labels="false"
          :allow-empty="false"
          @update:model-value="saveCosmetics"
        />
      </div>
    </section>
    <section class="universal-card">
      <h2>Feature flags</h2>
      <div class="adjacent-input small">
        <label for="advanced-rendering">
          <span class="label__title">Advanced rendering</span>
          <span class="label__description"
            >Enables advanced rendering such as blur effects that may cause performance issues
            without hardware-accelerated rendering.</span
          >
        </label>
        <input
          id="advanced-rendering"
          v-model="$cosmetics.advancedRendering"
          class="switch stylized-toggle"
          type="checkbox"
          @change="saveCosmetics"
        />
      </div>
      <div class="adjacent-input small">
        <label for="modpacks-alpha-notice">
          <span class="label__title">Modpacks alpha notice</span>
          <span class="label__description">Shows a banner stating that modpacks are in alpha.</span>
        </label>
        <input
          id="modpacks-alpha-notice"
          v-model="$cosmetics.modpacksAlphaNotice"
          class="switch stylized-toggle"
          type="checkbox"
          @change="saveCosmetics"
        />
      </div>
      <div class="adjacent-input small">
        <label for="external-links-new-tab">
          <span class="label__title">Open external links in new tab</span>
          <span class="label__description">
            Make links which go outside of Modrinth open in a new tab. No matter this setting, links
            on the same domain and in Markdown descriptions will open in the same tab, and links on
            ads and edit pages will open in a new tab.
          </span>
        </label>
        <input
          id="external-links-new-tab"
          v-model="$cosmetics.externalLinksNewTab"
          class="switch stylized-toggle"
          type="checkbox"
          @change="saveCosmetics"
        />
      </div>
    </section>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import CheckIcon from '~/assets/images/utils/check.svg'

export default defineNuxtComponent({
  components: {
    Multiselect,
    CheckIcon,
  },
  data() {
    return {
      searchDisplayMode: this.$cosmetics.searchDisplayMode,
      counter: 0,
    }
  },
  head: {
    title: 'Display settings - Modrinth',
  },
  computed: {
    listTypes() {
      const types = this.$tag.projectTypes.map((type) => {
        return {
          id: type.id,
          name: this.$formatProjectType(type.id) + ' search',
          display: 'the ' + this.$formatProjectType(type.id).toLowerCase() + 's search page',
        }
      })
      types.push({
        id: 'user',
        name: 'User page',
        display: 'user pages',
      })
      return types
    },
    themes() {
      const modes = ['light', 'dark', 'oled']
      if (!modes.includes(this.$colorMode.preference)) {
        modes.push(this.$colorMode.preference)
      }
      return modes
    },
  },
})
</script>
<style lang="scss" scoped>
.color-theme-selector {
  --_border-color: var(--color-bg);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: var(--spacing-card-sm);
  margin-bottom: calc(var(--spacing-card-md) + var(--spacing-card-sm));

  .color-theme-option {
    display: contents;
    input {
      appearance: none;
      position: absolute;
      width: 0;
      height: 0;
      outline: none;
      box-shadow: none;
    }
    label {
      display: flex;
      gap: var(--spacing-card-md);
      padding: var(--spacing-card-lg);
      outline: 2px solid transparent;
      width: unset;
      align-items: center;

      .indicator {
        display: flex;
        width: 2rem;
        height: 2rem;
        color: var(--color-button-text-active);
        background-color: var(--color-raised-bg);
        border: 2px solid var(--color-divider-dark);
        border-radius: 50%;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        svg {
          width: 1.25rem;
          height: 1.25rem;
          stroke-width: 3px;
          margin: 0;
          opacity: 0;
        }
      }

      .preview {
        padding: var(--spacing-card-lg);
        min-width: 2rem;
        min-height: unset;
        border-radius: 1rem;
        flex-grow: 1;
        background-color: var(--color-raised-bg);
        color: var(--color-text);
        font-weight: bold;
        margin: 0;
      }
    }

    &.selected label {
      .indicator {
        color: var(--color-button-text-active);
        background-color: var(--color-brand-highlight);
        border-color: var(--color-brand);

        svg {
          opacity: 1;
        }
      }
    }
  }
}
</style>
