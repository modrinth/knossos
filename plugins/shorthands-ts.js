// @ts-check

/** @typedef {'mod' | 'modpack' | 'resourcepack' | 'plugin'} ProjectType */

/** @typedef {'required' | 'optional' | 'unsupported'} SideRequirement */

/**
 * @typedef {object} Project
 * @property {ProjectType} project_type Type of the project.
 * @property {SideRequirement} client_side Project requirement for the client
 *   side.
 * @property {SideRequirement} server_side Project requirement for the server
 *   side.
 */

/** @typedef {'universal' | 'server' | 'client' | 'unknown'} ProjectSide */

/**
 * By checking project side requirements determines which side the project must
 * be present at.
 *
 * This helper function should be defined as `$computeProjectSide` in both Vue
 * and Nuxt's Context types.
 *
 * @param {Project} project Project which side to check.
 * @returns {ProjectSide} Project side.
 */
function computeProjectSide(project) {
  const { client_side: clientSide, server_side: serverSide } = project
  if (clientSide === 'optional' && serverSide === 'optional') {
    return 'universal'
  }

  if (
    (clientSide === 'optional' || clientSide === 'required') &&
    (serverSide === 'optional' || serverSide === 'unsupported')
  ) {
    return 'client'
  }

  if (
    (serverSide === 'optional' || serverSide === 'required') &&
    (clientSide === 'optional' || clientSide === 'unsupported')
  ) {
    return 'server'
  }

  return 'unknown'
}

/**
 * Represents a computed type of the project (whether it's a mod, plugin or a
 * mix of both).
 *
 * @typedef {'mod' | 'plugin' | 'mixed'} ProjectTypeDisplayType
 */

/**
 * @typedef {object} ProjectTypeDisplay
 * @property {string | null} sideTip Localised side tip (project side + project
 *   type).
 * @property {string} projectType Localised project type.
 */

/** @typedef {ProjectType | 'mod-and-plugin'} CoercedProjectType */

/**
 * Coerces project type if the project is of mod type, but has along its loaders
 * any plugin loaders, in which case it's coerced to `mod-and-plugin` type.
 *
 * This helper function should be defined as `$coerceProjectType` on both Vue
 * and Nuxt Context types.
 *
 * @param {ProjectType} projectType Regular project type taken from
 *   `project_type` property of project object.
 * @param {string[]} loaders Identifiers of all loaders found by going through
 *   all of the project's versions.
 * @returns {CoercedProjectType} Coerced project type.
 * @this {import('@nuxt/types').Context}
 */
function coerceProjectType(projectType, loaders) {
  if (projectType !== 'mod') {
    return projectType
  }

  const isPlugin = loaders.some((loader) =>
    this.store.state.tag.loaderData.allPluginLoaders.includes(loader)
  )

  const isMod = loaders.some((loader) =>
    this.store.state.tag.loaderData.modLoaders.includes(loader)
  )

  if (isPlugin && isMod) {
    return 'mod-and-plugin'
  } else if (isPlugin) {
    return 'plugin'
  }

  return 'mod'
}

/** @type {CoercedProjectType[]} */
const excludedSideTipTypes = ['plugin', 'resourcepack']

/**
 * Computes whether project type must be displayed and if so, provides localised
 * title that can be displayed.
 *
 * This helper function should be defined as `$computedProjectTypeDisplay` on
 * both Vue and Nuxt's Context types.
 *
 * @param {ProjectSide} side Earlier computed project side using
 *   {@link computeProjectSide}.
 * @param {CoercedProjectType} type Coerced using {@link coerceProjectType}
 *   function project type.
 * @returns {string | null} Project side tip or `null` if it should not be
 *   displayed.
 * @this {import('@nuxt/types').Context}
 */
function computeProjectTypeDisplay(side, type) {
  if (side === 'unknown' || excludedSideTipTypes.includes(type)) {
    return null
  }

  return this.$t(`project-type-display.${type}`, { side })
}

/**
 * Provides localised category name.
 *
 * @param {string} categoryName Original category name provided by the API.
 * @returns {string} Localised category name.
 * @this {import('@nuxt/types').Context}
 */
function translateCategory(categoryName) {
  /** @type {string} */
  let normalizedKey

  switch (categoryName) {
    case '512x+': {
      normalizedKey = '512x-or-higher'
      break
    }
    case '8x-': {
      normalizedKey = '8x-or-lower'
      break
    }
    default: {
      normalizedKey = categoryName
    }
  }

  normalizedKey = normalizedKey.replace(/_/g, '-')

  return this.$t(`category.${normalizedKey}`)
}

/**
 * Provides localised loader name.
 *
 * @param {string} loaderName Original loader name provided by the API.
 * @returns {string} Localised loader name.
 * @this {import('@nuxt/types').Context}
 */
function translateLoader(loaderName) {
  return this.$t(`loader.${loaderName}`)
}

/**
 * @typedef {object} DefinedHelpers
 * @property {typeof computeProjectSide} $computeProjectSide
 * @property {typeof coerceProjectType} $coerceProjectType
 * @property {typeof computeProjectTypeDisplay} $computeProjectTypeDisplay
 * @property {typeof translateCategory} $translateCategory
 * @property {typeof translateLoader} $translateLoader
 */

/** @type {import('@nuxt/types').Plugin} */
export default (ctx, inject) => {
  inject('computeProjectSide', computeProjectSide)
  inject('coerceProjectType', coerceProjectType.bind(ctx))
  inject('computeProjectTypeDisplay', computeProjectTypeDisplay.bind(ctx))
  inject('translateCategory', translateCategory.bind(ctx))
  inject('translateLoader', translateLoader.bind(ctx))
}
