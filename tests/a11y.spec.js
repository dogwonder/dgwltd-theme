import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { testPages } from './pages.js';

test.describe('Accessibility', () => {

  for (const { name, path } of testPages) {
    test(`${name} should have no WCAG 2.1 AA violations`, async ({ page }) => {
      await page.goto(path);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();

      if (results.violations.length > 0) {
        const summary = results.violations.map((v) => {
          const nodes = v.nodes.map((n) => `  - ${n.target.join(', ')}`).join('\n');
          return `[${v.impact}] ${v.id}: ${v.help}\n${nodes}`;
        }).join('\n\n');

        console.log(`\nAccessibility violations on ${name} (${path}):\n\n${summary}\n`);
      }

      expect(results.violations).toEqual([]);
    });
  }

});
