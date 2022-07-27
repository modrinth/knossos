export interface NewVersion {
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

export interface NewDependency {
	target: 'project' | 'version'
	identifier: string
	type: 'required' | 'optional' | 'incompatible' | 'embedded'
}

export type Parser = ({ meta, project }: { meta: Record<string, any>; project: Project }) => {
	version: NewVersion
	dependencies: NewDependency[]
}
