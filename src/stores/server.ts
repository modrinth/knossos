import { writable } from 'svelte/store';

export const token = writable('');

export const user = writable<User | null>();
