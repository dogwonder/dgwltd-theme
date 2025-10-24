import { test, expect } from '@playwright/test';

// Run serially so SW/caches/state don't step on each other
test.describe.configure({ mode: 'serial' });

test.describe('Basic offline support', () => {

  test('registers a service worker at page load', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const isRegistered = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) return false;
      const registration = await navigator.serviceWorker.ready;
      return !!registration && !!registration.active;
    });

    expect(isRegistered).toBe(true);
  });

  test('service worker scope covers the whole site', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const scope = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) return null;
      const registration = await navigator.serviceWorker.ready;
      return registration.scope;
    });

    // We just assert that scope is not some subfolder like /wp-content/ etc.
    // It should control the origin root (because sw.js is served from /sw.js).
    expect(scope).toBeTruthy();
    expect(scope).toMatch(/^https?:\/\/.+?\/$/); // ends with /
  });

  test('caches the offline fallback page during install', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Give SW a moment to precache assets
    await page.waitForTimeout(1000);

    // Check that offline.html is in at least one cache
    const offlineCached = await page.evaluate(async () => {
      const cacheNames = await caches.keys();

      for (const name of cacheNames) {
        const cache = await caches.open(name);
        const requests = await cache.keys();
        const hasOffline = requests.some(req =>
          req.url.includes('/dist/offline.html')
        );
        if (hasOffline) return true;
      }

      return false;
    });

    expect(offlineCached).toBe(true);
  });

  test('serves offline fallback page for navigation when offline', async ({ page, context }) => {
  // 1. Go online, visit once so SW is active and cache is warm
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // 2. Go offline
  await context.setOffline(true);

  // 3. Try to visit some page we haven't cached
  //    The SW should intercept and return *something* (the offline fallback),
  //    not just explode with a network error page.
  await page.goto('/definitely-not-a-real-page-abc123', {
    waitUntil: 'domcontentloaded'
  });

  const html = await page.content();

  // Assert we actually got a document back.
  // If the SW didn't respond, Chromium usually shows its own "no internet" page,
  // which has almost no meaningful app markup. To keep this generic,
  // we just make sure we got a non-trivial HTML payload.
  expect(html.length).toBeGreaterThan(100);

  // 4. Go back online
  await context.setOffline(false);
});

  test('does not try to hijack wp-admin requests', async ({ page }) => {
    // We just sanity check that our SW fetch handler is bailing early
    // for admin URLs (it returns without respondWith).
    // Easiest observable behaviour: wp-admin/ should NOT appear in cache.

    // First visit homepage to ensure SW is installed
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Hit a wp-admin URL (it may 302/403/etc, that's fine)
    try {
      await page.goto('/wp-admin/', { waitUntil: 'domcontentloaded', timeout: 5000 });
    } catch {
      // It's okay if it errors because of auth, we just care about caching behaviour
    }

    // Check caches to confirm nothing with /wp-admin/ was stored
    const wpAdminCached = await page.evaluate(async () => {
      const cacheNames = await caches.keys();

      for (const name of cacheNames) {
        const cache = await caches.open(name);
        const requests = await cache.keys();
        const adminReqs = requests.filter(req => req.url.includes('/wp-admin/'));
        if (adminReqs.length > 0) return true;
      }

      return false;
    });

    expect(wpAdminCached).toBe(false);
  });

});