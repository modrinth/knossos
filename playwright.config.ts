import type { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'VITE_API_URL="https://staging-api.modrinth.com/v2/" pnpm build && pnpm preview',
		port: 3000,
	},
}

export default config
