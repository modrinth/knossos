<script lang="ts">
	import Button from '$components/elements/Button.svelte';
	import Meta from '$components/utils/Meta.svelte';
	import { markdownXSS } from '$lib/parse';
	import { getContext } from 'svelte';
	import { t } from 'svelte-intl-precompile';
	import IconPencil from 'virtual:icons/heroicons-outline/pencil';

	let project: Project = getContext('project');
</script>

<Meta title={project.title} description={project.description} />

<div class="card card--text">
	<div class="card__overlay">
		<Button label={$t('generic.actions.edit')} icon={IconPencil} />
	</div>
	{@html markdownXSS(project.body)}
</div>
