import gameVersions from '$generated/gameVersions.json'

/** Gets the list of minecraft versions that a version range encompasses */
export function gameVersionRange(gameVersionString: string): string[] {
	// Truncate characters after `-` & `+`
	const gameString = gameVersionString.replace(/-|\+.*$/g, '')

	let prefix = ''
	if (gameString.includes('~')) {
		// Include minor versions
		// ~1.2.3 -> 1.2
		prefix = gameString.replace('~', '').split('.').slice(0, 2).join('.')
	} else if (gameString.includes('>=')) {
		// Include minor versions
		// >=1.2.3 -> 1.2
		prefix = gameString.replace('>=', '').split('.').slice(0, 2).join('.')
	} else if (gameString.includes('^')) {
		// Include major versions
		// ^1.2.3 -> 1
		prefix = gameString.replace('^', '').split('.')[0]
	} else if (gameString.includes('x')) {
		// Include versions that match `x.x.x`
		// 1.2.x -> 1.2
		prefix = gameString.replace(/\.x$/, '')
	} else {
		// Include exact version
		// 1.2.3 -> 1.2.3
		prefix = gameString
	}

	const simplified: string[] = gameVersions
		.filter((it) => it.version_type === 'release')
		.map((it) => it.version)
	return simplified.filter((version) => version.startsWith(prefix))
}

/** Finds the release channel of a version from its version number */
export function versionType(number: string): 'release' | 'beta' | 'alpha' {
	if (number.includes('alpha')) {
		return 'alpha'
	} else if (
		number.includes('beta') ||
		number.match(/[^A-z](rc)[^A-z]/) || // includes `rc`
		number.match(/[^A-z](pre)[^A-z]/) // includes `pre`
	) {
		return 'beta'
	} else {
		return 'release'
	}
}

/** Creates a version number */
export function versionNumber({
	number,
	gameVersionString,
	loader,
}: {
	number: string | undefined
	gameVersionString: string | undefined
	loader: string | undefined
}): string {
	if (
		number &&
		gameVersionString &&
		loader &&
		!number.includes(gameVersionString.replace(/\^|~|>=|-.*$/g, ''))
	) {
		return `${number}+${gameVersionString}-${loader}`
	} else if (number) {
		return `${number}-${loader}`
	} else {
		return ''
	}
}

/** Creates a version name */
export function versionName({
	number,
	gameVersionString,
	project,
}: {
	number: string | undefined
	gameVersionString: string | undefined
	project: Project
}): string {
	return `${project.title} ${number || 'x.x.x'} ${
		gameVersionString && !number?.includes(gameVersionString.replace(/\^|~|>=|-.*$/g, ''))
			? `for ${gameVersionString}`
			: ''
	}`
}
