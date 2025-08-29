module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run build && npm run start',
      startServerTimeout: 60000,
      url: [
        'http://localhost:3000',
        'http://localhost:3000/recipes',
        // Add more critical routes as they're built
      ],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        // Performance thresholds
        'categories:performance': ['error', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.85 }],

        // Core Web Vitals
        'first-contentful-paint': ['warn', { maxNumericValue: 1500 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        'speed-index': ['warn', { maxNumericValue: 3000 }],

        // Additional performance metrics
        interactive: ['error', { maxNumericValue: 3500 }],
        'first-meaningful-paint': ['warn', { maxNumericValue: 2000 }],
        'uses-optimized-images': 'error',
        'uses-webp-images': 'error',
        'modern-image-formats': 'error',
        'unused-css-rules': ['warn', { maxNumericValue: 20 }],
        'unused-javascript': ['warn', { maxNumericValue: 20 }],

        // PWA (if implemented later)
        'categories:pwa': 'off',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
    server: {
      port: 9009,
      storage: './lighthouse-reports',
    },
  },
};
