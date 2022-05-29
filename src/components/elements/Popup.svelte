<script lang="ts">
    import { t } from 'svelte-intl-precompile'
	import { popups } from '$stores/app'
	import { clickOutside } from 'svelte-use-click-outside'
	import { Button, Select, Chips, TextInput } from 'omorphia'
	import { markdown } from 'omorphia/utils'
	import IconX from 'virtual:icons/heroicons-outline/x'
	import IconArrowRight from 'virtual:icons/heroicons-outline/arrow-right'
	import IconExclamation from 'virtual:icons/heroicons-outline/exclamation'
    import { reportTypes } from '$generated/tags.json'
	import { fade } from 'svelte/transition'
	import { navigating } from '$app/stores'
	import ImageUpload from '$components/elements/ImageUpload.svelte'

	let popup
	$: popup = $popups[0]
	let deletionKey = ''
	let body = ''
	let report_type = ''
	let status = 'approved'
	let project_type = ''
	let name = ''
	let file

	function close() {
		deletionKey = ''
		report_type = ''
		body = ''
		status = 'approved'
		project_type = ''
		name = ''
		file = undefined
		$popups = $popups.slice(1, $popups.length - 1)
	}

	$: {
		if ($navigating) {
			$popups = []
		}
	}
</script>

{#if popup}
	<div class="popup" transition:fade={{ duration: 100 }}>
		<div
			class="popup__card card card--gap-compressed"
			use:clickOutside={() => {
				if (!popup?.type?.creation) close()
			}}
			class:popup__card--wide={popup?.style?.wide}>
			<h1 class="popup__card__top">
				<h2 class="title-secondary">{popup.title}</h2>
				<Button title="Close" color="transparent" on:click={close}><IconX width={20} /></Button>
			</h1>
			{#if popup?.type?.deletion}
				<div class="popup__card__warning">
					<IconExclamation height="26px" width="26px" /><span>{$t('generic.popup.important')}</span>
				</div>
			{/if}
			{#if popup.body}
				{@html markdown(popup.body)}
			{/if}
			{#if popup?.type?.deletion}
				<p><b>To verify, type</b> <i>{popup.type.deletion.key}</i> <b>below:</b></p>
				<TextInput placeholder="{$t('generic.popup.placeholder')}" bind:value={deletionKey} />
			{/if}
			{#if popup?.type?.report}
				<p><b>Reason</b></p>
				<Select
					bind:value={report_type}
					options={reportTypes.map(({ name }) => ({ label: $t(`report.type.${name}`), value: name }))}
				/>
				<p>
					<b>{$t('report.new.information')}</b><br />{$t('report.new.description')}
				</p>
				<TextInput multiline placeholder="Enter additional information..." bind:value={body} />
			{/if}
			{#if popup?.type?.creation === 'project'}
				<p><b>Project type</b></p>
				<Chips
					bind:value={project_type}
					options={[
						{ label: 'Mod', value: 'mod' },
						{ label: 'Modpack', value: 'modpack' },
					]} />
				<p><b>Name</b></p>
				<TextInput placeholder="Enter project name..." bind:value={name} />
				<p><b>Summary</b><br />This appears in search and on the sidebar of your project's page.</p>
				<TextInput multiline placeholder="Enter short summary of project..." bind:value={body} />
			{/if}
			{#if popup?.type?.creation === 'galleryItem'}
				<p>
					<b
						>{#if !file}Image file{:else}Preview{/if}</b>
				</p>
				<ImageUpload bind:file />
				<p><b>Title</b></p>
				<TextInput placeholder="Enter image title..." bind:value={name} />
				<p><b>Description</b></p>
				<TextInput multiline placeholder="Enter image description..." bind:value={body} />
			{/if}
			{#if popup?.type?.moderation}
				<p><b>Status</b></p>
				<Select
					bind:value={status}
					options={[
						{ label: 'Approve', value: 'approved' },
						{ label: 'Unlist', value: 'unlisted' },
						{ label: 'Reject', value: 'rejected' },
					]} />
				<p>
					<b>Moderation message</b><br />Optionally include information to communicate problems with
					a project's team members. Markdown formatting is supported.
				</p>
				<TextInput multiline placeholder="Enter additional information..." bind:value={body} />
			{/if}
			<div class="popup__card__buttons">
				{#if popup?.type?.deletion}
					<Button on:click={close}>Cancel</Button>
				{/if}
				<Button
					on:click={async () => {
						await popup.button?.click({ body, status, report_type, project_type, name, file })
						close()
					}}
					color={popup?.type?.deletion ? 'danger' : 'primary'}
					disabled={(popup?.type?.deletion && popup.type.deletion.key !== deletionKey) ||
						(popup?.type?.report && !report_type) ||
						(popup?.type?.creation === 'project' && (!project_type || !name || !body)) ||
						(popup?.type?.creation === 'galleryItem' && !file)}>
					{#if !popup?.type?.deletion && !popup?.type?.report}
						<IconArrowRight />
					{/if}
					{popup?.button?.label || 'Continue'}
				</Button>
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	.popup {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: hsla(0, 0%, 0%, 0.5);
		backdrop-filter: blur(3px);
		z-index: 20;
		display: flex;
		justify-content: center;
		align-items: center;

		&__card {
			width: 80%;
			max-width: 600px;
			z-index: 25;
			max-height: calc(100% - 2rem);
			overflow-y: auto;

			&--wide {
				max-width: 750px;
			}

			&__top {
				background-color: var(--color-bg);
				margin: -1rem -1rem 0.5rem -1rem;
				padding: 0.8rem 1rem 0.8rem 1.25rem;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}

			&__warning {
				margin: -1.1rem -1rem 0.25rem;
				background-color: var(--color-danger-bg);
				padding: 1rem 1.25rem;
				display: flex;
				align-items: center;
				grid-gap: 0.5rem;
				color: var(--color-danger-text);
				border-color: var(--color-danger-text);
				border-width: 0.15rem 0;
				border-style: solid;
			}

			:global(p),
			:global(ul),
			:global(ol) {
				line-height: 1.5;
				margin: 0;

				:global(a) {
					color: var(--color-link);

					&:hover {
						text-decoration: underline;
					}
				}
			}

			&__buttons {
				margin-top: 1rem;
				display: flex;
				justify-content: flex-end;
				grid-gap: 1rem;
			}
		}
	}
</style>
