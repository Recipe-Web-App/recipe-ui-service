'use client';

import React, { useState } from 'react';
import { BrowseGrid, SimpleBrowseGrid } from '@/components/ui/browse-grid';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, ChefHat } from 'lucide-react';

// Mock recipe data
interface Recipe {
  id: number;
  title: string;
  category: string;
  time: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating: number;
  description: string;
}

const generateMockRecipes = (count: number): Recipe[] => {
  const categories = [
    'Italian',
    'Mexican',
    'Asian',
    'American',
    'French',
    'Indian',
    'Thai',
    'Greek',
  ];
  const difficulties: Array<'Easy' | 'Medium' | 'Hard'> = [
    'Easy',
    'Medium',
    'Hard',
  ];

  return Array.from({ length: count }, (_, i) => {
    const categoryIndex = i % categories.length;
    const difficultyIndex = i % 3;
    const category = categories.at(categoryIndex) ?? 'Italian';
    const difficulty = difficulties.at(difficultyIndex) ?? 'Medium';

    return {
      id: i + 1,
      title: `Delicious Recipe ${i + 1}`,
      category: category,
      time: `${20 + (i % 60)} min`,
      difficulty: difficulty,
      rating: 3.5 + Math.random() * 1.5,
      description: `A wonderful ${category} dish that's perfect for any occasion.`,
    };
  });
};

const allRecipes = generateMockRecipes(48);

const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'success';
      case 'Medium':
        return 'warning';
      case 'Hard':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <Card className="h-full transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-2 text-lg">{recipe.title}</CardTitle>
          <Badge variant="secondary" className="ml-2 shrink-0">
            {recipe.rating.toFixed(1)}★
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {recipe.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{recipe.category}</span>
          <span className="text-muted-foreground">{recipe.time}</span>
        </div>
        <Badge variant={getDifficultyColor(recipe.difficulty)}>
          {recipe.difficulty}
        </Badge>
      </CardContent>
    </Card>
  );
};

