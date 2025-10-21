'use client';

import React, { useState } from 'react';
import { BrowseList, SimpleBrowseList } from '@/components/ui/browse-list';
import {
  ListItem,
  ListItemContent,
  ListItemTitle,
  ListItemDescription,
  ListItemIcon,
} from '@/components/ui/list';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, ChefHat, Clock, Star } from 'lucide-react';

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

const RecipeListItem = ({ recipe }: { recipe: Recipe }) => {
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
    <ListItem className="hover:bg-accent/50 py-4 transition-colors">
      <ListItemIcon
        position="leading"
        size="lg"
        variant="muted"
        className="bg-primary/10 rounded-md"
      >
        <ChefHat className="text-primary h-6 w-6" />
      </ListItemIcon>
      <ListItemContent className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <ListItemTitle className="mb-1">{recipe.title}</ListItemTitle>
            <ListItemDescription className="line-clamp-1">
              {recipe.description}
            </ListItemDescription>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Star className="h-3 w-3 fill-current" />
              {recipe.rating.toFixed(1)}
            </Badge>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {recipe.time}
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">{recipe.category}</span>
          <Badge variant={getDifficultyColor(recipe.difficulty)} size="sm">
            {recipe.difficulty}
          </Badge>
        </div>
      </ListItemContent>
    </ListItem>
  );
};

export default function BrowseListDemoPage() {
  // Basic list state
  const [basicPage, setBasicPage] = useState(1);
  const basicPageSize = 5;

  // Interactive example state
  const [interactivePage, setInteractivePage] = useState(1);
  const [interactivePageSize, setInteractivePageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

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
        <h1 className="mb-2 text-4xl font-bold">BrowseList Component</h1>
        <p className="text-muted-foreground text-lg">
          A compact, reusable list layout for browsing content with pagination,
          loading, empty, and error states
        </p>
      </div>

      {/* Basic List */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Basic List</h2>
          <p className="text-muted-foreground text-sm">
            Simple list layout without pagination
          </p>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <SimpleBrowseList<Recipe>
            items={allRecipes.slice(0, 6)}
            renderItem={recipe => (
              <RecipeListItem key={recipe.id} recipe={recipe} />
            )}
          />
        </div>
      </section>

      {/* List with Pagination */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">With Pagination</h2>
          <p className="text-muted-foreground text-sm">
            List with pagination controls - navigate through pages
          </p>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <BrowseList<Recipe>
            items={basicRecipes}
            renderItem={recipe => (
              <RecipeListItem key={recipe.id} recipe={recipe} />
            )}
            currentPage={basicPage}
            totalPages={basicTotal}
            totalItems={allRecipes.length}
            pageSize={basicPageSize}
            onPageChange={setBasicPage}
            showPagination={true}
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
          <BrowseList<Recipe>
            items={[]}
            renderItem={recipe => (
              <RecipeListItem key={recipe.id} recipe={recipe} />
            )}
            loading={isLoading}
            skeletonCount={5}
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
          <BrowseList<Recipe>
            items={[]}
            renderItem={recipe => (
              <RecipeListItem key={recipe.id} recipe={recipe} />
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
          <BrowseList<Recipe>
            items={hasError ? [] : allRecipes.slice(0, 5)}
            renderItem={recipe => (
              <RecipeListItem key={recipe.id} recipe={recipe} />
            )}
            error={
              hasError
                ? 'Failed to load recipes. Please check your connection and try again.'
                : null
            }
            onRetry={handleRetry}
          />
        </div>
      </section>

      {/* Spacing Variants */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Spacing Variants</h2>
          <p className="text-muted-foreground text-sm">
            Different spacing between list and pagination
          </p>
        </div>
        <div className="space-y-8">
          <div className="bg-card rounded-lg border p-6">
            <h3 className="mb-4 text-sm font-medium">Compact Spacing</h3>
            <SimpleBrowseList<Recipe>
              items={allRecipes.slice(0, 3)}
              renderItem={recipe => (
                <RecipeListItem key={recipe.id} recipe={recipe} />
              )}
              spacing="compact"
            />
          </div>
          <div className="bg-card rounded-lg border p-6">
            <h3 className="mb-4 text-sm font-medium">Comfortable Spacing</h3>
            <SimpleBrowseList<Recipe>
              items={allRecipes.slice(0, 3)}
              renderItem={recipe => (
                <RecipeListItem key={recipe.id} recipe={recipe} />
              )}
              spacing="comfortable"
            />
          </div>
        </div>
      </section>

      {/* Dividers */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">With Dividers</h2>
          <p className="text-muted-foreground text-sm">
            Show dividers between list items for better separation
          </p>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <SimpleBrowseList<Recipe>
            items={allRecipes.slice(0, 5)}
            renderItem={recipe => (
              <RecipeListItem key={recipe.id} recipe={recipe} />
            )}
            showDividers={true}
          />
        </div>
      </section>

      {/* Interactive Example */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Interactive Example</h2>
          <p className="text-muted-foreground text-sm">
            Full-featured list with search, filters, and pagination
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

          {/* List */}
          <BrowseList<Recipe>
            items={hasError || isLoading ? [] : interactiveRecipes}
            renderItem={recipe => (
              <RecipeListItem key={recipe.id} recipe={recipe} />
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
            showDividers={true}
            showPagination={true}
            paginationProps={{
              showPageInfo: true,
              showPageSizeSelector: true,
              pageSizeOptions: [5, 10, 20, 50],
            }}
            aria-label="Interactive recipe list"
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
            <code>{`<BrowseList
  items={recipes}
  renderItem={(recipe) => <RecipeListItem recipe={recipe} />}
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  loading={isLoading}
  emptyMessage="No recipes found"
  showDividers={true}
/>`}</code>
          </pre>
        </div>
      </section>
    </div>
  );
}
