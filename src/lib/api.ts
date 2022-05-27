import { token as tokenStore } from "$stores/server";
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

            const options: RequestInit = {
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
    data: any = {}
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

            try {
                response = await axios.default(
                    baseUrl + (baseUrl.endsWith("/") ? "" : "/") + route,
                    {
                        method: method,
                        data: fData,
                        ...options,
                    }
                );
            } catch (e) {
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
