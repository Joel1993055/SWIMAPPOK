import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate between pages correctly', async ({ page }) => {
    // Test navigation links
    await page.click('text=Features');
    await expect(page.url()).toContain('/features');
    
    await page.goBack();
    await expect(page.url()).toBe('http://localhost:3000/');
    
    await page.click('text=Pricing');
    await expect(page.url()).toContain('/pricing');
  });

  test('should have working logo that returns to home', async ({ page }) => {
    // Navigate to another page first
    await page.click('text=Features');
    await expect(page.url()).toContain('/features');
    
    // Click logo to return home
    await page.click('text=Swim:APP');
    await expect(page.url()).toBe('http://localhost:3000/');
  });

  test('should have responsive navigation on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if mobile menu exists (hamburger menu)
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
    
    if (await mobileMenuButton.isVisible()) {
      // Open mobile menu
      await mobileMenuButton.click();
      
      // Check if navigation links are visible
      await expect(page.locator('text=Features')).toBeVisible();
      await expect(page.locator('text=Pricing')).toBeVisible();
      
      // Close mobile menu
      await mobileMenuButton.click();
    }
  });

  test('should maintain navigation state across page reloads', async ({ page }) => {
    // Navigate to a page
    await page.click('text=Features');
    await expect(page.url()).toContain('/features');
    
    // Reload page
    await page.reload();
    
    // Check that we're still on the same page
    await expect(page.url()).toContain('/features');
  });

  test('should handle browser back/forward buttons', async ({ page }) => {
    // Navigate through multiple pages
    await page.click('text=Features');
    await expect(page.url()).toContain('/features');
    
    await page.click('text=Pricing');
    await expect(page.url()).toContain('/pricing');
    
    // Use browser back button
    await page.goBack();
    await expect(page.url()).toContain('/features');
    
    // Use browser forward button
    await page.goForward();
    await expect(page.url()).toContain('/pricing');
  });

  test('should have accessible navigation', async ({ page }) => {
    // Check that navigation is keyboard accessible
    await page.keyboard.press('Tab');
    
    // Check if focus is visible on navigation elements
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check that we can navigate with Enter key
    await page.keyboard.press('Enter');
  });

  test('should show active state for current page', async ({ page }) => {
    // Navigate to a page
    await page.click('text=Features');
    
    // Check if the active link has proper styling
    const activeLink = page.locator('text=Features');
    await expect(activeLink).toHaveClass(/active/);
  });

  test('should handle external links correctly', async ({ page }) => {
    // Check if there are any external links
    const externalLinks = page.locator('a[href^="http"]');
    const count = await externalLinks.count();
    
    if (count > 0) {
      // Test first external link
      const firstLink = externalLinks.first();
      const href = await firstLink.getAttribute('href');
      
      // Check that external links open in new tab
      await expect(firstLink).toHaveAttribute('target', '_blank');
      await expect(firstLink).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });
});
