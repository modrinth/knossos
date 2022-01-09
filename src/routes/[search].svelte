<script context="module" lang="ts">
	import { send } from '$lib/api';

	export async function load({ page, fetch, session, stuff }) {
		const project_type = page.params.search.replace('s', '');

		if (!['mod', 'modpack'].includes(project_type)) {
			return {
				status: 404,
			};
		}
		const url = `search?query=${page.params.search}`;
		const { data } = await send('GET', url);

		return {
			props: {
				data,
			},
		};
	}
</script>

<script lang="ts">
</script>
