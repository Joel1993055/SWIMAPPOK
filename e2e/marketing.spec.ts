import { test, expect } from '@playwright/test';

test.describe('Marketing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the marketing page successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Swim APP PRO/);

    // Check if the page loads without errors
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display hero section with correct content', async ({ page }) => {
    // Check hero title
    await expect(page.locator('h1')).toContainText(
      'Advanced Swimming Analytics'
    );

    // Check hero description
    await expect(page.locator('text=Every Coach')).toBeVisible();

    // Check CTA buttons
    await expect(page.locator('text=Start Free Trial')).toBeVisible();
    await expect(page.locator('text=Get Started')).toBeVisible();
  });

  test('should display features section', async ({ page }) => {
    // Scroll to features section
    await page.locator('text=Everything coaches need').scrollIntoViewIfNeeded();

    // Check features are visible
    await expect(
      page.locator('text=Everything coaches need for swimming analysis')
    ).toBeVisible();

    // Check feature items
    const featureItems = page.locator('[data-testid="feature-item"]');
    await expect(featureItems).toHaveCount(8);
  });

  test('should display stats section', async ({ page }) => {
    // Scroll to stats section
    await page.locator('text=Trusted by coaches').scrollIntoViewIfNeeded();

    // Check stats are visible
    await expect(
      page.locator('text=Trusted by coaches worldwide')
    ).toBeVisible();

    // Check individual stats
    await expect(page.locator('text=500+')).toBeVisible();
    await expect(page.locator('text=10,000+')).toBeVisible();
    await expect(page.locator('text=95%')).toBeVisible();
  });

  test('should display demo section', async ({ page }) => {
    // Scroll to demo section
    await page
      .locator('text=Everything you need at your fingertips')
      .scrollIntoViewIfNeeded();

    // Check demo content
    await expect(
      page.locator('text=Everything you need at your fingertips')
    ).toBeVisible();
    await expect(page.locator('text=A comprehensive collection')).toBeVisible();
  });

  test('should display features tabs section', async ({ page }) => {
    // Scroll to features tabs section
    await page
      .locator('text=Make the right impression')
      .scrollIntoViewIfNeeded();

    // Check section title
    await expect(page.locator('text=Make the right impression')).toBeVisible();

    // Check tabs
    await expect(page.locator('text=Choose your sections')).toBeVisible();
    await expect(page.locator('text=Add your content')).toBeVisible();
    await expect(page.locator('text=Customize')).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    // Check navbar is visible
    await expect(page.locator('nav')).toBeVisible();

    // Check logo
    await expect(page.locator('text=Swim:APP')).toBeVisible();

    // Check navigation links
    await expect(page.locator('text=Features')).toBeVisible();
    await expect(page.locator('text=Pricing')).toBeVisible();
    await expect(page.locator('text=Documentation')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that content is still visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Start Free Trial')).toBeVisible();

    // Check mobile navigation
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should have proper meta tags', async ({ page }) => {
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /swimming/i);

    // Check viewport meta tag
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width=device-width/);
  });

  test('should load without console errors', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Filter out known non-critical errors
    const criticalErrors = consoleErrors.filter(
      error =>
        !error.includes('favicon') &&
        !error.includes('404') &&
        !error.includes('Failed to load resource')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});
