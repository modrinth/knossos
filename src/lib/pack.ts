import { fetching } from "./api";
import { Serializable } from "./util";
import axios from "axios";
import { get } from "svelte/store";

export type SideMetadata = "required" | "optional" | "unsupported";
export type ProjectType = "mod" | "modpack";
export type StatusData =
    | "approved"
    | "rejected"
    | "draft"
    | "unlisted"
    | "archived"
    | "processing"
    | "unknown";
export type VersionType = "release" | "beta" | "alpha";
export type DependencyType = "required" | "optional" | "incompatable";

export interface DonationMetadata {
    id?: string;
    platform?: string;
    url?: string;
}

export interface LicenseObject {
    id?: string;
    name?: string;
    url?: string;
}

export interface GalleryImage {
    url: string;
    featured: boolean;
    title?: string;
    description?: string;
    created: string;
}

export interface ModeratorMessage {
    message?: string | null;
    body?: string | null;
}

export interface ModMetadata {
    slug: string;
    title: string;
    description: string;
    categories: string[];
    client_side: SideMetadata;
    server_side: SideMetadata;
    body: string;
    project_type: ProjectType;
    downloads: number;
    followers: number;
    id: string;
    team: string;
    published: string;
    updated: string;
    status: StatusData;
    issues_url?: string | null;
    source_url?: string | null;
    wiki_url?: string | null;
    discord_url?: string | null;
    icon_url?: string | null;
    body_url?: string | null;
    moderator_message?: ModeratorMessage | null;
    donation_urls?: DonationMetadata[] | null;
    license?: LicenseObject | null;
    versions?: string[] | null;
    gallery?: GalleryImage[] | null;
}

export interface Dependency {
    dependency_type: DependencyType;
    project_id?: string | null;
    version_id?: string | null;
}

export interface FileHashes {
    sha512?: string | null;
    sha1?: string | null;
}

export interface FileInfo {
    hashes: FileHashes;
    url: string;
    filename: string;
    primary: boolean;
    size: number;
}

export interface VersionMetadata {
    name: string;
    version_number: string;
    game_versions: string[];
    version_type: VersionType;
    loaders: string[];
    featured: boolean;
    id: string;
    project_id: string;
    author_id: string;
    date_published: string;
    downloads: number;
    files: FileInfo[];
    changelog?: string | null;
    dependencies?: Dependency[] | null;
    changelog_url?: string | null;
}

export interface ModInfoMetadata {
    getFile(): { url: string; name: string; size: number };
    getHash(type?: "sha1" | "sha512"): string | undefined;
    setVersion(name: string): Promise<void>;
    getVersion(): VersionMetadata;
    get(): ModMetadata;
}

export class ModInfo implements ModInfoMetadata {
    private id: string;
    private slug: string;
    private name: string;
    private author: string;
    private version: string;
    private raw: ModMetadata;
    private rawVersion: VersionMetadata;
    private opts: ModpackOpts;

    constructor(id: string, opts?: ModpackOpts) {
        this.id = id;
        this.opts = opts || {};
    }

    public async resolve(index: number, total: number, onUpdate?: (index: number, total: number, mod: string, done: boolean, stage: FetchStage) => any) {
        // const baseUrl = import.meta.env.VITE_API_URL.toString();
        fetching.set(get(fetching) + 1);

        if(onUpdate) onUpdate(index, total, this.name, false, "info");

        const baseUrl =
            import.meta.env.VITE_API_URL?.toString() ||
            "https://api.modrinth.com/v2/";
        const url = `${baseUrl}${baseUrl.endsWith("/") ? "" : "/"}project/${
            this.id
        }`;
        let result;

        try {
            result = await axios.get(url);
        } catch (e) {
            fetching.set(get(fetching) - 1);
            throw e;
        }

        this.raw = result.data;
        this.slug = this.raw.slug;
        this.name = this.raw.title;

        if(onUpdate) onUpdate(index, total, this.name, false, "versions");

        const versionsUrl = `${baseUrl}${
            baseUrl.endsWith("/") ? "" : "/"
        }project/${this.id}/version?loaders=["${
            this.opts.loader || "fabric"
        }"]&game_versions=["${this.opts.gameVersion || "1.18.2"}"]`;

        fetching.set(get(fetching) - 1);
        fetching.set(get(fetching) + 1);

        let result2;

        try {
            result2 = await axios.get(versionsUrl);
        } catch (e) {
            fetching.set(get(fetching) - 1);
            throw e;
        }

        this.version = this.version || result2.data[0].id || "latest";

        if(onUpdate) onUpdate(index, total, this.name, false, "version");

        const versionUrl = `${baseUrl}${
            baseUrl.endsWith("/") ? "" : "/"
        }version/${this.version}`;

        fetching.set(get(fetching) - 1);
        fetching.set(get(fetching) + 1);

        let result3;

        try {
            result3 = await axios.get(versionUrl);
        } catch (e) {
            fetching.set(get(fetching) - 1);
            throw e;
        }

        this.rawVersion = result3.data;

        fetching.set(get(fetching) - 1);
    }

