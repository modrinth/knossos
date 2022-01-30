import { popups } from '$stores/app';
import { get } from 'svelte/store';

export function report(type: 'project' | 'user' | 'version', id: string): void {
	popups.set([
		{
			title: `Report ${type}`,
			body: `Modding should be safe for everyone, so we take abuse and malicious intent seriously at Modrinth. We want to hear about harmful behavior on the site that violates our [ToS](/legal/terms) and [Rules](/legal/rules). Rest assured, we’ll keep your identifying information private.`,
			type: {
				report: {
					type,
					id,
				},
			},
		},
		...get(popups),
	]);
}
