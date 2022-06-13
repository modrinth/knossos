import { expect, test } from '@playwright/test'

if (process.env.TEST_MODRINTH_TOKEN) {
	test('login to access notifications', async ({ page }) => {
		await page.goto('/notifications?code=' + process.env.TEST_MODRINTH_TOKEN)
		await page.waitForURL(/\/(|notifications)$/)
		expect(page.url()).toContain('notifications')
	})
} else {
	console.log('Skipping login test because TEST_MODRINTH_TOKEN is not set.')
}
