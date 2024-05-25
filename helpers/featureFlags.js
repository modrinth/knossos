const NEW_PROJECT_LINKS = {
    NEW_PROJECT_LINKS: true,
    REMOVE_LEGACY_PROJECT_LINKS: true,
}

const NEW_PROJECT_DETAILS = {
    PROJECT_DETAILS_CARD: true,
    REMOVE_LEGACY_TECHNICAL_INFO: true,
}

const ALL_NEW_PROJECT_STUFF = {
    PROJECT_COMPATIBILITY_CARD: true,
    NEW_PROJECT_LINKS: true,
    REMOVE_LEGACY_PROJECT_LINKS: true,
    REMOVE_FEATURED_VERSIONS: true,
    PROJECT_DETAILS_CARD: true,
    REMOVE_LEGACY_TECHNICAL_INFO: true,
}

const GLOBAL_EXPERIMENTAL_STYLES = {
    USE_EXPERIMENTAL_STYLES_GLOBALLY: true,
}

export const PRODUCTION_FLAGS = {
    ...NEW_PROJECT_LINKS,
}

export const DEV_FLAGS = {
    ...PRODUCTION_FLAGS,
    ...ALL_NEW_PROJECT_STUFF
}