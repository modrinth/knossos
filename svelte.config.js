import adapter from "./src/adapter/index.js";
import svelteSvg from "@poppanator/sveltekit-svg";
import path from "path";
import precompileIntl from "svelte-intl-precompile/sveltekit-plugin";
import preprocess from "svelte-preprocess";
import Icons from "unplugin-icons/vite";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: [
        preprocess({
            babel: {
                presets: [
                    [
                        "@babel/preset-env",
                        {
                            loose: true,
                            modules: false,
                            targets: {
                                esmodules: true,
                            },
                        },
                    ],
                ],
            },
            postcss: true,
            preserve: ["ld+json"],
        }),
    ],

    kit: {
        adapter: adapter({
            fallback: "index.html",
        }),
        vite: {
            plugins: [
                svelteSvg(),
                precompileIntl("locales"),
                Icons({
                    compiler: "svelte",
                }),
            ],
            resolve: {
                alias: {
                    $assets: path.resolve("./src/assets"),
                    $components: path.resolve("./src/components"),
                    $lib: path.resolve("./src/lib"),
                    $stores: path.resolve("./src/stores"),
                    $styles: path.resolve("./src/styles"),
                    $generated: path.resolve("./src/generated"),
                },
            },
            server: {
                hmr: process.env.GITPOD_WORKSPACE_URL
                    ? {
                          protocol: "wss",
                          clientPort: 443,
                          host: process.env.GITPOD_WORKSPACE_URL.replace(
                              "https://",
                              "3000-"
                          ),
                      }
                    : true,
                host: "0.0.0.0",
                cors: false,
                strictPort: true,
                port: 3000,
                https: false,
            },
        },
        paths: {
            base: process.env.GITHUB_ACTIONS ? "/knossos" : "",
        },
    },
};

export default config;
