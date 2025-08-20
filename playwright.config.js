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
    baseURL: 'https://dev.dgw.ltd.ddev.site:8443',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },  

  projects: [
		{
			name: 'chromium',
			use: { 
				...devices['Desktop Chrome'],
				 // Add Chrome debugging args for Lighthouse tests
				launchOptions: {
					args: ['--remote-debugging-port=9222']
				}
			 },
		},

		// {
		// 	name: 'firefox',
		// 	use: { ...devices['Desktop Firefox'] },
		// },

		// {
		// 	name: 'webkit',
		// 	use: { ...devices['Desktop Safari'] },
		// },

		// Test against mobile viewports
		// {
		// 	name: 'Mobile Chrome',
		// 	use: { ...devices['Pixel 7'] },
		// },
		// {
		// 	name: 'Mobile Safari',
		// 	use: { ...devices['iPhone 13'] },
		// },

	],
  
});