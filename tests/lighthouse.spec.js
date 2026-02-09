import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';
import { testPages } from './pages.js';

const REPORTS_DIR = path.resolve('lighthouse-reports');
const HISTORY_FILE = path.resolve('lighthouse-history.jsonl');

const THRESHOLDS = {
  performance: 90,
  accessibility: 90,
  'best-practices': 90,
  seo: 90,
};

test.describe('Lighthouse audit', () => {
  test.describe.configure({ mode: 'serial' });

  for (const { name, path: pagePath } of testPages) {
    test(`${name} should pass Lighthouse audit`, async ({ browser }) => {
      const context = await browser.newContext();
      const page = await context.newPage();

      await page.goto(pagePath);

      const slug = name.toLowerCase().replace(/\s+/g, '-');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const reportName = `${slug}-${timestamp}`;

      // Ensure reports directory exists
      fs.mkdirSync(REPORTS_DIR, { recursive: true });

      const result = await playAudit({
        page,
        port: 9222,
        thresholds: THRESHOLDS,
        ignoreError: true,
        reports: {
          formats: { html: true, json: true },
          directory: REPORTS_DIR,
          name: reportName,
        },
      });

      // Extract scores (0-1 range) and convert to 0-100
      const categories = result.lhr.categories;
      const scores = {
        performance: Math.round((categories.performance?.score ?? 0) * 100),
        accessibility: Math.round((categories.accessibility?.score ?? 0) * 100),
        bestPractices: Math.round((categories['best-practices']?.score ?? 0) * 100),
        seo: Math.round((categories.seo?.score ?? 0) * 100),
      };

      // Append to history file
      const entry = {
        timestamp: new Date().toISOString(),
        page: name,
        url: pagePath,
        ...scores,
      };
      fs.appendFileSync(HISTORY_FILE, JSON.stringify(entry) + '\n');

      // Assert thresholds manually so the test still fails on regressions
      expect(scores.performance, `Performance score ${scores.performance} below ${THRESHOLDS.performance}`).toBeGreaterThanOrEqual(THRESHOLDS.performance);
      expect(scores.accessibility, `Accessibility score ${scores.accessibility} below ${THRESHOLDS.accessibility}`).toBeGreaterThanOrEqual(THRESHOLDS.accessibility);
      expect(scores.bestPractices, `Best Practices score ${scores.bestPractices} below ${THRESHOLDS['best-practices']}`).toBeGreaterThanOrEqual(THRESHOLDS['best-practices']);
      expect(scores.seo, `SEO score ${scores.seo} below ${THRESHOLDS.seo}`).toBeGreaterThanOrEqual(THRESHOLDS.seo);

      await context.close();
    });
  }
});
