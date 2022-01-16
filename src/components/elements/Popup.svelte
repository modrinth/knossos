<script lang="ts">
	import { popups } from '$stores/app';
	import { clickOutside } from 'svelte-use-click-outside';
	import Multiselect from '$components/elements/Multiselect.svelte';
	import Button from '$components/elements/Button.svelte';

	$: popup = $popups[0];

	function close() {
		$popups = $popups.slice(1, $popups.length - 1);
		console.log($popups);
	}
</script>

{#if $popups.length > 0}
	<div class="popup">
		<div class="popup__card card card--gap-compressed" use:clickOutside={close}>
			<h1 class="title">{popup.title}</h1>
			{#if popup.description}
				<p class="popup__card__description">{@html popup.description}</p>
			{/if}
			{#if popup.form}
				<form class="popup__form" on:submit|preventDefault={popup.form.action}>
					{#each popup.form.fields as field}
						<div class="popup__form__field">
							<label for={'popup_form_' + field.label}>{field.label}</label>
							{#if field.type === 'text'}
								<input
									type="text"
									name={field.label}
									id={'popup_form_' + field.label}
									value={field.value}
								/>
							{:else if field.type === 'multiselect'}
								<Multiselect options={field.options} />
							{/if}
						</div>
					{/each}
				</form>
			{/if}
			<div class="popup__card__buttons">
				<Button on:click={close} label="Close" />
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
			max-width: 500px;
			z-index: 25;

			&__description {
				line-height: 1.3;
				font-size: 0.9rem;

				:global(a) {
					color: var(--color-link);

					&:hover {
						text-decoration: underline;
					}
				}
			}

			&__buttons {
				display: flex;
				justify-content: flex-end;
			}
		}
	}
</style>
