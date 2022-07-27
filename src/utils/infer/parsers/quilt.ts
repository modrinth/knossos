import type { Parser, NewDependency } from '../types'
import { gameVersionRange, versionType, versionNumber, versionName } from './common'

export const quilt: Parser = ({ meta, project }) => {
	// Like `1.18.x` or `1.15.2`
	const gameVersionString: string =
		meta.quilt_loader?.depends?.find((it) => it?.id === 'minecraft').versions || ''

	return {
		version: {
			name: versionName({ number: meta.quilt_loader.version, gameVersionString, project }),

			version_number: versionNumber({
				number: meta.quilt_loader.version,
				gameVersionString,
				loader: 'quilt',
			}),

			changelog: '',

			game_versions: gameVersionString ? gameVersionRange(gameVersionString) : [],

			version_type: versionType(meta.quilt_loader.version),

			loaders: ['quilt'],
		},
		dependencies: [
			...(meta.quilt_loader?.entrypoints?.modmenu || meta.quilt_loader.modmenu
				? [
						{
							target: 'project',
							identifier: 'modmenu',
							type: 'optional',
						},
				  ]
				: []),
			// Quilt dependencies can be strings or { id: string, optional: boolean }
			...(meta.quilt_loader?.depends?.map((dep) => ({
				target: 'project',
				identifier: dep.id || dep,
				type: dep?.optional ? 'optional' : 'required',
			})) || []),
			...(meta.quilt_loader?.breaks?.map((dep) => ({
				target: 'project',
				identifier: dep.id || dep,
				type: 'incompatible',
			})) || []),
		] as NewDependency[],
	}
}
