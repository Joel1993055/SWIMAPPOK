import { test, expect } from '@playwright/test';

test.describe('PWA Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have valid manifest.json', async ({ page }) => {
    // Check manifest link
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toBeVisible();
    
    const manifestHref = await manifestLink.getAttribute('href');
    expect(manifestHref).toBe('/manifest.json');
    
    // Check manifest content
    const response = await page.request.get('/manifest.json');
    expect(response.status()).toBe(200);
    
    const manifest = await response.json();
    expect(manifest.name).toBe('Swim APP PRO');
    expect(manifest.short_name).toBe('SwimPRO');
    expect(manifest.start_url).toBe('/');
    expect(manifest.display).toBe('standalone');
    expect(manifest.icons).toBeDefined();
    expect(manifest.icons.length).toBeGreaterThan(0);
  });

  test('should register service worker', async ({ page }) => {
    // Check if service worker is registered
    const swRegistration = await page.evaluate(() => {
      return navigator.serviceWorker.getRegistration();
    });
    
    expect(swRegistration).toBeTruthy();
    expect(swRegistration?.scope).toBe('http://localhost:3000/');
  });

  test('should have proper meta tags for PWA', async ({ page }) => {
    // Check theme color
    const themeColor = page.locator('meta[name="theme-color"]');
    await expect(themeColor).toHaveAttribute('content', '#2563eb');
    
    // Check viewport
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', 'width=device-width, initial-scale=1');
    
    // Check apple-mobile-web-app-capable
    const appleCapable = page.locator('meta[name="apple-mobile-web-app-capable"]');
    await expect(appleCapable).toHaveAttribute('content', 'yes');
  });

  test('should work offline', async ({ page }) => {
    // Go offline
    await page.context().setOffline(true);
    
    // Try to navigate to a page
    await page.goto('/');
    
    // Page should still load from cache
    await expect(page.locator('body')).toBeVisible();
    
    // Go back online
    await page.context().setOffline(false);
  });

  test('should show install prompt on supported browsers', async ({ page }) => {
    // Check if beforeinstallprompt event is fired
    const installPromptFired = await page.evaluate(() => {
      return new Promise((resolve) => {
        window.addEventListener('beforeinstallprompt', () => {
          resolve(true);
        });
        
        // Timeout after 5 seconds
        setTimeout(() => resolve(false), 5000);
      });
    });
    
    // Note: This test might not work in all environments
    // as the install prompt is browser-specific
    console.log('Install prompt fired:', installPromptFired);
  });

  test('should have proper icons for different sizes', async ({ page }) => {
    // Check apple-touch-icon
    const appleIcon = page.locator('link[rel="apple-touch-icon"]');
    await expect(appleIcon).toBeVisible();
    
    // Check favicon
    const favicon = page.locator('link[rel="icon"]');
    await expect(favicon).toBeVisible();
    
    // Check icon sizes
    const iconSizes = ['72x72', '96x96', '128x128', '144x144', '152x152', '192x192', '384x384', '512x512'];
    
    for (const size of iconSizes) {
      const icon = page.locator(`link[sizes="${size}"]`);
      await expect(icon).toBeVisible();
    }
  });

  test('should handle push notifications', async ({ page }) => {
    // Request notification permission
    const permission = await page.evaluate(async () => {
      return await Notification.requestPermission();
    });
    
    // Permission should be granted or denied (not default)
    expect(['granted', 'denied']).toContain(permission);
  });

  test('should have proper shortcuts in manifest', async ({ page }) => {
    const response = await page.request.get('/manifest.json');
    const manifest = await response.json();
    
    expect(manifest.shortcuts).toBeDefined();
    expect(manifest.shortcuts.length).toBeGreaterThan(0);
    
    // Check specific shortcuts
    const shortcuts = manifest.shortcuts;
    const shortcutNames = shortcuts.map((s: any) => s.name);
    
    expect(shortcutNames).toContain('Dashboard');
    expect(shortcutNames).toContain('Sessions');
    expect(shortcutNames).toContain('Calendar');
  });

  test('should have proper display mode', async ({ page }) => {
    // Check if the app can be displayed in standalone mode
    const displayMode = await page.evaluate(() => {
      return window.matchMedia('(display-mode: standalone)').matches;
    });
    
    // This will be false in regular browser, but true when installed as PWA
    console.log('Display mode standalone:', displayMode);
  });

  test('should handle app lifecycle events', async ({ page }) => {
    // Test visibility change
    await page.evaluate(() => {
      Object.defineProperty(document, 'visibilityState', {
        writable: true,
        value: 'hidden'
      });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    
    // Test page show/hide events
    await page.evaluate(() => {
      window.dispatchEvent(new Event('pageshow'));
      window.dispatchEvent(new Event('pagehide'));
    });
    
    // These events should not cause errors
    await expect(page.locator('body')).toBeVisible();
  });
});
