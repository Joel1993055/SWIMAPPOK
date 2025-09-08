import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check that h1 exists
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);

    // Check that headings are in logical order
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();

    expect(headingCount).toBeGreaterThan(0);

    // Check that h1 comes before h2, etc.
    for (let i = 0; i < headingCount - 1; i++) {
      const currentHeading = headings.nth(i);
      const nextHeading = headings.nth(i + 1);

      const currentLevel = await currentHeading.evaluate(el =>
        parseInt(el.tagName.charAt(1))
      );
      const nextLevel = await nextHeading.evaluate(el =>
        parseInt(el.tagName.charAt(1))
      );

      // Next heading should not skip more than one level
      expect(nextLevel - currentLevel).toBeLessThanOrEqual(1);
    }
  });

  test('should have proper alt text for images', async ({ page }) => {
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');

      // All images should have alt text
      expect(alt).toBeTruthy();
      expect(alt).not.toBe('');
    }
  });

  test('should have proper form labels', async ({ page }) => {
    // Navigate to form example
    await page.goto('/examples/session-form');

    const inputs = page.locator('input, select, textarea');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');

      if (id) {
        // Check if there's a label for this input
        const label = page.locator(`label[for="${id}"]`);
        await expect(label).toBeVisible();
      }
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');

    // Check if focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Test tabbing through interactive elements
    const interactiveElements = page.locator(
      'a, button, input, select, textarea, [tabindex]'
    );
    const elementCount = await interactiveElements.count();

    for (let i = 0; i < Math.min(elementCount, 10); i++) {
      await page.keyboard.press('Tab');
      const focused = page.locator(':focus');
      await expect(focused).toBeVisible();
    }
  });

  test('should have proper color contrast', async ({ page }) => {
    // This is a simplified test - in reality you'd use a proper contrast checker
    const textElements = page.locator('p, span, div, h1, h2, h3, h4, h5, h6');
    const textCount = await textElements.count();

    // Check that text elements are visible (basic contrast check)
    for (let i = 0; i < Math.min(textCount, 5); i++) {
      const element = textElements.nth(i);
      const isVisible = await element.isVisible();

      if (isVisible) {
        const color = await element.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return styles.color;
        });

        // Basic check that color is not transparent
        expect(color).not.toBe('rgba(0, 0, 0, 0)');
      }
    }
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    // Check for proper ARIA roles
    const elementsWithRole = page.locator('[role]');
    const roleCount = await elementsWithRole.count();

    // Should have some elements with ARIA roles
    expect(roleCount).toBeGreaterThan(0);

    // Check for ARIA labels
    const elementsWithAriaLabel = page.locator('[aria-label]');
    const ariaLabelCount = await elementsWithAriaLabel.count();

    // Should have some elements with ARIA labels
    expect(ariaLabelCount).toBeGreaterThan(0);
  });

  test('should have proper focus management', async ({ page }) => {
    // Test that focus is managed properly
    const focusableElements = page.locator(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const focusableCount = await focusableElements.count();

    expect(focusableCount).toBeGreaterThan(0);

    // Test that focus is visible
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should have proper semantic HTML', async ({ page }) => {
    // Check for semantic elements
    const semanticElements = page.locator(
      'main, nav, header, footer, section, article, aside'
    );
    const semanticCount = await semanticElements.count();

    // Should have some semantic elements
    expect(semanticCount).toBeGreaterThan(0);

    // Check for proper main content
    const main = page.locator('main');
    await expect(main).toHaveCount(1);
  });

  test('should handle screen reader announcements', async ({ page }) => {
    // Test that important changes are announced
    // This is a simplified test - in reality you'd use a screen reader

    // Check for aria-live regions
    const liveRegions = page.locator('[aria-live]');
    const liveRegionCount = await liveRegions.count();

    // Should have some live regions for dynamic content
    expect(liveRegionCount).toBeGreaterThan(0);
  });

  test('should have proper skip links', async ({ page }) => {
    // Check for skip to main content link
    const skipLink = page.locator('a[href="#main"], a[href="#content"]');
    const skipLinkCount = await skipLink.count();

    // Should have skip links for keyboard navigation
    expect(skipLinkCount).toBeGreaterThan(0);
  });

  test('should have proper form validation announcements', async ({ page }) => {
    await page.goto('/examples/session-form');

    // Submit empty form
    await page.click('button[type="submit"]');

    // Check that validation errors are properly announced
    const errorMessages = page.locator(
      '[role="alert"], .error, [aria-invalid="true"]'
    );
    const errorCount = await errorMessages.count();

    expect(errorCount).toBeGreaterThan(0);

    // Check that error messages are associated with form fields
    const inputs = page.locator('input, select, textarea');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const hasError = await input.getAttribute('aria-invalid');

      if (hasError === 'true') {
        const errorMessage = page.locator(
          `[aria-describedby="${await input.getAttribute('id')}"]`
        );
        await expect(errorMessage).toBeVisible();
      }
    }
  });

  test('should have proper language attributes', async ({ page }) => {
    // Check html lang attribute
    const html = page.locator('html');
    const lang = await html.getAttribute('lang');

    expect(lang).toBeTruthy();
    expect(lang).toBe('en');
  });
});
