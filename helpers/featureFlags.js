const NEW_PROJECT_LINKS = {
  NEW_PROJECT_LINKS: true,
  REMOVE_LEGACY_PROJECT_LINKS: true,
}

const NEW_PROJECT_MEMBERS = {
  PROJECT_MEMBERS_CARD: true,
  REMOVE_LEGACY_PROJECT_MEMBERS: true,
}

const NEW_PROJECT_DETAILS = {
  PROJECT_DETAILS_CARD: true,
  REMOVE_LEGACY_TECHNICAL_INFO: true,
  REMOVE_LEGACY_PROJECT_DATE_INFO: true,
}

const ALL_NEW_PROJECT_STUFF = {
  ...NEW_PROJECT_LINKS,
  ...NEW_PROJECT_MEMBERS,
  ...NEW_PROJECT_DETAILS,
  PROJECT_COMPATIBILITY_CARD: true,
  REMOVE_FEATURED_VERSIONS: true,
}

// const GLOBAL_EXPERIMENTAL_STYLES = {
//   USE_EXPERIMENTAL_STYLES_GLOBALLY: true,
// }

export const PRODUCTION_FLAGS = {
  ...NEW_PROJECT_LINKS,
  ...NEW_PROJECT_MEMBERS,
  ...NEW_PROJECT_DETAILS,
}

export const DEV_FLAGS = {
  ...PRODUCTION_FLAGS,
  ...ALL_NEW_PROJECT_STUFF,
}
