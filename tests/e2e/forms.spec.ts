import { test, expect } from '@playwright/test';

test.describe('Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should validate session form correctly', async ({ page }) => {
    // Navigate to session form example (assuming it's accessible)
    // This would need to be implemented in your app
    await page.goto('/examples/session-form');

    // Check form is visible
    await expect(page.locator('form')).toBeVisible();

    // Test empty form submission
    await page.click('button[type="submit"]');

    // Check validation errors
    await expect(page.locator('text=Title is required')).toBeVisible();
    await expect(page.locator('text=Date is required')).toBeVisible();
    await expect(page.locator('text=Start time is required')).toBeVisible();
    await expect(page.locator('text=Distance must be positive')).toBeVisible();
    await expect(page.locator('text=Duration must be positive')).toBeVisible();
    await expect(page.locator('text=RPE must be at least 1')).toBeVisible();
  });

  test('should accept valid form data', async ({ page }) => {
    await page.goto('/examples/session-form');

    // Fill in valid data
    await page.fill('input[name="title"]', 'Morning Training Session');
    await page.fill('input[name="date"]', '2024-01-15');
    await page.fill('input[name="startTime"]', '10:00');
    await page.fill('input[name="distance"]', '2000');
    await page.fill('input[name="duration"]', '90');
    await page.selectOption('select[name="rpe"]', '7');

    // Submit form
    await page.click('button[type="submit"]');

    // Check for success message or redirect
    await expect(
      page.locator('text=Session created successfully')
    ).toBeVisible();
  });

  test('should validate individual fields in real-time', async ({ page }) => {
    await page.goto('/examples/session-form');

    // Test title validation
    await page.fill('input[name="title"]', '');
    await page.blur('input[name="title"]');
    await expect(page.locator('text=Title is required')).toBeVisible();

    await page.fill('input[name="title"]', 'Valid Title');
    await page.blur('input[name="title"]');
    await expect(page.locator('text=Title is required')).not.toBeVisible();

    // Test RPE validation
    await page.fill('input[name="rpe"]', '15');
    await page.blur('input[name="rpe"]');
    await expect(page.locator('text=RPE must be at most 10')).toBeVisible();

    await page.fill('input[name="rpe"]', '8');
    await page.blur('input[name="rpe"]');
    await expect(page.locator('text=RPE must be at most 10')).not.toBeVisible();
  });

  test('should handle form reset correctly', async ({ page }) => {
    await page.goto('/examples/session-form');

    // Fill in some data
    await page.fill('input[name="title"]', 'Test Session');
    await page.fill('input[name="date"]', '2024-01-15');

    // Click reset button
    await page.click('button[type="button"]:has-text("Reset")');

    // Check fields are cleared
    await expect(page.locator('input[name="title"]')).toHaveValue('');
    await expect(page.locator('input[name="date"]')).toHaveValue('');
  });

  test('should show loading state during submission', async ({ page }) => {
    await page.goto('/examples/session-form');

    // Fill valid data
    await page.fill('input[name="title"]', 'Test Session');
    await page.fill('input[name="date"]', '2024-01-15');
    await page.fill('input[name="startTime"]', '10:00');
    await page.fill('input[name="distance"]', '2000');
    await page.fill('input[name="duration"]', '90');
    await page.selectOption('select[name="rpe"]', '7');

    // Submit and check loading state
    await page.click('button[type="submit"]');

    // Check for loading indicator
    await expect(page.locator('text=Creating...')).toBeVisible();

    // Wait for loading to complete
    await expect(page.locator('text=Creating...')).not.toBeVisible({
      timeout: 10000,
    });
  });
});
