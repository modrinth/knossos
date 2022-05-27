import { popups } from '$stores/app'
import { get } from 'svelte/store'
import { send } from '$lib/api'

export function report(type: 'project' | 'user' | 'version', id: string): void {
	popups.set([
		{
			title: `Report ${type}`,
			body: `Modding should be safe for everyone, so we take abuse and malicious intent seriously at Modrinth. We want to hear about harmful behavior on the site that violates our [ToS](/legal/terms) and [Rules](/legal/rules). Rest assured, we’ll keep your identifying information private.`,
			type: {
				report: true,
			},
			button: {
				label: `Report ${type}`,
				click: async ({ report_type, body }) => {
					await send('POST', 'report', {
						report_type,
						body,
						item_id: id,
						item_type: type,
					})
				},
			},
		},
		...get(popups),
	])
}
