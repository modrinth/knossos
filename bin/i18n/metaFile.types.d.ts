// @ts-check

/** Converts a map of properties to Chrome messages format (sort of). */
export type ChromeifiedObject<T> = {
  [K in keyof T]: T[K] extends string
    ? {
        message: T[K]
        description?: string
      }
    : never
}

/** Represents a source meta file object. */
export interface MetaFileSource {
  [key: string]: string
}

/** Represents a source meta file object in Chrome messages format. */
export type ChromeifiedMetaSource = ChromeifiedObject<MetaFileSource>
