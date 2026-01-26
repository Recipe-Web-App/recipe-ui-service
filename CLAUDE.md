# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev                     # Start dev server with Turbopack
npm run build                   # Production build
npm run quality                 # Lint + type-check + test (run before commits)

# Testing
npm run test                    # Run all tests
npm run test -- path/to/test    # Run single test file
npm run test -- -t "test name"  # Run tests matching name
npm run test:watch              # Interactive test watcher
npm run test:coverage           # Coverage report

# Specific test suites
npm run test:unit               # Unit tests only
npm run test:integration        # All integration tests
npm run test:e2e                # E2E tests (Playwright)

# Code quality
npm run lint                    # Lint and fix
npm run type-check              # TypeScript validation
npm run format                  # Prettier formatting
```

## Architecture

### Microservices

This Next.js 15 UI connects to 7 backend services via `sous-chef-proxy.local`:

| Service              | Purpose                                        |
| -------------------- | ---------------------------------------------- |
| Auth                 | Authentication, OAuth2, PKCE                   |
| Recipe Management    | Recipe CRUD, ingredients, steps, tags, reviews |
| Recipe Scraper       | Web scraping, recipe import                    |
| Media Management     | File upload, image processing                  |
| User Management      | Profiles, preferences, social                  |
| Meal Plan Management | Meal planning, scheduling                      |
| Notification         | Email notifications, alerts                    |

Service URLs are configured in `src/config/services.ts` using the `SERVICE_URLS` constant.

### 3-Layer API Pattern

Each service follows: **Types → API Client → React Hooks**

```
src/types/{service}/           # DTOs and request/response types
src/lib/api/{service}/client.ts  # Axios instance with interceptors
src/lib/api/{service}/*.ts     # API methods (getX, createX, updateX, deleteX)
src/hooks/{service}/           # TanStack Query hooks (useX, useCreateX, etc.)
```

Example flow for recipes:

1. `src/types/recipe-management/recipe.ts` - RecipeDto, CreateRecipeRequest
2. `src/lib/api/recipe-management/client.ts` - Axios instance with auth interceptor
3. `src/lib/api/recipe-management/recipes.ts` - RecipeApi class with CRUD methods
4. `src/hooks/recipe-management/useRecipes.ts` - useRecipes, useRecipe, useCreateRecipe hooks

### State Management

- **Server state**: TanStack Query v5 with query keys in `src/constants/index.ts`
- **Client state**: Zustand stores in `src/stores/` (auth, recipe, preferences, 12 UI stores)
- **Forms**: React Hook Form + Zod validation

### Query Keys Pattern

```typescript
// Always use constants from src/constants/index.ts
QUERY_KEYS.RECIPE_MANAGEMENT.RECIPES; // ['recipeManagement', 'recipes']
QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE; // ['recipeManagement', 'recipe']
```

### Key Directories

```
src/app/                    # Next.js App Router pages
src/components/ui/          # shadcn/ui base components
src/components/forms/       # Form components
src/components/layout/      # Layout components
src/config/services.ts      # Service URL configuration (getServiceUrl)
tests/unit/                 # Jest + RTL tests
tests/integration/          # API integration tests
tests/e2e/                  # Playwright E2E tests
```

### Import Aliases

- `@/` → `src/`
- `@/tests/` → `tests/`

## Patterns

### Creating New API Integration

1. Add types in `src/types/{service}/`
2. Add API methods in `src/lib/api/{service}/` using the service client
3. Add hooks in `src/hooks/{service}/` using TanStack Query
4. Add query keys to `src/constants/query-keys.ts`

### TanStack Query Conventions

- Queries: `useX(id)`, `useXs(params)`
- Mutations: `useCreateX()`, `useUpdateX()`, `useDeleteX()`
- Always invalidate related queries after mutations
- Default staleTime: 5 minutes, gcTime: 10 minutes

### Component Conventions

- Use shadcn/ui components from `src/components/ui/`
- Styling: Tailwind CSS + CVA for variants
- Forms: React Hook Form + Zod schemas
- All components must be fully typed (strict mode)

## Environment Variables

Copy `.env.example` to `.env.local` and configure as needed. Service URLs are hardcoded in `src/config/services.ts` and route through `sous-chef-proxy.local`.
