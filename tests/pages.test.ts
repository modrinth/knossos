import { expect, test } from '@playwright/test'

test('landing page', async ({ page }) => {
	await page.goto('/')

	// Test stacks exist with link
	const stackColumnFace = page.locator('.stacks__row__column__face').first()
	await stackColumnFace.waitFor()
	expect(await stackColumnFace.getAttribute('src')).toContain('https://')

	// Test navigation
	// Click header >> text=Mods
	await page.locator('header >> text=Mods').click()
	await page.waitForNavigation()
	await expect(page).toHaveURL('http://localhost:3000/mods')
})

test('search', async ({ page }) => {
	await page.goto('/mods')

	// Click button:has-text("2") >> nth=1
	await page.locator('button:has-text("2")').nth(1).click()
	await expect(page).toHaveURL('http://localhost:3000/mods?o=10')
	// Click text=10 10 5 10 20 50 100 >> div >> nth=0
	await page.locator('text=10 10 5 10 20 50 100 >> div').first().click()
	// Click text=5
	await page.locator('button:has-text("5")').first().click()
	await expect(page).toHaveURL('http://localhost:3000/mods?m=5')
	// Click text=Client
	await page.locator('text=Client').click()
	await expect(page).toHaveURL('http://localhost:3000/mods?m=5&e=client')
	// Click text=Clear filters
	await page.locator('text=Clear filters').click()
	await expect(page).toHaveURL('http://localhost:3000/mods?m=5')
	// Click [placeholder="Search mods\.\.\."]
	await page.locator('[placeholder="Search mods\\.\\.\\."]').click()
	// Fill [placeholder="Search mods\.\.\."]
	await page.locator('[placeholder="Search mods\\.\\.\\."]').fill('test')
	await expect(page).toHaveURL('http://localhost:3000/mods?m=5&q=test')
})

test('user', async ({ page }) => {
	await page.goto('/user/venashial')

	// Test title exists
	expect(await page.locator('h1 >> nth=0').innerHTML()).toBe('venashial')

	// Test github link
	expect(await page.locator('text=GitHub profile').getAttribute('href')).toBe(
		'https://github.com/venashial'
	)

	// Test page sub-navigation
	await page.locator('main >> text=Mods').click()
	await expect(page).toHaveURL('http://localhost:3000/user/venashial?type=mod')
})

test('project', async ({ page }) => {
	await page.goto('/mod/darklilith')

	// Test title exists
	expect(await page.locator('h1.title').innerHTML()).toBe('Hot Dog Water')
})
