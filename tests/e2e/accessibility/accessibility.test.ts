import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('should not have any automatically detectable accessibility issues', async ({
    page,
  }) => {
    await page.goto('/');

    // @ts-expect-error - playwright-core version mismatch between @playwright/test and @axe-core/playwright
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should be navigable with keyboard', async ({ page }) => {
    await page.goto('/');

    // Test keyboard navigation
    await page.keyboard.press('Tab');

    // Verify focus is visible
    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // Check for h1 element
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
    expect(h1Count).toBeLessThanOrEqual(1); // Only one h1 per page

    // Check heading hierarchy (h2 should come after h1, etc.)
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();

    if (headings.length > 1) {
      for (let i = 0; i < headings.length - 1; i++) {
        if (i < 0 || i >= headings.length - 1) continue;

        const currentHeading = headings.at(i);
        const nextHeading = headings.at(i + 1);
        if (!currentHeading || !nextHeading) continue;

        const currentTagName = await currentHeading.evaluate(el => el.tagName);
        const currentLevel = parseInt(currentTagName?.substring(1) ?? '1');
        const nextTagName = await nextHeading.evaluate(el => el.tagName);
        const nextLevel = parseInt(nextTagName?.substring(1) ?? '1');

        // Next heading should not skip levels (e.g., h1 -> h3)
        expect(nextLevel - currentLevel).toBeLessThanOrEqual(1);
      }
    }
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/');

    const images = await page.locator('img').all();

    for (const img of images) {
      const altText = await img.getAttribute('alt');
      const ariaLabel = await img.getAttribute('aria-label');
      const ariaLabelledby = await img.getAttribute('aria-labelledby');

      // Image should have alt text or aria-label/aria-labelledby
      expect(
        altText !== null || ariaLabel !== null || ariaLabelledby !== null
      ).toBeTruthy();
    }
  });

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/');

    // @ts-expect-error - playwright-core version mismatch between @playwright/test and @axe-core/playwright
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
