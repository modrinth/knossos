<script lang="ts">
	import Input from '$components/elements/Input.svelte';

	interface Field {
		key: string;
		label?: string;
		placeholder?: string;
		type: 'text' | 'select' | 'checkboxes' | 'textarea';
		options?: [
			{
				label: string;
				value: string | number;
			}
		];
		validation?: {
			required?: boolean;
			characters?: 'numeric' | 'url';
			length?: {
				min?: number;
				max?: number;
			};
		};
	}

	export let fields: Field[];
	export let route: string;

	async function submit() {
		console.log({ route });
		console.log(this);
	}
</script>

<form on:submit|preventDefault={submit} class="form">
	{#each fields as field (field.key)}
		<Input {...field} />
	{/each}
</form>

<style lang="postcss">
	.form {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		grid-gap: 1rem;
	}
</style>
