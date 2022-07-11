import { writable } from 'svelte/store'
import type { Permissions } from 'omorphia/utils'

export const project = writable<Project>()
export const members = writable<schemas['TeamMember'][]>([])
export const versions = writable<Version[]>([])
export const featuredVersions = writable<Version[]>([])
export const dependencies = writable<schemas['ProjectDependencyList']>()
export const permissions = writable<Permissions>()
export const color = writable<string>()

export const releaseColors = {
	release: 'green',
	beta: 'yellow',
	alpha: 'red',
}
