# Testing Strategy & Structure

This document explains our comprehensive testing architecture and when to use each type of test.

## Test Directory Structure

```text
tests/
├── unit/                           # Isolated component/utility tests
│   ├── components/                 # React component unit tests
│   ├── utils/                      # Utility function tests
│   └── hooks/                      # Custom hook tests
├── integration/
│   ├── frontend/                   # Frontend integration tests (mocked APIs)
│   │   ├── api-client/            # API client with mocked responses
│   │   ├── components/            # Multi-component interactions
│   │   └── hooks/                 # Hook integration with context
│   └── backend/                   # Backend integration tests (real APIs)
│       ├── api-endpoints/         # Next.js API route testing
│       └── services/              # Service layer integration
├── e2e/                           # Full user journey tests
│   ├── critical-paths/            # Essential user flows
│   ├── accessibility/             # A11y compliance tests
│   └── cross-browser/             # Browser compatibility
├── performance/                   # Performance & load testing
│   ├── core-web-vitals/          # LCP, CLS, FCP metrics
│   ├── lighthouse/               # Lighthouse audits
│   └── load-testing/             # Stress & load tests
└── visual/                       # Visual regression testing
    ├── components/               # Component visual tests
    └── pages/                    # Page screenshot comparisons
```

## Test Types & When to Use Them

### 1. Unit Tests (`tests/unit/`)

**Purpose**: Test individual components, functions, or hooks in isolation.

**When to use**:

- Testing individual React components
- Testing utility functions
- Testing custom hooks
- Testing business logic in isolation

**Characteristics**:

- Fast execution (< 1s per test)
- No external dependencies
- Heavily mocked
- High coverage expected (90%+)

**Example**:

```typescript
// tests/unit/utils/formatters.test.ts
import { formatCookingTime } from '@/utils/formatters';

describe('formatCookingTime', () => {
  test('should format minutes correctly', () => {
    expect(formatCookingTime(30)).toBe('30 minutes');
  });
});
```

### 2. Frontend Integration Tests (`tests/integration/frontend/`)

**Purpose**: Test how frontend components work together with mocked backend services.

**When to use**:

- Testing API client logic with mocked responses
- Testing component interactions within a feature
- Testing state management integration
- Testing form submissions with validation

**Characteristics**:

- Medium execution time (1-5s per test)
- Mocked API responses
- Tests component collaboration
- Focuses on frontend behavior

**Example**:

```typescript
// tests/integration/frontend/components/recipe-form.test.tsx
import { render, screen } from '@testing-library/react';
import { RecipeForm } from '@/components/RecipeForm';

// Mock API client
jest.mock('@/lib/api/recipes');

test('should handle form submission with validation', async () => {
  render(<RecipeForm />);
  // Test form interactions with mocked API
});
```

### 3. Backend Integration Tests (`tests/integration/backend/`)

**Purpose**: Test backend services, API endpoints, and data flow with real implementations.

**When to use**:

- Testing Next.js API routes
- Testing service layer integration
- Testing data validation and processing
- Testing external service integrations

**Characteristics**:

- Medium-slow execution time (2-10s per test)
- Real API calls (may use test database)
- Tests actual backend logic
- May require setup/teardown

**Example**:

```typescript
// tests/integration/backend/api-endpoints/recipes.test.ts
import request from 'supertest';
import { createMocks } from 'node-mocks-http';

test('POST /api/recipes should create recipe', async () => {
  const response = await request(app)
    .post('/api/recipes')
    .send(validRecipeData);

  expect(response.status).toBe(201);
});
```

### 4. End-to-End Tests (`tests/e2e/`)

**Purpose**: Test complete user journeys from browser perspective.

**When to use**:

- Testing critical user flows
- Testing cross-page navigation
- Testing authentication flows
- Testing production-like scenarios

**Characteristics**:

- Slow execution time (10-60s per test)
- Real browser environment
- Tests entire application stack
- Fewer tests, high business value

**Example**:

