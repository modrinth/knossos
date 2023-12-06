interface ModLinks {
  websiteUrl: string
  wikiUrl: string
  issuesUrl: string
  sourceUrl: string
}

interface ModAsset {
  id: number
  modId: number
  title: string
  description: string
  thumbnailUrl: string
  url: string
}

interface ModAuthor {
  id: number
  name: string
  url: string
}

export interface FACategory {
  id: number
  gameId: number
  name: string
  slug: string
  url: string
  iconUrl: string
  /**
   * ISO 8601 format
   */
  dateModified: string
  isClass: boolean
  classId: number
  parentCategoryId: number
  displayIndex: number
}

enum ModStatus {
  New = 1,
  ChangesRequired,
  UnderSoftReview,
  Approved,
  Rejected,
  ChangesMade,
  Inactive,
  Abandoned,
  Deleted,
  UnderReview,
}

export interface FAMod {
  id: number
  gameId: number
  name: string
  slug: string
  links: ModLinks
  summary: string
  status: ModStatus
  downloadCount: number
  isFeatured: boolean
  primaryCategoryId: number
  categories: FACategory[]
  classId: number | null
  authors: ModAuthor[]
  logo: ModAsset
  screenshots: ModAsset[]
  mainFileId: number
  // latestFiles: fa_File[];
  // latestFilesIndexes: FileIndex[];
  // latestEarlyAccessFilesIndexes: FileIndex[];
  dateCreated: string // ISO 8601 format
  dateModified: string // ISO 8601 format
  dateReleased: string // ISO 8601 format
  allowModDistribution: boolean | null
  gamePopularityRank: number
  isAvailable: boolean
  thumbsUpCount: number
}

interface Pagination {
  index: number
  pageSize: number
  resultCount: number
  totalCount: number
}

export interface FAModSearchPagination {
  data: FAMod[]
  pagination: Pagination
}

enum FAFileRelationType {
  EmbeddedLibrary = 1,
  OptionalDependency,
  RequiredDependency,
  Tool,
  Incompatible,
  Include,
}

enum FAFileReleaseType {
  Release = 1,
  Beta,
  Alpha,
}

enum FAFileStatus {
  Processing = 1,
  ChangesRequired,
  UnderReview,
  Approved,
  Rejected,
  MalwareDetected,
  Deleted,
  Archived,
  Testing,
  Released,
  ReadyForReview,
  Deprecated,
  Baking,
  AwaitingPublishing,
  FailedPublishing,
}

enum HashAlgo {
  Sha1 = 1,
  Md5,
}

interface FAFileDependency {
  modId: number
  relationType: FAFileRelationType
}

interface FAFileHash {
  value: string
  algo: HashAlgo
}

interface FAFileModule {
  name: string
  fingerprint: number
}

interface FASortableGameVersion {
  gameVersionName: string // Original version name (e.g. 1.5b)
  gameVersionPadded: string // Used for sorting (e.g. 0000000001.0000000005)
  gameVersion: string // Game version clean name (e.g. 1.5)
  gameVersionReleaseDate: string // Game version release date (date-time)
  gameVersionTypeId: number | null // Game version type id
}

interface FAFile {
  id: number // The file id
  gameId: number // The game id related to the mod that this file belongs to
  modId: number // The mod id
  isAvailable: boolean // Whether the file is available to download
  displayName: string // Display name of the file
  fileName: string // Exact file name
  releaseType: FAFileReleaseType // The file release type
  fileStatus: FAFileStatus // Status of the file
  hashes: FAFileHash[] // The file hash (i.e., md5 or sha1)
  fileDate: string // The file timestamp (date-time)
  fileLength: number // The file length in bytes
  downloadCount: number // The number of downloads for the file
  fileSizeOnDisk: number | null // The file's size on disk
  downloadUrl: string // The file download URL
  gameVersions: string[] // List of game versions this file is relevant for
  sortableGameVersions: FASortableGameVersion[] // Metadata used for sorting by game versions
  dependencies: FAFileDependency[] // List of dependencies files
  exposeAsAlternative: boolean | null
  parentProjectFileId: number | null
  alternateFileId: number | null
  isServerPack: boolean | null
  serverPackFileId: number | null
  isEarlyAccessContent: boolean | null
  earlyAccessEndDate: string | null // (date-time)
  fileFingerprint: number
  modules: FAFileModule[]
}

export interface FAFilePagination {
  data: FAFile[]
  pagination: Pagination
}