    get(): ModMetadata {
        return this.raw;
    }

    getFile(): { url: string; name: string; size: number } {
        return {
            url: this.rawVersion.files[0].url,
            name: this.rawVersion.files[0].filename,
            size: this.rawVersion.files[0].size,
        };
    }

    getHash(type: "sha1" | "sha512" = "sha1"): string | undefined {
        return this.rawVersion.files[0].hashes[type];
    }

    getVersion(): VersionMetadata {
        return this.rawVersion;
    }

    async setVersion(name: string): Promise<void> {
        this.version = name;
        await this.resolve(0, 1);
    }
}

export interface ModpackFile {
    path: string;
    hashes: {
        sha1: string;
        sha512: string;
    };
    env?: {
        client: SideMetadata;
        server: SideMetadata;
    };
    downloads: string[];
    fileSize: number;
}

export interface ModpackInfo {
    formatVersion: number;
    game: "minecraft";
    versionId: string | number;
    name: string;
    summary?: string;
    files: ModpackFile[];
    dependencies: { [key: string]: string | number };
    _dependencies: {
        [key: string]: { version: VersionMetadata; mod: ModMetadata };
    };
}

export interface ModpackOpts {
    gameVersion?: string;
    loader?: string;
}

export type FetchStage = "none" | "prefetch" | "info" | "versions" | "version" | "postfetch";

export class Modpack extends Serializable {
    private mods: ModInfo[];
    private modNames: string[];
    private pack: ModpackInfo;
    private opts: ModpackOpts;

    constructor(mods: string[] = [], opts?: ModpackOpts) {
        super();
        this.pack = {
            formatVersion: 1,
            game: "minecraft",
            versionId: "0.0.0",
            name: "",
            files: [],
            dependencies: {},
            _dependencies: {},
        };
        this.mods = [];
        this.modNames = mods;
        this.opts = {
            gameVersion: opts.gameVersion || "1.18.2",
            loader: opts.loader || "fabric",
        };
    }

    public async resolve(
        onUpdate?: (index: number, total: number, mod: string, done: boolean, stage: FetchStage) => any
    ) {
        for (let i = 0; i < this.modNames.length; i++) {
            const mod = this.modNames[i];
            const modInfo = new ModInfo(mod, this.opts);

            if (onUpdate) onUpdate(i, this.modNames.length, mod, false, "prefetch");

            try {
                await modInfo.resolve(i, this.modNames.length, onUpdate);
            } catch (e) {
                throw e;
            }

            if (onUpdate) onUpdate(i, this.modNames.length, mod, true, "postfetch");

            this.mods.push(modInfo);
            this.pack._dependencies[mod] = {
                mod: modInfo.get(),
                version: modInfo.getVersion(),
            };
        }
    }

    public deserialize(data: string): void {}

    public serialize(pretty = false): string {
        this.mods.forEach((m) => {
            if (
                this.pack.files.filter((f) => f.downloads[0] == m.getFile().url)
                    .length <= 0
            ) {
                this.pack.files.push({
                    fileSize: m.getFile().size,
                    downloads: [m.getFile().url],
                    hashes: {
                        sha1: m.getHash("sha1"),
                        sha512: m.getHash("sha512"),
                    },
                    path: "mods/" + m.getFile().name,
                });
            }
        });
        if (!pretty) return JSON.stringify(this.pack);
        else return JSON.stringify(this.pack, null, 4);
    }
}
