import { Page, expect } from '@playwright/test';

/**
 * Helper function to wait for page to be fully loaded
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Helper function to mock API responses
 */
export async function mockApiResponse(
  page: Page,
  url: string,
  response: any,
  status: number = 200
) {
  await page.route(url, route => {
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}

/**
 * Helper function to mock API errors
 */
export async function mockApiError(
  page: Page,
  url: string,
  error: string = 'Internal Server Error',
  status: number = 500
) {
  await page.route(url, route => {
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify({ error }),
    });
  });
}

/**
 * Helper function to fill form fields
 */
export async function fillForm(page: Page, formData: Record<string, string>) {
  for (const [field, value] of Object.entries(formData)) {
    await page.fill(`[name="${field}"]`, value);
  }
}

/**
 * Helper function to check for error messages
 */
export async function expectErrorMessage(page: Page, message?: string) {
  const errorElement = page.locator('[data-testid="error-message"]');
  await expect(errorElement).toBeVisible();

  if (message) {
    await expect(errorElement).toContainText(message);
  }
}

/**
 * Helper function to check for loading states
 */
export async function expectLoadingState(page: Page) {
  const loadingElement = page.locator('[data-testid="loading-spinner"]');
  await expect(loadingElement).toBeVisible();
}

/**
 * Helper function to check for success messages
 */
export async function expectSuccessMessage(page: Page, message?: string) {
  const successElement = page.locator('[data-testid="success-message"]');
  await expect(successElement).toBeVisible();

  if (message) {
    await expect(successElement).toContainText(message);
  }
}

/**
 * Helper function to simulate user authentication
 */
export async function mockAuthenticatedUser(page: Page, user: any = {}) {
  const defaultUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    ...user,
  };

  await page.addInitScript(user => {
    window.localStorage.setItem('user', JSON.stringify(user));
  }, defaultUser);
}

/**
 * Helper function to clear authentication
 */
export async function clearAuthentication(page: Page) {
  await page.evaluate(() => {
    window.localStorage.removeItem('user');
    window.localStorage.removeItem('token');
  });
}
