import { send } from '$lib/api';

export async function search(urlParams: URLSearchParams): Promise<object> {
	const params = {
		query: urlParams.get('q').toString() ?? '',
		limit: urlParams.get('m').toString() ?? '0',
		offset: urlParams.get('o').toString() ?? '0',
		index: urlParams.get('s').toString() ?? '',
		facets: [],
	};

	const data = send('GET', `search?${new URLSearchParams(params)}`);
}
