import type { Parser, NewDependency } from '../types'
import { gameVersionRange, versionType, versionNumber, versionName } from './common'

export const fabric: Parser = ({ meta, project }) => {
	// Like `1.18.x` or `1.15.2`
	const gameVersionString: string = meta?.depends?.minecraft || ''

	return {
		version: {
			name: versionName({ number: meta.version, gameVersionString, project }),

			version_number: versionNumber({
				number: meta.version,
				gameVersionString,
				loader: 'fabric',
			}),

			changelog: '',

			game_versions: gameVersionString ? gameVersionRange(gameVersionString) : [],

			version_type: versionType(meta.version),

			loaders: ['fabric'],
		},
		dependencies: [
			...(meta?.entrypoints?.modmenu
				? [
						{
							target: 'project',
							identifier: 'modmenu',
							type: 'optional',
						},
				  ]
				: []),
			...(meta?.depends
				? Object.keys(meta.depends).map((slug) => ({
						target: 'project',
						identifier: slug,
						type: 'required',
				  }))
				: []),
			...(meta?.recommends
				? Object.keys(meta.recommends).map((slug) => ({
						target: 'project',
						identifier: slug,
						type: 'optional',
				  }))
				: []),
			...(meta?.suggests
				? Object.keys(meta.suggests).map((slug) => ({
						target: 'project',
						identifier: slug,
						type: 'optional',
				  }))
				: []),
			...(meta?.breaks
				? Object.keys(meta.breaks).map((slug) => ({
						target: 'project',
						identifier: slug,
						type: 'incompatible',
				  }))
				: []),
		] as NewDependency[],
	}
}
