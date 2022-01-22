<script context="module" lang="ts">
  import { search } from '$lib/search'
  import { projectTypes } from '$generated/tags.json'

  /** @type {import('@sveltejs/kit').Load} */
  export async function load({params, url, fetch, session, stuff}) {
    const projectType = params.search.replace('s', '')

    if (!projectTypes.includes(projectType)) {
      return {
        status: 404,
      }
    }

    const searchParams = fromUrl(url.searchParams)

    return {
      props: {
        results: await search(searchParams, projectType),
        projectType,
        searchParams,
      },
    }
  }

  function fromUrl(params: URLSearchParams) {
    const entries = Array.from(params.entries()).map(([key, value]) => {
      if (['v', 'c', 'e', 'l', 'i'].includes(key)) value = value.split('~')
      return [key, value]
    })
    return Object.fromEntries(entries)
  }
</script>

<script lang="ts">
  import ProjectCard from '$components/elements/ProjectCard.svelte'
  import { t } from 'svelte-intl-precompile'
  import Input from '$components/elements/Input.svelte'
  import Multiselect from '$components/elements/Multiselect.svelte'
  import { browser } from '$app/env'
  import { debounce } from 'throttle-debounce'
  import Meta from '$components/utils/Meta.svelte'
  import IconSearch from 'virtual:icons/heroicons-outline/search'
  import IconClient from 'virtual:icons/lucide/laptop'
  import IconServer from 'virtual:icons/lucide/hard-drive'
  import IconCode from 'virtual:icons/heroicons-outline/code'
  import { categories, loaders, tagIcons, licenses } from '$generated/tags.json'
  import VirtualList from 'svelte-tiny-virtual-list'
  import gameVersions from '$generated/gameVersions.json'
  import Button from '$components/elements/Button.svelte'

  export let results
  export let projectType: string

  export let searchParams: Record<string, string | string[]>

  const replaceStateWithQuery = (values: Record<string, unknown>) => {
    const url = new URL(window.location.toString())
    for (let [k, v] of Object.entries(values)) {
      if (!!v) {
        if (Array.isArray(v)) v = v.join('~')
        url.searchParams.set(encodeURIComponent(k), encodeURIComponent(v))
      } else {
        url.searchParams.delete(k)
      }
    }
    for (let [k, v] of Array.from(url.searchParams.entries())) {
      if (!v) {
        url.searchParams.delete(k)
      }
    }
    history.replaceState({}, '', url)
  }

  const runSearch = debounce(200, true, () => search(searchParams, projectType).then(data => results = data))

  $: if (searchParams && browser) {
    replaceStateWithQuery(searchParams)
    runSearch()
  }

  let filteredVersions = []
  let filterTerm = ''

  $: if (filterTerm && (searchParams.h || !searchParams.h)) {
    filteredVersions = gameVersions.filter(it => it.version.includes(filterTerm))
  } else if (!searchParams.h) {
    filteredVersions = gameVersions.filter(it => it.version_type === 'release' || searchParams.v?.includes(it.version))
  } else {
    filteredVersions = gameVersions
  }

  const handleChange = (e, param, key) => {
    if (e.target.checked) {
      if (!searchParams[param]) searchParams[param] = [];
      searchParams[param] = [key, ...searchParams[param]];
    } else {
      searchParams[param] = searchParams[param].filter((it) => key !== it)
    }
  }
</script>

<Meta title={$t(`project.types.${projectType}.plural`)}/>

<div class="column-layout">
  <div class="column-layout__sidebar">
    <div class="card card--gap-compressed">
      <h3>Minecraft versions</h3>
      <VirtualList
        width="100%"
        height={180}
        itemCount={filteredVersions.length}
        itemSize={30}>
        <div slot="item" let:index let:style {style} style:padding-bottom={(filteredVersions.length) - 1 === index ? '2.5rem' : ''}>
          {@const version = filteredVersions[index].version}
          <Input type="checkbox" value={searchParams.v?.includes(version)} label={version} on:change={(e) => handleChange(e, 'v', version)}/>
        </div>
      </VirtualList>
      <Input type="checkbox" bind:value={searchParams.h} label="Show snapshots" icon={IconCode}/>
      <Input type="text" placeholder="Search versions..." bind:value={filterTerm}/>

      <hr class="divider"/>

      <h3>Mod Loaders</h3>
      <Input type="checkboxes" options={loaders.filter(it => it.supported_project_types.includes(projectType)).map(({name}) => ({ label: $t(`tags.${name}`), value: name, icon: tagIcons[name] }))} bind:value={searchParams.l} wrap/>

      <hr class="divider"/>

      <h3>Environments</h3>
      <Input type="checkboxes" options={[
        { label: $t(`tags.client`), value: 'client', icon: IconClient },
        { label: $t(`tags.server`), value: 'server', icon: IconServer },
      ]} bind:value={searchParams.e} wrap/>

      <hr class="divider"/>

      <h3>Categories</h3>
      <Input type="checkboxes" options={categories.filter(it => it.project_type === projectType).map(({name}) => ({ label: $t(`tags.${name}`), value: name, icon: tagIcons[name] }))} bind:value={searchParams.c} />

      <h3>Licenses</h3>
      <Input type="checkboxes" options={licenses.map(({short}) => ({ label: short.toUpperCase(), value: short }))} bind:value={searchParams.i} />

      <div class="button-group">
        <Button label="Clear filters" on:click={() => { searchParams = { v: [], h: '', l: [], e: [], c: [], i: [] } }}/>
      </div>
    </div>
  </div>

  <div class="column-layout__content">
    <div class="card card--gap-compressed card--row card--overflow-visible">
      <div class="search">
        <IconSearch class="search__icon"/>
        <input class="search__input" type="text" placeholder="{$t(`project.types.${projectType}.search`)}" bind:value={searchParams.q}/>
      </div>

      Sort by
      <Multiselect options={[
        { value: "", label: "Relevance" },
        { value: "downloads", label: "Downloads" },
        { value: "follows", label: "Followers" },
        { value: "newest", label: "Recently created" },
        { value: "updated", label: "Recently updated" },
        ]} bind:value={searchParams.s}/>

      Show per page
      <Multiselect options={[
        { value: "", label: "5" },
        { value: "10", label: "10" },
        { value: "20", label: "20" },
        { value: "50", label: "50" },
        { value: "100", label: "100" },
        ]} bind:value={searchParams.m}/>
    </div>

    {#each results.hits as project (project.project_id)}
      <ProjectCard {project}/>
    {/each}
  </div>
</div>

<style lang="postcss">
  .search {
    position: relative;
    display: flex;
    align-items: center;

    :global(&__icon) {
      position: absolute;
      left: 0.5rem;
      height: 1rem;
      opacity: 0.7;
    }

    &__input {
      border-radius: var(--rounded-sm);
      box-shadow: var(--shadow-inset-sm);
      background-color: var(--color-button-bg);
      border: none;
      padding: 0.25rem 0.5rem 0.25rem 2rem;
    }
  }

  :global(.virtual-list-wrapper) {
    mask-image: linear-gradient(rgba(0, 0, 0, 1.0) 80%, transparent);
    scrollbar-color: var(--color-button-bg) var(--color-raised-bg);

    &::-webkit-scrollbar {
      width: 16px;
    }

    &::-webkit-scrollbar-track {
      background-color: var(--color-raised-bg);
      border: 1px solid var(--color-button-bg);
      border-top-width: 0;
      padding: 1px 0;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--color-button-bg);
    }
  }
</style>
