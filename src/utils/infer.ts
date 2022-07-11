import { unzipSync, strFromU8 } from 'fflate'
import toml from 'markty-toml'
import gameVersions from '$generated/gameVersions.json'

// TODO: Finish Fabric support (handle incomplete mod.json)
// TODO: Forge & Quilt support

/** Gets the list of minecraft versions that a version range encompasses */
function gameVersionRange(range: string): string[] {
	const simplified: string[] = gameVersions
		.filter((it) => it.version_type === 'release')
		.map((it) => it.version)
	const prefix = range.replace(/\.x$/, '')
	return simplified.filter((version) => version.startsWith(prefix))
}

/* Finds the release channel of a version from its version number */
function versionType(number: string): 'release' | 'beta' | 'alpha' {
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

const parsers: Record<
	string,
	(meta: Record<string, any>) => Promise<{ version: NewVersion; dependencies: NewDependency }>
> = {
	'fabric.mod.json': async (meta) => {
		const dependencies = [
			...(meta.entrypoints.modmenu && [
				{
					target: 'project',
					identifier: 'modmenu',
					type: 'optional',
				},
			]),
			...Object.keys(meta.breaks).map((slug) => ({
				target: 'project',
				identifier: slug,
				type: 'incompatible',
			})),
		]

		const game_versions = [...(meta.depends.minecraft && gameVersionRange(meta.depends.minecraft))]

		return {
			version: {
				name: `${meta.name} ${meta.version} for ${meta.depends.minecraft}`,
				version_number: `${meta.version}+${meta.depends.minecraft}-fabric`,
				changelog: '',
				game_versions,
				version_type: versionType(meta.version),
				loaders: ['fabric'],
			},
			dependencies,
		}
	},
	'quilt.mod.json': (meta) => {
		console.log(meta)
	},
	'META-INF/mods.toml': (meta) => {
		console.log(meta)
	},
}

interface NewVersion {
	name?: string
	project_id?: string
	file_parts?: string[]
	version_number?: string
	changelog?: string
	dependencies?: Version['dependencies']
	game_versions?: string[]
	loaders?: string[]
	version_type?: 'alpha' | 'beta' | 'release'
	featured?: boolean
	primary_file?: string
}

interface NewDependency {
	target: 'project' | 'version'
	identifier: string
	type: 'required' | 'optional' | 'incompatible' | 'embedded'
}

/** Infers meta data of version from file */
export async function inferVersion(
	file: File,
	projectId: string
): Promise<{
	version: NewVersion
	file: File
	dependencies: NewDependency[]
}> {
	const zip = new Uint8Array(await file.arrayBuffer())

	const unzipped = unzipSync(zip, {
		filter: (file) => Object.keys(parsers).includes(file.name),
	})

	const version: NewVersion = {
		featured: false,
		project_id: projectId,
		primary_file: `${file.name}-0`,
		file_parts: [`${file.name}-0`],
		loaders: [],
		dependencies: [],
	}

	let dependencies = []

	for (const [fileName, unitArray] of Object.entries(unzipped)) {
		const parser = parsers[fileName as keyof typeof parsers]
		const stringified = strFromU8(unitArray)

		let meta = {}
		if (fileName.endsWith('.json')) {
			meta = JSON.parse(stringified)
		} else if (fileName.endsWith('.toml')) {
			meta = toml(stringified)
		}

		const result = await parser(meta)
		dependencies = dependencies.concat(result.dependencies)

		for (const [key, value] of Object.entries(result.version)) {
			if (key === 'loaders') {
				version.loaders = version.loaders!.concat(value)
			} else {
				version[key as keyof NewVersion] = value
			}
		}
	}

	return {
		version,
		file,
		dependencies,
	}
}
