<script setup lang="ts">
import Fuse from 'fuse.js/dist/fuse.basic'
import RadioButtonIcon from '~/assets/images/utils/radio-button.svg'
import RadioButtonCheckedIcon from '~/assets/images/utils/radio-button-checked.svg'
import WarningIcon from '~/assets/images/utils/issues.svg'

const vintl = useVIntl()
const { formatMessage } = vintl

const messages = defineMessages({
  languagesTitle: {
    id: 'settings.language.title',
    defaultMessage: 'Language',
  },
  languagesDescription: {
    id: 'settings.language.description',
    defaultMessage:
      'Choose your preferred language for the site. Translations are contributed by volunteers <crowdin-link>on Crowdin</crowdin-link>.',
  },
  automaticLocale: {
    id: 'settings.language.languages.automatic',
    defaultMessage: 'Sync with the system language',
  },
  noResults: {
    id: 'settings.language.languages.search.no-results',
    defaultMessage: 'No languages match your search.',
  },
  searchFieldDescription: {
    id: 'settings.language.languages.search-field.description',
    defaultMessage: 'Submit to focus the first search result',
  },
  searchFieldPlaceholder: {
    id: 'settings.language.languages.search-field.placeholder',
    defaultMessage: 'Search for a language...',
  },
  searchResultsAnnouncement: {
    id: 'settings.language.languages.search-results-announcement',
    defaultMessage:
      '{matches, plural, =0 {No languages match} one {# language matches} other {# languages match}} your search.',
  },
  contributionNotice: {
    id: 'settings.language.languages.contribution-notice',
    defaultMessage:
      'Modrinth is translated by volunteers. <crowdin-link>You can contribute!</crowdin-link>',
  },
  loadFailed: {
    id: 'settings.language.languages.load-failed',
    defaultMessage: 'Cannot load this language. Try again in a bit.',
  },
})

const categoryNames = defineMessages({
  auto: {
    id: 'settings.language.categories.auto',
    defaultMessage: 'Automatic',
  },
  default: {
    id: 'settings.language.categories.default',
    defaultMessage: 'Standard languages',
  },
  fun: {
    id: 'settings.language.categories.fun',
    defaultMessage: 'Fun languages',
  },
  experimental: {
    id: 'settings.language.categories.experimental',
    defaultMessage: 'Experimental languages',
  },
  searchResult: {
    id: 'settings.language.categories.search-result',
    defaultMessage: 'Search results',
  },
})

type Category = keyof typeof categoryNames

const categoryOrder: Category[] = ['auto', 'default', 'fun', 'experimental']

const $defaultNames = useDisplayNames(() => vintl.defaultLocale)

const $translatedNames = useDisplayNames(() => vintl.locale)

type LocaleBase = {
  category: Category
  tag: string
  searchTerms?: string[]
}

type AutomaticLocale = LocaleBase & {
  auto: true
}

type CommonLocale = LocaleBase & {
  auto?: never
  displayName: string
  defaultName: string
  translatedName: string
}

type Locale = AutomaticLocale | CommonLocale

function normalizeCategoryName(name?: string): keyof typeof categoryNames {
  switch (name) {
    case 'auto':
    case 'fun':
    case 'experimental':
      return name
    default:
      return 'default'
  }
}

const $searchQuery = ref('')

const $search = computed(
  () =>
    new Fuse($locales.value, {
      keys: ['tag', 'displayName', 'translatedName', 'englishName', 'searchTerms'],
      threshold: 0.4,
      distance: 100,
    })
)

const $locales = computed(() => {
  const locales: Locale[] = []

  locales.push({
    auto: true,
    tag: 'auto',
    category: 'auto',
    searchTerms: [
      'automatic',
      'Sync with the system language',
      formatMessage(messages.automaticLocale),
    ],
  })

  for (const locale of vintl.availableLocales) {
    let displayName = locale.meta?.displayName

    if (displayName == null) {
      displayName = createDisplayNames(locale.tag).of(locale.tag) ?? locale.tag
    }

    let defaultName = vintl.defaultResources['languages.json']?.[locale.tag]

    if (defaultName == null) {
      defaultName = $defaultNames.value.of(locale.tag) ?? locale.tag
    }

    let translatedName = vintl.resources['languages.json']?.[locale.tag]

    if (translatedName == null) {
      translatedName = $translatedNames.value.of(locale.tag) ?? locale.tag
    }

    let searchTerms = locale.meta?.searchTerms
    if (searchTerms === '-') searchTerms = undefined

    locales.push({
      tag: locale.tag,
      category: normalizeCategoryName(locale.meta?.category),
      displayName,
      defaultName,
      translatedName,
      searchTerms: searchTerms?.split('\n'),
    })
  }

  return locales
})

