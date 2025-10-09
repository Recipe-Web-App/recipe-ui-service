# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Recipe UI Service - Claude Code Guide

A comprehensive guide for using Claude Code with this Next.js 15 recipe management application built with microservices architecture.

## 📋 Table of Contents

- [Quick Start Commands](#-quick-start-commands)
- [Architecture Overview](#-architecture-overview)
- [Key Technologies & Patterns](#-key-technologies--patterns)
- [Code Generation Guidelines](#-code-generation-guidelines)
- [Common Patterns](#-common-patterns-to-follow)
- [Development Workflow](#-development-workflow)
- [Best Practices](#-best-practices-for-claude-code)

## 🚀 Quick Start Commands

### Essential Development Commands

```bash
# Development workflow
npm run dev                    # Start development server with Turbopack
npm run build                  # Production build with Turbopack
npm run start                  # Start production server
npm run test                   # Run all tests
npm run test:watch             # Interactive test watcher
npm run lint                   # Lint and fix code issues
npm run type-check             # TypeScript validation
npm run format                 # Format code with Prettier

# Quality assurance (run before committing)
npm run quality                # Combined lint + type-check + test
npm run validate               # Full validation suite
npm run validate:security      # Security scans
npm run validate:ci            # Full CI validation
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
npm run analyze              # Bundle analysis (set ANALYZE=true)
npm run perf:lighthouse      # Lighthouse performance audit
npm run perf:vitals          # Core Web Vitals measurement
npm run perf:bundle          # Bundle performance validation
npm run size-limit           # Bundle size validation
npm run knip                 # Unused code detection
npm run knip:production      # Production unused code detection
npm run madge                # Circular dependency detection
npm run deps:check           # Check circular deps and unused code
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
├── app/                    # Next.js 15 App Router pages and layouts
│   ├── api/               # API routes (health checks, metrics)
│   ├── manifest.ts        # PWA manifest
│   ├── robots.ts          # Robots.txt
│   └── sitemap.ts         # Sitemap generation
├── components/             # React components
│   ├── ui/                # Base design system components (shadcn/ui)
│   ├── forms/             # Form components (React Hook Form + Zod)
│   └── layout/            # Layout components
├── hooks/                 # Service-specific React hooks (TanStack Query)
│   ├── auth/             # Authentication hooks
│   ├── recipe-management/
│   ├── recipe-scraper/
│   ├── media-management/
│   ├── user-management/
│   └── meal-plan-management/
├── lib/                   # API clients and utilities
│   ├── api/              # Service-specific API clients (Axios)
│   │   ├── auth/
│   │   │   ├── client.ts        # Axios instance with interceptors
│   │   │   ├── user-auth.ts     # Auth endpoints
│   │   │   ├── oauth2.ts        # OAuth2 flow
│   │   │   └── pkce.ts          # PKCE utilities
│   │   ├── recipe-management/
│   │   │   ├── client.ts        # Service client
│   │   │   ├── recipes.ts       # Recipe CRUD
│   │   │   ├── ingredients.ts   # Ingredient management
│   │   │   ├── steps.ts         # Step management
│   │   │   ├── tags.ts          # Tag management
│   │   │   ├── reviews.ts       # Review management
│   │   │   └── search.ts        # Search functionality
│   │   ├── recipe-scraper/
│   │   ├── media-management/
│   │   ├── user-management/
│   │   └── meal-plan-management/
│   ├── auth/             # Auth utilities (token management)
│   └── utils/            # General utilities
├── stores/               # Zustand state stores
│   ├── auth-store.ts     # Authentication state
│   ├── recipe-store.ts   # Recipe state
│   ├── preferences-store.ts  # User preferences
│   └── ui/               # UI state stores (12 specialized stores)
│       ├── toast-store.ts
│       ├── theme-store.ts
│       ├── navigation-store.ts
│       ├── modal-store.ts
│       ├── loading-store.ts
│       ├── search-filter-store.ts
│       ├── layout-store.ts
│       ├── interaction-store.ts
│       ├── offline-store.ts
│       ├── accessibility-store.ts
│       ├── feature-store.ts
│       └── preference-store.ts
├── types/                # Service-specific TypeScript types
│   ├── auth/             # Auth DTOs (user, oauth2, client)
│   ├── recipe-management/ # Recipe DTOs (recipe, ingredient, step, tag, review)
│   ├── recipe-scraper/   # Scraper DTOs (requests, responses, nutrition)
│   ├── media-management/ # Media DTOs
│   ├── user-management/  # User DTOs (user, social, notifications, admin)
│   ├── meal-plan-management/ # Meal plan DTOs
│   └── ui/               # UI state types
├── config/               # Configuration
│   └── services.ts       # Service URL configuration
├── constants/            # Application constants
└── styles/               # Global styles and Tailwind config
```

## 🔧 Key Technologies & Patterns

### State Management

- **TanStack Query v5**: Server state management with caching, prefetching, and synchronization
  - Query keys follow pattern: `[service-name, resource, ...params]`
  - Default staleTime: 5 minutes for most queries
  - Default gcTime: 10 minutes
  - Optimistic updates in mutations
- **Zustand**: Lightweight client state management (15 specialized stores)
  - Auth state, Recipe state, User preferences
  - 12 UI stores (toast, theme, navigation, modal, loading, search, layout, interaction, offline, a11y, features, preferences)
- **React Hook Form + Zod**: Form state management with validation
- **Path aliases**: `@/` maps to `src/` for clean imports

### API Integration Pattern

Each microservice follows a consistent 3-layer architecture:

**Layer 1: API Client** (`src/lib/api/{service}/client.ts`)

```typescript
import axios from 'axios';
import { getServiceUrl } from '@/config/services';

const baseURL = getServiceUrl('SERVICE_NAME');

export const serviceClient = axios.create({
  baseURL,
  timeout: 10000, // 30000 for file uploads
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: Attach auth token
serviceClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle errors
serviceClient.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message ?? error.message;
    return Promise.reject({
      ...error,
      message,
      status: error.response?.status,
    });
  }
);

// Custom error class
export class ServiceApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ServiceApiError';
    this.status = status;
  }
}
```

**Layer 2: API Methods** (`src/lib/api/{service}/[feature].ts`)

```typescript
import { serviceClient } from './client';
import type { ItemDto, CreateRequest, UpdateRequest } from '@/types/{service}';

export class FeatureApi {
  async getItems(params?: PaginationParams): Promise<ItemDto[]> {
    const response = await serviceClient.get('/items', { params });
    return response.data;
  }

  async getItemById(id: number): Promise<ItemDto> {
    const response = await serviceClient.get(`/items/${id}`);
    return response.data;
  }

  async createItem(data: CreateRequest): Promise<ItemDto> {
    const response = await serviceClient.post('/items', data);
    return response.data;
  }

  async updateItem(id: number, data: UpdateRequest): Promise<ItemDto> {
    const response = await serviceClient.put(`/items/${id}`, data);
    return response.data;
  }

  async deleteItem(id: number): Promise<void> {
    await serviceClient.delete(`/items/${id}`);
  }
}

export const featureApi = new FeatureApi();
```

**Layer 3: React Hooks** (`src/hooks/{service}/use[Feature].ts`)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { featureApi } from '@/lib/api/{service}';
import { QUERY_KEYS } from '@/constants';

// Fetch all items
export const useItems = (params?: PaginationParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.SERVICE.ITEMS, params],
    queryFn: () => featureApi.getItems(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Fetch single item
export const useItem = (id: number) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.SERVICE.ITEM, id],
    queryFn: () => featureApi.getItemById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Create mutation with optimistic update
export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRequest) => featureApi.createItem(data),
    onSuccess: newItem => {
      // Update cache optimistically
      queryClient.setQueryData(
        [...QUERY_KEYS.SERVICE.ITEM, newItem.id],
        newItem
      );
      // Invalidate list query
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SERVICE.ITEMS,
      });
    },
  });
};

// Update mutation
export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateRequest }) =>
      featureApi.updateItem(id, data),
    onSuccess: (updatedItem, variables) => {
      queryClient.setQueryData(
        [...QUERY_KEYS.SERVICE.ITEM, variables.id],
        updatedItem
      );
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SERVICE.ITEMS,
      });
    },
  });
};

