<script context="module" lang="ts">
    import { projectTypes } from "$generated/tags.json";
    import { search } from "$lib/search";

    /** @type {import('@sveltejs/kit').Load} */
    export async function load({ params, url, fetch, session, stuff }) {
        let projectType = params.search.replace("s", "");

        if (projectType === "builder") projectType = "mod";

        if (!projectTypes.includes(projectType)) {
            return {
                status: 404,
            };
        }

        const searchParams = {
            c: [],
            e: [],
            i: [],
            l: [],
            m: "",
            o: "",
            s: "",
            ...fromUrl(url.searchParams),
        };

        return {
            props: {
                results: await search(searchParams, projectType),
                projectType,
                searchParams,
                serverRendered: true,
            },
        };
    }

    function fromUrl(params: URLSearchParams) {
        const entries = Array.from(params.entries()).map(([key, value]) => {
            if (["v", "c", "e", "l", "i"].includes(key))
                // @ts-ignore
                value = value.split("~");
            return [key, value];
        });
        return Object.fromEntries(entries);
    }
</script>

<script lang="ts">
    import { browser } from "$app/env";
    import { page } from "$app/stores";
    import Ad from "$components/elements/Ad.svelte";
    import Button from "$components/elements/Button.svelte";
    import Input from "$components/elements/Input.svelte";
    import Multiselect from "$components/elements/Multiselect.svelte";
    import Pagination from "$components/elements/Pagination.svelte";
    import ProjectCard from "$components/elements/ProjectCard.svelte";
    import Meta from "$components/utils/Meta.svelte";
    import gameVersions from "$generated/gameVersions.json";
    import {
        categories,
        loaders,
        tagIcons,
        licenses,
    } from "$generated/tags.json";
    import { createModpack } from "$lib/api";
    import { simplify } from "$lib/number";
    import type { FetchStage, Modpack, ModpackInfo } from "$lib/pack";
    import { capitalize, capitalizeAll, formatBytes } from "$lib/util";
    import { formatVersions } from "$lib/versions";
    import { packMods, popups } from "$stores/app";
    import { onMount } from "svelte";
    import { t } from "svelte-intl-precompile";
    import VirtualList from "svelte-tiny-virtual-list";
    import { get } from "svelte/store";
    import { debounce } from "throttle-debounce";
    import IconCode from "virtual:icons/heroicons-outline/code";
    import IconSearch from "virtual:icons/heroicons-outline/search";
    import IconTrash from "virtual:icons/heroicons-outline/trash";
    import IconBox from "virtual:icons/lucide/box";
    import IconExpand from "virtual:icons/lucide/expand";
    import IconServer from "virtual:icons/lucide/hard-drive";
    import IconClient from "virtual:icons/lucide/laptop";
    import IconShrink from "virtual:icons/lucide/shrink";
    import JSZip from "jszip";
    import { saveAs } from "file-saver";

    let showFilters = false;
    let builder = false;

    export let results;
    export let projectType: string;

    export let searchParams: Record<string, string | string[]>;
    let previousParams = { ...searchParams };

    const replaceStateWithQuery = (values: Record<string, unknown>) => {
        const url = new URL(window.location.toString());
        for (let [k, v] of Object.entries(values)) {
            if (!!v) {
                if (Array.isArray(v)) v = v.join("~");
                url.searchParams.set(
                    encodeURIComponent(k),
                    encodeURIComponent(v as any)
                );
            } else {
                url.searchParams.delete(k);
            }
        }
        for (let [k, v] of Array.from(url.searchParams.entries())) {
            if (!v || k === "code") {
                url.searchParams.delete(k);
            }
        }
        history.replaceState({}, "", url);
    };

    const runSearch = debounce(200, false, () =>
        search(searchParams, projectType).then((data) => (results = data))
    );

    export let serverRendered: boolean;

    $: if (searchParams && browser) {
        if (serverRendered) {
            serverRendered = false;
        }
        // If certain params have changed, go to page 1
        else if (
            searchParams.q !== previousParams.q ||
            searchParams.l !== previousParams.l ||
            searchParams.c !== previousParams.c ||
            searchParams.s !== previousParams.s ||
            searchParams.m !== previousParams.m ||
            searchParams.v !== previousParams.v ||
            searchParams.e !== previousParams.e ||
            searchParams.i !== previousParams.i
        ) {
            searchParams.o = "";
            replaceStateWithQuery(searchParams);
            runSearch();
        } else if (searchParams.o !== previousParams.o) {
            replaceStateWithQuery(searchParams);
            runSearch();
        }

        previousParams = { ...searchParams };
    }

    $: if (!builder && $page.url.pathname == "/builder") builder = true;
    else builder = false;

    let filteredVersions = [];
    let filterTerm = "";

    $: if (filterTerm && (searchParams.h || !searchParams.h)) {
        filteredVersions = gameVersions.filter((it) =>
            it.version.includes(filterTerm)
        );
    } else if (!searchParams.h) {
        filteredVersions = gameVersions.filter(
            (it) =>
                it.version_type === "release" ||
                searchParams.v?.includes(it.version)
        );
    } else {
        filteredVersions = gameVersions;
    }

    const handleChange = (e, param, key) => {
        if (e.target.checked) {
            if (!searchParams[param]) searchParams[param] = [];
            searchParams[param] = [key, ...searchParams[param]];
        } else {
            searchParams[param] = (searchParams[param] as any).filter(
                (it) => key !== it
            );
        }
    };

    function clearFilters() {
        searchParams = { v: [], h: "", l: [], e: [], c: [], i: [] };
    }

    onMount(() => {
        packMods.set(
            JSON.parse(localStorage.getItem("modrinth_pack_mods")) || []
        );
        packMods.subscribe((v) =>
            localStorage.setItem("modrinth_pack_mods", JSON.stringify(v))
        );
    });

    let cachedPack = { pack: null, mods: [] };

    const handleComplete = (pack: Modpack) => {
        const serialized = pack.serialize();
        const json: ModpackInfo = JSON.parse(serialized);

        let size = 0;
        json.files.forEach((v) => (size += v.fileSize));

        // const mods = Object.keys(json.dependencies)
        //     .map(
        //         (k) =>
        //             `<li><b>${capitalizeAll(k)}</b> @ ${
        //                 json.dependencies[k]
        //             }</li>`
        //     )
        //     .join("");

        const mods = Object.keys(json._dependencies)
            .map(
                (dep) =>
                    `<li><b>${json._dependencies[dep].mod.title}</b> @ ${
                        json._dependencies[dep].version.version_number
                    } (${capitalize(
                        json._dependencies[dep].version.version_type
                    )})<br />Minecraft ${formatVersions(
                        json._dependencies[dep].version.game_versions
                    )}, ${json._dependencies[dep].version.loaders
                        .map((l) => capitalize(l))
                        .join(", ")}</li>`
            )
            .join("");

        popups.set([
            {
                title: "Modpack Info",
                body: `Pack Name: ${
                    json.name || "Unknown"
                }<br />Pack Version: v${
                    json.versionId
                }<br />Pack Size: ${formatBytes(
                    size
                )}<br /><br />Mods: <ul>${mods}</ul>Files: <ul>${json.files
                    .map(
                        (file) =>
                            `<li><b>${file.path}</b><br />(${formatBytes(
                                file.fileSize
                            )}, downloaded from <code>${
                                new URL(file.downloads[0]).host
                            }</code>)</li>`
                    )
                    .join("")}</ul>`,
                button: {
                    label: "",
                    click: (data) => {
                        const zip = new JSZip();
                        zip.file("modrinth.index.json", serialized + "\n");
                        zip.generateAsync({ type: "blob" }).then((blob) => {
                            saveAs(blob, "modpack.mrpack");
                        });
                    },
                },
            },
            ...get(popups),
        ]);
    };

    let stage: FetchStage;

    $: current = 0;
    $: total = $packMods.length;
    $: stage = "none";
    $: mod = "None";

    const buildModpack = () => {
        const mods = get(packMods).map((m) => m.slug);
        const pack = createModpack(mods);

        if (cachedPack.mods == mods) {
            handleComplete(cachedPack.pack);
        } else {
            pack.resolve((i, t, m, d, s) => {
                current = i;
                total = t;
                stage = s;
                mod = m || "Unknown";
            })
                .then(() => {
                    cachedPack = { pack, mods };
                    handleComplete(pack);
                })
                .catch((e) => {
                    console.error(e);
                });
        }
    };