const $categories = computed(() => {
  const categories = new Map<Category, Locale[]>()

  for (const category of categoryOrder) categories.set(category, [])

  for (const locale of $locales.value) {
    let categoryLocales = categories.get(locale.category)

    if (categoryLocales == null) {
      categoryLocales = []
      categories.set(locale.category, categoryLocales)
    }

    categoryLocales.push(locale)
  }

  for (const categoryKey of [...categories.keys()]) {
    if (categories.get(categoryKey)?.length === 0 ?? false) {
      categories.delete(categoryKey)
    }
  }

  return categories
})

const $searchResults = computed(() => {
  return new Map<Category, Locale[]>([
    [
      'searchResult',
      $searchQuery.value.trim().length === 0
        ? []
        : $search.value.search($searchQuery.value).map(({ item }) => item),
    ],
  ])
})

const $displayCategories = computed(() =>
  $searchQuery.value.trim().length === 0 ? $categories.value : $searchResults.value
)

const $changingTo = ref<string | undefined>()
const $failedLocale = ref<string>()

const $activeLocale = computed({
  get() {
    if ($changingTo.value != null) {
      return $changingTo.value
    }

    return vintl.automatic ? 'auto' : vintl.locale
  },
  set(value) {
    $changingTo.value = value
    ;(async () => {
      try {
        await vintl.changeLocale(value)
        $failedLocale.value = undefined
      } catch (err) {
        $failedLocale.value = value
      } finally {
        $changingTo.value = undefined
      }
    })()
  },
})

const $languagesList = ref<HTMLDivElement | undefined>()
const $noResultsPlaceholder = ref<HTMLDivElement[]>([])

function onSearchSubmit(e: KeyboardEvent) {
  if (e.key !== 'Enter' || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return
  ;($languagesList.value?.querySelector('input') ?? $noResultsPlaceholder.value[0])?.focus()
}
</script>

<template>
  <div>
    <section class="universal-card">
      <h2>{{ formatMessage(messages.languagesTitle) }}</h2>

      <div class="card-description">
        <IntlFormatted :message-id="messages.languagesDescription">
          <template #crowdin-link="{ children }">
            <a href="https://crowdin.com/project/modrinth">
              <component :is="() => children" />
            </a>
          </template>
        </IntlFormatted>
      </div>

      <div class="search-container">
        <input
          id="language-search"
          v-model="$searchQuery"
          name="language"
          type="search"
          :placeholder="formatMessage(messages.searchFieldPlaceholder)"
          class="language-search"
          aria-describedby="language-search-description"
          :disabled="$changingTo != null"
          @keypress="onSearchSubmit"
        />

        <div id="language-search-description" class="visually-hidden">
          {{ formatMessage(messages.searchFieldDescription) }}
        </div>

        <div id="language-search-results-announcements" class="visually-hidden" aria-live="polite">
          {{
            $searchQuery === ''
              ? ''
              : formatMessage(messages.searchResultsAnnouncement, {
                  matches: $searchResults.get('searchResult')?.length ?? 0,
                })
          }}
        </div>
      </div>

      <div ref="$languagesList" :class="{ 'languages-list': true, changing: $changingTo != null }">
        <template v-for="[category, locales] in $displayCategories" :key="category">
          <div class="category-name">
            <strong>{{ formatMessage(categoryNames[category]) }}</strong>
          </div>

          <div
            v-if="category === 'searchResult' && locales.length === 0"
            ref="$noResultsPlaceholder"
            class="no-results"
            tabindex="0"
          >
            {{ formatMessage(messages.noResults) }}
          </div>

          <template v-for="locale in locales" :key="locale.tag">
            <label
              :class="{
                pending: $changingTo == locale.tag,
                errored: $failedLocale == locale.tag,
              }"
              :aria-describedby="
                $failedLocale == locale.tag ? `language__${locale.tag}__fail` : undefined
              "
            >
              <input
                :id="`language__${locale.tag}`"
                v-model="$activeLocale"
                name="language"
                :value="locale.tag"
                type="radio"
                class="visually-hidden"
                :disabled="$changingTo != null"
              />

              <RadioButtonCheckedIcon v-if="$activeLocale === locale.tag" class="radio" />
              <RadioButtonIcon v-else class="radio" />

              <div class="language-names">
                <div class="language-name">
                  {{ locale.auto ? formatMessage(messages.automaticLocale) : locale.displayName }}
                </div>

                <div v-if="!locale.auto" class="language-translated-name">
                  {{ locale.translatedName }}
                </div>
              </div>
            </label>

            <div
              v-if="$failedLocale === locale.tag"
              :id="`language__${locale.tag}__fail`"
              class="language-errored"
            >
              <WarningIcon /> {{ formatMessage(messages.loadFailed) }}
            </div>
          </template>
        </template>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.visually-hidden {
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important; // Fix for https://github.com/twbs/bootstrap/issues/25686
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;

  // Fix for positioned table caption that could become anonymous cells
  &:not(caption) {
    position: absolute !important;
  }
}