```typescript
// tests/e2e/critical-paths/recipe-creation.spec.ts
import { test, expect } from '@playwright/test';

test('user can create and view recipe', async ({ page }) => {
  await page.goto('/recipes/new');
  await page.fill('[data-testid=title]', 'Test Recipe');
  await page.click('[data-testid=submit]');

  await expect(page).toHaveURL(/\/recipes\/\d+/);
});
```

### 5. Performance Tests (`tests/performance/`)

**Purpose**: Validate application performance and Core Web Vitals.

**When to use**:

- Measuring page load performance
- Testing under load conditions
- Validating Core Web Vitals
- Bundle size monitoring

**Characteristics**:

- Variable execution time
- Real performance metrics
- CI/CD integration
- Performance budgets

**Example**:

```typescript
// tests/performance/core-web-vitals/vitals.test.ts
test('homepage meets Core Web Vitals', async ({ page }) => {
  const vitals = await measureCoreWebVitals(page, '/');

  expect(vitals.lcp).toBeLessThan(2500); // Good LCP
  expect(vitals.cls).toBeLessThan(0.1); // Good CLS
});
```

### 6. Visual Tests (`tests/visual/`)

**Purpose**: Detect visual regressions through screenshot comparisons.

**When to use**:

- Preventing UI regressions
- Cross-browser visual consistency
- Component visual validation
- Design system compliance

## Test Execution Commands

```bash
# Run specific test types
npm run test:unit                    # Unit tests only
npm run test:integration            # All integration tests
npm run test:integration:frontend   # Frontend integration only
npm run test:integration:backend    # Backend integration only
npm run test:e2e                    # End-to-end tests
npm run test:performance            # Performance tests
npm run test:visual                 # Visual regression tests

# Combined test suites
npm run test:frontend               # Unit + Frontend Integration
npm run test:backend                # Backend Integration only
npm run test:all                    # Unit + Integration + E2E

# Development workflow
npm run test:watch                  # Watch mode for development
npm run test:coverage              # Generate coverage report
```

## Coverage Requirements

| Test Type         | Coverage Target | Critical Files Target |
| ----------------- | --------------- | --------------------- |
| Unit Tests        | 80%             | 90%                   |
| Integration Tests | 70%             | 85%                   |
| Combined          | 85%             | 95%                   |

Critical files include:

- `src/lib/api/**/*.ts` - API layer (90% coverage required)
- `src/utils/**/*.ts` - Utilities (85% coverage required)
- `src/hooks/**/*.ts` - Custom hooks (85% coverage required)

## Best Practices

### 1. Test Pyramid Distribution

- **70% Unit Tests**: Fast, isolated, high coverage
- **20% Integration Tests**: Component collaboration
- **10% E2E Tests**: Critical user journeys

### 2. Frontend vs Backend Integration

- **Frontend Integration**: Mock API responses, test UI logic
- **Backend Integration**: Real API calls, test business logic

### 3. Test Naming Conventions

```typescript
describe('ComponentName', () => {
  test('should behavior when condition', () => {
    // Test implementation
  });
});
```

### 4. Mock Strategy

- Unit tests: Mock all dependencies
- Frontend integration: Mock API clients
- Backend integration: Mock external services only
- E2E tests: No mocking (real environment)

### 5. Test Data Management

- Use factories for test data generation
- Isolate test data between test runs
- Clean up after backend integration tests

## CI/CD Integration

Tests run automatically in this order:

1. **Pre-commit**: Unit tests for changed files
2. **CI Pipeline**:
   - Unit tests (parallel)
   - Frontend integration tests
   - Backend integration tests
   - E2E tests (critical paths)
   - Performance tests
   - Visual regression tests

## Debugging Tests

```bash
# Debug specific test
npm run test -- --testNamePattern="specific test name"

# Debug with verbose output
npm run test -- --verbose

# Debug E2E tests in headed mode
npm run test:e2e:headed

# Debug performance tests
npm run test:performance:headed
```

This testing strategy ensures comprehensive coverage while maintaining fast feedback loops and clear
separation of concerns between different test types.
