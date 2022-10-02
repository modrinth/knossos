/** Represents map of messages, keyed by their IDs, with translations as values. */
export type Messages = Record<string, string>

export interface LocaleImport {
  messages: Messages
  importedData: Record<string, any>
}

/**
 * Represents a function that imports all necessary files required by the
 * locale, including locale's own messages, and returns them.
 *
 * @returns Promise that resolves with locale's messages.
 */
export type LocaleImportFunction = () => Promise<LocaleImport>

/**
 * Represents a locale definition, generated automatically from the building
 * based on the values in the module's config.
 */
export interface LocaleDefinition {
  /** Function to import required locale's requirements and own messages. */
  importFunction: LocaleImportFunction
  /** Additional custom data associated with the locale. */
  data?: unknown
}

/**
 * Represents an automatically generated map of locale definitions, including
 * import functions and custom data. All generated from the module config.
 */
export type LocalesDefinitionsMap = Record<string, LocaleDefinition>

/** Base URL of the site (domain name). */
export declare const baseURL: string | null

/**
 * Default locale as specified in the module config, to use when user's locale
 * has not been set and cannot be detected automatically based on the browser's
 * settings.
 */
export declare const defaultLocale: string

/**
 * All locales that were specified in the module config, with import functions
 * and associated custom data.
 */
export declare const localesDefinitions: LocalesDefinitionsMap

export default {
  defaultLocale,
  localesDefinitions,
}