</script>

<Meta
    title="Search {$t(`project.types.${projectType}.plural`)}"
    description="Search and browse {simplify(results.total_hits)} Minecraft {$t(
        `project.types.${projectType}.plural`
    ).toLowerCase()} on Modrinth with instant, accurate search results. Our filters help you quickly find the best Minecraft {$t(
        `project.types.${projectType}.plural`
    ).toLowerCase()}."
/>

<div class="column-layout">
    <div class="column-layout__sidebar">
        <div class="card card--gap-compressed">
            <div class="button-group filters-button">
                <Button
                    label="{showFilters ? 'Hide' : 'Show'} filters"
                    on:click={() => (showFilters = !showFilters)}
                    icon={showFilters ? IconShrink : IconExpand}
                />
            </div>

            <div style:display={showFilters ? "flex" : "none"} class="filters">
                <div class={`button-group ${builder ? "flex__col" : ""}`}>
                    {#if builder}
                        Mod: {mod}<br />
                        Fetching: {current + 1} of {total}<br />
                        Stage: {capitalize(stage)}<br />
                    {/if}
                    <Button
                        label="Clear filters"
                        on:click={clearFilters}
                        icon={IconTrash}
                    />
                    {#if builder}
                        <Button
                            label="Build Modpack"
                            on:click={buildModpack}
                            icon={IconBox}
                        />
                    {/if}
                </div>

                <hr class="divider" />

                <h3>Categories</h3>
                <Input
                    type="checkboxes"
                    options={categories
                        .filter((it) => it.project_type === projectType)
                        .map(({ name }) => ({
                            label: $t(`tags.${name}`),
                            value: name,
                            icon: tagIcons[name],
                        }))}
                    bind:value={searchParams.c}
                />

                <hr class="divider" />

                <h3>Mod Loaders</h3>
                <Input
                    type="checkboxes"
                    options={loaders
                        .filter((it) =>
                            it.supported_project_types.includes(projectType)
                        )
                        .map(({ name }) => ({
                            label: $t(`tags.${name}`),
                            value: name,
                            icon: tagIcons[name],
                        }))}
                    bind:value={searchParams.l}
                    wrap
                />

                <hr class="divider" />

                <h3>Environments</h3>
                <Input
                    type="checkboxes"
                    options={[
                        {
                            label: $t(`tags.client`),
                            value: "client",
                            icon: IconClient,
                        },
                        {
                            label: $t(`tags.server`),
                            value: "server",
                            icon: IconServer,
                        },
                    ]}
                    bind:value={searchParams.e}
                    wrap
                />

                <hr class="divider" />

                <h3>Minecraft versions</h3>
                <Input
                    type="checkbox"
                    bind:value={searchParams.h}
                    label="Show snapshots"
                    icon={IconCode}
                />
                <VirtualList
                    width="100%"
                    height={180}
                    itemCount={filteredVersions.length}
                    itemSize={30}
                >
                    <div
                        slot="item"
                        let:index
                        let:style
                        {style}
                        style:padding-bottom={filteredVersions.length - 1 ===
                        index
                            ? "2.5rem"
                            : ""}
                    >
                        {@const version = filteredVersions[index].version}
                        <Input
                            type="checkbox"
                            value={searchParams.v?.includes(version)}
                            label={version}
                            on:change={(e) => handleChange(e, "v", version)}
                        />
                    </div>
                </VirtualList>
                <Input
                    type="text"
                    placeholder="Search versions..."
                    bind:value={filterTerm}
                />

                <hr class="divider" />

                <h3>Licenses</h3>
                <Input
                    type="checkboxes"
                    options={licenses.map(({ short }) => ({
                        label: short.toUpperCase(),
                        value: short,
                    }))}
                    bind:value={searchParams.i}
                />
            </div>
        </div>
    </div>

    <div class="column-layout__content">
        <Ad />
        <div
            class="card card--gap-compressed card--row card--overflow-visible search-bar"
        >
            <div class="search">
                <IconSearch class="search__icon" />
                <input
                    class="search__input"
                    type="text"
                    placeholder={$t(`project.types.${projectType}.search`)}
                    bind:value={searchParams.q}
                />
            </div>

            <div class="search-bar__field">
                Sort by
                <Multiselect
                    options={[
                        { value: "", label: "Relevance" },
                        { value: "downloads", label: "Downloads" },
                        { value: "follows", label: "Followers" },
                        { value: "newest", label: "Recently created" },
                        { value: "updated", label: "Recently updated" },
                    ]}
                    bind:value={searchParams.s}
                />
            </div>

            <div class="search-bar__field">
                Show per page
                <Multiselect
                    options={[
                        { value: "5", label: "5" },
                        { value: "", label: "10" },
                        { value: "20", label: "20" },
                        { value: "50", label: "50" },
                        { value: "100", label: "100" },
                    ]}
                    bind:value={searchParams.m}
                />
            </div>
        </div>

        <Pagination
            page={(parseInt(searchParams.o.toString()) || 0) / results.limit +
                1}
            count={Math.ceil(results.total_hits / results.limit)}
            on:change={({ detail }) => {
                searchParams.o = ((detail - 1) * results.limit).toString();
            }}
        />

        {#each results.hits as project (project.project_id)}
            <ProjectCard {project} {builder} />
        {/each}

        {#if results.hits.length > 4}
            <Pagination
                page={(parseInt(searchParams.o.toString()) || 0) /
                    results.limit +
                    1}
                count={Math.ceil(results.total_hits / results.limit)}
                on:change={({ detail }) => {
                    searchParams.o = ((detail - 1) * results.limit).toString();
                }}
            />
        {/if}
    </div>
</div>

<style lang="postcss">
    .filters {
        display: flex;
        flex-direction: column;
        grid-gap: 0.6rem;
    }

    .flex__col {
        flex-direction: column;
    }

    @media (width >= 800px) {
        .filters {
            display: flex !important;
        }

        .filters-button {
            display: none;
        }
    }

    .search-bar {
        .search {
            position: relative;
            display: flex;
            align-items: center;
            flex: 1;

            :global(&__icon) {
                position: absolute;
                left: 0.5rem;
                height: 1rem;
                opacity: 0.7;
            }

            &__input {
                width: 100%;
                border-radius: var(--rounded-sm);
                box-shadow: var(--shadow-inset-sm);
                background-color: var(--color-button-bg);
                border: none;
                padding: 0.25rem 0.5rem 0.25rem 2rem;
            }
        }

        &__field {
            display: flex;
            grid-gap: 0.5rem;
            align-items: center;
            flex-wrap: wrap;
        }

        @media (width <= 1050px) {
            flex-wrap: wrap;

            .search {
                flex: unset;
            }
        }
    }

    :global(.virtual-list-wrapper) {
        mask-image: linear-gradient(rgba(0, 0, 0, 1) 80%, transparent);
        scrollbar-color: var(--color-button-bg) var(--color-raised-bg);

        &::-webkit-scrollbar {
            width: 16px;
        }

        &::-webkit-scrollbar-track {
            background-color: var(--color-raised-bg);
            border: 1px solid var(--color-button-bg);
            padding: 1px 0;
            border-radius: 4px;
        }

        &::-webkit-scrollbar-thumb {
            background-color: var(--color-button-bg);
            border-radius: 4px;
        }
    }
</style>
