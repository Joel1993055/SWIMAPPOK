import { expect, test } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page loads without errors
    await expect(page).toHaveTitle(/Next.js App/);
    
    // Check for main content
    await expect(page.locator('main')).toBeVisible();
  });

  test('should display navigation menu', async ({ page }) => {
    await page.goto('/');
    
    // Check if navigation is visible
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check if page is still functional on mobile
    await expect(page.locator('main')).toBeVisible();
  });
});
