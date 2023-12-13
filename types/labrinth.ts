export namespace LabrinthAPI {
  export type ProjectId = string
  export type TeamId = string
  export type OrganizationId = string
  export type VersionId = string
  export type ThreadId = string

  export enum ProjectStatus {
    Approved,
    Archived,
    Rejected,
    Draft,
    Unlisted,
    Processing,
    Withheld,
    Scheduled,
    Private,
    Unknown,
  }

  export interface ModeratorMessage {
    message: string
    body?: string
  }

  export interface License {
    id: string
    name: string
    url?: string
  }

  export interface GalleryItem {
    url: string
    featured: boolean
    name?: string
    description?: string
    created: Date
    ordering: number
  }

  export enum MonetizationStatus {
    ForceDemonetized,
    Demonetized,
    Monetized,
  }

  export interface Link {
    platform: string
    donation: boolean
    url: string
  }

  export interface Project {
    id: ProjectId
    slug?: string
    projectTypes: string[]
    games: string[]
    teamId: TeamId
    organization?: OrganizationId
    name: string
    summary: string
    description: string
    published: Date
    updated: Date
    approved?: Date
    queued?: Date
    status: ProjectStatus
    requestedStatus?: ProjectStatus
    moderatorMessage?: ModeratorMessage
    license: License
    downloads: number
    followers: number
    categories: string[]
    additionalCategories: string[]
    loaders: string[]
    versions: VersionId[]
    iconUrl?: string
    linkUrls: { [key: string]: Link }
    gallery: GalleryItem[]
    color?: number
    threadId: ThreadId
    monetizationStatus: MonetizationStatus
    fields: { [key: string]: unknown[] }
  }
}
