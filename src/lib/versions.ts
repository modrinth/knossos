import gameVersions from '$generated/gameVersions.json';

export function formatVersions(versionArray: string[]): string {
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

export const getPrimary = (files: Version['files']) =>
	files.find((file) => file.primary) || files[0];

export function downloadUrl(file): string {
	return import.meta.env.VITE_API_URL + `version_file/${file.hashes.sha1}/download`;
}
