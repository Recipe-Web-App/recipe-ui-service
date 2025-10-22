'use client';

import React, { useState, useMemo } from 'react';
import { RecipeBrowseList } from '@/components/recipe/RecipeBrowseList';
import {
  sortRecipesByRating,
  sortRecipesByTotalTime,
  sortRecipesByTitle,
  filterRecipesByDifficulty,
  filterRecipesByTime,
  filterRecipesByRating,
} from '@/types/recipe/browse-list';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DifficultyLevel } from '@/types/recipe-management/common';
import { type RecipeListItemRecipe } from '@/types/ui/recipe-list-item';

// Sample recipe data (20+ recipes with varied properties)
const generateSampleRecipes = (): RecipeListItemRecipe[] => {
  const recipes: RecipeListItemRecipe[] = [
    {
      recipeId: 1,
      title: 'Classic Chocolate Chip Cookies',
      description: 'Soft and chewy cookies loaded with chocolate chips',
      imageUrl:
        'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800',
      preparationTime: 15,
      cookingTime: 12,
      difficulty: DifficultyLevel.EASY,
      servings: 24,
      rating: 4.8,
      reviewCount: 342,
      isFavorite: true,
      author: {
        id: 'user-1',
        name: 'Sarah Baker',
        role: 'chef',
        verified: true,
      },
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      recipeId: 2,
      title: 'Homemade Margherita Pizza',
      description: 'Authentic Italian pizza with fresh mozzarella and basil',
      imageUrl:
        'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800',
      preparationTime: 90,
      cookingTime: 15,
      difficulty: DifficultyLevel.MEDIUM,
      servings: 4,
      rating: 4.9,
      reviewCount: 567,
      author: {
        id: 'user-2',
        name: 'Marco Rossi',
        role: 'chef',
        verified: true,
      },
      createdAt: '2024-02-20T14:30:00Z',
    },
    {
      recipeId: 3,
      title: 'Grilled Salmon with Lemon',
      description: 'Light and healthy grilled salmon with a citrus marinade',
      imageUrl:
        'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
      preparationTime: 10,
      cookingTime: 15,
      difficulty: DifficultyLevel.EASY,
      servings: 2,
      rating: 4.7,
      reviewCount: 189,
      isFavorite: true,
      author: {
        id: 'user-3',
        name: 'Chef Michael',
        role: 'chef',
      },
      createdAt: '2024-03-10T09:15:00Z',
    },
    {
      recipeId: 4,
      title: 'Beef Wellington',
      description: 'Elegant beef tenderloin wrapped in puff pastry',
      imageUrl:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
      preparationTime: 60,
      cookingTime: 45,
      difficulty: DifficultyLevel.HARD,
      servings: 6,
      rating: 4.6,
      reviewCount: 234,
      author: {
        id: 'user-4',
        name: 'Gordon Chef',
        role: 'chef',
        verified: true,
      },
      createdAt: '2024-01-05T16:00:00Z',
    },
    {
      recipeId: 5,
      title: 'Greek Salad',
      description: 'Fresh Mediterranean salad with feta and olives',
      preparationTime: 15,
      cookingTime: 0,
      difficulty: DifficultyLevel.EASY,
      servings: 4,
      rating: 4.5,
      reviewCount: 128,
      author: {
        id: 'user-5',
        name: 'Elena Papadopoulos',
        role: 'user',
      },
      createdAt: '2024-04-01T11:00:00Z',
    },
    {
      recipeId: 6,
      title: 'Thai Green Curry',
      description: 'Aromatic and spicy Thai curry with coconut milk',
      imageUrl:
        'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800',
      preparationTime: 20,
      cookingTime: 25,
      difficulty: DifficultyLevel.MEDIUM,
      servings: 4,
      rating: 4.8,
      reviewCount: 456,
      isFavorite: false,
      author: {
        id: 'user-6',
        name: 'Somchai Wong',
        role: 'chef',
      },
      createdAt: '2024-02-14T13:45:00Z',
    },
    {
      recipeId: 7,
      title: 'Chocolate Lava Cake',
      description: 'Decadent molten chocolate cake with a gooey center',
      imageUrl:
        'https://images.unsplash.com/photo-1511911063855-2bf39afa5b2e?w=800',
      preparationTime: 20,
      cookingTime: 12,
      difficulty: DifficultyLevel.MEDIUM,
      servings: 2,
      rating: 4.9,
      reviewCount: 789,
      isFavorite: true,
      author: {
        id: 'user-1',
        name: 'Sarah Baker',
        role: 'chef',
        verified: true,
      },
      createdAt: '2024-03-05T15:20:00Z',
    },
    {
      recipeId: 8,
      title: 'Chicken Tikka Masala',
      description: 'Creamy Indian curry with tender chicken pieces',
      imageUrl:
        'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
      preparationTime: 30,
      cookingTime: 30,
      difficulty: DifficultyLevel.MEDIUM,
      servings: 6,
      rating: 4.7,
      reviewCount: 423,
      author: {
        id: 'user-7',
        name: 'Priya Sharma',
        role: 'chef',
        verified: true,
      },
      createdAt: '2024-01-25T12:00:00Z',
    },
    {
      recipeId: 9,
      title: 'French Onion Soup',
      description: 'Classic French soup with caramelized onions and cheese',
      imageUrl:
        'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
      preparationTime: 15,
      cookingTime: 60,
      difficulty: DifficultyLevel.MEDIUM,
      servings: 4,
      rating: 4.6,
      reviewCount: 201,
      author: {
        id: 'user-8',
        name: 'Pierre Dubois',
        role: 'chef',
      },
      createdAt: '2024-02-28T10:30:00Z',
    },
    {
      recipeId: 10,
      title: 'Veggie Stir Fry',
      description: 'Quick and colorful vegetable stir fry',
      preparationTime: 10,
      cookingTime: 8,
      difficulty: DifficultyLevel.EASY,
      servings: 3,
      rating: 4.3,
      reviewCount: 156,
      author: {
        id: 'user-9',
        name: 'Amy Green',
        role: 'user',
      },
      createdAt: '2024-03-15T18:00:00Z',
    },
    {
      recipeId: 11,
      title: 'Banana Bread',
      description: 'Moist and flavorful banana bread',
      imageUrl:
        'https://images.unsplash.com/photo-1540192115535-3a99f7a3f8ad?w=800',
      preparationTime: 15,
      cookingTime: 60,
      difficulty: DifficultyLevel.EASY,
      servings: 8,
      rating: 4.7,
      reviewCount: 298,
      isFavorite: true,
      author: {
        id: 'user-1',
        name: 'Sarah Baker',
        role: 'chef',
        verified: true,
      },
      createdAt: '2024-01-20T08:00:00Z',
    },
    {
      recipeId: 12,
      title: 'Spaghetti Carbonara',
      description: 'Traditional Roman pasta with eggs and pancetta',
      imageUrl:
        'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800',
      preparationTime: 10,
      cookingTime: 15,
      difficulty: DifficultyLevel.MEDIUM,
      servings: 4,
      rating: 4.8,
      reviewCount: 512,
      author: {
        id: 'user-2',
        name: 'Marco Rossi',
        role: 'chef',
        verified: true,
      },
      createdAt: '2024-02-10T17:00:00Z',
    },
    {
      recipeId: 13,
      title: 'Caesar Salad',
      description: 'Classic Caesar salad with homemade dressing',
      preparationTime: 15,
      cookingTime: 0,
      difficulty: DifficultyLevel.EASY,
      servings: 4,
      rating: 4.4,
      reviewCount: 167,
      author: {
        id: 'user-10',
        name: 'Julia Romano',
        role: 'user',
      },
      createdAt: '2024-03-20T12:30:00Z',
    },
    {
      recipeId: 14,
      title: 'Pad Thai',
      description: 'Authentic Thai rice noodles with tamarind sauce',
      imageUrl:
        'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800',
      preparationTime: 20,
      cookingTime: 15,
      difficulty: DifficultyLevel.MEDIUM,
      servings: 2,
      rating: 4.7,
      reviewCount: 345,
      isFavorite: true,
      author: {
        id: 'user-6',
        name: 'Somchai Wong',
        role: 'chef',
      },
      createdAt: '2024-01-30T14:15:00Z',
    },
    {
      recipeId: 15,
      title: 'Croissants',
      description: 'Buttery French pastries with flaky layers',
      imageUrl:
        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800',
      preparationTime: 180,
      cookingTime: 20,
      difficulty: DifficultyLevel.HARD,
      servings: 12,
      rating: 4.9,
      reviewCount: 234,
      author: {
        id: 'user-8',
        name: 'Pierre Dubois',
        role: 'chef',
      },
      createdAt: '2024-02-05T06:00:00Z',
    },
    {
      recipeId: 16,
      title: 'Miso Soup',
      description: 'Traditional Japanese soup with tofu and seaweed',
      preparationTime: 5,
      cookingTime: 10,
      difficulty: DifficultyLevel.EASY,
      servings: 2,
      rating: 4.5,
      reviewCount: 145,
      author: {
        id: 'user-11',
        name: 'Yuki Tanaka',
        role: 'chef',
        verified: true,
      },
      createdAt: '2024-03-25T09:00:00Z',
    },
    {
      recipeId: 17,
      title: 'BBQ Ribs',
      description: 'Fall-off-the-bone ribs with smoky BBQ sauce',
      imageUrl:
        'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
      preparationTime: 30,
      cookingTime: 180,
      difficulty: DifficultyLevel.MEDIUM,
      servings: 4,
      rating: 4.8,
      reviewCount: 367,
      isFavorite: false,
      author: {
        id: 'user-12',
        name: 'Jake BBQ',
        role: 'chef',
      },
      createdAt: '2024-01-10T11:00:00Z',
    },
    {
      recipeId: 18,
      title: 'Tiramisu',
      description: 'Classic Italian coffee-flavored dessert',
      imageUrl:
        'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800',
      preparationTime: 30,
      cookingTime: 0,
      difficulty: DifficultyLevel.MEDIUM,
      servings: 8,
      rating: 4.9,
      reviewCount: 678,
      isFavorite: true,
      author: {
        id: 'user-2',
        name: 'Marco Rossi',
        role: 'chef',
        verified: true,
      },
      createdAt: '2024-02-15T16:00:00Z',
    },
    {
      recipeId: 19,
      title: 'Tacos al Pastor',
      description: 'Mexican tacos with marinated pork and pineapple',
      imageUrl:
        'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800',
      preparationTime: 20,
      cookingTime: 15,
      difficulty: DifficultyLevel.MEDIUM,
      servings: 4,
      rating: 4.7,
      reviewCount: 289,
      author: {
        id: 'user-13',
        name: 'Carlos Martinez',
        role: 'chef',
        verified: true,
      },
      createdAt: '2024-03-01T13:00:00Z',
    },
    {
      recipeId: 20,
      title: 'Smoothie Bowl',
      description: 'Healthy breakfast bowl with fresh fruits',
      imageUrl:
        'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800',
      preparationTime: 10,
      cookingTime: 0,
      difficulty: DifficultyLevel.EASY,
      servings: 1,
      rating: 4.4,
      reviewCount: 198,
      isFavorite: false,
      author: {
        id: 'user-9',
        name: 'Amy Green',
        role: 'user',
      },
      createdAt: '2024-03-30T07:00:00Z',
    },
  ];

  return recipes;
};

