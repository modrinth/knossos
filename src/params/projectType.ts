import { projectTypes } from '$generated/tags.json'

/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param) {
	return projectTypes.includes(param)
}
