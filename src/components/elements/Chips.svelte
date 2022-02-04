<script lang="ts">
  import Button from "$components/elements/Button.svelte";
  import IconCheck from 'virtual:icons/heroicons-outline/check'

  interface Option {
    label: string;
    value: string | number;
  }

  export let options: Option[] = [];
  export let value: string | number;
  export let selected: Option | null = options.find((option) => option.value === (value || ''));
  export let neverEmpty = false;

  $: if (selected) {
    value = selected.value;
  } else {
    value = ''
  }
</script>

<div class="chips">
  {#each options as option}
    {@const isSelected = selected?.value === option.value}
    <Button
      label={option.label}
      color={isSelected ? 'brand-light' : undefined}
      on:click={() => {
        isSelected && !neverEmpty
          ? selected = null
          : selected = option
      }}
      icon={isSelected ? IconCheck : undefined}
    />
  {/each}
</div>

<style lang="postcss">
  .chips {
    display: flex;
    grid-gap: 0.5rem;
  }
</style>
