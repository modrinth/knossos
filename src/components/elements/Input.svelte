<script lang="ts">
	import Multiselect from "$components/elements/Multiselect.svelte";
  import IconCheck from 'virtual:icons/heroicons-outline/check'
  import { SvelteComponent } from 'svelte'

  export let key = '';
	export let label = '';
	export let placeholder = '';
  export let icon: string | SvelteComponent = '';
	export let type: 'text' | 'select' | 'checkboxes' | 'textarea' | 'checkbox';
	export let options: [
		{
			label: string;
			value: string | number;
      icon: string;
		}
	] = [];
  export let value = undefined;
  if (type === 'checkboxes' && !value) value = []

  export let wrap = false;

	// export let validation: {
	// 	required?: boolean;
	// 	characters?: 'numeric' | 'url';
	// 	length?: {
	// 		min?: number;
	// 		max?: number;
	// 	};
	// } = {};

  const handleChange = (e, key) => {
    if (e.target.checked) {
      if (!value) value = []
      value = [key, ...value];
    } else {
      value = value.filter((it) => key !== it)
    }
  }
</script>

  {#if type !== 'checkbox' && label}
    <div class="input__label">
     {label}
    </div>
  {/if}
	{#if type === 'text'}
		<input type="text" name={key} class="input-box" {placeholder} bind:value={value} />
	{:else if type === 'select'}
		<Multiselect {options} value={options[0].value} />
	{:else if type === 'checkboxes'}
		<div class="checkboxes" class:wrap>
			{#each options as option}
				<svelte:self type='checkbox' {...option} on:change={(e) => handleChange(e, option.value)} value={value?.includes(option.value)} />
			{/each}
		</div>
	{:else if type === 'textarea'}
		<textarea name={key} class="input-box input-box--fill" {placeholder} bind:value={value} />
  {:else if type === 'checkbox'}
    <label class="checkbox">
      <input type='checkbox' bind:checked={value} on:change>
      <span class="checkbox__box">
          <IconCheck class="checkbox__box__icon" />
      </span>
      {#if typeof icon === 'string'}
        {@html icon}
      {:else}
        <svelte:component this={icon} />
      {/if}
      {label}
    </label>
	{/if}

<style lang="postcss">
	.input-box {
		border-radius: var(--rounded-sm);
		box-shadow: var(--shadow-inset-sm);
		background-color: var(--color-button-bg);
		border: none;
    padding: 0.25rem 0.75rem;
    width: 20rem;
    max-width: 100%;

    &--fill {
      width: 100%;
      padding: 0.5rem 0.75rem;
    }
  }

  .checkboxes {
    display: flex;
    flex-direction: column;

    &.wrap {
      flex-direction: row;
      flex-wrap: wrap;
      grid-gap: 2rem;
    }
  }

  .checkbox {
    input {
      display: none;
    }
    display: inline-flex;
    align-items: center;
    grid-gap: 0.5rem;

    > :global(svg) {
      width: 1.1rem;
      margin-right: -0.1rem;
    }

    &__box {
      height: 1rem;
      width: 1rem;
      display: flex;
      border-radius: 0.25rem;
      background-color: var(--color-button-bg);
      justify-content: center;
      align-items: center;

      :global(&__icon) {
        display: none;
        width: 1rem;
        height: 1rem;
        color: var(--color-raised-bg)
      }
    }

    [type=checkbox]:checked + span {
      background-color: var(--color-brand);

      :global(.checkbox__box__icon) {
        display: unset;
      }
    }
  }
</style>
