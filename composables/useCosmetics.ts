interface CosmeticsConfig {
  searchLayout: boolean
  projectLayout: boolean
  modpacksAlphaNotice: boolean
  advancedRendering: boolean
  externalLinksNewTab: boolean
  notUsingBlockers: boolean
  searchDisplayMode: {
    mod: 'list' | 'grid'
    plugin: 'list' | 'grid'
    resourcepack: 'gallery' | 'list'
    modpack: 'list' | 'grid'
    shader: 'gallery' | 'list'
    datapack: 'list' | 'grid'
    user: 'list' | 'grid'
  }
}

export default () => {
  const cosmetics = useState('cosmetics', () => {
    const cosmeticsCookie = useCookie<CosmeticsConfig>('cosmetics', {
      maxAge: 60 * 60 * 24 * 365 * 10,
      sameSite: 'lax',
      secure: true,
      httpOnly: false,
      path: '/',
    })

    if (!cosmeticsCookie.value) {
      cosmeticsCookie.value = {
        searchLayout: false,
        projectLayout: false,
        modpacksAlphaNotice: true,
        advancedRendering: true,
        externalLinksNewTab: true,
        notUsingBlockers: false,
        searchDisplayMode: {
          mod: 'list',
          plugin: 'list',
          resourcepack: 'gallery',
          modpack: 'list',
          shader: 'gallery',
          datapack: 'list',
          user: 'list',
        },
      }
    }

    return cosmeticsCookie.value
  })

  const saveCosmetics = () => {
    const cosmeticsCookie = useCookie<CosmeticsConfig>('cosmetics', {
      maxAge: 60 * 60 * 24 * 365 * 10,
      sameSite: 'lax',
      secure: true,
      httpOnly: false,
      path: '/',
    })

    cosmeticsCookie.value = cosmetics.value
  }

  return {
    cosmetics: cosmetics.value,
    saveCosmetics,
  }
}
