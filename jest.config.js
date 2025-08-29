const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/index.ts', // Export-only files
  ],
  testMatch: [
    '<rootDir>/tests/unit/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/tests/integration/frontend/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/tests/integration/backend/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/tests/performance/**/*.test.js', // Performance tests with Jest
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/tests/e2e/', // Playwright tests
    '<rootDir>/tests/visual/', // Visual regression tests
    '<rootDir>/tests/performance/**/*.test.ts', // Playwright performance tests
  ],
  // Coverage thresholds - enforce minimum coverage
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    // Stricter thresholds for critical files
    'src/lib/api/**/*.ts': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    'src/utils/**/*.ts': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  // Enhanced coverage reporting
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  collectCoverage: process.env.CI === 'true',
  // Fail tests if coverage is below threshold
  coverageDirectory: 'coverage',
  // Clear mocks between tests
  clearMocks: true,
  // Reset modules between tests for better isolation
  resetMocks: true,
};

module.exports = createJestConfig(config);
