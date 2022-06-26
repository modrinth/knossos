/// <reference types="@sveltejs/kit" />
/// <reference types="unplugin-icons/types/svelte" />

declare module '$assets/images/*'
declare module '$locales'
declare module '$generated/*'
declare module '$assets/images/*.svg'

type schemas = import('$generated/openapi').components['schemas']
type Project = schemas['Project']
type Version = schemas['Version']
type User = schemas['User']
type Report = schemas['Report']
