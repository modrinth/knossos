import { projectTypes } from '$generated/tags.json'

/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param) {
	if(param == "builder") return true
	return projectTypes.includes(param.slice(0, -1))
}
