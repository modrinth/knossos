/// <reference types="@sveltejs/kit" />
/// <reference types="unplugin-icons/types/svelte" />

declare module '$assets/*'
declare module '$locales'
declare module '$assets/*.svg'
declare module 'markty-toml'

type schemas = import('$generated/openapi').components['schemas']
type Project = schemas['Project']
type Version = schemas['Version']
type User = schemas['User']
type Report = schemas['Report']
