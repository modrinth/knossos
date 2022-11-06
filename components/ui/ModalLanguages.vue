<template>
  <Modal :show="isShowing" :header="$t('language-modal.title')" @close="close">
    <template #default>
      <div class="container">
        <div class="contributions-notice">
          <IntlFormatted message-id="language-modal.contribution-notice">
            <template #crowdin-link="{ children }">
              <a href=""><Fragment :of="children" /></a>
            </template>
          </IntlFormatted>
        </div>
        <div class="languages-grid-container">
          <div v-if="automatic" class="automatic-overlay">
            <div class="automatic-overlay-icon">
              <GlobeIcon />
            </div>
            <div class="automatic-overlay-title">
              {{ $t('language-modal.automatic.title') }}
            </div>
            <div class="automatic-overlay-description">
              <IntlFormatted
                message-id="language-modal.automatic.description"
                :values="{ language: currentLanguage.displayName }"
              />
            </div>
            <div class="automatic-overlay-actions">
              <button
                class="iconified-button brand-button"
                @click="disableAutomaticMode"
              >
                {{ $t('language-modal.automatic.action') }}
              </button>
            </div>
          </div>
          <div
            class="languages-grid-wrap"
            :tabindex="automatic ? -1 : undefined"
            :class="{ 'blur-out': automatic }"
          >
            <input
              type="search"
              name="search"
              v-model="searchQuery"
              :placeholder="$t('language-modal.search-field.placeholder')"
              :disabled="automatic"
            />
            <div class="languages-grid" :class="{ empty }">
              <div
                v-for="language in matchingLanguages"
                class="language"
                :class="{ active: selectedLanguage === language.code }"
                :key="language.code"
                :ref="
                  selectedLanguage === language.code
                    ? 'highlightedLanguageEl'
                    : undefined
                "
              >
                <input
                  type="radio"
                  name="language"
                  :value="language.code"
                  :id="language.inputID"
                  :ref="language.inputID"
                  v-model="selectedLanguage"
                  class="sr-only"
                  :disabled="automatic"
                />
                <div class="language-info">
                  <label :for="language.inputID" class="language-label">
                    <div class="display-name">
                      {{ language.displayName }}
                    </div>
                    <span
                      v-if="isBrowserLanguage(language)"
                      v-tooltip="
                        $t('language-modal.language.browser-preferred')
                      "
                      class="browser-locale"
                    >
                      <GlobeIcon />
                    </span>
                    <span
                      v-if="isCurrentlyUsed(language)"
                      v-tooltip="$t('language-modal.language.currently-used')"
                      class="current-locale"
                    >
                      <Check />
                    </span>
                  </label>
                  <div class="translated-name">
                    {{ language.translatedName }}
                  </div>
                </div>
              </div>
              <div
                v-if="!empty && matchingLanguages.length < 4"
                class="language spacer"
              />
              <div
                v-if="!empty && matchingLanguages.length < 3"
                class="language spacer"
              />
              <div
                v-if="!empty && matchingLanguages.length < 2"
                class="language spacer"
              />
              <div v-if="empty" class="placeholder">
                {{ $t('language-modal.no-results') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="action-tray">
        <div class="left">
          <button
            class="iconified-button"
            @click="enableAutomatic"
            :disabled="automatic"
          >
            {{ $t('language-modal.action.enable-automatic') }}
          </button>
        </div>
        <div class="right">
          <button
            type="button"
            class="iconified-button brand-button"
            @click="applyChanges"
            :disabled="!canBeSaved"
          >
            {{ $t('generic.action.save') }}
          </button>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script>
// @ts-check
import Vue from 'vue'
import Fuse from 'fuse.js/dist/fuse.basic'
import Modal from './Modal.vue'
import GlobeIcon from '~/assets/images/utils/globe.svg?inline'
import Check from '~/assets/images/utils/check.svg?inline'

const englishDisplayNames = new Intl.DisplayNames('en', { type: 'language' })

/**
 * @typedef {object} LanguageProps
 * @property {string} inputID Unique identifier for the input element to link it
 *   and its label together.
 * @property {string} displayName Language displayed in that language.
 * @property {string} translatedName Language name translated to the current
 *   language.
 * @property {string} englishName Language name in English.
 */

/**
 * @typedef {import('~/modules/i18n/templates/types').LocaleDescriptor &
 *   LanguageProps} Language
 */

/** @typedef {Language[]} LanguagesIndex */

/** @this {Vue} */
function initialState() {
  return {
    /** Currently selected locale. */
    manuallySelectedLanguage: this.$i18n.locale,
    /** Holds value for the current search query. */
    typedSearchQuery: '',
  }
}

export default Vue.extend({
  name: 'ModalLanguages',
  components: {
    Modal,
    GlobeIcon,
    Check,
  },
  data() {
    return initialState.call(this)
  },
  computed: {
    /**
     * @returns {boolean} Whether the modal is showing based on the global
     *   state.
     */
    isShowing() {
      return this.$store.getters['i18n/isLanguageModalShowing']
    },
    /** @returns {boolean} */
    automatic() {
      return this.$i18n.automatic
    },
    /** Current search query or empty string (`''`) if automatic mode is enabled. */
    searchQuery: {
      /**
       * @returns {string} Current search query or `''` if automatic mode is
       *   enabled.
       */
      get() {
        if (this.automatic) {
          return ''
        }

        return this.typedSearchQuery
      },
      /** @param {string} value New search query. */
      set(value) {
        this.typedSearchQuery = value
      },
    },
    selectedLanguage: {
      /** @returns {string} Either automatic locale or selected locale. */
      get() {
        return this.automatic
          ? this.$i18n.locale
          : this.manuallySelectedLanguage
      },
      /** @param {string} value New locale. */
      set(value) {
        this.manuallySelectedLanguage = value
      },
    },
    /** @returns {LanguagesIndex} */
    languages() {
      return this.$i18n.availableLocales.map((locale) => {
        const { baseName: safeLocaleCode } = new Intl.Locale(locale.code)

        /** @type {string | undefined} */
        let displayName = locale.data?.displayName

        if (displayName == null) {
          try {
            displayName = new Intl.DisplayNames(safeLocaleCode, {
              type: 'language',
            }).of(safeLocaleCode)
          } catch (err) {
            console.warn(
              `Cannot compute display name for locale "${locale.code}"!`
            )
          }
        }

        if (displayName == null) {
          // You gotta display something, ey?
          displayName = locale.code
        }

        /** @type {string | undefined} */
        let translatedName

        try {
          translatedName = this.$fmt.displayName(safeLocaleCode, {
            type: 'language',
            style: 'short',
          })
        } catch (err) {
          console.warn(
            `Cannot compute translated name for locale "${locale.code}"`
          )
        }

        if (translatedName == null) {
          translatedName = locale.code
        }

        return /** @type {Language} */ ({
          ...locale,
          inputID: `language-${locale.code}`,
          displayName,
          translatedName,
          englishName: englishDisplayNames.of(safeLocaleCode), // FIXME: we should pre-compute English name using English locale somehow
        })
      })
    },
    /**
     * Fuse search instance.
     *
     * @returns {import('fuse.js/dist/fuse').default<LanguagesIndex[0]>}
     */
    fuse() {
      return new Fuse(this.languages, {
        keys: ['code', 'displayName', 'translatedName', 'englishName'],
        threshold: 0.3,
        distance: 5,
      })
    },
    /**
     * All languages that match the search query sorted by relevance. If search
     * query is empty, then this returns all available languages sorted by their
     * display names instead.
     *
     * @returns {LanguagesIndex}
     */
    matchingLanguages() {
      if (this.searchQuery.trim() === '') {
        return [...this.languages].sort((a, b) =>
          a.displayName.localeCompare(b.displayName)
        )
      }

      const result = this.fuse.search(this.searchQuery)
      console.log(result)
      return result.map((_) => _.item)
    },
    /** @returns {boolean} Whether there are no search results. */
    empty() {
      return this.matchingLanguages.length === 0
    },
    /** @returns {Language} */
    currentLanguage() {
      // voiding the typescript check since we (probably) can be sure that the language will be found
      return /** @type {Language} */ (
        this.languages.find((language) => language.code === this.$i18n.locale)
      )
    },
    /**
     * @returns {boolean} Whether there are any changes that can be saved, will
     *   also return `false` if automatic mode is enabled.
     */
    canBeSaved() {
      return !this.automatic && this.$i18n.locale !== this.selectedLanguage
    },
  },
  methods: {
    applyChanges() {
      return this.$i18n.changeLocale(this.selectedLanguage)
    },
    /**
     * @param {Language} language Language to check.
     * @returns {boolean} Whether the locale is browser preferred locale.
     */
    isBrowserLanguage(language) {
      return language.code === this.$i18n.browserLocale
    },
    /**
     * @param {Language} language Language to check.
     * @returns {boolean} Whether the language is currently used.
     */
    isCurrentlyUsed(language) {
      return language.code === this.$i18n.locale
    },
    /**
     * Checks whether the language has a special classes on its row and if so,
     * returns it.
     *
     * @param {Language} language Language to check for special classes.
     * @returns {Record<string, boolean> | undefined} Special classes to use.
     */
    specialLanguageClasses(language) {
      switch (language.code) {
        case 'en-x-updown':
          return { 'upside-down': true }
        case 'en-x-uwu':
          return { uwuify: true }
        default:
          return undefined
      }
    },
    /** Closes the modal by dispatching an action on the global state. */
    close() {
      this.$store.dispatch('i18n/toggleLanguageModal', false)
    },
    /** Turns on automatic mode. */
    enableAutomatic() {
      return this.$i18n.changeLocale('auto')
    },
    /** Turns off automatic mode. */
    disableAutomaticMode() {
      return this.$i18n.changeLocale(this.$i18n.locale)
    },
    /** Resets everything to default state. */
    reset() {
      Object.assign(this.$data, initialState.call(this))
    },
  },
  watch: {
    isShowing(isShowing, wasShowing) {
      if (isShowing && !wasShowing) {
        this.reset()

        Vue.nextTick(() => {
          const el = /** @type {HTMLDivElement[]} */ (
            this.$refs.highlightedLanguageEl
          )[0]

          if (el != null) {
            el.scrollIntoView({
              behavior: 'auto',
              block: 'center',
            })
          }
        })
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.container {
  position: relative;
}

.contributions-notice {
  padding: var(--spacing-card-bg);
  background: #cce4ff;
  box-shadow: var(--shadow-raised), var(--shadow-inset);
  border-radius: var(--size-rounded-card);
  margin: var(--spacing-card-md);
  margin-top: var(--spacing-card-sm);

  .dark-mode &,
  .oled-mode & {
    background: #2a4a6f;
    color: var(--color-text-dark);
  }

  a {
    color: #005fcc;

    .dark-mode &,
    .oled-mode & {
      color: #b8d7f9;
    }

    &:hover {
      text-decoration: underline;
    }
  }
}

.languages-grid-container {
  position: relative; // for overlay

  border-radius: 5px;
  overflow: hidden;
  padding: var(--spacing-card-md);
  padding-bottom: 0;

  input[type='search'] {
    width: 100%;
    margin: unset;
    margin-top: -5px;
    margin-bottom: 10px;
  }
}

.automatic-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  background: rgba(255, 255, 255, 0.8);

  html.dark-mode & {
    background: rgba(38, 41, 47, 0.9);
  }

  html.oled-mode & {
    background: rgba(0, 0, 0, 0.7);
  }

  z-index: 2;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  border-radius: 4.9px; // precision because we're duplicating the rounding

  row-gap: 15px;

  padding: 10px; // some space when very limited by space

  &:first-child {
    margin-top: -1rem;
  }

  &-icon {
    display: flex;
    font-size: 5rem;
  }

  &-title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-heading);
  }

  &-icon,
  &-title {
    color: black;

    html.dark-mode &,
    html.oled-mode & {
      color: white;
    }
  }

  &-title,
  &-description {
    text-align: center;
  }

  &-description {
    white-space: pre-line;
    max-width: 400px;

    html.dark-mode &,
    html.oled-mode & {
      color: #dbdbdb;
    }
  }
}

.languages-grid-wrap {
  &.blur-out {
    filter: blur(2px);
  }
}

.languages-grid {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  align-content: flex-start;

  @media (max-width: 585px) {
    justify-content: stretch;
  }

  height: 300px;

  max-width: 645px;

  gap: 5px;

  overflow-y: auto;

  overscroll-behavior: none;

  scrollbar-gutter: stable;

  margin-bottom: 1px; // don't you love CSS?

  &.empty {
    scrollbar-gutter: auto;
    justify-content: center;
    align-content: center;
  }

  .language {
    display: flex;

    min-width: 180px;
    width: 180px;

    @media (max-width: 585px) {
      width: 100%;
    }

    background: hsl(0deg 0% 95%);

    html.dark-mode & {
      background: rgba(0, 0, 0, 0.25);
    }

    html.oled-mode & {
      background: rgba(255, 255, 255, 0.07);
    }

    padding: 10px;

    position: relative;

    border: 2px solid transparent;
    border-radius: var(--size-rounded-control);

    transition: filter 0.2s ease-in-out, transform 0.05s ease-out,
      outline 0.2s ease-in-out;

    isolation: isolate; // avoid z-index mess

    &:active {
      transform: scale(0.96);
      filter: brightness(0.9);
    }

    &.active {
      background: var(--color-brand-light);
      border-color: var(--color-brand-active);

      html.dark-mode &,
      html.oled-mode & {
        background: hsl(155deg 54% 20%);
        border-color: hsl(153deg 89% 35%);
      }
    }

    .language-info {
      overflow: hidden;

      label {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        column-gap: 5px;
        align-items: center;

        color: var(--color-text);

        &[for='language-en-x-updown'] {
          div.display-name {
            transform: rotate(180deg);
          }
        }

        div {
          flex: unset;
        }

        span {
          // unset any nonsense by global styles
          flex: unset;
          padding-right: unset;
          display: flex;
        }

        span.browser-locale {
          z-index: 1;
          justify-self: flex-start;
        }

        span.current-locale {
          z-index: 1;
        }
      }

      .display-name {
        font-weight: bold;
      }

      .translated-name {
        font-size: var(--font-size-sm);
        color: rgba(0, 0, 0, 0.7);

        html.dark-mode & {
          color: rgba(255, 255, 255, 0.5);
        }

        html.oled-mode & {
          color: rgb(176, 186, 197, 0.5);
        }
      }

      .display-name,
      .translated-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .spacer {
    visibility: hidden;
  }

  .placeholder {
    text-align: center;
    width: 100vw; // set to something absurd so it stretches the whole grid
  }
}

.language-label {
  cursor: pointer;

  &::after {
    content: '';
    // pseudo can be of any size so we just need to attach it to all sides
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}

.action-tray {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-card-md);
}
</style>
