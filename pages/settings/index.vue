<template>
  <div>
    <MessageBanner v-if="cosmetics.developerMode" message-type="warning" class="developer-message">
      <CodeIcon /> <strong>Developer mode</strong> is active. This will allow you to view the
      internal IDs of various things throughout Modrinth that may be helpful if you're a developer
      using the Modrinth API. Click on the Modrinth logo at the bottom of the page 5 times to toggle
      developer mode.
      <Button :action="() => disableDeveloperMode()"> Deactivate developer mode </Button>
    </MessageBanner>
    <section class="universal-card">
      <h2>Color theme</h2>
      <div class="theme-options">
        <button
          v-for="option in options"
          :key="option"
          class="theme-option button-base"
          :class="{ selected: theme.preference === option }"
          @click="() => updateColorTheme(option)"
        >
          <div class="preview" :class="`${option === 'system' ? systemTheme : option}-mode`">
            <div class="example-card card card">
              <div class="example-icon"></div>
              <div class="example-text-1"></div>
              <div class="example-text-2"></div>
            </div>
          </div>
          <div class="label">
            <RadioButtonChecked v-if="theme.preference === option" class="radio" />
            <RadioButtonIcon v-else class="radio" />
            {{ formatOption(option) }}
          </div>
        </button>
      </div>
    </section>
    <section class="universal-card">
      <h2>Sidebar mode</h2>
      <div class="adjacent-input small">
        <label for="search-layout-toggle">
          <span class="label__title">Search sidebar on the right</span>
          <span class="label__description">
            Enabling this will put the search page's filters sidebar on the right side.
          </span>
        </label>
        <input
          id="search-layout-toggle"
          v-model="cosmetics.searchLayout"
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
          v-model="cosmetics.projectLayout"
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
          v-model="cosmetics.searchDisplayMode[projectType.id]"
          :options="tags.projectViewModes"
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
          v-model="cosmetics.advancedRendering"
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
          v-model="cosmetics.externalLinksNewTab"
          class="switch stylized-toggle"
          type="checkbox"
          @change="saveCosmetics"
        />
      </div>
      <div class="adjacent-input small">
        <label for="modrinth-app-promos">
          <span class="label__title">Hide Modrinth App promotions</span>
          <span class="label__description">
            Hides the "Get Modrinth App" buttons from primary navigation. The Modrinth App page can
            still be found on the landing page or in the footer.
          </span>
        </label>
        <input
          id="modrinth-app-promos"
          v-model="cosmetics.hideModrinthAppPromos"
          class="switch stylized-toggle"
          type="checkbox"
          @change="saveCosmetics"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { Multiselect } from 'vue-multiselect'
import { CodeIcon, Button, RadioButtonIcon, RadioButtonChecked } from 'omorphia'
import { formatProjectType } from '~/plugins/shorthands.js'
import MessageBanner from '~/components/ui/MessageBanner.vue'

useHead({
  title: 'Display settings - Modrinth',
})

const cosmetics = useCosmetics()
const tags = useTags()

const systemTheme = ref('light')

const theme = useTheme()

const options = computed(() => {
  const options = ['system', 'light', 'dark', 'oled']
  if (cosmetics.value.developerMode || theme.value.preference === 'retro') {
    options.push('retro')
  }
  return options
})

function formatOption(value) {
  if (value === 'oled') {
    return 'OLED'
  } else if (value === 'system') {
    return 'Sync with system'
  }
  return value.charAt(0).toUpperCase() + value.slice(1)
}

onMounted(() => {
  const colorSchemeQueryList = window.matchMedia('(prefers-color-scheme: light)')
  if (colorSchemeQueryList.matches) {
    systemTheme.value = 'light'
  } else {
    systemTheme.value = 'dark'
  }
})

function updateColorTheme(value) {
  if (['dark', 'oled', 'retro'].includes(value)) {
    cosmetics.value.preferredDarkTheme = value
    saveCosmetics()
  }
  updateTheme(value, true)
}

function disableDeveloperMode() {
  cosmetics.value.developerMode = !cosmetics.value.developerMode
  saveCosmetics()
  addNotification({
    group: 'main',
    title: 'Developer mode deactivated',
    text: 'Developer mode has been disabled',
    type: 'success',
  })
}

const listTypes = computed(() => {
  const types = tags.value.projectTypes.map((type) => {
    return {
      id: type.id,
      name: formatProjectType(type.id) + ' search',
      display: 'the ' + formatProjectType(type.id).toLowerCase() + 's search page',
    }
  })
  types.push({
    id: 'user',
    name: 'User page',
    display: 'user pages',
  })
  return types
})
</script>
<style scoped lang="scss">
.theme-options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--gap-lg);
}
.theme-option {
  width: 100%;
  border-radius: var(--radius-md);
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--color-divider);
  background-color: var(--color-button-bg);
  color: var(--color-base);

  &.selected {
    color: var(--color-contrast);

    .label svg {
      color: var(--color-brand);
    }
  }

  .preview {
    background-color: var(--color-bg);
    padding: 1.5rem;

    .example-card {
      margin: 0;
      padding: 1rem;
      display: grid;
      grid-template: 'icon text1' 'icon text2';
      grid-template-columns: auto 1fr;
      gap: 0.5rem;

      .example-icon {
        grid-area: icon;
        width: 2rem;
        height: 2rem;
        background-color: var(--color-button-bg);
        border-radius: var(--radius-sm);
      }

      .example-text-1,
      .example-text-2 {
        height: 0.5rem;
        border-radius: var(--radius-sm);
      }

      .example-text-1 {
        grid-area: text1;
        width: 100%;
        background-color: var(--color-base);
      }

      .example-text-2 {
        grid-area: text2;
        width: 60%;
        background-color: var(--color-secondary);
      }
    }
  }

  .label {
    display: flex;
    align-items: center;
    padding: var(--gap-md) var(--gap-lg);

    svg {
      margin-right: 0.5rem;
    }
  }
}

.developer-message {
  svg {
    vertical-align: middle;
    margin-bottom: 2px;
  }

  .btn {
    margin-top: var(--gap-sm);
  }
}
</style>
