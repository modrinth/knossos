import { get } from 'svelte/store';
import { gameVersions as gameVersionsStore } from '$stores/tags';

export function formatVersions(versionArray: string[]): string {
	const gameVersions = get(gameVersionsStore);
	const all: string[] = gameVersions.map((it) => it.version).reverse();
	const allMajors: string[] = gameVersions
		.filter((it) => it.version_type === 'release')
		.map((it) => it.version)
		.reverse();
	const borders: Array<string[]> = [];

	for (const version of versionArray) {
		const index = versionArray.indexOf(version);
		if (index === 0) {
			borders[0] = [version];
		} else {
			const allIndex = all.indexOf(version);
			const allMajorIndex = allMajors.indexOf(version);
			if (all.length - 1 >= allIndex && allMajors.length - 1 >= allMajorIndex) {
				const lastAny = all[allIndex - 1];
				const lastMajor = allMajors[allMajorIndex - 1];
				const border = borders[borders.length - 1][1] ?? borders[borders.length - 1][0];
				if (border === lastAny || border === lastMajor) {
					borders[borders.length - 1][1] = version;
				} else {
					borders.push([version]);
				}
			}
		}
	}

	let output = '';
	borders.forEach((border, index) => {
		output += `${border[0]}${border[1] ? '-' + border[1] : ''}${
			index !== borders.length - 1 ? ', ' : ''
		}`;
	});

	return output;
}
