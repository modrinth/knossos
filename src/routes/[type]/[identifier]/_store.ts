import { writable } from 'svelte/store';

interface Member {
	team_id: string;
	user: User;
	role: string;
	permissions: number;
	accepted: boolean;
}

export const project = writable<Project>();
export const members = writable<Member[]>([]);
export const versions = writable<Version[]>([]);
export const featuredVersions = writable<Version[]>([]);

export const releaseColors = {
	release: 'green',
	beta: 'yellow',
	alpha: 'red',
};
