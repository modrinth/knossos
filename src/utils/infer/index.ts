import { unzipSync, strFromU8 } from 'fflate'
import { parsers } from './parsers'
import toml from 'markty-toml'
import type { NewVersion, NewDependency } from './types'

/** Infers meta data of version from file */
export async function inferVersion(
	file: File,
	project: Project
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
		project_id: project.id,
		primary_file: `${file.name}-0`,
		file_parts: [`${file.name}-0`],
		loaders: [],
		dependencies: [],
	}

	let dependencies: NewDependency[] = []

	for (const [fileName, unitArray] of Object.entries(unzipped)) {
		const parser = parsers[fileName as keyof typeof parsers]
		const stringified = strFromU8(unitArray)

		let meta = {}
		if (fileName.endsWith('.json')) {
			meta = JSON.parse(stringified)
		} else if (fileName.endsWith('.toml')) {
			// Workaround for markty-toml#15
			const fixed = stringified.replace(/ #.*\n/g, '\n')
			meta = toml(fixed)
		}

		const result = parser({ meta, project })
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
