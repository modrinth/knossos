// import { projectTypes } from '$generated/tags.json'

let projectTypes = ['mod', 'modpack', 'plugin', 'resourcepack']

/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param) {
	return projectTypes.includes(param.slice(0, -1))
}
