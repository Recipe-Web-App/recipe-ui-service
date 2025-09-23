'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import {
  InfiniteScroll,
  RecipeInfiniteScroll,
  SearchResultsInfiniteScroll,
  DefaultInfiniteScrollLoading,
  DefaultInfiniteScrollError,
  DefaultInfiniteScrollEmpty,
  Spinner,
} from '@/components/ui/infinite-scroll';
import type {
  Recipe,
  SearchResult,
  LoadingState,
  InfiniteScrollError,
} from '@/types/ui/infinite-scroll';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChefHat, Clock, Star, Users, Utensils, Search } from 'lucide-react';

// Mock data generators
const generateMockRecipes = (count: number, startId: number = 1): Recipe[] => {
  const difficulties: Array<'easy' | 'medium' | 'hard'> = [
    'easy',
    'medium',
    'hard',
  ];
  const categories = [
    'breakfast',
    'lunch',
    'dinner',
    'dessert',
    'snack',
    'appetizer',
    'main course',
    'side dish',
    'soup',
    'salad',
    'bread',
    'beverage',
  ];
  const authors = [
    { name: 'Chef Julia', avatar: '/avatars/chef-julia.jpg' },
    { name: 'Chef Marcus', avatar: '/avatars/chef-marcus.jpg' },
    { name: 'Chef Sarah', avatar: '/avatars/chef-sarah.jpg' },
    { name: 'Chef David', avatar: '/avatars/chef-david.jpg' },
    { name: 'Chef Elena', avatar: '/avatars/chef-elena.jpg' },
  ];

  const recipeNames = [
    'Chocolate Chip Cookies',
    'Beef Stir Fry',
    'Caesar Salad',
    'Margherita Pizza',
    'Chicken Tikka Masala',
    'Spaghetti Carbonara',
    'Fish Tacos',
    'Mushroom Risotto',
    'BBQ Pulled Pork',
    'Greek Moussaka',
    'Thai Pad Thai',
    'French Onion Soup',
    'Apple Pie',
    'Chicken Alfredo',
    'Beef Wellington',
    'Chocolate Cake',
    'Salmon Teriyaki',
    'Vegetable Curry',
    'Pancakes',
    'Garlic Bread',
  ];

  return Array.from({ length: count }, (_, index) => {
    const id = startId + index;
    const recipe = recipeNames[index % recipeNames.length];
    const author = authors[index % authors.length];
    const difficulty = difficulties[index % difficulties.length];
    const categoryList = categories
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 1);

    return {
      id: id.toString(),
      title: `${recipe} ${id > recipeNames.length ? `(${Math.floor(id / recipeNames.length) + 1})` : ''}`,
      description: `Delicious ${recipe.toLowerCase()} recipe with authentic flavors and easy-to-follow instructions. Perfect for any occasion!`,
      imageUrl: `/images/recipes/recipe-${(index % 12) + 1}.jpg`,
      cookTime: Math.floor(Math.random() * 60) + 15,
      difficulty,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      categories: categoryList,
      author,
      createdAt: new Date(
        Date.now() - Math.random() * 10000000000
      ).toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
};

const generateMockSearchResults = (
  count: number,
  query: string = '',
  startId: number = 1
): SearchResult[] => {
  const types: Array<'recipe' | 'ingredient' | 'user' | 'collection'> = [
    'recipe',
    'ingredient',
    'user',
    'collection',
  ];
  const results = [
    {
      title: 'Chocolate Cake Recipe',
      description: 'Rich and moist chocolate cake perfect for celebrations',
    },
    {
      title: 'Dark Chocolate',
      description: 'High-quality dark chocolate for baking and cooking',
    },
    {
      title: 'Chef Baker',
      description: 'Professional pastry chef specializing in desserts',
    },
    {
      title: 'Dessert Collection',
      description: 'Curated collection of the best dessert recipes',
    },
    {
      title: 'Vanilla Extract',
      description: 'Pure vanilla extract for enhanced flavoring',
    },
    {
      title: 'Sweet Treats',
      description: 'Collection of candy and sweet recipe ideas',
    },
    { title: 'Baker John', description: 'Home baker with 500+ tested recipes' },
    {
      title: 'Cookie Recipes',
      description: 'Ultimate collection of cookie recipes',
    },
  ];

  return Array.from({ length: count }, (_, index) => {
    const id = `sr${startId + index}`;
    const type = types[index % types.length];
    const result = results[index % results.length];

    return {
      id,
      type,
      title: result.title,
      description: result.description,
      imageUrl:
        type === 'recipe'
          ? `/images/recipes/recipe-${(index % 8) + 1}.jpg`
          : type === 'user'
            ? `/avatars/user-${(index % 5) + 1}.jpg`
            : undefined,
      relevanceScore: Math.round((Math.random() * 0.4 + 0.6) * 100) / 100,
      metadata: { query, searchTime: Date.now() },
    };
  });
};

export default function InfiniteScrollDemo() {
  // Basic infinite scroll state
  const [basicItems, setBasicItems] = useState(() => generateMockRecipes(20));
  const [basicHasNext, setBasicHasNext] = useState(true);
  const [basicLoading, setBasicLoading] = useState<LoadingState>('idle');
  const [basicError, setBasicError] = useState<string | null>(null);

  // Recipe infinite scroll state
  const [recipes, setRecipes] = useState(() => generateMockRecipes(15));
  const [recipesHasNext, setRecipesHasNext] = useState(true);
  const [recipesLoading, setRecipesLoading] = useState<LoadingState>('idle');
  const [recipesError, setRecipesError] = useState<InfiniteScrollError | null>(
    null
  );

  // Search results state
  const [searchResults, setSearchResults] = useState(() =>
    generateMockSearchResults(12, 'chocolate')
  );
  const [searchHasNext, setSearchHasNext] = useState(true);
  const [searchLoading, setSearchLoading] = useState<LoadingState>('idle');
  const [searchQuery, setSearchQuery] = useState('chocolate');

  // Demo configuration
  const [showAuthor, setShowAuthor] = useState(true);
  const [showRating, setShowRating] = useState(true);
  const [showCookTime, setShowCookTime] = useState(true);
  const [showCategories, setShowCategories] = useState(false);
  const [cardVariant, setCardVariant] = useState<
    'default' | 'compact' | 'detailed'
  >('default');
  const [gridCols, setGridCols] = useState<1 | 2 | 3 | 4>(2);
  const [simulateErrors, setSimulateErrors] = useState(false);
  const [loadDelay, setLoadDelay] = useState(1000);

  // Simulate loading delay
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Basic infinite scroll handlers
  const loadMoreBasic = useCallback(async () => {
    if (basicLoading !== 'idle') return;

    setBasicLoading('loadingMore');
    setBasicError(null);

    try {
      await delay(loadDelay);

      if (simulateErrors && Math.random() < 0.3) {
        throw new Error('Simulated network error');
      }

      const newItems = generateMockRecipes(15, basicItems.length + 1);
      setBasicItems(prev => [...prev, ...newItems]);

      // Simulate end of data after 100 items
      if (basicItems.length + newItems.length >= 100) {
        setBasicHasNext(false);
        setBasicLoading('complete');
      } else {
        setBasicLoading('idle');
      }
    } catch (err) {
      setBasicError(
        err instanceof Error ? err.message : 'Failed to load more items'
      );
      setBasicLoading('error');
    }
  }, [basicItems.length, basicLoading, loadDelay, simulateErrors]);

  // Recipe infinite scroll handlers
  const loadMoreRecipes = useCallback(async () => {
    if (recipesLoading !== 'idle') return;

    setRecipesLoading('loadingMore');
    setRecipesError(null);

    try {
      await delay(loadDelay);

      if (simulateErrors && Math.random() < 0.2) {
        throw new Error('Recipe server temporarily unavailable');
      }

      const newRecipes = generateMockRecipes(12, recipes.length + 1);
      setRecipes(prev => [...prev, ...newRecipes]);

      if (recipes.length + newRecipes.length >= 80) {
        setRecipesHasNext(false);
        setRecipesLoading('complete');
      } else {
        setRecipesLoading('idle');
      }
    } catch (error) {
      setRecipesError({
        message:
          error instanceof Error ? error.message : 'Failed to load recipes',
        code: 'NETWORK_ERROR',
        retryable: true,
      });
      setRecipesLoading('error');
    }
  }, [recipes.length, recipesLoading, loadDelay, simulateErrors]);

  // Search results handlers
  const loadMoreSearchResults = useCallback(async () => {
    if (searchLoading !== 'idle') return;

    setSearchLoading('loadingMore');

    try {
      await delay(loadDelay);

      const newResults = generateMockSearchResults(
        10,
        searchQuery,
        searchResults.length + 1
      );
      setSearchResults(prev => [...prev, ...newResults]);

      if (searchResults.length + newResults.length >= 60) {
        setSearchHasNext(false);
        setSearchLoading('complete');
      } else {
        setSearchLoading('idle');
      }
    } catch {
      setSearchLoading('error');
    }
  }, [searchResults.length, searchLoading, searchQuery, loadDelay]);

  // Retry handlers
  const retryBasic = useCallback(() => {
    setBasicError(null);
    setBasicLoading('idle');
    loadMoreBasic();
  }, [loadMoreBasic]);

  const retryRecipes = useCallback(() => {
    setRecipesError(null);
    setRecipesLoading('idle');
    loadMoreRecipes();
  }, [loadMoreRecipes]);

  // Reset handlers
  const resetBasic = () => {
    setBasicItems(generateMockRecipes(20));
    setBasicHasNext(true);
    setBasicLoading('idle');
    setBasicError(null);
  };

  const resetRecipes = () => {
    setRecipes(generateMockRecipes(15));
    setRecipesHasNext(true);
    setRecipesLoading('idle');
    setRecipesError(null);
  };

  const resetSearch = () => {
    setSearchResults(generateMockSearchResults(12, searchQuery));
    setSearchHasNext(true);
    setSearchLoading('idle');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-4xl font-bold">
          InfiniteScroll Component
        </h1>
        <p className="text-muted-foreground text-lg">
          Powerful, accessible infinite scroll component for recipe applications
        </p>
      </div>

      {/* Demo Controls */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Demo Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Recipe Display Options */}
            <div className="space-y-3">
              <h4 className="font-medium">Recipe Display</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <Switch
                    checked={showAuthor}
                    onCheckedChange={setShowAuthor}
                  />
                  <span className="text-sm">Show Author</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Switch
                    checked={showRating}
                    onCheckedChange={setShowRating}
                  />
                  <span className="text-sm">Show Rating</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Switch
                    checked={showCookTime}
                    onCheckedChange={setShowCookTime}
                  />
                  <span className="text-sm">Show Cook Time</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Switch
                    checked={showCategories}
                    onCheckedChange={setShowCategories}
                  />
                  <span className="text-sm">Show Categories</span>
                </label>
              </div>
            </div>

            {/* Layout Options */}
            <div className="space-y-3">
              <h4 className="font-medium">Layout</h4>
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium">Card Variant</label>
                  <Select
                    value={cardVariant}
                    onValueChange={(
                      value: 'default' | 'compact' | 'detailed'
                    ) => setCardVariant(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Grid Columns</label>
                  <Select
                    value={gridCols.toString()}
                    onValueChange={value =>
                      setGridCols(parseInt(value) as 1 | 2 | 3 | 4)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Column</SelectItem>
                      <SelectItem value="2">2 Columns</SelectItem>
                      <SelectItem value="3">3 Columns</SelectItem>
                      <SelectItem value="4">4 Columns</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Demo Options */}
            <div className="space-y-3">
              <h4 className="font-medium">Demo Options</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <Switch
                    checked={simulateErrors}
                    onCheckedChange={setSimulateErrors}
                  />
                  <span className="text-sm">Simulate Errors</span>
                </label>
                <div>
                  <label className="text-sm font-medium">Load Delay (ms)</label>
                  <Input
                    type="number"
                    value={loadDelay}
                    onChange={e =>
                      setLoadDelay(parseInt(e.target.value) || 1000)
                    }
                    min="100"
                    max="5000"
                    step="100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Search Query</label>
                  <Input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Enter search query..."
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Sections */}
      <div className="space-y-12">
        {/* Basic Infinite Scroll */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-foreground mb-2 text-2xl font-bold">
                Basic Infinite Scroll
              </h2>
              <p className="text-muted-foreground">
                Simple infinite scroll with custom item renderer
              </p>
            </div>
            <Button onClick={resetBasic} variant="outline">
              Reset
            </Button>
          </div>

          <InfiniteScroll
            items={basicItems}
            renderItem={({ item: recipe }) => (
              <Card className="h-full">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Image
                      src={recipe.imageUrl ?? '/placeholder-recipe.jpg'}
                      alt={recipe.title}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-1 text-sm font-semibold">
                        {recipe.title}
                      </h3>
                      <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                        {recipe.description}
                      </p>
                      <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
                        <Clock className="h-3 w-3" />
                        <span>{recipe.cookTime} min</span>
                        <Star className="h-3 w-3" />
                        <span>{recipe.rating}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            hasNextPage={basicHasNext}
            loadingState={basicLoading}
            onLoadMore={loadMoreBasic}
            error={basicError}
            onRetry={retryBasic}
            variant="grid"
            gridCols={gridCols}
            className="min-h-[400px]"
          />
        </section>

        {/* Recipe Infinite Scroll */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-foreground mb-2 text-2xl font-bold">
                Recipe Infinite Scroll
              </h2>
              <p className="text-muted-foreground">
                Specialized infinite scroll for recipe cards with metadata
              </p>
            </div>
            <Button onClick={resetRecipes} variant="outline">
              Reset
            </Button>
          </div>

          <RecipeInfiniteScroll
            items={recipes}
            recipeContext="recipes"
            hasNextPage={recipesHasNext}
            loadingState={recipesLoading}
            onLoadMore={loadMoreRecipes}
            error={recipesError}
            onRetry={retryRecipes}
            showAuthor={showAuthor}
            showRating={showRating}
            showCookTime={showCookTime}
            showCategories={showCategories}
            cardVariant={cardVariant}
            variant="grid"
            gridCols={gridCols}
            enableImageLazyLoading={true}
            className="min-h-[400px]"
          />
        </section>

        {/* Search Results Infinite Scroll */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-foreground mb-2 text-2xl font-bold">
                Search Results Infinite Scroll
              </h2>
              <p className="text-muted-foreground">
                Search results with query highlighting and type indicators
              </p>
            </div>
            <Button onClick={resetSearch} variant="outline">
              Reset
            </Button>
          </div>

          <SearchResultsInfiniteScroll
            items={searchResults}
            recipeContext="search-results"
            searchQuery={searchQuery}
            hasNextPage={searchHasNext}
            loadingState={searchLoading}
            onLoadMore={loadMoreSearchResults}
            highlightQuery={true}
            showResultType={true}
            showRelevanceScore={true}
            variant="default"
            className="min-h-[400px]"
          />
        </section>

        {/* Loading States Demo */}
        <section>
          <h2 className="text-foreground mb-6 text-2xl font-bold">
            Loading States
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Spinner Loading</CardTitle>
              </CardHeader>
              <CardContent>
                <DefaultInfiniteScrollLoading
                  variant="spinner"
                  text="Loading recipes..."
                  loadingState="loading"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Dots Loading</CardTitle>
              </CardHeader>
              <CardContent>
                <DefaultInfiniteScrollLoading
                  variant="dots"
                  text="Loading more..."
                  loadingState="loadingMore"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Wave Loading</CardTitle>
              </CardHeader>
              <CardContent>
                <DefaultInfiniteScrollLoading
                  variant="wave"
                  text="Please wait..."
                  loadingState="loading"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Skeleton Loading</CardTitle>
              </CardHeader>
              <CardContent>
                <DefaultInfiniteScrollLoading
                  variant="skeleton"
                  showSkeleton={true}
                  skeletonCount={2}
                  loadingState="loading"
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Error States Demo */}
        <section>
          <h2 className="text-foreground mb-6 text-2xl font-bold">
            Error States
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Retryable Error</CardTitle>
              </CardHeader>
              <CardContent>
                <DefaultInfiniteScrollError
                  error="Network connection failed"
                  onRetry={() => alert('Retry clicked!')}
                  retryable={true}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Non-retryable Error</CardTitle>
              </CardHeader>
              <CardContent>
                <DefaultInfiniteScrollError
                  error="Access denied - insufficient permissions"
                  retryable={false}
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Empty State Demo */}
        <section>
          <h2 className="text-foreground mb-6 text-2xl font-bold">
            Empty State
          </h2>

          <Card>
            <CardContent className="p-8">
              <DefaultInfiniteScrollEmpty
                text="No recipes match your search criteria"
                icon={<ChefHat className="h-12 w-12 opacity-50" />}
                actionButton={
                  <Button variant="outline">
                    <Search className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </section>

        {/* Spinner Variants Demo */}
        <section>
          <h2 className="text-foreground mb-6 text-2xl font-bold">
            Spinner Variants
          </h2>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Default</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center py-8">
                <Spinner variant="default" size="md" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Dots</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center py-8">
                <Spinner variant="dots" size="md" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Wave</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center py-8">
                <Spinner variant="wave" size="md" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Pulse</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center py-8">
                <Spinner variant="pulse" size="md" />
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      {/* Performance Info */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
            <div>
              <span className="font-medium">Basic Items:</span>{' '}
              {basicItems.length}
            </div>
            <div>
              <span className="font-medium">Recipe Items:</span>{' '}
              {recipes.length}
            </div>
            <div>
              <span className="font-medium">Search Results:</span>{' '}
              {searchResults.length}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
