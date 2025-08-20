import { test, expect } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';

test.describe('Lighthouse audit', () => {
    
  test('should pass performance audit', async ({ browser }) => {
    // Launch a new browser instance with debugging port
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('/');

    await playAudit({
      page: page,
      port: 9222,
      thresholds: {
        performance: 90,
        accessibility: 90,
        'best-practices': 90,
        seo: 90,
        pwa: 50,
      },
    });

    await context.close();
  });
});