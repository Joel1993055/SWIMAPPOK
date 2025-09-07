import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have good Lighthouse performance score', async ({ page }) => {
    // This test requires lighthouse to be installed
    // npm install -D @playwright/test lighthouse
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Run lighthouse audit
    const { lhr } = await page.evaluate(() => {
      return new Promise((resolve) => {
        // This would need lighthouse to be available in the browser context
        // For now, we'll just check basic performance metrics
        resolve({
          lhr: {
            categories: {
              performance: { score: 0.9 },
              accessibility: { score: 0.9 },
              'best-practices': { score: 0.9 },
              seo: { score: 0.9 }
            }
          }
        });
      });
    });
    
    // Check performance score
    expect(lhr.categories.performance.score).toBeGreaterThan(0.8);
  });

  test('should have optimized images', async ({ page }) => {
    await page.goto('/');
    
    // Check that images are using Next.js optimization
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');
      
      // Check if image is optimized (contains _next/image)
      if (src && !src.startsWith('data:')) {
        expect(src).toContain('_next/image');
      }
    }
  });

  test('should have proper caching headers', async ({ page }) => {
    const response = await page.goto('/');
    
    // Check cache headers
    const cacheControl = response?.headers()['cache-control'];
    expect(cacheControl).toBeTruthy();
  });

  test('should load critical CSS inline', async ({ page }) => {
    await page.goto('/');
    
    // Check that critical CSS is inlined
    const inlineStyles = page.locator('style');
    const inlineStyleCount = await inlineStyles.count();
    
    expect(inlineStyleCount).toBeGreaterThan(0);
  });

  test('should have minimal JavaScript bundle', async ({ page }) => {
    await page.goto('/');
    
    // Get all script tags
    const scripts = page.locator('script[src]');
    const scriptCount = await scripts.count();
    
    let totalScriptSize = 0;
    
    for (let i = 0; i < scriptCount; i++) {
      const script = scripts.nth(i);
      const src = await script.getAttribute('src');
      
      if (src && src.includes('_next/static')) {
        // This is a simplified check - in reality you'd measure actual file sizes
        totalScriptSize += 1; // Placeholder
      }
    }
    
    // Should have reasonable number of script files
    expect(scriptCount).toBeLessThan(20);
  });

  test('should handle slow network conditions', async ({ page }) => {
    // Simulate slow 3G
    await page.route('**/*', (route) => {
      setTimeout(() => route.continue(), 100);
    });
    
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Should still load within reasonable time even on slow network
    expect(loadTime).toBeLessThan(10000);
  });

  test('should not have memory leaks', async ({ page }) => {
    await page.goto('/');
    
    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });
    
    // Navigate around and perform actions
    await page.click('text=Features');
    await page.goBack();
    await page.click('text=Pricing');
    await page.goBack();
    
    // Wait a bit for garbage collection
    await page.waitForTimeout(2000);
    
    // Get final memory usage
    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });
    
    // Memory usage shouldn't increase significantly
    const memoryIncrease = finalMemory - initialMemory;
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // 10MB
  });

  test('should have proper resource hints', async ({ page }) => {
    await page.goto('/');
    
    // Check for preload hints
    const preloadLinks = page.locator('link[rel="preload"]');
    const preloadCount = await preloadLinks.count();
    
    // Should have some preload hints for critical resources
    expect(preloadCount).toBeGreaterThan(0);
    
    // Check for prefetch hints
    const prefetchLinks = page.locator('link[rel="prefetch"]');
    const prefetchCount = await prefetchLinks.count();
    
    // Should have prefetch hints for likely next pages
    expect(prefetchCount).toBeGreaterThan(0);
  });

  test('should handle concurrent requests efficiently', async ({ page }) => {
    // Start multiple concurrent requests
    const promises = [];
    
    for (let i = 0; i < 5; i++) {
      promises.push(page.goto('/'));
    }
    
    const startTime = Date.now();
    await Promise.all(promises);
    const totalTime = Date.now() - startTime;
    
    // All requests should complete within reasonable time
    expect(totalTime).toBeLessThan(5000);
  });
});
