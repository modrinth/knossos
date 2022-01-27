import { send } from '$lib/api';

export async function search(
	params: Record<string, string | string[]>,
	projectType: string
): Promise<unknown> {
	let facets = [[`project_type:${projectType}`]];

	const searchParams = {
		query: params.q ?? '',
		limit: params.m || '5',
		offset: params.o || '0',
		index: params.s || 'relevance',
	};

	// Versions
	if (params.v?.length > 0 && Array.isArray(params.v)) {
		const versions = params.v.map((version) => `versions:${version}`);
		facets.push(versions);
	}

	// Loaders
	if (params.l?.length > 0 && Array.isArray(params.l)) {
		params.l.forEach((loader) => facets.push([`categories:${loader}`]));
	}

	// Environments
	if (params.e?.length > 0 && Array.isArray(params.e)) {
		const includesClient = params.e.includes('client');
		const includesServer = params.e.includes('server');
		if (includesClient && includesServer) {
			facets = [...facets, ['client_side:required'], ['server_side:required']];
		} else {
			if (includesClient) {
				facets = [
					...facets,
					['client_side:optional', 'client_side:required'],
					['server_side:optional', 'server_side:unsupported'],
				];
			}
			if (includesServer) {
				facets = [
					...facets,
					['client_side:optional', 'client_side:unsupported'],
					['server_side:optional', 'server_side:required'],
				];
			}
		}
	}

	// Categories
	if (params.c?.length > 0 && Array.isArray(params.c)) {
		params.c.forEach((category) => facets.push([`categories:${category}`]));
	}

	// Licenses
	if (params.i?.length > 0 && Array.isArray(params.i)) {
		const licenses = params.i.map((license) => `license:${license}`);
		facets.push(licenses);
	}

	return await send(
		'GET',
		`search?${new URLSearchParams({
			...(searchParams as Record<string, string>),
			facets: JSON.stringify(facets),
		})}`
	);
}
