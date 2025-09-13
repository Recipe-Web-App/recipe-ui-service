# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Recipe UI Service - Claude Code Guide

A comprehensive guide for using Claude Code with this Next.js 15 recipe management application built with microservices architecture.

## 🚀 Quick Start Commands

### Essential Development Commands

```bash
# Development workflow
npm run dev                    # Start development server with Turbopack
npm run build                 # Production build
npm run test                  # Run all tests
npm run test:watch            # Interactive test watcher
npm run lint                  # Lint and fix code issues
npm run type-check           # TypeScript validation
npm run format              # Format code with Prettier

# Quality assurance (run before committing)
npm run quality             # Combined lint + type-check + test
npm run validate            # Full validation suite
npm run validate:security   # Security scans
```

### Testing Commands

```bash
# Unit and integration tests
npm run test:unit                    # Unit tests only
npm run test:integration            # All integration tests
npm run test:integration:frontend   # Frontend integration tests
npm run test:integration:backend    # Backend integration tests

# End-to-end and specialized testing
npm run test:e2e                   # E2E tests with Playwright
npm run test:e2e:headed           # E2E tests with browser UI
npm run test:performance          # Performance testing
npm run test:a11y                 # Accessibility testing
npm run test:visual               # Visual regression testing
npm run test:coverage             # Generate coverage report
```

### Performance and Analysis

```bash
npm run analyze              # Bundle analysis
npm run perf:lighthouse     # Lighthouse performance audit
npm run perf:vitals         # Core Web Vitals measurement
npm run size-limit          # Bundle size validation
npm run knip                # Unused code detection
npm run madge               # Circular dependency detection
```

## 🏗️ Architecture Overview

### Microservices Architecture

This UI service communicates with 6 backend microservices:

- **Auth Service** (port 8081) - Authentication and authorization
- **Recipe Management Service** (port 8082) - Recipe CRUD operations
- **Recipe Scraper Service** (port 8083) - Web scraping and import
- **Media Management Service** (port 8084) - File upload and processing
- **User Management Service** (port 8085) - User profiles and preferences
- **Meal Plan Management Service** (port 8086) - Meal planning

### Project Structure

```
src/
├── app/                    # Next.js 15 App Router
├── components/             # React components
│   ├── ui/                # Base design system components
│   ├── forms/             # Form components
│   └── layout/            # Layout components
├── hooks/                 # Service-specific React hooks
│   ├── auth/             # Authentication hooks
│   ├── recipe-management/
│   ├── recipe-scraper/
│   ├── media-management/
│   ├── user-management/
│   └── meal-plan-management/
├── lib/                   # API clients and utilities
│   ├── api/              # Service-specific API clients
│   │   ├── auth/
│   │   ├── recipe-management/
│   │   ├── recipe-scraper/
│   │   ├── media-management/
│   │   ├── user-management/
│   │   └── meal-plan-management/
│   └── utils/            # General utilities
├── stores/               # Zustand state stores
├── types/                # Service-specific TypeScript types
└── constants/            # Application constants
```

## 🔧 Key Technologies & Patterns

### State Management

- **TanStack Query**: Server state management with caching, prefetching, and synchronization
- **Zustand**: Lightweight client state management
- **React Hook Form**: Form state management

### API Integration Pattern

Each microservice follows this structure:

```typescript
// API Client (src/lib/api/{service}/client.ts)
export const serviceClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_{SERVICE}_URL,
  // Interceptors for auth, error handling
});

// API Methods (src/lib/api/{service}/[feature].ts)
export class FeatureApi {
  async getItems(): Promise<ItemDto[]> { /* ... */ }
  async createItem(data: CreateRequest): Promise<ItemDto> { /* ... */ }
}

// React Hooks (src/hooks/{service}/use[Feature].ts)
export const useItems = () => useQuery({
  queryKey: ['service', 'items'],
  queryFn: () => featureApi.getItems(),
});

export const useCreateItem = () => useMutation({
  mutationFn: featureApi.createItem,
  onSuccess: () => queryClient.invalidateQueries(['service', 'items']),
});
```

### Component Patterns

- **Container/Presenter**: Separate business logic from presentation
- **Compound Components**: For complex UI components
- **Custom Hooks**: Encapsulate business logic and API integration

### Error Handling

Each service has custom error classes and handlers:

```typescript
export class ServiceApiError extends Error {
  status?: number;
  details?: Record<string, unknown>;
}

export const handleServiceApiError = (error: unknown): never => {
  // Standardized error handling logic
};
```

## 📝 Code Generation Guidelines

### When Creating Components

Specify the following for proper code generation:

```text
Create a [ComponentName] component in src/components/[folder]/ that:
- Uses TypeScript with strict typing
- Follows the existing component patterns in src/components/
- Uses TailwindCSS for styling
- Includes proper accessibility attributes
- Has comprehensive unit tests with React Testing Library
- Follows the error boundary patterns
```

### When Creating API Integration

