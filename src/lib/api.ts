import { token as tokenStore } from "$stores/server";
import { Modpack } from "./pack";
import type { ModpackOpts } from "./pack";
import * as axios from "axios";
import { get, writable } from "svelte/store";

interface Overrides {
    token?: string;
    fetch?: any;
}

export const fetching = writable<number>(0);

export function send(
    method: string,
    route: string,
    data: any = null,
    overrides: Overrides = { token: "", fetch: null }
): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            fetching.set(get(fetching) + 1);

            const options: {
                method: string;
                headers: Record<string, string>;
                body?: string;
            } = {
                method: method,
                headers: {},
            };

            const token = get(tokenStore) || overrides.token;

            if (token) {
                options.headers["Authorization"] = token;
            }

            if (data?.type && data?.lastModified && data?.size) {
                // Data is a File
                options.headers["Content-Type"] = data.type;
            } else if (data && !data.entries) {
                // Data is an object that is not a FormData
                // options.headers['Content-Type'] = 'application/json';
                options.body = data;
            }

            let response;

            const baseUrl = import.meta.env.VITE_API_URL.toString();

            try {
                response = await (overrides.fetch || fetch)(
                    baseUrl + (baseUrl.endsWith("/") ? "" : "/") + route,
                    options
                );
            } catch (e) {
                fetching.set(get(fetching) - 1);
                return reject(e);
            }

            fetching.set(get(fetching) - 1);

            if (!response.ok) {
                return reject(response);
            }

            let parsed = {};

            if (response.status !== 204) {
                try {
                    parsed = await response.json();
                } catch {
                    console.error("Could not parse API response");
                    return reject("Could not parse!");
                }
            }

            return resolve(parsed);
        } catch (e) {
            return reject("An unknown error occured: " + e);
        }
    });
}

export function sendAxios(
    method: string,
    route: string,
    data: any = {},
    config = { type: "multipart/form-data", useFormData: true }
): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            fetching.set(get(fetching) + 1);

            const options: axios.AxiosRequestConfig<any> = { headers: {} };

            const token = get(tokenStore);

            if (token) {
                options.headers["Authorization"] = token;
            }

            if (data?.type && data?.lastModified && data?.size) {
                // Data is a File
                options.headers["Content-Type"] = data.type;
            } else if (data && !data.entries) {
                // Data is an object that is not a FormData
                options.headers["Content-Type"] = config.type;
            }

            let response;

            const baseUrl = import.meta.env.VITE_API_URL.toString();

            const fData = new FormData();
            fData.append("data", JSON.stringify(data));

            try {
                response = await axios.default(
                    baseUrl + (baseUrl.endsWith("/") ? "" : "/") + route,
                    {
                        method: method,
                        data: config.useFormData ? fData : data,
                        ...options,
                    }
                );
            } catch (e) {
                fetching.set(get(fetching) - 1);
                return reject(e);
            }

            fetching.set(get(fetching) - 1);

            if (!response.ok) {
                return reject(response);
            }

            let parsed = {};

            if (response.status !== 204) {
                try {
                    parsed = await response.json();
                } catch {
                    console.error("Could not parse API response");
                    return reject("Could not parse!");
                }
            }

            return resolve(parsed);
        } catch (e) {
            return reject("An unknown error occured: " + e);
        }
    });
}

export function sendAxiosMulti(
    method: string,
    route: string,
    data: any = {},
    files: File[] = null
): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            fetching.set(get(fetching) + 1);

            const options: axios.AxiosRequestConfig<any> = { headers: {} };

            const token = get(tokenStore);

            if (token) {
                options.headers["Authorization"] = token;
            }

            if (data?.type && data?.lastModified && data?.size) {
                // Data is a File
                options.headers["Content-Type"] = data.type;
            } else if (data && !data.entries) {
                // Data is an object that is not a FormData
                options.headers["Content-Type"] = "multipart/form-data";
            }

            let response;

            const baseUrl = import.meta.env.VITE_API_URL.toString();

            const fData = new FormData();
            fData.append("data", JSON.stringify(data));

            for (let i = 0; i < files.length; i++) {
                fData.append(
                    data.file_parts[i] || files[i].name.split("/").pop(),
                    new Blob([files[i]]),
                    files[i].name
                );
            }

            try {
                response = await axios.default({
                    ...options,
                    url: baseUrl + (baseUrl.endsWith("/") ? "" : "/") + route,
                    method: method,
                    data: fData,
                    headers: {
                        ...options.headers,
                        "Content-Type": "multipart/form-data",
                    },
                });
            } catch (e) {
                fetching.set(get(fetching) - 1);
                return reject(e);
            }

            fetching.set(get(fetching) - 1);

            if (!response.ok) {
                return reject(response);
            }

            let parsed = {};

            if (response.status !== 204) {
                try {
                    parsed = await response.json();
                } catch {
                    console.error("Could not parse API response");
                    return reject("Could not parse!");
                }
            }

            return resolve(parsed);
        } catch (e) {
            return reject("An unknown error occured: " + e);
        }
    });
}

export function createModpack(mods?: string[], opts?: ModpackOpts) {
    return new Modpack(mods || [], opts || {});
}
