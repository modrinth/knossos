<script lang="ts">
	import Multiselect from "$components/elements/Multiselect.svelte";

  export let key: string;
	export let label = '';
	export let placeholder = '';
	export let type: 'text' | 'select' | 'checkboxes' | 'textarea';
	export let options: [
		{
			label: string;
			value: string | number;
		}
	] = [];

	export let validation: {
		required?: boolean;
		characters?: 'numeric' | 'url';
		length?: {
			min?: number;
			max?: number;
		};
	} = {};
</script>

<div class="input">
  <div class="input__label">
   {label}
  </div>
	{#if type === 'text'}
		<input type="text" name={key} class="input-box" {placeholder} />
	{:else if type === 'select'}
		<Multiselect {options} value={options[0].value} />
	{:else if type === 'checkboxes'}
		<div>
			{#each options as option}
				<label>
					<input type="checkbox" name={key} value={option.value} />
					{option.label}
				</label>
			{/each}
		</div>
	{:else if type === 'textarea'}
		<textarea name={key} class="input-box" />
	{/if}
</div>

<style lang="postcss">
	.input-box {
		border-radius: var(--rounded-sm);
		box-shadow: var(--shadow-inset-sm);
		background-color: var(--color-button-bg);
		border: none;
    padding: 0.25rem 0.5rem;
  }
</style>