type SortType = 'rating' | 'time' | 'title' | 'date';

export default function RecipeBrowseListDemo() {
  const allRecipes = useMemo(() => generateSampleRecipes(), []);

  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<SortType>('rating');
  const [difficultyFilter, setDifficultyFilter] = useState<
    DifficultyLevel | undefined
  >();
  const [minRating, setMinRating] = useState<number | undefined>();
  const [maxTime, setMaxTime] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [emptyState, setEmptyState] = useState(false);
  const [itemVariant, setItemVariant] = useState<
    'default' | 'compact' | 'detailed'
  >('default');
  const [itemSize, setItemSize] = useState<'sm' | 'default' | 'lg'>('default');
  const [lastAction, setLastAction] = useState<string>('');

  // Apply filters and sorting
  const filteredRecipes = useMemo(() => {
    if (emptyState) return [];

    let filtered = [...allRecipes];

    // Apply difficulty filter
    if (difficultyFilter) {
      filtered = filterRecipesByDifficulty(filtered, difficultyFilter);
    }

    // Apply time filter
    if (maxTime) {
      filtered = filterRecipesByTime(filtered, maxTime);
    }

    // Apply rating filter
    if (minRating) {
      filtered = filterRecipesByRating(filtered, minRating);
    }

    // Apply sorting
    switch (sortBy) {
      case 'rating':
        filtered = sortRecipesByRating(filtered);
        break;
      case 'time':
        filtered = sortRecipesByTotalTime(filtered);
        break;
      case 'title':
        filtered = sortRecipesByTitle(filtered);
        break;
      case 'date':
        // Already in date order (newest first)
        break;
    }

    return filtered;
  }, [allRecipes, difficultyFilter, maxTime, minRating, sortBy, emptyState]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredRecipes.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRecipes = filteredRecipes.slice(
    startIndex,
    startIndex + pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setLastAction(`Changed to page ${page}`);
  };

  const handleAction = (action: string) => {
    setLastAction(action);
  };

  const handleRetry = () => {
    setError(false);
    handleAction('Retried after error');
  };

  const clearFilters = () => {
    setDifficultyFilter(undefined);
    setMinRating(undefined);
    setMaxTime(undefined);
    setCurrentPage(1);
    handleAction('Cleared all filters');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          RecipeBrowseList Component
        </h1>
        <p className="text-muted-foreground text-lg">
          Recipe-specific list wrapper with RecipeListItem integration,
          pagination, and recipe actions. Optimized for scanning many recipes
          quickly.
        </p>
      </div>

      <div className="space-y-8">
        {/* Interactive Controls */}
        <Card size="lg">
          <CardHeader>
            <CardTitle>Interactive Controls</CardTitle>
            <CardDescription>
              Test different RecipeBrowseList features and configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* State Toggles */}
              <div>
                <label className="text-muted-foreground mb-2 block text-sm font-medium">
                  Component States
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={loading}
                      onChange={e => setLoading(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Loading</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={error}
                      onChange={e => setError(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Error</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={emptyState}
                      onChange={e => setEmptyState(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Empty State</span>
                  </label>
                </div>
              </div>

              {/* Item Variant */}
              <div>
                <label className="text-muted-foreground mb-2 block text-sm font-medium">
                  Item Variant
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={itemVariant === 'default' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setItemVariant('default')}
                  >
                    Default
                  </Button>
                  <Button
                    variant={itemVariant === 'compact' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setItemVariant('compact')}
                  >
                    Compact
                  </Button>
                  <Button
                    variant={itemVariant === 'detailed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setItemVariant('detailed')}
                  >
                    Detailed
                  </Button>
                </div>
              </div>

              {/* Item Size */}
              <div>
                <label className="text-muted-foreground mb-2 block text-sm font-medium">
                  Item Size
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={itemSize === 'sm' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setItemSize('sm')}
                  >
                    Small
                  </Button>
                  <Button
                    variant={itemSize === 'default' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setItemSize('default')}
                  >
                    Default
                  </Button>
                  <Button
                    variant={itemSize === 'lg' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setItemSize('lg')}
                  >
                    Large
                  </Button>
                </div>
              </div>

              {/* Sorting */}
              <div>
                <label className="text-muted-foreground mb-2 block text-sm font-medium">
                  Sort By
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={sortBy === 'rating' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('rating')}
                  >
                    Rating
                  </Button>
                  <Button
                    variant={sortBy === 'time' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('time')}
                  >
                    Time
                  </Button>
                  <Button
                    variant={sortBy === 'title' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('title')}
                  >
                    Title
                  </Button>
                  <Button
                    variant={sortBy === 'date' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('date')}
                  >
                    Date
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-muted-foreground text-sm font-medium">
                    Filters
                  </label>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {/* Difficulty Filter */}
                  <div>
                    <label className="text-muted-foreground mb-1 block text-xs">
                      Difficulty
                    </label>
                    <select
                      className="border-input bg-background ring-offset-background focus:ring-ring w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
                      value={difficultyFilter ?? ''}
                      onChange={e =>
                        setDifficultyFilter(
                          e.target.value
                            ? (e.target.value as DifficultyLevel)
                            : undefined
                        )
                      }
                    >
                      <option value="">All</option>
                      <option value={DifficultyLevel.EASY}>Easy</option>
                      <option value={DifficultyLevel.MEDIUM}>Medium</option>
                      <option value={DifficultyLevel.HARD}>Hard</option>
                    </select>
                  </div>

                  {/* Time Filter */}
                  <div>
                    <label className="text-muted-foreground mb-1 block text-xs">
                      Max Time (minutes)
                    </label>
                    <select
                      className="border-input bg-background ring-offset-background focus:ring-ring w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
                      value={maxTime ?? ''}
                      onChange={e =>
                        setMaxTime(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    >
                      <option value="">All</option>
                      <option value="30">Under 30 min</option>
                      <option value="60">Under 1 hour</option>
                      <option value="120">Under 2 hours</option>
                    </select>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="text-muted-foreground mb-1 block text-xs">
                      Min Rating
                    </label>
                    <select
                      className="border-input bg-background ring-offset-background focus:ring-ring w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
                      value={minRating ?? ''}
                      onChange={e =>
                        setMinRating(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    >
                      <option value="">All</option>
                      <option value="3.5">3.5+</option>
                      <option value="4.0">4.0+</option>
                      <option value="4.5">4.5+</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pagination Controls */}
              <div>
                <label className="text-muted-foreground mb-2 block text-sm font-medium">
                  Items Per Page
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={pageSize === 5 ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setPageSize(5);
                      setCurrentPage(1);
                    }}
                  >
                    5
                  </Button>
                  <Button
                    variant={pageSize === 10 ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setPageSize(10);
                      setCurrentPage(1);
                    }}
                  >
                    10
                  </Button>
                  <Button
                    variant={pageSize === 20 ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setPageSize(20);
                      setCurrentPage(1);
                    }}
                  >
                    20
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-muted rounded-lg p-4">
                <div className="grid gap-2 text-sm md:grid-cols-4">
                  <div>
                    <span className="text-muted-foreground">Total:</span>{' '}
                    <span className="font-medium">
                      {filteredRecipes.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Page:</span>{' '}
                    <span className="font-medium">
                      {currentPage} of {totalPages}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Per Page:</span>{' '}
                    <span className="font-medium">{pageSize}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Shown:</span>{' '}
                    <span className="font-medium">
                      {paginatedRecipes.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Log */}
              {lastAction && (
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Last Action:</span>{' '}
                    <span className="font-medium">{lastAction}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recipe Browse List */}
        <Card size="lg">
          <CardHeader>
            <CardTitle>Recipe Browse List</CardTitle>
            <CardDescription>
              Current configuration: {filteredRecipes.length} recipes,{' '}
              {itemVariant} variant, {itemSize} size
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecipeBrowseList
              recipes={paginatedRecipes}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              loading={loading}
              error={error ? new Error('Failed to load recipes') : null}
              onRetry={handleRetry}
              itemVariant={itemVariant}
              itemSize={itemSize}
              onRecipeClick={recipe => handleAction(`Clicked: ${recipe.title}`)}
              onFavorite={recipe => handleAction(`Favorited: ${recipe.title}`)}
              onShare={recipe => handleAction(`Shared: ${recipe.title}`)}
              isOwner={recipe => recipe.author?.id === 'user-1'}
              onEdit={recipe => handleAction(`Edit: ${recipe.title}`)}
              onDelete={recipe => handleAction(`Delete: ${recipe.title}`)}
              emptyMessage="No recipes found"
              emptyDescription="Try adjusting your filters or search terms."
              aria-label="Browse recipes list"
            />
          </CardContent>
        </Card>

        {/* Features */}
        <Card size="lg">
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>✓ Pagination with customizable page size</li>
              <li>✓ Loading state with RecipeListItem skeletons</li>
              <li>✓ Empty state with custom message</li>
              <li>✓ Error state with retry functionality</li>
              <li>✓ Recipe-specific actions (favorite, share, edit, delete)</li>
              <li>✓ Flexible ownership determination (boolean or function)</li>
              <li>✓ Item variant control (default, compact, detailed)</li>
              <li>✓ Item size control (sm, default, lg)</li>
              <li>✓ Configurable metadata display (author, rating)</li>
              <li>✓ Full accessibility support with ARIA labels</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
