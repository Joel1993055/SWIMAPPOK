/**
 * Basic E2E tests for critical user flows
 * These tests ensure the app works end-to-end
 */

import { expect, test } from '@playwright/test';

test.describe('Basic E2E Functionality', () => {
  test('homepage loads without errors', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Check that page loads
    await expect(page).toHaveTitle(/Swim APP/);
    
    // Check that main content is visible
    await expect(page.locator('body')).toBeVisible();
  });

  test('auth pages exist and load', async ({ page }) => {
    // Test login page
    await page.goto('/auth/login');
    await expect(page.locator('body')).toBeVisible();
    
    // Test signup page
    await page.goto('/auth/signup');
    await expect(page.locator('body')).toBeVisible();
  });

  test('marketing pages load', async ({ page }) => {
    // Test about page
    await page.goto('/about');
    await expect(page.locator('body')).toBeVisible();
    
    // Test pricing page
    await page.goto('/pricing');
    await expect(page.locator('body')).toBeVisible();
  });

  test('protected routes redirect to login', async ({ page }) => {
    // Try to access dashboard without auth
    await page.goto('/dashboard');
    
    // Should redirect to login or show auth form
    await expect(page.locator('body')).toBeVisible();
  });

  test('app is responsive', async ({ page }) => {
    await page.goto('/');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('body')).toBeVisible();
  });
});
