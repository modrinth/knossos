import gameVersions from '$generated/gameVersions.json';

export function formatVersions(versionArray: string[]): string {
	const allVersions = gameVersions.reverse();

	const intervals = [];
	let currentInterval = 0;

	for (let i = 0; i < versionArray.length; i++) {
		const index = allVersions.findIndex((x) => x.version === versionArray[i]);

		if (i === 0) {
			intervals.push([[versionArray[i], index]]);
		} else {
			const intervalBase = intervals[currentInterval];
			if (intervalBase.length === 2) {
				if (index - intervalBase[1][1] === 1) {
					if (
						allVersions[intervalBase[0][1]].version_type !== 'release' &&
						allVersions[index].version_type === 'release'
					) {
						currentInterval += 1;
						intervals[currentInterval] = [[versionArray[i], index]];
					} else {
						intervalBase[1] = [versionArray[i], index];
					}
				} else {
					currentInterval += 1;
					intervals[currentInterval] = [[versionArray[i], index]];
				}
			} else if (index - intervalBase[0][1] === 1) {
				if (
					allVersions[intervalBase[0][1]].version_type !== 'release' &&
					allVersions[index].version_type === 'release'
				) {
					currentInterval += 1;
					intervals[currentInterval] = [[versionArray[i], index]];
				} else {
					intervalBase[1] = [versionArray[i], index];
				}
			} else {
				currentInterval++;
				intervals[currentInterval] = [[versionArray[i], index]];
			}
		}
	}

	const output = [];

	for (const interval of intervals) {
		if (interval.length === 2) {
			output.push(`${interval[0][0]} - ${interval[1][0]}`);
		} else {
			output.push(interval[0][0]);
		}
	}

	return output.join(', ');
}

export const getPrimary = (files: Version['files']) =>
	files.find((file) => file.primary) || files[0];

export function downloadUrl(file): string {
	return import.meta.env.VITE_API_URL + `version_file/${file.hashes.sha1}/download`;
}
