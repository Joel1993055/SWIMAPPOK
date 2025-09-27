import { expect, test } from '@playwright/test';
import { TEST_CONFIG } from './test.config';
import {
  expectErrorMessage,
  fillForm,
  mockApiResponse,
  waitForPageLoad,
} from './utils/test-helpers';

test.describe('Integration Tests', () => {
  test('should complete full user flow', async ({ page }) => {
    // Mock API responses
    await mockApiResponse(page, '**/api/auth/login', {
      success: true,
      user: TEST_CONFIG.TEST_USER,
    });

    await mockApiResponse(page, '**/api/data', {
      data: [
        { id: 1, name: 'Test Item 1' },
        { id: 2, name: 'Test Item 2' },
      ],
    });

    // Navigate to homepage
    await page.goto(TEST_CONFIG.BASE_URL);
    await waitForPageLoad(page);

    // Check if page loads correctly
    await expect(page).toHaveTitle(/Next.js App/);

    // Test authentication flow
    await fillForm(page, {
      email: TEST_CONFIG.TEST_USER.email,
      password: TEST_CONFIG.TEST_USER.password,
    });

    await page.click('button[type="submit"]');
    await waitForPageLoad(page);

    // Check if user is authenticated
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();

    // Test data loading
    await expect(page.locator('[data-testid="data-list"]')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await mockApiResponse(
      page,
      '**/api/data',
      {
        error: 'Database connection failed',
      },
      500
    );

    await page.goto(TEST_CONFIG.BASE_URL);
    await waitForPageLoad(page);

    // Check if error is displayed
    await expectErrorMessage(page, 'Database connection failed');
  });

  test('should work on different screen sizes', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1920, height: 1080, name: 'Desktop' },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });

      await page.goto(TEST_CONFIG.BASE_URL);
      await waitForPageLoad(page);

      // Check if page is still functional
      await expect(page.locator('main')).toBeVisible();
    }
  });
});
