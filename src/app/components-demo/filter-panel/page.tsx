'use client';

import * as React from 'react';
import { FilterPanel } from '@/components/ui/filter-panel';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { FilterConfig, FilterValues } from '@/types/ui/filter-panel';

export default function FilterPanelDemoPage() {
  return (
    <div className="container mx-auto space-y-12 py-8">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold">FilterPanel Component</h1>
            <p className="text-muted-foreground text-lg">
              A generic, configurable filter panel that composes existing UI
              components to provide a flexible filtering system.
            </p>
          </div>
          <Badge variant="default" className="text-sm">
            Generic Component
          </Badge>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold">5 Filter Types</h3>
                <p className="text-muted-foreground text-sm">
                  Search, Checkbox, Range, Select, Custom
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold">Fully Configurable</h3>
                <p className="text-muted-foreground text-sm">
                  Props-based configuration
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold">Mobile-Friendly</h3>
                <p className="text-muted-foreground text-sm">
                  Collapsible on mobile
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold">Accessible</h3>
                <p className="text-muted-foreground text-sm">
                  WCAG 2.1 AA compliant
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section 1: Basic Usage */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-2 text-2xl font-bold">
            Basic Usage (Recipe Filters)
          </h2>
          <p className="text-muted-foreground">
            A filter panel with all filter types for filtering recipes.
          </p>
        </div>

        <BasicUsageDemo />
      </section>

      {/* Section 2: All Filter Types */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-2 text-2xl font-bold">All Filter Types</h2>
          <p className="text-muted-foreground">
            Showcase of all supported filter types with descriptions.
          </p>
        </div>

        <AllFilterTypesDemo />
      </section>

      {/* Section 3: Collapsible */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-2 text-2xl font-bold">
            Collapsible (Mobile-Friendly)
          </h2>
          <p className="text-muted-foreground">
            Panel can be collapsed to save space on mobile devices.
          </p>
        </div>

        <CollapsibleDemo />
      </section>

      {/* Section 4: Variants */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-2 text-2xl font-bold">Variants</h2>
          <p className="text-muted-foreground">
            Different visual styles: default, compact, and full.
          </p>
        </div>

        <VariantsDemo />
      </section>

      {/* Section 5: With Result Count */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-2 text-2xl font-bold">With Result Count</h2>
          <p className="text-muted-foreground">
            Shows the number of results matching current filters.
          </p>
        </div>

        <ResultCountDemo />
      </section>

      {/* Section 6: Real-time Filtering */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-2 text-2xl font-bold">Real-time Filtering</h2>
          <p className="text-muted-foreground">
            Results update automatically as filters change.
          </p>
        </div>

        <RealTimeFilteringDemo />
      </section>

      {/* Section 7: Apply Button Mode */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-2 text-2xl font-bold">Apply Button Mode</h2>
          <p className="text-muted-foreground">
            Filters are applied only when the Apply button is clicked.
          </p>
        </div>

        <ApplyButtonModeDemo />
      </section>

      {/* Section 8: In Context (Browse Page) */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-2 text-2xl font-bold">In Context (Browse Page)</h2>
          <p className="text-muted-foreground">
            Filter panel integrated into a typical browse page layout.
          </p>
        </div>

        <InContextDemo />
      </section>

      {/* Section 9: Interactive Playground */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-2 text-2xl font-bold">Interactive Playground</h2>
          <p className="text-muted-foreground">
            Configure all filter panel options and see the results in real-time.
          </p>
        </div>

        <InteractivePlaygroundDemo />
      </section>

      {/* Section 10: Usage Examples */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-2 text-2xl font-bold">Usage Examples</h2>
          <p className="text-muted-foreground">
            Code examples for common use cases.
          </p>
        </div>

        <UsageExamplesDemo />
      </section>
    </div>
  );
}

function BasicUsageDemo() {
  const [filterValues, setFilterValues] = React.useState<FilterValues>({
    search: '',
    categories: [],
    time: [0, 120],
    difficulty: '',
    dietary: [],
  });

  const filters: FilterConfig[] = [
    {
      type: 'search',
      id: 'search',
      placeholder: 'Search recipes by name or ingredients...',
    },
    {
      type: 'checkbox',
      id: 'categories',
      label: 'Meal Type',
      options: [
        { id: 'breakfast', label: 'Breakfast', count: 42 },
        { id: 'lunch', label: 'Lunch', count: 38 },
        { id: 'dinner', label: 'Dinner', count: 56 },
        { id: 'snack', label: 'Snack', count: 24 },
        { id: 'dessert', label: 'Dessert', count: 32 },
      ],
      showSelectAll: true,
      showClearAll: true,
      searchable: true,
    },
    {
      type: 'range',
      id: 'time',
      label: 'Total Time',
      min: 0,
      max: 120,
      step: 5,
      unit: 'min',
      showValue: true,
    },
    {
      type: 'select',
      id: 'difficulty',
      label: 'Difficulty Level',
      options: [
        { value: 'easy', label: 'Easy' },
        { value: 'medium', label: 'Medium' },
        { value: 'hard', label: 'Hard' },
      ],
      placeholder: 'Any difficulty',
    },
    {
      type: 'checkbox',
      id: 'dietary',
      label: 'Dietary',
      options: [
        { id: 'vegetarian', label: 'Vegetarian', count: 48 },
        { id: 'vegan', label: 'Vegan', count: 32 },
        { id: 'gluten-free', label: 'Gluten-Free', count: 28 },
      ],
    },
  ];

  return (
    <div className="max-w-sm">
      <FilterPanel
        title="Filter Recipes"
        filters={filters}
        values={filterValues}
        onValuesChange={setFilterValues}
        totalResults={192}
        showResultCount
      />
    </div>
  );
}

function AllFilterTypesDemo() {
  const [filterValues, setFilterValues] = React.useState<FilterValues>({
    search: '',
    checkboxes: [],
    range: [25, 75],
    select: '',
    custom: 'custom value',
  });

  const filters: FilterConfig[] = [
    {
      type: 'search',
      id: 'search',
      placeholder: 'Search with debouncing...',
      description: 'Full-text search with 300ms debounce',
    },
    {
      type: 'checkbox',
      id: 'checkboxes',
      label: 'Checkbox Filter',
      description: 'Multi-select with search, select all, and clear all',
      options: [
        { id: 'option1', label: 'Option 1', count: 10 },
        { id: 'option2', label: 'Option 2', count: 15 },
        { id: 'option3', label: 'Option 3', count: 8 },
        { id: 'option4', label: 'Option 4', count: 12 },
      ],
      searchable: true,
      showSelectAll: true,
      showClearAll: true,
    },
    {
      type: 'range',
      id: 'range',
      label: 'Range Filter',
      description: 'Dual-thumb slider for numeric ranges',
      min: 0,
      max: 100,
      step: 5,
      showValue: true,
      showTicks: true,
    },
    {
      type: 'select',
      id: 'select',
      label: 'Select Filter',
      description: 'Single-choice dropdown',
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ],
      placeholder: 'Choose an option',
    },
    {
      type: 'custom',
      id: 'custom',
      label: 'Custom Filter',
      description: 'Custom render function for maximum flexibility',
      render: ({ value, onChange, disabled }) => (
        <input
          type="text"
          value={value as string}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Custom input..."
        />
      ),
    },
  ];

  return (
    <div className="max-w-sm">
      <FilterPanel
        title="All Filter Types"
        filters={filters}
        values={filterValues}
        onValuesChange={setFilterValues}
      />
    </div>
  );
}

function CollapsibleDemo() {
  const [filterValues, setFilterValues] = React.useState<FilterValues>({
    search: '',
    categories: [],
  });

  const filters: FilterConfig[] = [
    {
      type: 'search',
      id: 'search',
      placeholder: 'Search...',
    },
    {
      type: 'checkbox',
      id: 'categories',
      label: 'Categories',
      options: [
        { id: 'cat1', label: 'Category 1', count: 12 },
        { id: 'cat2', label: 'Category 2', count: 8 },
        { id: 'cat3', label: 'Category 3', count: 15 },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-muted-foreground mb-2 text-sm">Expanded (default)</p>
        <FilterPanel
          title="Filters"
          filters={filters}
          values={filterValues}
          onValuesChange={setFilterValues}
          collapsible
          defaultCollapsed={false}
        />
      </div>
      <div>
        <p className="text-muted-foreground mb-2 text-sm">
          Collapsed by default
        </p>
        <FilterPanel
          title="Filters"
          filters={filters}
          values={filterValues}
          onValuesChange={setFilterValues}
          collapsible
          defaultCollapsed
        />
      </div>
    </div>
  );
}

function VariantsDemo() {
  const [filterValues, setFilterValues] = React.useState<FilterValues>({
    search: '',
    tags: [],
  });

  const filters: FilterConfig[] = [
    {
      type: 'search',
      id: 'search',
      placeholder: 'Search...',
    },
    {
      type: 'checkbox',
      id: 'tags',
      label: 'Tags',
      options: [
        { id: 'new', label: 'New', count: 5 },
        { id: 'featured', label: 'Featured', count: 8 },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <p className="text-muted-foreground mb-2 text-sm">Default</p>
        <FilterPanel
          title="Default"
          filters={filters}
          values={filterValues}
          onValuesChange={setFilterValues}
          variant="default"
        />
      </div>
      <div>
        <p className="text-muted-foreground mb-2 text-sm">Compact</p>
        <FilterPanel
          title="Compact"
          filters={filters}
          values={filterValues}
          onValuesChange={setFilterValues}
          variant="compact"
        />
      </div>
      <div>
        <p className="text-muted-foreground mb-2 text-sm">Full</p>
        <FilterPanel
          title="Full"
          filters={filters}
          values={filterValues}
          onValuesChange={setFilterValues}
          variant="full"
        />
      </div>
    </div>
  );
}

function ResultCountDemo() {
  const [filterValues, setFilterValues] = React.useState<FilterValues>({
    search: '',
    categories: [],
    price: [0, 500],
  });

  const filters: FilterConfig[] = [
    {
      type: 'search',
      id: 'search',
      placeholder: 'Search products...',
    },
    {
      type: 'checkbox',
      id: 'categories',
      label: 'Categories',
      options: [
        { id: 'electronics', label: 'Electronics', count: 24 },
        { id: 'clothing', label: 'Clothing', count: 18 },
        { id: 'home', label: 'Home & Garden', count: 32 },
      ],
    },
    {
      type: 'range',
      id: 'price',
      label: 'Price',
      min: 0,
      max: 500,
      unit: '$',
      showValue: true,
    },
  ];

  // Mock result calculation
  const baseCount = 74;
  const searchPenalty = filterValues.search ? 20 : 0;
  const categoryPenalty = (filterValues.categories as string[]).length * 10;
  const [minPrice, maxPrice] = filterValues.price as [number, number];
  const pricePenalty = Math.floor((500 - (maxPrice - minPrice)) / 10);
  const resultCount = Math.max(
    0,
    baseCount - searchPenalty - categoryPenalty - pricePenalty
  );

  return (
    <div className="max-w-sm">
      <FilterPanel
        title="Product Filters"
        filters={filters}
        values={filterValues}
        onValuesChange={setFilterValues}
        totalResults={resultCount}
        showResultCount
      />
    </div>
  );
}

function RealTimeFilteringDemo() {
  const [filterValues, setFilterValues] = React.useState<FilterValues>({
    search: '',
    categories: [],
  });

  const filters: FilterConfig[] = [
    {
      type: 'search',
      id: 'search',
      placeholder: 'Search...',
    },
    {
      type: 'checkbox',
      id: 'categories',
      label: 'Categories',
      options: [
        { id: 'cat1', label: 'Category 1' },
        { id: 'cat2', label: 'Category 2' },
      ],
    },
  ];

  return (
    <div className="max-w-sm">
      <FilterPanel
        title="Real-time Filters"
        filters={filters}
        values={filterValues}
        onValuesChange={setFilterValues}
        showApplyButton={false}
      />
      <p className="text-muted-foreground mt-4 text-sm">
        Results update immediately as you change filters
      </p>
    </div>
  );
}

function ApplyButtonModeDemo() {
  const [filterValues, setFilterValues] = React.useState<FilterValues>({
    search: '',
    categories: [],
  });

  const [appliedValues, setAppliedValues] = React.useState(filterValues);

  const filters: FilterConfig[] = [
    {
      type: 'search',
      id: 'search',
      placeholder: 'Search...',
    },
    {
      type: 'checkbox',
      id: 'categories',
      label: 'Categories',
      options: [
        { id: 'cat1', label: 'Category 1' },
        { id: 'cat2', label: 'Category 2' },
      ],
    },
  ];

  return (
    <div className="max-w-sm space-y-4">
      <FilterPanel
        title="Apply Button Mode"
        filters={filters}
        values={filterValues}
        onValuesChange={setFilterValues}
        showApplyButton
        onApply={setAppliedValues}
      />
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <p className="mb-2 text-sm font-medium">Applied Filters:</p>
        <pre className="text-muted-foreground text-xs">
          {JSON.stringify(appliedValues, null, 2)}
        </pre>
      </div>
      <p className="text-muted-foreground text-sm">
        Click &quot;Apply&quot; to update results
      </p>
    </div>
  );
}

function InContextDemo() {
  const [filterValues, setFilterValues] = React.useState<FilterValues>({
    search: '',
    categories: [],
    price: [0, 200],
    rating: '',
  });

  const filters: FilterConfig[] = [
    {
      type: 'search',
      id: 'search',
      placeholder: 'Search products...',
    },
    {
      type: 'checkbox',
      id: 'categories',
      label: 'Categories',
      options: [
        { id: 'electronics', label: 'Electronics', count: 24 },
        { id: 'clothing', label: 'Clothing', count: 18 },
        { id: 'home', label: 'Home', count: 32 },
      ],
      showSelectAll: true,
      showClearAll: true,
    },
    {
      type: 'range',
      id: 'price',
      label: 'Price Range',
      min: 0,
      max: 200,
      unit: '$',
      showValue: true,
    },
    {
      type: 'select',
      id: 'rating',
      label: 'Minimum Rating',
      options: [
        { value: '4', label: '4+ Stars' },
        { value: '3', label: '3+ Stars' },
      ],
      placeholder: 'Any rating',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {/* Sidebar */}
      <div className="col-span-1">
        <FilterPanel
          title="Filters"
          filters={filters}
          values={filterValues}
          onValuesChange={setFilterValues}
          totalResults={68}
          showResultCount
        />
      </div>

      {/* Main content */}
      <div className="col-span-3">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Products</h2>
          <p className="text-muted-foreground text-sm">Showing 68 results</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="mb-3 aspect-square rounded-lg bg-gray-200 dark:bg-gray-700" />
                <h3 className="font-medium">Product {i}</h3>
                <p className="text-muted-foreground text-sm">$99.99</p>
                <div className="mt-2 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg
                      key={j}
                      className={`h-4 w-4 ${j < 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function InteractivePlaygroundDemo() {
  const [filterValues, setFilterValues] = React.useState<FilterValues>({
    search: '',
    categories: [],
    price: [0, 500],
    rating: '',
  });

  const [variant, setVariant] = React.useState<'default' | 'compact' | 'full'>(
    'default'
  );
  const [size, setSize] = React.useState<'sm' | 'md' | 'lg'>('md');
  const [collapsible, setCollapsible] = React.useState(true);
  const [showHeader, setShowHeader] = React.useState(true);
  const [showFooter, setShowFooter] = React.useState(true);
  const [showApplyButton, setShowApplyButton] = React.useState(false);
  const [showResultCount, setShowResultCount] = React.useState(true);

  const filters: FilterConfig[] = [
    {
      type: 'search',
      id: 'search',
      placeholder: 'Search...',
    },
    {
      type: 'checkbox',
      id: 'categories',
      label: 'Categories',
      options: [
        { id: 'cat1', label: 'Category 1', count: 12 },
        { id: 'cat2', label: 'Category 2', count: 8 },
        { id: 'cat3', label: 'Category 3', count: 15 },
      ],
      showSelectAll: true,
      showClearAll: true,
    },
    {
      type: 'range',
      id: 'price',
      label: 'Price',
      min: 0,
      max: 500,
      unit: '$',
      showValue: true,
    },
    {
      type: 'select',
      id: 'rating',
      label: 'Rating',
      options: [
        { value: '5', label: '5 Stars' },
        { value: '4', label: '4+ Stars' },
        { value: '3', label: '3+ Stars' },
      ],
      placeholder: 'Any rating',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>
            Adjust settings to see how they affect the filter panel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="variant"
                className="mb-2 block text-sm font-medium"
              >
                Variant
              </label>
              <select
                id="variant"
                value={variant}
                onChange={e => setVariant(e.target.value as typeof variant)}
                className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
              >
                <option value="default">Default</option>
                <option value="compact">Compact</option>
                <option value="full">Full</option>
              </select>
            </div>

            <div>
              <label htmlFor="size" className="mb-2 block text-sm font-medium">
                Size
              </label>
              <select
                id="size"
                value={size}
                onChange={e => setSize(e.target.value as typeof size)}
                className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={collapsible}
                onChange={e => setCollapsible(e.target.checked)}
                className="border-input h-4 w-4 rounded"
              />
              <span className="text-sm font-medium">Collapsible</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showHeader}
                onChange={e => setShowHeader(e.target.checked)}
                className="border-input h-4 w-4 rounded"
              />
              <span className="text-sm font-medium">Show Header</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showFooter}
                onChange={e => setShowFooter(e.target.checked)}
                className="border-input h-4 w-4 rounded"
              />
              <span className="text-sm font-medium">Show Footer</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showApplyButton}
                onChange={e => setShowApplyButton(e.target.checked)}
                className="border-input h-4 w-4 rounded"
              />
              <span className="text-sm font-medium">Show Apply Button</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showResultCount}
                onChange={e => setShowResultCount(e.target.checked)}
                className="border-input h-4 w-4 rounded"
              />
              <span className="text-sm font-medium">Show Result Count</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Filter Panel Preview */}
      <div className="max-w-sm">
        <FilterPanel
          title="Interactive Filters"
          filters={filters}
          values={filterValues}
          onValuesChange={setFilterValues}
          variant={variant}
          size={size}
          collapsible={collapsible}
          showHeader={showHeader}
          showFooter={showFooter}
          showApplyButton={showApplyButton}
          showResultCount={showResultCount}
          totalResults={35}
        />
      </div>
    </div>
  );
}

function UsageExamplesDemo() {
  const examples = [
    {
      title: 'Basic Recipe Filters',
      code: `const [filterValues, setFilterValues] = useState({
  search: '',
  categories: [],
  time: [0, 120],
  difficulty: '',
});

const filters = [
  {
    type: 'search',
    id: 'search',
    placeholder: 'Search recipes...',
  },
  {
    type: 'checkbox',
    id: 'categories',
    label: 'Categories',
    options: [
      { id: 'breakfast', label: 'Breakfast', count: 42 },
      { id: 'lunch', label: 'Lunch', count: 38 },
    ],
    showSelectAll: true,
  },
  {
    type: 'range',
    id: 'time',
    label: 'Cook Time',
    min: 0,
    max: 120,
    unit: 'min',
  },
];

<FilterPanel
  title="Filter Recipes"
  filters={filters}
  values={filterValues}
  onValuesChange={setFilterValues}
  totalResults={192}
  showResultCount
/>`,
    },
    {
      title: 'With Apply Button',
      code: `const [filterValues, setFilterValues] = useState({ ... });
const [appliedValues, setAppliedValues] = useState(filterValues);

<FilterPanel
  filters={filters}
  values={filterValues}
  onValuesChange={setFilterValues}
  showApplyButton
  onApply={setAppliedValues}
/>`,
    },
    {
      title: 'Custom Filter',
      code: `const filters = [
  {
    type: 'custom',
    id: 'custom',
    label: 'Custom Filter',
    render: ({ value, onChange, disabled }) => (
      <YourCustomComponent
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    ),
  },
];`,
    },
  ];

  return (
    <div className="space-y-4">
      {examples.map((example, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{example.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg bg-gray-100 p-4 text-xs dark:bg-gray-900">
              <code>{example.code}</code>
            </pre>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
