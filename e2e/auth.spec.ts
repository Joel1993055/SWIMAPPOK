import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show login form when not authenticated', async ({ page }) => {
    await page.goto('/');
    
    // Check if login form is visible
    const loginForm = page.locator('form[data-testid="login-form"]');
    await expect(loginForm).toBeVisible();
  });

  test('should display error message for invalid credentials', async ({ page }) => {
    await page.goto('/');
    
    // Fill in invalid credentials
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Check for error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });

  test('should show loading state during authentication', async ({ page }) => {
    await page.goto('/');
    
    // Fill in credentials
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    
    // Submit form and check for loading state
    await page.click('button[type="submit"]');
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
  });
});