```text
Create API integration for [feature] that:
- Follows the existing pattern in src/lib/api/[service-name]/
- Uses the service-specific client from src/lib/api/[service-name]/client.ts
- Includes proper TypeScript types from src/types/[service-name]/
- Has corresponding React hooks in src/hooks/[service-name]/
- Includes comprehensive error handling
- Has unit and integration tests
```

### When Creating Tests

```text
Create tests that:
- Follow patterns in tests/unit/ and tests/integration/
- Use React Testing Library for components
- Mock API calls appropriately
- Include accessibility testing with @axe-core/react
- Test both happy path and error scenarios
- Maintain the 85%+ coverage target
```

## 🔍 Common Patterns to Follow

### API Client Configuration

```typescript
// Each service client includes:
- Custom baseURL from environment variables
- Request/response interceptors for auth and error handling
- Proper timeout configuration (30s for file uploads)
- TypeScript error handling with custom error classes
```

### TanStack Query Configuration

```typescript
// Query configuration follows this pattern:
{
  queryKey: ['service-name', 'resource', ...params],
  queryFn: () => api.method(),
  staleTime: 5 * 60 * 1000,  // 5 minutes
  gcTime: 10 * 60 * 1000,    // 10 minutes
}

// Mutations include cache updates:
onSuccess: (data) => {
  queryClient.setQueryData(queryKey, data);
  queryClient.invalidateQueries(['service-name']);
}
```

### Environment Variables

Services use these environment variable patterns:

```bash
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:8081
NEXT_PUBLIC_RECIPE_MANAGEMENT_SERVICE_URL=http://localhost:8082
NEXT_PUBLIC_RECIPE_SCRAPER_SERVICE_URL=http://localhost:8083
NEXT_PUBLIC_MEDIA_MANAGEMENT_SERVICE_URL=http://localhost:8084
NEXT_PUBLIC_USER_MANAGEMENT_SERVICE_URL=http://localhost:8085
NEXT_PUBLIC_MEAL_PLAN_MANAGEMENT_SERVICE_URL=http://localhost:8086
```

## 🛠️ Development Workflow

### Before Committing Changes

Always run these commands to ensure code quality:

```bash
npm run lint              # Fix linting issues
npm run type-check       # Verify TypeScript
npm run test             # Run tests
npm run format           # Format code
```

Or use the combined command:

```bash
npm run quality          # Runs all the above
```

### Creating New Features

1. **Plan the feature** - Identify which services are involved
2. **Create types** - Add TypeScript types in `src/types/[service]/`
3. **Create API client** - Add methods to appropriate service client
4. **Create hooks** - Add TanStack Query hooks in `src/hooks/[service]/`
5. **Create components** - Build UI components following existing patterns
6. **Add tests** - Unit tests for hooks/utils, integration tests for workflows
7. **Update documentation** - Add any new patterns or conventions

### Testing Strategy

- **Unit Tests (70%)**: Components, hooks, utilities
- **Integration Tests (25%)**: API integration, user workflows
- **E2E Tests (5%)**: Critical user journeys

### Performance Considerations

- Components are optimized with React.memo where appropriate
- TanStack Query handles caching and deduplication
- Bundle analysis with `npm run analyze` to monitor size
- Core Web Vitals monitoring with `npm run perf:vitals`

## 🔒 Security & Best Practices

### Security Features

- ESLint security plugin with comprehensive rules
- Automated secret detection with secretlint
- Content Security Policy headers
- Input validation and sanitization
- HTTPS-only in production

### Code Quality Tools

- **ESLint**: 60+ rules covering TypeScript, React, accessibility, security
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict mode with comprehensive type checking
- **Husky**: Git hooks for quality gates
- **pre-commit**: Multi-stage validation pipeline

## 📊 Monitoring & Debugging

### Available Metrics

```bash
npm run perf:lighthouse    # Performance scoring
npm run perf:vitals       # Core Web Vitals
npm run analyze           # Bundle composition
npm run test:coverage     # Test coverage report
```

### Health Checks

The application includes health check endpoints for monitoring:

- `/api/v1/recipe-ui/health/live` - Liveness probe
- `/api/v1/recipe-ui/health/ready` - Readiness probe
- `/api/v1/recipe-ui/metrics` - Application metrics

## 🎯 Best Practices for Claude Code

### When Analyzing Code

- Reference specific files with line numbers: `src/hooks/recipe-management/useRecipes.ts:45`
- Check existing patterns before suggesting changes
- Consider the microservices architecture when making recommendations

### When Writing Code

- Always follow the established service-specific patterns
- Use existing error handling classes and utilities
- Maintain consistency with TypeScript strict mode
- Include proper test coverage for new functionality

### When Debugging Issues

- Check service-specific error handling first
- Verify environment variables are properly configured
- Use the health check endpoints to verify service connectivity
- Check TanStack Query DevTools for cache issues

---

This guide covers the essential patterns and practices specific to this Recipe UI Service codebase. Always refer to existing code patterns and maintain consistency with the established architecture.