.languages-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  label {
    display: flex;
    align-items: center;
    column-gap: 0.5rem;
    border: 0.15rem solid transparent;
    border-radius: var(--spacing-card-md);
    background: var(--color-button-bg);
    padding: var(--spacing-card-md);
    cursor: pointer;
    position: relative;
    overflow: hidden;

    &:not(:has(input[disabled])):hover {
      border-color: var(--color-button-bg-hover);
    }

    &:focus-visible,
    &:has(:focus-visible) {
      outline: 2px solid var(--color-brand);
    }

    &.errored {
      border-color: var(--color-special-red);

      &:hover {
        border-color: var(--color-special-red);
      }
    }

    &.pending {
      &::after {
        // shimmer gradient
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        background-image: linear-gradient(
          102deg,
          rgba(0, 0, 0, 0) 0%,
          rgba(0, 0, 0, 0) 20%,
          rgba(0, 0, 0, 0.1) 45%,
          rgba(0, 0, 0, 0.1) 50%,
          rgba(0, 0, 0, 0) 80%,
          rgba(0, 0, 0, 0) 100%
        );

        background-repeat: no-repeat;
        animation: placeholderShimmer 2.5s ease-out infinite;
        // opacity: 0.2;

        .dark-mode &,
        .oled-mode & {
          background-image: linear-gradient(
            102deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0) 20%,
            rgba(255, 255, 255, 0.1) 45%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0) 80%,
            rgba(255, 255, 255, 0) 100%
          );

          // opacity: 0.1;
        }
      }
    }
  }

  &.changing {
    label {
      opacity: 0.9;
    }
  }
}

.language-errored {
  color: var(--color-special-red);
  font-size: var(--font-size-sm);
  margin-left: 0.3rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

@keyframes placeholderShimmer {
  from {
    left: -100%;
  }

  to {
    left: 100%;
  }
}

.radio {
  width: 24px;
  height: 24px;
}

.language-names {
  display: flex;
  justify-content: space-between;
  flex: 1;
  flex-wrap: wrap;
}

.language-name {
  font-weight: bold;
}

.language-search {
  width: 100%;
  font-size: var(--font-size-md);
  padding: var(--spacing-card-md);
}

.search-container {
  margin-bottom: var(--spacing-card-md);
}

.card-description {
  margin-bottom: calc(var(--spacing-card-sm) + var(--spacing-card-md));
}

.contribution-notice {
  background-color: var(--color-info-banner-bg);
  color: var(--color-info-banner-text);
  min-height: unset;
  padding: var(--spacing-card-bg);
}

.contribution-notice,
.card-description {
  a {
    color: var(--color-link);

    &:hover {
      color: var(--color-link-hover);
    }

    &:active {
      color: var(--color-link-active);
    }
  }
}
</style>
