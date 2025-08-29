import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'html',
  outputDir: 'test-results',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // E2E Tests - Cross-browser
    {
      name: 'e2e-chromium',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'e2e-firefox',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'e2e-webkit',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'e2e-mobile',
      testDir: './tests/e2e',
      use: { ...devices['Pixel 5'] },
    },

    // Performance Tests - Chromium only for consistency
    {
      name: 'performance',
      testDir: './tests/performance',
      use: {
        ...devices['Desktop Chrome'],
        // Performance-specific settings
        trace: 'off', // Disable tracing for performance tests
        video: 'off',
      },
      grep: /\.test\.ts$/,
    },

    // Visual Regression Tests
    {
      name: 'visual-desktop',
      testDir: './tests/visual',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'visual-tablet',
      testDir: './tests/visual',
      use: {
        ...devices['iPad Pro'],
        viewport: { width: 1024, height: 768 },
      },
    },
    {
      name: 'visual-mobile',
      testDir: './tests/visual',
      use: {
        ...devices['iPhone 12'],
        viewport: { width: 375, height: 667 },
      },
    },

    // Accessibility Tests - Cross-browser
    {
      name: 'accessibility',
      testDir: './tests/e2e/accessibility',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
