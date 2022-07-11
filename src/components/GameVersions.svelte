<script lang="ts">
	import gameVersions from '$generated/gameVersions.json'
	import { Checkbox, CheckboxVirtualList, TextInput } from 'omorphia'
	import { t } from 'svelte-intl-precompile'
	import IconCode from 'virtual:icons/heroicons-outline/code'
	import IconFilter from 'virtual:icons/heroicons-outline/filter'

	export let snapshots = false
	export let value: string[] | undefined = []

	let filteredVersions: string[] = []
	let filterTerm = ''

	$: if (filterTerm) {
		filteredVersions = gameVersions
			.filter((it) => it.version.includes(filterTerm))
			.map((it) => it.version)
	} else if (snapshots) {
		filteredVersions = gameVersions.map((it) => it.version)
	} else {
		filteredVersions = gameVersions
			.filter((it) => it.version_type === 'release' || value?.includes(it.version))
			.map((it) => it.version)
	}
</script>

<CheckboxVirtualList
	height={180}
	options={filteredVersions.map((version) => ({ label: version, value: version }))}
	bind:value />
<Checkbox bind:checked={snapshots}>
	<IconCode />{$t('search.filters.show_snapshots')}
</Checkbox>
<TextInput
	placeholder={$t('search.filters.search_versions')}
	bind:value={filterTerm}
	icon={IconFilter}
	fill />
