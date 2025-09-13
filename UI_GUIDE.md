# 🎨 UI/UX Design Guide

This document outlines the user interface design system, component library, and user experience patterns for the
Recipe UI Service.

## 📋 Table of Contents

- [Design System Overview](#-design-system-overview)
- [Component Library](#-component-library)
- [Page Structure](#-page-structure)
- [User Experience Patterns](#-user-experience-patterns)
- [Accessibility Guidelines](#-accessibility-guidelines)
- [Responsive Design](#-responsive-design)
- [Theming and Customization](#-theming-and-customization)

## 🎯 Design System Overview

### Design Principles

1. **Simplicity First**: Clean, uncluttered interfaces
2. **Accessibility**: WCAG 2.1 AA compliant
3. **Mobile-First**: Responsive design from small to large screens
4. **Performance**: Fast loading with smooth interactions
5. **Consistency**: Unified patterns across all pages

### Brand Identity

#### Color Palette

```css
/* Primary Colors */
--primary-50: #eff6ff;
--primary-500: #3b82f6;
--primary-900: #1e3a8a;

/* Secondary Colors */
--secondary-50: #fafaf9;
--secondary-500: #78716c;
--secondary-900: #1c1917;

/* Semantic Colors */
--success-500: #10b981;
--warning-500: #f59e0b;
--error-500: #ef4444;
--info-500: #06b6d4;
```

#### Typography

```css
/* Font Families */
font-family-sans:
  'Geist',
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  sans-serif;
font-family-mono: 'Geist Mono', 'JetBrains Mono', Consolas, monospace;

/* Font Scales */
text-xs: 0.75rem; /* 12px */
text-sm: 0.875rem; /* 14px */
text-base: 1rem; /* 16px */
text-lg: 1.125rem; /* 18px */
text-xl: 1.25rem; /* 20px */
text-2xl: 1.5rem; /* 24px */
text-3xl: 1.875rem; /* 30px */
text-4xl: 2.25rem; /* 36px */
```

#### Spacing Scale

```css
/* Consistent spacing system */
space-1: 0.25rem; /* 4px */
space-2: 0.5rem; /* 8px */
space-3: 0.75rem; /* 12px */
space-4: 1rem; /* 16px */
space-6: 1.5rem; /* 24px */
space-8: 2rem; /* 32px */
space-12: 3rem; /* 48px */
space-16: 4rem; /* 64px */
```

## 🧩 Component Library

### Base Components

#### Button Component

```tsx
// Primary button for main actions
<Button variant="primary" size="lg" icon={<PlusIcon />}>
  Add Recipe
</Button>

// Secondary button for supporting actions
<Button variant="secondary" size="md">
  Cancel
</Button>

// Icon-only button for compact spaces
<Button variant="ghost" size="sm" iconOnly>
  <HeartIcon />
</Button>
```

**Button Variants:**

- `primary`: Main call-to-action buttons
- `secondary`: Supporting actions
- `outline`: Less prominent actions
- `ghost`: Minimal styling for icon buttons
- `destructive`: Delete or remove actions

#### Input Components

```tsx
// Text input with label and validation
<Input
  label="Recipe Name"
  placeholder="Enter recipe name"
  error="Recipe name is required"
  required
/>

// Search input with icon
<SearchInput
  placeholder="Search recipes..."
  onSearch={handleSearch}
  icon={<SearchIcon />}
/>

// Select dropdown
<Select
  label="Category"
  options={categories}
  placeholder="Select category"
  value={selectedCategory}
  onChange={setSelectedCategory}
/>
```

#### Card Component

```tsx
// Recipe card with image and metadata
<Card variant="elevated" padding="lg">
  <Card.Image src="/recipe-image.jpg" alt="Recipe" />
  <Card.Content>
    <Card.Title>Delicious Recipe</Card.Title>
    <Card.Description>A wonderful recipe description</Card.Description>
    <Card.Footer>
      <Badge variant="secondary">30 min</Badge>
      <Rating value={4.5} />
    </Card.Footer>
  </Card.Content>
</Card>
```

### Layout Components

#### Navigation

```tsx
// Main navigation header
<Header>
  <Header.Brand>
    <Logo />
  </Header.Brand>
  <Header.Navigation>
    <NavItem href="/" active>Home</NavItem>
    <NavItem href="/recipes">Recipes</NavItem>
    <NavItem href="/categories">Categories</NavItem>
  </Header.Navigation>
  <Header.Actions>
    <SearchButton />
    <UserMenu />
  </Header.Actions>
</Header>

// Mobile navigation drawer
<MobileNav open={isOpen} onClose={closeMobileNav}>
  <MobileNav.Item href="/">Home</MobileNav.Item>
  <MobileNav.Item href="/recipes">Recipes</MobileNav.Item>
</MobileNav>
```

#### Layout Grid

```tsx
// Responsive grid system
<Grid>
  <Grid.Col span={12} md={8}>
    <MainContent />
  </Grid.Col>
  <Grid.Col span={12} md={4}>
    <Sidebar />
  </Grid.Col>
</Grid>

// Recipe grid layout
<RecipeGrid>
  {recipes.map(recipe => (
    <RecipeCard key={recipe.id} recipe={recipe} />
  ))}
</RecipeGrid>
```

### Specialized Components

#### Recipe Components

```tsx
// Recipe card for listings
<RecipeCard
  image="/recipe.jpg"
  title="Chicken Tikka Masala"
  description="Aromatic and flavorful Indian curry"
  cookTime="45 min"
  difficulty="Medium"
  rating={4.8}
  tags={["Indian", "Spicy", "Dinner"]}
/>

// Recipe detail view
<RecipeDetail>
  <RecipeDetail.Hero image="/hero.jpg" title="Recipe Name" />
  <RecipeDetail.Meta cookTime="30m" serves="4" difficulty="Easy" />
  <RecipeDetail.Ingredients ingredients={ingredientsList} />
  <RecipeDetail.Instructions steps={instructionSteps} />
  <RecipeDetail.Nutrition nutrition={nutritionFacts} />
</RecipeDetail>

// Recipe form for editing
<RecipeForm
  initialData={recipe}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  isSubmitting={isLoading}
/>
```

## 📱 Page Structure

### Home Page

```tsx
// Landing page layout
<HomePage>
  <Hero
    title="Discover Amazing Recipes"
    subtitle="Cook something delicious today"
    cta={<Button>Explore Recipes</Button>}
  />

  <FeaturedSection>
    <SectionTitle>Featured Recipes</SectionTitle>
    <RecipeGrid recipes={featuredRecipes} />
  </FeaturedSection>

  <CategoriesSection>
    <SectionTitle>Browse by Category</SectionTitle>
    <CategoryGrid categories={categories} />
  </CategoriesSection>
</HomePage>
```

### Recipe Listing Page

```tsx
// Recipe browsing interface
<RecipesPage>
  <PageHeader>
    <PageTitle>All Recipes</PageTitle>
    <SearchBar placeholder="Search recipes..." />
  </PageHeader>

  <ContentLayout>
    <Sidebar>
      <FilterPanel>
        <CategoryFilter />
        <DifficultyFilter />
        <CookTimeFilter />
        <TagFilter />
      </FilterPanel>
    </Sidebar>

    <MainContent>
      <ResultsHeader>
        <ResultCount count={totalRecipes} />
        <SortSelector options={sortOptions} />
      </ResultsHeader>
      <RecipeGrid recipes={recipes} />
      <Pagination currentPage={page} totalPages={totalPages} />
    </MainContent>
  </ContentLayout>
</RecipesPage>
```

### Recipe Detail Page

```tsx
// Individual recipe view
<RecipePage>
  <RecipeHero
    image="/recipe-hero.jpg"
    title="Chicken Tikka Masala"
    rating={4.8}
    reviewCount={234}
  />

  <RecipeMeta
    cookTime="45 min"
    prepTime="20 min"
    serves="4 people"
    difficulty="Medium"
    calories={420}
  />

  <RecipeContent>
    <IngredientsPanel ingredients={ingredients} />
    <InstructionsPanel steps={instructions} />
    <NutritionPanel nutrition={nutrition} />
  </RecipeContent>

  <RelatedSection>
    <SectionTitle>Similar Recipes</SectionTitle>
    <RecipeCarousel recipes={relatedRecipes} />
  </RelatedSection>
</RecipePage>
```

## 🔄 State Management Integration

### UI Store Architecture

The application uses a comprehensive set of Zustand stores for UI state management:

```tsx
import { useUI } from '@/stores/ui';

// Access all UI stores through one hook
const ui = useUI();
const {
  toast,
  theme,
  navigation,
  modal,
  loading,
  search,
  layout,
  accessibility,
} = ui;
```

### Toast Notifications

```tsx
import { useToastStore } from '@/stores/ui/toast-store';

function RecipeActions() {
  const { addToast } = useToastStore();

  const handleSave = async () => {
    try {
      await saveRecipe();
      addToast({
        message: 'Recipe saved successfully!',
        type: 'success',
        duration: 3000,
      });
    } catch (error) {
      addToast({
        message: 'Failed to save recipe',
        type: 'error',
        action: {
          label: 'Retry',
          onClick: handleSave,
        },
      });
    }
  };
}
```

### Theme Management

```tsx
import { useThemeStore } from '@/stores/ui/theme-store';

function ThemeToggle() {
  const { theme, effectiveTheme, setTheme } = useThemeStore();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(effectiveTheme === 'light' ? 'dark' : 'light')}
    >
      {effectiveTheme === 'light' ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
}
```

### Modal Management

```tsx
import { useModalStore } from '@/stores/ui/modal-store';

function RecipeDetails() {
  const { openModal, closeModal } = useModalStore();

  const handleEdit = () => {
    openModal({
      id: 'edit-recipe',
      component: RecipeEditModal,
      props: { recipeId: recipe.id },
      size: 'lg',
      closeOnOverlayClick: false,
    });
  };
}
```

### Search & Filter State

```tsx
import { useSearchFilterStore } from '@/stores/ui/search-filter-store';

function RecipeFilters() {
  const {
    activeQuery,
    activeFilters,
    setQuery,
    addFilter,
    removeFilter,
    setSortConfig,
  } = useSearchFilterStore();

  return (
    <FilterPanel>
      <SearchInput
        value={activeQuery}
        onChange={setQuery}
        placeholder="Search recipes..."
      />
      <FilterGroup>
        {activeFilters.map(filter => (
          <FilterChip
            key={filter.id}
            label={filter.label}
            onRemove={() => removeFilter(filter.id)}
          />
        ))}
      </FilterGroup>
    </FilterPanel>
  );
}
```

### Layout & View Modes

```tsx
import { useLayoutStore } from '@/stores/ui/layout-store';

function RecipeGrid() {
  const { viewMode, setViewMode, pagination, setPage } = useLayoutStore();

  return (
    <>
      <ViewModeSelector
        mode={viewMode}
        onChange={setViewMode}
        options={['grid', 'list', 'card']}
      />
      <div className={viewMode === 'grid' ? 'grid' : 'flex flex-col'}>
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
      />
    </>
  );
}
```

### Offline Support

```tsx
import { useOfflineStore } from '@/stores/ui/offline-store';

function OfflineIndicator() {
  const { isOnline, syncQueue, processSyncQueue } = useOfflineStore();

  if (isOnline) return null;

  return (
    <Banner variant="warning">
      <p>You're offline. {syncQueue.length} changes pending sync.</p>
      <Button size="sm" onClick={processSyncQueue}>
        Sync Now
      </Button>
    </Banner>
  );
}
```

### Feature Flags

```tsx
import { useFeatureStore } from '@/stores/ui/feature-store';

function RecipeFeatures() {
  const { isFeatureEnabled, getFeatureVariant } = useFeatureStore();

  // Check if feature is enabled
  if (!isFeatureEnabled('ai-suggestions')) {
    return null;
  }

  // Get A/B test variant
  const variant = getFeatureVariant('recipe-layout');

  return (
    <div>
      {variant === 'grid' ? <GridLayout /> : <ListLayout />}
      <AISuggestions />
    </div>
  );
}
```

### Accessibility Management

```tsx
import { useAccessibilityStore } from '@/stores/ui/accessibility-store';

function AccessibleRecipeCard({ recipe }) {
  const { fontSize, highContrast, announce } = useAccessibilityStore();

  const handleFavorite = () => {
    toggleFavorite(recipe.id);
    announce(`${recipe.title} added to favorites`, 'polite');
  };

  return (
    <Card
      className={cn(
        'recipe-card',
        highContrast && 'high-contrast',
        fontSize === 'large' && 'text-lg'
      )}
    >
      {/* Card content */}
    </Card>
  );
}
```

## 💫 User Experience Patterns

### Loading States

```tsx
// Skeleton loading for recipe cards
<RecipeCardSkeleton />

// Progressive loading with suspense
<Suspense fallback={<RecipeListSkeleton />}>
  <RecipeList />
</Suspense>

// Loading indicators
<LoadingSpinner size="sm" />
<LoadingDots />
<ProgressBar progress={uploadProgress} />
```

### Error States

```tsx
// Empty states
<EmptyState
  icon={<EmptyRecipesIcon />}
  title="No recipes found"
  description="Try adjusting your search criteria"
  action={<Button>Clear Filters</Button>}
/>

// Error boundaries
<ErrorBoundary
  fallback={<ErrorState />}
  onRetry={handleRetry}
>
  <RecipeContent />
</ErrorBoundary>

// Form validation errors
<Input
  error="Recipe name must be at least 3 characters"
  status="error"
/>
```

### Interactive Patterns

```tsx
// Hover states and micro-interactions
<RecipeCard className="hover:scale-105 transition-transform" />

// Favorite toggle with animation
<FavoriteButton
  isFavorited={isFavorited}
  onClick={toggleFavorite}
  className="hover:scale-110 active:scale-95"
/>

// Progressive disclosure
<Accordion>
  <Accordion.Item title="Nutritional Information">
    <NutritionFacts />
  </Accordion.Item>
</Accordion>
```

## ♿ Accessibility Guidelines

### ARIA Labels and Roles

```tsx
// Proper labeling
<button aria-label="Add recipe to favorites">
  <HeartIcon />
</button>

// Form accessibility
<Input
  aria-describedby="name-error"
  aria-invalid={hasError}
/>
<div id="name-error" role="alert">
  {errorMessage}
</div>

// Navigation landmarks
<nav role="navigation" aria-label="Main navigation">
<main role="main">
<aside role="complementary">
```

### Keyboard Navigation

```tsx
// Focus management
<Modal onOpen={focusFirstElement}>
<Dialog onClose={returnFocusToTrigger}>

// Skip links
<SkipLink href="#main-content">Skip to main content</SkipLink>

// Tab order optimization
<div tabIndex={0} onKeyDown={handleKeyDown}>
```

### Screen Reader Support

```tsx
// Descriptive text for complex interactions
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// Alternative text for images
<Image
  src="/recipe.jpg"
  alt="Golden brown chicken tikka masala in a cast iron pan with basmati rice and naan bread"
/>
```

## 📱 Responsive Design

### Breakpoint System

```css
/* Mobile First Breakpoints */
sm: '640px',   /* Small tablets */
md: '768px',   /* Tablets */
lg: '1024px',  /* Small desktops */
xl: '1280px',  /* Large desktops */
2xl: '1536px'  /* Extra large screens */
```

### Responsive Patterns

```tsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

// Responsive text sizing
<h1 className="text-2xl md:text-3xl lg:text-4xl">

// Mobile navigation
<div className="hidden md:flex">Desktop Nav</div>
<div className="md:hidden">Mobile Nav</div>

// Responsive spacing
<div className="p-4 md:p-6 lg:p-8">
```

### Mobile Optimizations

```tsx
// Touch-friendly buttons
<Button className="min-h-[44px] min-w-[44px]">

// Swipe gestures
<RecipeCarousel swipeEnabled touchThreshold={50} />

// Mobile-specific interactions
<PullToRefresh onRefresh={refetchRecipes}>
  <RecipeList />
</PullToRefresh>
```

## 🎨 Theming and Customization

### CSS Custom Properties

```css
/* Theme variables */
:root {
  --color-primary: theme('colors.blue.500');
  --color-background: theme('colors.white');
  --color-foreground: theme('colors.gray.900');
  --border-radius: theme('borderRadius.lg');
  --font-sans: theme('fontFamily.sans');
}

/* Dark theme */
[data-theme='dark'] {
  --color-background: theme('colors.gray.900');
  --color-foreground: theme('colors.gray.100');
}
```

### Theme Provider

```tsx
// Theme context
<ThemeProvider defaultTheme="light">
  <App />
</ThemeProvider>

// Theme toggle
<ThemeToggle
  themes={['light', 'dark', 'system']}
  defaultTheme="system"
/>
```

### Component Variants

```tsx
// Variant system with class-variance-authority
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);
```

## 🎭 Animation and Transitions

### Micro-interactions

```css
/* Smooth transitions */
.recipe-card {
  transition: all 0.2s ease-in-out;
}

.recipe-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

/* Loading animations */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.loading-skeleton {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### Page Transitions

```tsx
// Route transitions with Framer Motion
<AnimatePresence mode="wait">
  <motion.div
    key={pathname}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.2 }}
  >
    <PageContent />
  </motion.div>
</AnimatePresence>
```

## 🔧 Development Guidelines

### Component Development

```tsx
// Component structure template
export interface ComponentProps {
  // Props definition
}

const Component = forwardRef<HTMLElement, ComponentProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(componentVariants({ variant }), className)}
        {...props}
      >
        {/* Component content */}
      </div>
    );
  }
);

Component.displayName = 'Component';
export { Component };
```

### Testing UI Components

```tsx
// Component testing approach
describe('RecipeCard', () => {
  it('renders recipe information correctly', () => {
    render(
      <RecipeCard
        title="Test Recipe"
        description="Test Description"
        cookTime="30 min"
      />
    );

    expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    expect(screen.getByText('30 min')).toBeInTheDocument();
  });

  it('handles favorite toggle interaction', async () => {
    const onFavoriteToggle = jest.fn();
    render(
      <RecipeCard title="Test Recipe" onFavoriteToggle={onFavoriteToggle} />
    );

    await user.click(screen.getByLabelText('Add to favorites'));
    expect(onFavoriteToggle).toHaveBeenCalled();
  });
});
```

## 📊 UI Performance Guidelines

### Optimization Checklist

- [ ] Components use React.memo where appropriate
- [ ] Images are optimized with Next.js Image component
- [ ] Lazy loading implemented for below-fold content
- [ ] Virtual scrolling for long lists
- [ ] Bundle size monitored for component additions
- [ ] Animations use CSS transforms for performance
- [ ] Critical CSS inlined for above-fold content

### Accessibility Checklist

- [ ] All interactive elements are keyboard accessible
- [ ] Color contrast meets WCAG AA standards (4.5:1)
- [ ] Focus indicators are clearly visible
- [ ] Screen reader announcements for dynamic content
- [ ] Alternative text provided for all images
- [ ] Form labels properly associated with inputs
- [ ] Semantic HTML structure used throughout

---

This UI guide provides the foundation for creating a consistent, accessible, and delightful user experience across
the Recipe UI Service. All components should follow these patterns and guidelines to ensure a cohesive design system.