// Delete mutation
export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => featureApi.deleteItem(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({
        queryKey: [...QUERY_KEYS.SERVICE.ITEM, id],
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SERVICE.ITEMS,
      });
    },
  });
};
```

### Component Patterns

- **shadcn/ui**: Base design system components in `src/components/ui/`
- **React 19**: Latest React features (use client/server components appropriately)
- **TypeScript strict mode**: All components must be fully typed
- **Radix UI**: Headless accessible components (@radix-ui/react-\*)
- **Tailwind CSS + CVA**: Styling with class-variance-authority for variants
- **Form handling**: React Hook Form + Zod validation

### TypeScript Configuration

- **Strict mode enabled**: All type checking rules enforced
- **Path aliases**: `@/*` → `src/*`, `@/tests/*` → `tests/*`
- **Target**: ES2017 with modern lib (dom, dom.iterable, esnext)
- **Module resolution**: bundler (for Next.js 15)

### Testing Structure

```
tests/
├── unit/                    # Unit tests (Jest + RTL)
│   ├── components/         # Component unit tests
│   ├── hooks/              # Hook tests
│   ├── lib/                # Utility/API tests
│   └── stores/             # Store tests
├── integration/            # Integration tests
│   ├── frontend/          # Frontend integration
│   └── backend/           # API integration
├── e2e/                   # E2E tests (Playwright)
│   ├── user-journeys/     # User flows
│   ├── cross-browser/     # Browser compatibility
│   └── accessibility/     # A11y tests
├── performance/           # Performance tests
│   ├── lighthouse/        # Lighthouse CI
│   ├── core-web-vitals/  # Web Vitals
│   └── load-testing/      # Load tests
└── visual/                # Visual regression
    ├── components/        # Component screenshots
    └── pages/             # Page screenshots
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

### Service Configuration

**Environment Variables** (`.env.local`):

```bash
# Core application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Microservices (all default to localhost in development)
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:8081
NEXT_PUBLIC_RECIPE_MANAGEMENT_SERVICE_URL=http://localhost:8082
NEXT_PUBLIC_RECIPE_SCRAPER_SERVICE_URL=http://localhost:8083
NEXT_PUBLIC_MEDIA_MANAGEMENT_SERVICE_URL=http://localhost:8084
NEXT_PUBLIC_USER_MANAGEMENT_SERVICE_URL=http://localhost:8085
NEXT_PUBLIC_MEAL_PLAN_MANAGEMENT_SERVICE_URL=http://localhost:8086
```

**Service URL Helper** (`src/config/services.ts`):

```typescript
export const getServiceUrl = (service: ServiceName): string => {
  const urls = {
    AUTH: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL,
    RECIPE_MANAGEMENT: process.env.NEXT_PUBLIC_RECIPE_MANAGEMENT_SERVICE_URL,
    // ... other services
  };
  return urls[service] || '';
};
```

### Query Key Patterns

**Consistent naming in `src/constants/query-keys.ts`**:

```typescript
export const QUERY_KEYS = {
  AUTH: {
    USER: ['auth', 'user'] as const,
    OAUTH: ['auth', 'oauth'] as const,
  },
  RECIPE_MANAGEMENT: {
    RECIPES: ['recipe-management', 'recipes'] as const,
    RECIPE: ['recipe-management', 'recipe'] as const,
    RECIPE_INGREDIENTS: ['recipe-management', 'recipe-ingredients'] as const,
    RECIPE_STEPS: ['recipe-management', 'recipe-steps'] as const,
    RECIPE_TAGS: ['recipe-management', 'recipe-tags'] as const,
    RECIPE_REVIEWS: ['recipe-management', 'recipe-reviews'] as const,
  },
  // ... other services
} as const;
```

### Cache Management Strategy

**Query Configuration**:

- **Read-heavy resources** (recipes, ingredients): `staleTime: 5-10 minutes`
- **Frequently updated** (user preferences, cart): `staleTime: 1-2 minutes`
- **Static data** (categories, tags): `staleTime: 30 minutes`

**Mutation Best Practices**:

1. Use `queryClient.setQueryData()` for optimistic updates
2. Always `invalidateQueries()` after mutations
3. Use `removeQueries()` when deleting resources
4. Invalidate related queries (e.g., delete recipe → invalidate ingredients, steps, etc.)

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

Follow this step-by-step workflow:

1. **Plan & Identify Dependencies**
   - Determine which microservices are involved
   - Review existing patterns in similar features
   - Check if types/hooks already exist

2. **Create TypeScript Types** (`src/types/{service}/`)

   ```typescript
   // src/types/recipe-management/ingredient.ts
   export interface IngredientDto {
     ingredientId: number;
     recipeId: number;
     name: string;
     quantity: number;
     unit: string;
   }

   export interface CreateIngredientRequest {
     recipeId: number;
     name: string;
     quantity: number;
     unit: string;
   }
   ```

3. **Create API Methods** (`src/lib/api/{service}/`)
   - Add methods to existing API class or create new one
   - Use service client from `client.ts`
   - Follow naming: `get*`, `create*`, `update*`, `delete*`

4. **Create React Hooks** (`src/hooks/{service}/`)
   - Use TanStack Query for data fetching
   - Follow naming: `use{Resource}`, `use{Resources}`, `useCreate{Resource}`, etc.
   - Add proper cache management

5. **Create Components** (`src/components/`)
   - Use existing UI components from `src/components/ui/`
   - Follow TypeScript strict mode
   - Add proper accessibility attributes
   - Use Tailwind CSS for styling

6. **Write Tests**
   - Unit tests for hooks: `tests/unit/hooks/{service}/`
   - Unit tests for components: `tests/unit/components/`
   - Integration tests: `tests/integration/`
   - Maintain 85%+ coverage

7. **Run Quality Checks**
   ```bash
   npm run lint        # Fix linting
   npm run type-check  # Verify types
   npm run test        # Run tests
   npm run format      # Format code
   ```

### Testing Strategy & Coverage Targets

- **Unit Tests (70%)**: Components, hooks, utilities, stores
  - Coverage target: 85%+ (90%+ for critical files)
  - Tools: Jest, React Testing Library
  - Location: `tests/unit/`

- **Integration Tests (25%)**: API integration, user workflows
  - Frontend integration: Component + hook integration
  - Backend integration: Real API endpoint testing
  - Location: `tests/integration/`

- **E2E Tests (5%)**: Critical user journeys
  - Cross-browser testing (Chrome, Firefox, Safari)
  - Accessibility testing (WCAG 2.1 AA)
  - Visual regression testing
  - Tools: Playwright
  - Location: `tests/e2e/`

### Performance Best Practices

- **React Optimization**
  - Use `React.memo()` for expensive components
  - Avoid inline function definitions in render
  - Use `useMemo()` and `useCallback()` judiciously

- **TanStack Query Optimization**
  - Proper `staleTime` configuration
  - Query deduplication (automatic)
  - Prefetching for anticipated data
  - Optimistic updates for better UX

- **Bundle Optimization**
  - Run `npm run analyze` to check bundle size
  - Target: <250KB total bundle
  - Use dynamic imports for large components
  - Tree-shaking enabled by default

- **Core Web Vitals Targets**
  - LCP (Largest Contentful Paint): <2.5s
  - CLS (Cumulative Layout Shift): <0.1
  - FID (First Input Delay): <100ms
  - Monitor with `npm run perf:vitals`

## 🔒 Security & Best Practices

### Security Validation Layers

The project uses a comprehensive 7-layer security approach:

1. **Secret Detection**
   - `secretlint`: Scan for AWS, GCP, GitHub, npm, Slack secrets
   - `gitleaks`: Git history secret scanning
   - Pre-commit hooks prevent secret commits

2. **Static Analysis (SAST)**
   - `semgrep`: Security-focused code analysis
   - ESLint security plugin
   - Runs on every commit

3. **Dependency Scanning**
   - `npm audit`: npm package vulnerabilities
   - `trivy fs`: Dependency vulnerability scanning
   - `license-checker`: License compliance

4. **Container Security**
   - `hadolint`: Dockerfile linting
   - `trivy image`: Container vulnerability scanning
   - Multi-arch builds (amd64, arm64)

5. **Kubernetes Security**
   - `kubeval`: K8s manifest validation
   - `conftest`: Policy enforcement
   - Security context validation

6. **Repository Security**
   - `trivy repo`: Full repository scanning
   - Supply chain analysis

7. **Advanced Analysis**
   - `semgrep p/security-audit`: Advanced SAST rules
   - OWASP compliance validation

**Run all security scans**:

```bash
npm run validate:security  # All 7 layers
npm run security:scan      # Secrets + SAST
npm run security:deps      # Dependencies only
npm run security:docker    # Container only
npm run security:k8s       # Kubernetes only
```

### Code Quality Tools

- **ESLint**: 60+ rules (TypeScript, React, accessibility, security, performance)
  - Plugins: `@typescript-eslint`, `react-hooks`, `jsx-a11y`, `security`, `sonarjs`, `unicorn`
- **Prettier**: Consistent formatting with Tailwind plugin
- **TypeScript**: Strict mode enabled
- **Stylelint**: CSS/SCSS linting with Tailwind config
- **pre-commit framework**: 11-stage validation pipeline
- **Husky**: Git hooks automation

## 📊 Monitoring & Health Checks

### Application Health Endpoints

Located in `src/app/api/v1/recipe-ui/`:

- **`/api/v1/recipe-ui/health`** - Overall health status
- **`/api/v1/recipe-ui/health/live`** - Liveness probe (K8s)
- **`/api/v1/recipe-ui/health/ready`** - Readiness probe (K8s)
- **`/api/v1/recipe-ui/metrics`** - Application metrics

### Performance Monitoring

```bash
# Lighthouse CI audit
npm run perf:lighthouse    # Full Lighthouse audit (performance, accessibility, SEO)

# Core Web Vitals
npm run perf:vitals        # LCP, CLS, FID measurement

# Bundle analysis
npm run analyze            # Interactive bundle size visualization
npm run perf:bundle        # Bundle + size limit validation
npm run size-limit         # Enforce bundle size limits (<250KB)

# Load testing
npm run perf:load          # Load testing with autocannon

# Coverage
npm run test:coverage      # Test coverage report with thresholds
```

### Development Tools

- **TanStack Query DevTools**: Enabled in development for query inspection
- **React DevTools**: Component tree inspection
- **Next.js DevTools**: App Router debugging

## 🎯 Best Practices for Claude Code

### When Analyzing Code

- **Reference files precisely**: Use `file:line` format (e.g., `src/hooks/recipe-management/useRecipes.ts:89`)
- **Check existing patterns first**: Review similar features before suggesting new approaches
- **Understand service boundaries**: Each microservice has its own client, types, and hooks
- **Follow the data flow**: Types → API → Hooks → Components

### When Writing Code

1. **Follow Established Patterns**
   - API: 3-layer architecture (client → methods → hooks)
   - Components: Use shadcn/ui base components
   - Forms: React Hook Form + Zod validation
   - State: TanStack Query for server, Zustand for client

2. **Type Safety**
   - Use TypeScript strict mode (all files must be fully typed)
   - Define DTOs in `src/types/{service}/`
   - Use `as const` for query keys
   - Avoid `any` type (use `unknown` if necessary)

3. **Naming Conventions**
   - Components: PascalCase (`RecipeCard.tsx`)
   - Hooks: camelCase with `use` prefix (`useRecipes.ts`)
   - API methods: camelCase (`getRecipeById`, `createRecipe`)
   - Types: PascalCase with suffix (`RecipeDto`, `CreateRecipeRequest`)
   - Constants: UPPER_SNAKE_CASE

4. **Import Organization**

   ```typescript
   // 1. External libraries
   import { useQuery } from '@tanstack/react-query';

   // 2. Internal with @ alias
   import { recipeApi } from '@/lib/api/recipe-management';
   import type { RecipeDto } from '@/types/recipe-management';

   // 3. Relative imports (avoid if possible)
   import { helpers } from './helpers';
   ```

5. **Testing Requirements**
   - Write tests alongside new code
   - Unit tests for all hooks and utilities
   - Component tests with React Testing Library
   - Integration tests for multi-step workflows
   - Maintain 85%+ coverage

### When Debugging Issues

**Common Issues & Solutions**:

1. **API Connection Errors**
   - Check environment variables in `.env.local`
   - Verify service URLs with `getServiceUrl()`
   - Check health endpoints: `/api/v1/{service}/health`
   - Review network tab for request/response details

2. **Cache/State Issues**
   - Open TanStack Query DevTools (dev mode)
   - Check query keys match expected pattern
   - Verify `invalidateQueries()` after mutations
   - Look for stale data (check `staleTime` config)

3. **Type Errors**
   - Run `npm run type-check` for full diagnostics
   - Ensure types are imported from correct service
   - Check DTO alignment with backend API

4. **Build Errors**
   - Clear build cache: `rm -rf .next`
   - Check for client/server component conflicts
   - Verify environment variables are prefixed with `NEXT_PUBLIC_`

5. **Test Failures**
   - Run single test: `npm run test -- path/to/test.ts`
   - Check for missing mocks (axios, hooks)
   - Verify test utils are imported correctly

### Code Review Checklist

Before committing:

- [ ] `npm run lint` passes
- [ ] `npm run type-check` passes
- [ ] `npm run test` passes
- [ ] `npm run format` applied
- [ ] New code has tests (85%+ coverage)
- [ ] No console.log statements (use proper logging)
- [ ] Environment variables documented
- [ ] Comments explain "why", not "what"
- [ ] Accessibility attributes added (ARIA)
- [ ] Error handling implemented

### Quick Reference

**File a component lives in determines its location**:

- `src/components/ui/` → Base design system (shadcn/ui)
- `src/components/forms/` → Form-specific components
- `src/components/layout/` → Layout components (header, nav, etc.)
- `src/components/` (root) → Feature components

**Service-specific organization**:

```
{service}/
├── src/lib/api/{service}/      # API methods
├── src/hooks/{service}/         # React hooks
├── src/types/{service}/         # TypeScript types
└── tests/unit/hooks/{service}/  # Hook tests
```

**Common command shortcuts**:

```bash
npm run dev          # Start dev server
npm run quality      # Lint + type + test
npm run validate     # Full validation
npm test -- --watch  # Watch mode for tests
```

---

This guide covers the essential patterns and practices specific to this Recipe UI Service codebase. Always refer to existing code patterns and maintain consistency with the established architecture.
