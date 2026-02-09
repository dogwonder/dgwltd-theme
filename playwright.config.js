import { defineConfig, devices } from "@playwright/test";

/**
 * @see https://playwright.dev/docs/test-configuration
 */

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  // Reporter to use. See https://playwright.dev/docs/test-reporters
	reporter: [
		['list'],
		[
			'html',
			{
				open: 'never',
				outputFolder: 'playwright-report',
			}
		]
	],
  use: {
    baseURL: process.env.BASE_URL || 'https://dev.dgw.ltd.ddev.site:8443',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },  

  projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
			testIgnore: /lighthouse/,
		},
		{
			name: 'lighthouse',
			use: {
				...devices['Desktop Chrome'],
				launchOptions: {
					args: ['--remote-debugging-port=9222'],
				},
			},
			testMatch: /lighthouse/,
		},
	],
  
});