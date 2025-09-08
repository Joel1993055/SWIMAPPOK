import { expect, test } from '@playwright/test';

test.describe('Database Operations', () => {
  test('should display data from database', async ({ page }) => {
    await page.goto('/');
    
    // Wait for data to load
    await page.waitForSelector('[data-testid="data-list"]');
    
    // Check if data is displayed
    const dataList = page.locator('[data-testid="data-list"]');
    await expect(dataList).toBeVisible();
  });

  test('should handle database errors gracefully', async ({ page }) => {
    // Mock a database error
    await page.route('**/api/data', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Database connection failed' })
      });
    });

    await page.goto('/');
    
    // Check if error message is displayed
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });

  test('should show loading state while fetching data', async ({ page }) => {
    // Mock a slow response
    await page.route('**/api/data', route => {
      setTimeout(() => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: [] })
        });
      }, 1000);
    });

    await page.goto('/');
    
    // Check for loading state
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
  });
});
