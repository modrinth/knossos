import { expect, test } from '@playwright/test'

test('landing page has expected stack', async ({ page }) => {
	await page.goto('/')
	const stackColumnFace = page.locator('.stacks__row__column__face').first()
	await stackColumnFace.waitFor()
	expect(await stackColumnFace.getAttribute('src')).toContain('https://')
})
