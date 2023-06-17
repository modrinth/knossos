<script setup lang="ts">
import RadioButtonIcon from '~/assets/images/utils/radio-button.svg'
import RadioButtonCheckedIcon from '~/assets/images/utils/radio-button-checked.svg'

const vintl = useVIntl()
const { formatMessage } = vintl

const messages = defineMessages({
  languagesTitle: {
    id: 'settings.language.languages.title',
    defaultMessage: 'Languages',
  },
  automaticLocale: {
    id: 'settings.language.languages.automatic',
    defaultMessage: 'Sync with the system language',
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
})

const $defaultNames = useDisplayNames(() => vintl.defaultLocale)

const $translatedNames = useDisplayNames(() => vintl.locale)

type AutomaticLocale = {
  auto: true
  tag: 'auto'
}

type Locale = {
  auto?: never
  tag: string
  displayName: string
  defaultName: string
  translatedName: string
}

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

const $categories = computed(() => {
  const map = new Map<keyof typeof categoryNames, (Locale | AutomaticLocale)[]>()

  map.set('auto', [
    {
      auto: true,
      tag: 'auto',
    },
  ])

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

    const categoryName = normalizeCategoryName(locale.meta?.category)

    let categoryLocales = map.get(categoryName)

    if (categoryLocales == null) {
      categoryLocales = []
      map.set(categoryName, categoryLocales)
    }

    categoryLocales.push({
      tag: locale.tag,
      displayName,
      defaultName,
      translatedName,
    })
  }

  return map
})

const $isChanging = ref(false)

const $activeLocale = computed({
  get() {
    return vintl.automatic ? 'auto' : vintl.locale
  },
  set(value) {
    $isChanging.value = true
    vintl.changeLocale(value).then(
      () => {
        $isChanging.value = false
      },
      () => {}
    )
  },
})
</script>

<template>
  <div>
    <section class="universal-card">
      <h2>{{ formatMessage(messages.languagesTitle) }}</h2>

      <div class="languages-list">
        <template v-for="[category, locales] in $categories" :key="category">
          <small>{{ formatMessage(categoryNames[category]) }}</small>

          <label
            v-for="locale in locales"
            :key="locale.tag"
            :class="{ big: locale.tag === 'auto' }"
          >
            <input
              :id="`language__${locale.tag}`"
              v-model="$activeLocale"
              name="language"
              :value="locale.tag"
              type="radio"
              class="visually-hidden"
            />

            <RadioButtonIcon v-if="$activeLocale !== locale.tag" class="radio" />
            <RadioButtonCheckedIcon v-else class="radio" />

            <div class="language-names">
              <div class="language-name">
                {{ locale.auto ? formatMessage(messages.automaticLocale) : locale.displayName }}
              </div>

              <div v-if="!locale.auto" class="language-translated-name">
                {{ locale.translatedName }}
              </div>
            </div>
          </label>
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
    border: 0.15rem solid var(--color-button-bg);
    border-radius: var(--spacing-card-md);
    background: var(--color-button-bg);
    padding: var(--spacing-card-md);
    cursor: pointer;

    &:hover {
      border-color: var(--color-button-bg-hover);
    }

    &:focus-visible,
    &:has(:focus-visible) {
      outline: 2px solid var(--color-brand);
    }
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
}

.language-name {
  font-weight: bold;
}
</style>
