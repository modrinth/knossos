import type { FACategory, FAFilePagination, FAModSearchPagination } from '~/types/flame-anvil.ts'

const GAME_ID = 432

export const useFlameAnvilModsByUser = async (username: string): Promise<FAModSearchPagination> => {
  const config = useRuntimeConfig()

  const API_URL = config.public.flameAnvilUrl
  if (!API_URL) {
    throw new Error('Source URL not set')
  }

  const url = new URL(`${API_URL}mods/search`)

  url.searchParams.append('gameId', GAME_ID.toString())
  url.searchParams.append('searchFilter', username)
  url.searchParams.append('sortField', '6')
  url.searchParams.append('sortOrder', 'desc')

  const response = await fetch(url)
  const json = await response.json()

  return json
}

export const useFlameAnvilModsByID = async (uid: number): Promise<FAModSearchPagination> => {
  const config = useRuntimeConfig()

  const API_URL = config.public.flameAnvilUrl
  if (!API_URL) {
    throw new Error('Source URL not set')
  }

  const url = new URL(`${API_URL}mods/search`)

  url.searchParams.append('gameId', GAME_ID.toString())
  url.searchParams.append('primaryAuthorId', uid.toString())
  url.searchParams.append('sortField', '6')
  url.searchParams.append('sortOrder', 'desc')

  const response = await fetch(url)
  const json = await response.json()

  return json
}

export const useFlameAnvilVersionsFromMod = async (
  modId: number,
  index?: number
): Promise<FAFilePagination> => {
  if (!index) index = 0

  const config = useRuntimeConfig()

  const API_URL = config.public.flameAnvilUrl
  if (!API_URL) {
    throw new Error('Source URL not set')
  }

  const url = new URL(`${API_URL}mods/${modId}/files`)
  url.searchParams.append('index', index.toString())

  const response = await fetch(url)
  const json = await response.json()

  return json
}

const fixDescription = (val: string): string =>
  val
    .replace(/<p>&nbsp;<\/p>/g, '')
    .replace(/<p style="text-align:center">&nbsp;<\/p>/g, '')
    .replace(/<p style="text-align:left">&nbsp;<\/p>/g, '')
    .replace(/<p style="text-align:right">&nbsp;<\/p>/g, '')
    .replace(/https:\/\/www\.curseforge\.com\/linkout\?remoteUrl=/g, '')
    .replace(/https:\/\/minecraft\.curseforge\.com\/linkout\?remoteUrl=/g, '')
    .replace(/\/linkout\?remoteUrl=/g, '')

export const flameAnvilClassIDToType = (classID: number | null): string | undefined => {
  switch (classID) {
    case 5:
      return 'plugin'
    case 6:
      return 'mod'
    case 12:
      return 'resourcepack'
    case 6552:
      return 'shader'
  }
  return undefined
}

const faPluginTagsToCategories: Record<number, string> = {
  115: 'utility', // "Admin Tools" as "utility"
  122: 'utility', // "Developer Tools" as "utility"

  123: 'economy', // Direct match
  125: 'fixes', // Direct match
  127: 'general', // Direct match
  128: 'informational', // Direct match
  133: 'miscellaneous', // Direct match

  129: 'game-mechanics', // "Mechanics" as "game-mechanics"

  116: 'management', // "Anti-Griefing Tools" as "management"
  130: 'management', // "Website Administration" as "management"

  124: 'worldgen', // "World Editing and Management" as "worldgen"
  131: 'worldgen', // "World Generators" as "worldgen"

  132: 'adventure', // "Role Playing" as "adventure"

  134: 'transportation', // "Teleportation" as "transportation"

  117: 'social', // "Chat Related" as "social"
  4672: 'social', // "Twitch Integration" as "social"
}

const faModTagsToCategories: Record<number, string> = {
  422: 'adventure',
  4475: 'adventure',
  248: 'adventure',

  416: 'food',
  436: 'food',

  418: 'technology',
  4843: 'technology',
  417: 'technology',
  412: 'technology',
  413: 'technology',

  414: 'transportation',
  415: 'transportation',

  5191: 'utility',
  435: 'utility',
  423: 'utility',

  406: 'worldgen',

  431: 'mobs',

  420: 'storage',

  419: 'magic',

  421: 'library',

  434: 'equipment',
}

const faResourcePackTagsToCategories: Record<number, string> = {
  398: '512x+',
  397: '256x',
  396: '128x',
  395: '64x',
  394: '32x',
  393: '16x',

  5244: 'fonts',

  400: 'realistic',

  4465: 'modded',
  403: 'vanilla-like',
}

const faShaderTagsToCategories: Record<number, string> = {
  6553: 'realistic',
  6554: 'fantasy',
  6555: 'vanilla-like',
}

export const flameAnvilTypeTagConversion = (
  type: string,
  tags: FACategory[]
): { categories: string[]; additional: string[] } => {
  let categories: string[] = []

  switch (type) {
    case 'plugin':
      categories = tags.map((c) => faPluginTagsToCategories[c.id])
      break
    case 'mod':
      categories = tags.map((c) => faModTagsToCategories[c.id])
      break
    case 'resourcepack':
      categories = tags.map((c) => faResourcePackTagsToCategories[c.id])
      break
    case 'shader':
      categories = tags.map((c) => faShaderTagsToCategories[c.id])
      break
  }

  // dedupe and remove undefined/null
  categories = [...new Set(categories)].filter((c) => c)

  return {
    categories: categories.slice(0, 3),
    additional: categories.slice(3),
  }
}

export const useFlameAnvilModDescription = async (modId: number): Promise<string> => {
  const config = useRuntimeConfig()

  const API_URL = config.public.flameAnvilUrl
  if (!API_URL) {
    throw new Error('Source URL not set')
  }

  const url = new URL(`${API_URL}mods/${modId}/description`)

  const response = await fetch(url)
  const json = await response.json()
  const content = json?.data ?? ''
  return fixDescription(content)
}
