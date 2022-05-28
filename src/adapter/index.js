import * as esbuild from "esbuild";
import * as fs from "fs";
import * as glob from "glob";
import { posix } from "path";
import * as stream from "stream";
import * as url from "url";
import * as util from "util";
import * as zlib from "zlib";

const pipe = util.promisify(stream.pipeline);

/**
 * @param {import(".").AdapterOptions} options
 */
export default function ({
    pages = "build",
    assets = pages,
    fallback,
    precompress = false,
} = {}) {
    /**
     * @type {import("@sveltejs/kit").Adapter}
     */
    const adapter = {
        name: "@sveltejs/adapter-cloudflare",
        async adapt(builder) {
            if (!fallback && !builder.config.kit.prerender.default) {
                builder.log.warn(
                    "You should set `config.kit.prerender.default` to `true` if no fallback is specified"
                );
            }

            const files = url.fileURLToPath(
                new URL("./files", import.meta.url)
            );
            const dest = builder.getBuildDirectory("cloudflare");
            const tmp = builder.getBuildDirectory("cloudflare-tmp");

            builder.rimraf(dest);
            builder.rimraf(tmp);
            builder.mkdirp(tmp);

            builder.rimraf(assets);
            builder.rimraf(pages);

            builder.writeStatic(dest);
            builder.writeClient(dest);

            builder.writeStatic(assets);
            builder.writeClient(assets);
            builder.writePrerendered(pages, { fallback });

            if (precompress) {
                if (pages === assets) {
                    builder.log.minor("Compressing assets and pages");
                    await compress(assets);
                } else {
                    builder.log.minor("Compressing assets");
                    await compress(assets);

                    builder.log.minor("Compressing pages");
                    await compress(pages);
                }
            }

            if (pages === assets) {
                builder.log(`Wrote site to "${pages}"`);
            } else {
                builder.log(
                    `Wrote pages to "${pages}" and assets to "${assets}"`
                );
            }

            // const { paths } = await builder.prerendered({ dest });

            const relativePath = posix.relative(
                tmp,
                builder.getServerDirectory()
            );

            fs.writeFileSync(
                `${tmp}/manifest.js`,
                `export const manifest = ${builder.generateManifest({
                    relativePath,
                })};\n\nexport const prerendered = new Set(${JSON.stringify(
                    dest
                )});\n`
            );

            builder.copy(`${files}/worker.js`, `${tmp}/_worker.js`, {
                replace: {
                    SERVER: `${relativePath}/index.js`,
                    MANIFEST: "./manifest.js",
                },
            });

            await esbuild.build({
                target: "es2020",
                platform: "browser",
                entryPoints: [`${tmp}/_worker.js`],
                outfile: `${dest}/_worker.js`,
                allowOverwrite: true,
                format: "esm",
                bundle: true,
            });
        },
    };
    return adapter;
}

async function compress(directory) {
    const files = await glob("**/*.{html,js,json,css,svg,xml,wasm}", {
        cwd: directory,
        dot: true,
        absolute: true,
        filesOnly: true,
    });

    await Promise.all(
        files.map((file) =>
            Promise.all([compress_file(file, "gz"), compress_file(file, "br")])
        )
    );
}

async function compress_file(file, format = "gz") {
    const compress =
        format == "br"
            ? zlib.createBrotliCompress({
                  params: {
                      [zlib.constants.BROTLI_PARAM_MODE]:
                          zlib.constants.BROTLI_MODE_TEXT,
                      [zlib.constants.BROTLI_PARAM_QUALITY]:
                          zlib.constants.BROTLI_MAX_QUALITY,
                      [zlib.constants.BROTLI_PARAM_SIZE_HINT]:
                          fs.statSync(file).size,
                  },
              })
            : zlib.createGzip({ level: zlib.constants.Z_BEST_COMPRESSION });

    const source = fs.createReadStream(file);
    const destination = fs.createWriteStream(`${file}.${format}`);

    await pipe(source, compress, destination);
}