export default function BrowseGridDemoPage() {
  // Basic grid state
  const [basicPage, setBasicPage] = useState(1);
  const basicPageSize = 6;

  // Interactive example state
  const [interactivePage, setInteractivePage] = useState(1);
  const [interactivePageSize, setInteractivePageSize] = useState(12);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Custom columns state
  const [customPage, setCustomPage] = useState(1);

  // Filter recipes for interactive example
  const filteredRecipes = React.useMemo(() => {
    return allRecipes.filter(recipe => {
      const matchesSearch =
        !searchTerm ||
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === 'All' || recipe.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, categoryFilter]);

  // Pagination calculations
  const basicTotal = Math.ceil(allRecipes.length / basicPageSize);
  const basicRecipes = allRecipes.slice(
    (basicPage - 1) * basicPageSize,
    basicPage * basicPageSize
  );

  const interactiveTotal = Math.ceil(
    filteredRecipes.length / interactivePageSize
  );
  const interactiveRecipes = filteredRecipes.slice(
    (interactivePage - 1) * interactivePageSize,
    interactivePage * interactivePageSize
  );

  const customRecipes = allRecipes.slice(0, 8);

  // Categories for filter
  const categories = ['All', ...new Set(allRecipes.map(r => r.category))];

  // Simulate loading
  const simulateLoading = () => {
    setIsLoading(true);
    setHasError(false);
    setTimeout(() => setIsLoading(false), 2000);
  };

  // Simulate error
  const simulateError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  // Retry after error
  const handleRetry = () => {
    setHasError(false);
    simulateLoading();
  };

  return (
    <div className="container mx-auto space-y-12 p-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">BrowseGrid Component</h1>
        <p className="text-muted-foreground text-lg">
          A generic, reusable grid layout for browsing content with pagination,
          loading, empty, and error states
        </p>
      </div>

      {/* Basic Grid */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Basic Grid</h2>
          <p className="text-muted-foreground text-sm">
            Simple grid layout with no pagination
          </p>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <SimpleBrowseGrid<Recipe>
            items={allRecipes.slice(0, 8)}
            renderItem={recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            )}
            gap="md"
          />
        </div>
      </section>

      {/* Grid with Pagination */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">With Pagination</h2>
          <p className="text-muted-foreground text-sm">
            Grid with pagination controls - navigate through pages
          </p>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <BrowseGrid<Recipe>
            items={basicRecipes}
            renderItem={recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            )}
            currentPage={basicPage}
            totalPages={basicTotal}
            totalItems={allRecipes.length}
            pageSize={basicPageSize}
            onPageChange={setBasicPage}
            showPagination={true}
            gap="md"
          />
        </div>
      </section>

      {/* Loading State */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Loading State</h2>
          <p className="text-muted-foreground text-sm">
            Skeleton placeholders shown during data fetching
          </p>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="mb-4">
            <Button onClick={simulateLoading} variant="outline">
              Simulate Loading
            </Button>
          </div>
          <BrowseGrid<Recipe>
            items={[]}
            renderItem={recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            )}
            loading={isLoading}
            skeletonCount={6}
            gap="md"
          />
        </div>
      </section>

      {/* Empty State */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Empty State</h2>
          <p className="text-muted-foreground text-sm">
            Shown when there are no items to display
          </p>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <BrowseGrid<Recipe>
            items={[]}
            renderItem={recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            )}
            emptyMessage="No recipes found"
            emptyDescription="Try adjusting your search terms or browse our featured recipes."
            emptyIcon={<ChefHat className="text-muted-foreground h-16 w-16" />}
            emptyActions={
              <>
                <Button variant="outline">Clear Filters</Button>
                <Button>Browse All Recipes</Button>
              </>
            }
            gap="md"
          />
        </div>
      </section>

      {/* Error State */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Error State</h2>
          <p className="text-muted-foreground text-sm">
            Error handling with retry functionality
          </p>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <div className="mb-4 flex gap-2">
            <Button onClick={simulateError} variant="outline">
              Simulate Error
            </Button>
            {hasError && (
              <Button onClick={handleRetry} variant="default">
                Clear Error
              </Button>
            )}
          </div>
          <BrowseGrid<Recipe>
            items={hasError ? [] : allRecipes.slice(0, 6)}
            renderItem={recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            )}
            error={
              hasError
                ? 'Failed to load recipes. Please check your connection and try again.'
                : null
            }
            onRetry={handleRetry}
            gap="md"
          />
        </div>
      </section>

      {/* Gap Sizes */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Gap Sizes</h2>
          <p className="text-muted-foreground text-sm">
            Different spacing between grid items
          </p>
        </div>
        <div className="space-y-8">
          <div className="bg-card rounded-lg border p-6">
            <h3 className="mb-4 text-sm font-medium">Small Gap</h3>
            <SimpleBrowseGrid<Recipe>
              items={allRecipes.slice(0, 4)}
              renderItem={recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              )}
              gap="sm"
            />
          </div>
          <div className="bg-card rounded-lg border p-6">
            <h3 className="mb-4 text-sm font-medium">Large Gap</h3>
            <SimpleBrowseGrid<Recipe>
              items={allRecipes.slice(0, 4)}
              renderItem={recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              )}
              gap="lg"
            />
          </div>
        </div>
      </section>

      {/* Custom Columns */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Custom Column Layouts</h2>
          <p className="text-muted-foreground text-sm">
            Customize responsive column counts
          </p>
        </div>
        <div className="space-y-8">
          <div className="bg-card rounded-lg border p-6">
            <h3 className="mb-4 text-sm font-medium">
              Wide Layout (1/2/3 columns)
            </h3>
            <BrowseGrid<Recipe>
              items={customRecipes}
              renderItem={recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              )}
              columns={{ mobile: 1, tablet: 2, desktop: 3 }}
              currentPage={customPage}
              totalPages={2}
              onPageChange={setCustomPage}
              showPagination={true}
              gap="md"
            />
          </div>
          <div className="bg-card rounded-lg border p-6">
            <h3 className="mb-4 text-sm font-medium">
              Compact Layout (3/4/6 columns)
            </h3>
            <SimpleBrowseGrid<Recipe>
              items={customRecipes}
              renderItem={recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              )}
              columns={{ mobile: 3, tablet: 4, desktop: 6 }}
              gap="sm"
            />
          </div>
        </div>
      </section>

      {/* Interactive Example */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Interactive Example</h2>
          <p className="text-muted-foreground text-sm">
            Full-featured grid with search, filters, and pagination
          </p>
        </div>
        <div className="bg-card rounded-lg border p-6">
          {/* Controls */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="min-w-[200px] flex-1">
                <label
                  htmlFor="search"
                  className="mb-2 block text-sm font-medium"
                >
                  Search Recipes
                </label>
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <input
                    id="search"
                    type="text"
                    placeholder="Search by name or category..."
                    value={searchTerm}
                    onChange={e => {
                      setSearchTerm(e.target.value);
                      setInteractivePage(1);
                    }}
                    className="border-input bg-background w-full rounded-md border py-2 pr-4 pl-10 text-sm"
                  />
                </div>
              </div>

              <div className="min-w-[150px]">
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={categoryFilter}
                  onChange={e => {
                    setCategoryFilter(e.target.value);
                    setInteractivePage(1);
                  }}
                  className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end gap-2">
                <Button onClick={simulateLoading} variant="outline" size="sm">
                  Toggle Loading
                </Button>
                <Button onClick={simulateError} variant="outline" size="sm">
                  Simulate Error
                </Button>
              </div>
            </div>

            <div className="text-muted-foreground text-sm">
              Showing {filteredRecipes.length} recipe
              {filteredRecipes.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Grid */}
          <BrowseGrid<Recipe>
            items={hasError || isLoading ? [] : interactiveRecipes}
            renderItem={recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            )}
            currentPage={interactivePage}
            totalPages={interactiveTotal}
            totalItems={filteredRecipes.length}
            pageSize={interactivePageSize}
            onPageChange={setInteractivePage}
            onPageSizeChange={newSize => {
              setInteractivePageSize(newSize);
              setInteractivePage(1);
            }}
            loading={isLoading}
            error={hasError ? 'Failed to load recipes' : null}
            onRetry={handleRetry}
            emptyMessage="No recipes match your search"
            emptyDescription="Try adjusting your filters or search terms to find more recipes."
            emptyIcon={<Search className="text-muted-foreground h-16 w-16" />}
            emptyActions={
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('All');
                }}
              >
                Clear Filters
              </Button>
            }
            showPagination={true}
            paginationProps={{
              showPageInfo: true,
              showPageSizeSelector: true,
              pageSizeOptions: [6, 12, 24, 48],
            }}
            gap="md"
            aria-label="Interactive recipe grid"
          />
        </div>
      </section>

      {/* Usage Example */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Usage</h2>
        </div>
        <div className="bg-muted rounded-lg p-6">
          <pre className="overflow-x-auto text-sm">
            <code>{`<BrowseGrid
  items={recipes}
  renderItem={(recipe) => <RecipeCard recipe={recipe} />}
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  loading={isLoading}
  emptyMessage="No recipes found"
  gap="md"
/>`}</code>
          </pre>
        </div>
      </section>
    </div>
  );
}
