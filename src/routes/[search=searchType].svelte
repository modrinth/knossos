<script context="module" lang="ts">
	import { search } from '$lib/search'
	import { projectTypes } from '$generated/tags.json'

	/** @type {import('@sveltejs/kit').Load} */
	export async function load({ params, url, fetch, session, stuff }) {
		const projectType = params.search.slice(0, -1)

		const searchParams = {
			c: [],
			e: [],
			i: [],
			l: [],
			m: '',
			o: '',
			s: '',
			...fromUrl(url.searchParams),
		}

		return {
			props: {
				results: await search(searchParams, projectType, { fetch }),
				projectType,
				searchParams,
				serverRendered: true,
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
	import { browser } from '$app/env'
	import { debounce } from 'throttle-debounce'
	import Meta from '$components/utils/Meta.svelte'
	import IconSearch from 'virtual:icons/heroicons-outline/search'
	import IconClient from 'virtual:icons/lucide/laptop'
	import IconServer from 'virtual:icons/lucide/hard-drive'
	import IconCode from 'virtual:icons/heroicons-outline/code'
	import IconExpand from 'virtual:icons/lucide/expand'
	import IconShrink from 'virtual:icons/lucide/shrink'
	import IconTrash from 'virtual:icons/heroicons-outline/trash'
	import { categories, loaders, tagIcons, licenses } from '$generated/tags.json'
	import gameVersions from '$generated/gameVersions.json'
	import { Button, Checkbox, CheckboxList, Select, TextInput, CheckboxVirtualList } from 'omorphia'
	import Ad from '$components/elements/Ad.svelte'
	import { Pagination } from 'omorphia'
	import { simplify } from '$lib/number'
	import { page } from '$app/stores'

	let showFilters = false

	export let results
	export let projectType: string

	export let searchParams: Record<string, any>

	let previousParams = { ...searchParams }

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
			if (v === '' || k === 'code') {
				// Remove empty values and login token code
				url.searchParams.delete(k)
			}
		}

		history.replaceState({}, '', url)
	}

	const runSearch = debounce(200, false, () =>
		search(searchParams, projectType).then((data) => (results = data))
	)

	export let serverRendered: boolean

	$: if (searchParams && browser) {
		if (serverRendered) {
			serverRendered = false
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
			searchParams.o = ''
			replaceStateWithQuery(searchParams)
			runSearch()
		} else if (searchParams.o !== previousParams.o) {
			replaceStateWithQuery(searchParams)
			runSearch()
		} else {
			replaceStateWithQuery(searchParams)
		}

		previousParams = { ...searchParams }
	}

	let filteredVersions = []
	let filterTerm = ''

	$: if (filterTerm && (searchParams.h || !searchParams.h)) {
		filteredVersions = gameVersions.filter((it) => it.version.includes(filterTerm))
	} else if (!searchParams.h) {
		filteredVersions = gameVersions.filter(
			(it) => it.version_type === 'release' || searchParams.v?.includes(it.version)
		)
	} else {
		filteredVersions = gameVersions
	}

	function clearFilters() {
		searchParams = { v: [], h: false, l: [], e: [], c: [], i: [] }
	}
</script>

<Meta
	title="Search {$t(`project.types.${projectType}.plural`)}"
	description="Search and browse {simplify(results.total_hits)} Minecraft {$t(
		`project.types.${projectType}.plural`
	).toLowerCase()} on Modrinth with instant, accurate search results. Our filters help you quickly find the best Minecraft {$t(
		`project.types.${projectType}.plural`
	).toLowerCase()}." />

<div class="column-layout">
	<div class="column-layout__sidebar">
		<div class="card card--gap-compressed">
			<div class="button-group filters-button">
				<Button on:click={() => (showFilters = !showFilters)}>
					{#if showFilters}
						<IconShrink />
					{:else}
						<IconExpand />
					{/if}
					{showFilters ? 'Hide' : 'Show'} filters
				</Button>
			</div>

			<div style:display={showFilters ? 'flex' : 'none'} class="filters">
				<h3>Minecraft versions</h3>
				<CheckboxVirtualList
					height={180}
					options={filteredVersions.map((it) => ({ label: it.version, value: it.version }))}
					bind:value={searchParams.v} />
				<Checkbox bind:checked={searchParams.h}><IconCode /> Show snapshots</Checkbox>
				<TextInput placeholder="Search versions..." bind:value={filterTerm} />

				<hr class="divider" />

				<h3>Mod Loaders</h3>
				<CheckboxList
					options={loaders
						.filter((it) => it.supported_project_types.includes(projectType))
						.map(({ name }) => ({ label: $t(`tags.${name}`), value: name, icon: tagIcons[name] }))}
					bind:value={searchParams.l} />

				<hr class="divider" />

				<h3>Environments</h3>
				<CheckboxList
					options={[
						{ label: $t(`tags.client`), value: 'client', icon: IconClient },
						{ label: $t(`tags.server`), value: 'server', icon: IconServer },
					]}
					bind:value={searchParams.e}
					wrap />

				<hr class="divider" />

				<h3>Categories</h3>
				<CheckboxList
					options={categories
						.filter((it) => it.project_type === projectType)
						.map(({ name }) => ({ label: $t(`tags.${name}`), value: name, icon: tagIcons[name] }))}
					bind:value={searchParams.c} />

				<h3>Licenses</h3>
				<CheckboxList
					options={licenses.map(({ short }) => ({ label: short.toUpperCase(), value: short }))}
					bind:value={searchParams.i} />

				<div class="button-group">
					<Button on:click={clearFilters}><IconTrash /> Clear filters</Button>
				</div>
			</div>
		</div>
	</div>

	<div class="column-layout__content">
		<Ad />
		<div class="card card--gap-compressed card--row card--overflow-visible search-bar">
			<div class="search">
				<IconSearch class="search__icon" />
				<input
					class="search__input"
					type="text"
					placeholder={$t(`project.types.${projectType}.search`)}
					bind:value={searchParams.q} />
			</div>

			<div class="search-bar__field">
				Sort by
				<Select
					options={[
						{ value: '', label: 'Relevance' },
						{ value: 'downloads', label: 'Downloads' },
						{ value: 'follows', label: 'Followers' },
						{ value: 'newest', label: 'Recently created' },
						{ value: 'updated', label: 'Recently updated' },
					]}
					bind:value={searchParams.s} />
			</div>

			<div class="search-bar__field">
				Show per page
				<Select
					options={[
						{ value: '5', label: '5' },
						{ value: '', label: '10' },
						{ value: '20', label: '20' },
						{ value: '50', label: '50' },
						{ value: '100', label: '100' },
					]}
					bind:value={searchParams.m} />
			</div>
		</div>

		<Pagination
			page={(parseInt(searchParams.o) || 0) / results.limit + 1}
			count={Math.ceil(results.total_hits / results.limit)}
			on:change={({ detail }) => (searchParams.o = (detail - 1) * results.limit)} />

		{#each results.hits as project (project.project_id)}
			<ProjectCard {project} />
		{/each}

		{#if results.hits.length > 4}
			<Pagination
				page={(parseInt(searchParams.o) || 0) / results.limit + 1}
				count={Math.ceil(results.total_hits / results.limit)}
				on:change={({ detail }) => {
					searchParams.o = (detail - 1) * results.limit
				}} />
		{/if}
	</div>
</div>

<style lang="postcss">
	.filters {
		display: flex;
		flex-direction: column;
		grid-gap: 0.6rem;
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
