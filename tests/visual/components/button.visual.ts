import { test, expect } from '@playwright/test';

test.describe('Button Visual Tests', () => {
  test('should render primary button correctly', async ({ page }) => {
    await page.goto('/'); // Will go to a component showcase page when built

    // Create a simple button for visual testing
    await page.setContent(`
      <div style="padding: 20px; background: white;">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Primary Button
        </button>
      </div>
    `);

    await expect(page.locator('button')).toHaveScreenshot('primary-button.png');
  });

  test('should render button states correctly', async ({ page }) => {
    await page.setContent(`
      <div style="padding: 20px; background: white; display: flex; gap: 10px; flex-direction: column;">
        <button class="bg-blue-500 text-white font-bold py-2 px-4 rounded">
          Normal State
        </button>
        <button class="bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Hover State
        </button>
        <button class="bg-gray-400 text-gray-600 font-bold py-2 px-4 rounded cursor-not-allowed" disabled>
          Disabled State
        </button>
      </div>
    `);

    await expect(page.locator('div')).toHaveScreenshot('button-states.png');
  });

  test('should render button sizes correctly', async ({ page }) => {
    await page.setContent(`
      <div style="padding: 20px; background: white; display: flex; gap: 10px; align-items: center;">
        <button class="bg-blue-500 text-white font-bold py-1 px-2 rounded text-sm">
          Small
        </button>
        <button class="bg-blue-500 text-white font-bold py-2 px-4 rounded">
          Medium
        </button>
        <button class="bg-blue-500 text-white font-bold py-3 px-6 rounded text-lg">
          Large
        </button>
      </div>
    `);

    await expect(page.locator('div')).toHaveScreenshot('button-sizes.png');
  });
});
