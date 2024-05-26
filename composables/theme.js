export const useTheme = () =>
  useState('theme', () => {
    const colorMode = useCookie('color-mode', {
      maxAge: 60 * 60 * 24 * 365 * 10,
      sameSite: 'lax',
      secure: true,
      httpOnly: false,
      path: '/',
    })

    if (!colorMode.value) {
      colorMode.value = {
        value: 'dark',
        preference: 'system',
      }
    }

    if (colorMode.value.preference !== 'system') {
      colorMode.value.value = colorMode.value.preference
    }

    return colorMode.value
  })

export const updateTheme = (value, updatePreference = false) => {
  const theme = useTheme()
  const cosmetics = useCosmetics()
  const flags = useFeatureFlags()

  const extraClasses = flags.USE_EXPERIMENTAL_STYLES_GLOBALLY ? ' experimental-styles-within' : ''

  const themeCookie = useCookie('color-mode', {
    maxAge: 60 * 60 * 24 * 365 * 10,
    sameSite: 'lax',
    secure: true,
    httpOnly: false,
    path: '/',
  })

  if (value === 'system') {
    theme.value.preference = 'system'

    const colorSchemeQueryList = window.matchMedia('(prefers-color-scheme: light)')
    if (colorSchemeQueryList.matches) {
      theme.value.value = 'light'
    } else {
      theme.value.value = cosmetics.value.preferredDarkTheme
    }
  } else {
    theme.value.value = value
    if (updatePreference) theme.value.preference = value
  }

  if (process.client) {
    document.documentElement.className = `${theme.value.value}-mode${extraClasses}`
  }

  themeCookie.value = theme.value
}

export const DARK_THEMES = ['dark', 'oled', 'retro']
