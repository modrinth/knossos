export abstract class Serializable {
    abstract serialize(pretty?: boolean): string;
    abstract deserialize(data: string): void;
}

export function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function capitalize(s: string) {
    return s[0].toUpperCase() + s.slice(1);
}

export function capitalizeAll(s: string) {
    const s_ = s.replaceAll("-", " ").replaceAll("_", " ").split(" ");
    const res = s_
        .map((v) => v[0].toUpperCase() + v.slice(1))
        .join(" ")
        .replaceAll("Api", "API");
    return res.length > 3 ? res : res.toUpperCase();
}
