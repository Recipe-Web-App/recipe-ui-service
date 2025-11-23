'use client';

import React, { useState } from 'react';
import { RecipeBrowseGrid } from '@/components/recipe/RecipeBrowseGrid';
import {
  sortRecipesByRating,
  sortRecipesByTotalTime,
  sortRecipesByTitle,
  filterRecipesByDifficulty,
  filterRecipesByTime,
  filterRecipesByRating,
} from '@/types/recipe/browse-grid';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DifficultyLevel } from '@/types/recipe-management/common';
import { type RecipeCardRecipe } from '@/types/ui/recipe-card';

// Sample recipe data (20+ recipes with varied properties)
const generateSampleRecipes = (): RecipeCardRecipe[] => {
  const recipes: RecipeCardRecipe[] = [
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
        avatar: 'https://i.pravatar.cc/150?u=user1',
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
        avatar: 'https://i.pravatar.cc/150?u=user2',
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
        avatar: 'https://i.pravatar.cc/150?u=user3',
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
        avatar: 'https://i.pravatar.cc/150?u=user4',
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
        avatar: 'https://i.pravatar.cc/150?u=user6',
        role: 'chef',
      },
      createdAt: '2024-02-14T13:45:00Z',
    },
    {
      recipeId: 7,
      title: 'French Croissants',
      description: 'Buttery, flaky pastries perfect for breakfast',
      imageUrl:
        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800',
      preparationTime: 240,
      cookingTime: 20,
      difficulty: DifficultyLevel.EXPERT,
      servings: 12,
      rating: 4.9,
      reviewCount: 678,
      author: {
        id: 'user-7',
        name: 'Pierre Dubois',
        avatar: 'https://i.pravatar.cc/150?u=user7',
        role: 'chef',
        verified: true,
      },
      createdAt: '2024-01-20T08:00:00Z',
    },
    {
      recipeId: 8,
      title: 'Chicken Tikka Masala',
      description: 'Creamy Indian curry with marinated chicken',
      imageUrl:
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
      preparationTime: 30,
      cookingTime: 40,
      difficulty: DifficultyLevel.MEDIUM,
      servings: 6,
      rating: 4.7,
      reviewCount: 389,
      isFavorite: true,
      author: {
        id: 'user-8',
        name: 'Priya Sharma',
        role: 'chef',
      },
      createdAt: '2024-03-25T15:20:00Z',
    },
    {
      recipeId: 9,
      title: 'Blueberry Pancakes',
      description: 'Fluffy pancakes studded with fresh blueberries',
      imageUrl:
        'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800',
      preparationTime: 10,
      cookingTime: 15,
      difficulty: DifficultyLevel.EASY,
      servings: 4,
      rating: 4.6,
      reviewCount: 256,
      author: {
        id: 'user-9',
        name: 'Amy Johnson',
        avatar: 'https://i.pravatar.cc/150?u=user9',
        role: 'user',
      },
      createdAt: '2024-04-10T07:30:00Z',
    },
    {
      recipeId: 10,
      title: 'Sushi Rolls',
      description: 'Traditional Japanese sushi with fresh fish',
      imageUrl:
        'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
      preparationTime: 45,
      cookingTime: 0,
      difficulty: DifficultyLevel.HARD,
      servings: 4,
      rating: 4.8,
      reviewCount: 445,
      isFavorite: true,
      author: {
        id: 'user-10',
        name: 'Yuki Tanaka',
        avatar: 'https://i.pravatar.cc/150?u=user10',
        role: 'chef',
        verified: true,
      },
      createdAt: '2024-02-28T12:00:00Z',
    },
    {
      recipeId: 11,
      title: 'Chocolate Lava Cake',
      description: 'Decadent dessert with molten chocolate center',
      imageUrl:
        'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800',
      preparationTime: 20,
      cookingTime: 12,
      difficulty: DifficultyLevel.MEDIUM,
      servings: 2,
      rating: 4.9,
      reviewCount: 512,
      author: {
        id: 'user-11',
        name: 'Chocolate Master',
        role: 'chef',
      },
      createdAt: '2024-03-05T19:00:00Z',
    },
    {
      recipeId: 12,
      title: 'Caesar Salad',
      description: 'Classic salad with homemade dressing and croutons',
      preparationTime: 15,
      cookingTime: 0,
      difficulty: DifficultyLevel.EASY,
      servings: 4,
      rating: 4.4,
      reviewCount: 167,
      author: {
        id: 'user-12',
        name: 'Julia Cook',
        role: 'user',
      },
      createdAt: '2024-04-15T12:30:00Z',
    },
    {
      recipeId: 13,
      title: 'BBQ Ribs',
      description: 'Fall-off-the-bone tender ribs with smoky sauce',
      imageUrl:
        'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
      preparationTime: 30,
      cookingTime: 180,
      difficulty: DifficultyLevel.MEDIUM,
      servings: 4,
      rating: 4.7,
      reviewCount: 334,
      isFavorite: false,
      author: {
        id: 'user-13',
        name: 'Texas BBQ',
        avatar: 'https://i.pravatar.cc/150?u=user13',
        role: 'chef',
      },
      createdAt: '2024-01-30T14:00:00Z',
    },
    {
      recipeId: 14,
      title: 'Vegetarian Lasagna',
      description: 'Layered pasta with vegetables and cheese',
      imageUrl:
        'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800',
      preparationTime: 40,
      cookingTime: 45,
      difficulty: DifficultyLevel.MEDIUM,
      servings: 8,
      rating: 4.6,
      reviewCount: 278,
      author: {
        id: 'user-14',
        name: 'Veggie Chef',
        role: 'chef',
      },
      createdAt: '2024-03-15T17:00:00Z',
    },
    {
      recipeId: 15,
      title: 'Banana Bread',
      description: 'Moist and sweet quick bread with ripe bananas',
      imageUrl:
        'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800',
      preparationTime: 15,
      cookingTime: 60,
      difficulty: DifficultyLevel.EASY,
      servings: 10,
      rating: 4.5,
      reviewCount: 445,
      author: {
        id: 'user-15',
        name: 'Baking Queen',
        avatar: 'https://i.pravatar.cc/150?u=user15',
        role: 'user',
      },
      createdAt: '2024-02-10T10:00:00Z',
    },
    {
      recipeId: 16,
      title: 'Pad Thai',
      description: 'Stir-fried noodles with authentic Thai flavors',
      imageUrl:
        'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800',
      preparationTime: 20,
      cookingTime: 15,
      difficulty: DifficultyLevel.MEDIUM,
      servings: 4,
      rating: 4.7,
      reviewCount: 389,
      isFavorite: true,
      author: {
        id: 'user-6',
        name: 'Somchai Wong',
        avatar: 'https://i.pravatar.cc/150?u=user6',
        role: 'chef',
      },
      createdAt: '2024-04-05T13:00:00Z',
    },
    {
      recipeId: 17,
      title: 'Tiramisu',
      description: 'Classic Italian coffee-flavored dessert',
      preparationTime: 30,
      cookingTime: 0,
      difficulty: DifficultyLevel.MEDIUM,
      servings: 8,
      rating: 4.8,
      reviewCount: 567,
      author: {
        id: 'user-2',
        name: 'Marco Rossi',
        avatar: 'https://i.pravatar.cc/150?u=user2',
        role: 'chef',
        verified: true,
      },
      createdAt: '2024-03-20T16:00:00Z',
    },
    {
      recipeId: 18,
      title: 'Gazpacho',
      description: 'Refreshing cold Spanish soup perfect for summer',
      preparationTime: 20,
      cookingTime: 0,
      difficulty: DifficultyLevel.EASY,
      servings: 6,
      rating: 4.3,
      reviewCount: 123,
      author: {
        id: 'user-16',
        name: 'Carlos Martinez',
        role: 'user',
      },
      createdAt: '2024-04-12T11:30:00Z',
    },
    {
      recipeId: 19,
      title: 'Beef Bourguignon',
      description: 'French beef stew with red wine and vegetables',
      imageUrl:
        'https://images.unsplash.com/photo-1608877907149-a206d75ba011?w=800',
      preparationTime: 45,
      cookingTime: 180,
      difficulty: DifficultyLevel.HARD,
      servings: 6,
      rating: 4.9,
      reviewCount: 678,
      isFavorite: true,
      author: {
        id: 'user-7',
        name: 'Pierre Dubois',
        avatar: 'https://i.pravatar.cc/150?u=user7',
        role: 'chef',
        verified: true,
      },
      createdAt: '2024-01-25T15:00:00Z',
    },
    {
      recipeId: 20,
      title: 'Avocado Toast',
      description: 'Simple and healthy breakfast with perfectly ripe avocado',
      imageUrl:
        'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=800',
      preparationTime: 5,
      cookingTime: 2,
      difficulty: DifficultyLevel.BEGINNER,
      servings: 1,
      rating: 4.2,
      reviewCount: 89,
      author: {
        id: 'user-17',
        name: 'Health Guru',
        role: 'user',
      },
      createdAt: '2024-04-18T08:00:00Z',
    },
  ];

  return recipes;
};

export default function RecipeBrowseGridDemo() {
  const [recipes] = useState<RecipeCardRecipe[]>(generateSampleRecipes());
  const [clickCount, setClickCount] = useState(0);
  const [lastAction, setLastAction] = useState<string>('');

  // Interactive controls state
  const [cardVariant, setCardVariant] = useState<
    'default' | 'elevated' | 'outlined' | 'ghost' | 'interactive'
  >('elevated');
  const [cardSize, setCardSize] = useState<'sm' | 'default' | 'lg'>('default');
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [showMenu, setShowMenu] = useState(true);
  const [showAuthor, setShowAuthor] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  // Filtering state
  const [filterDifficulty, setFilterDifficulty] =
    useState<DifficultyLevel | null>(null);
  const [filterMaxTime, setFilterMaxTime] = useState<number | null>(null);
  const [filterMinRating, setFilterMinRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'rating' | 'time' | 'title' | 'none'>(
    'none'
  );

  const handleAction = (action: string, recipe?: RecipeCardRecipe) => {
    const message = recipe ? `${action}: ${recipe.title}` : action;
    setLastAction(message);
    setClickCount(prev => prev + 1);
  };

  // Apply filters and sorting
  const getFilteredRecipes = () => {
    let filtered = [...recipes];

    // Apply difficulty filter
    if (filterDifficulty) {
      filtered = filterRecipesByDifficulty(filtered, filterDifficulty);
    }

    // Apply max time filter
    if (filterMaxTime) {
      filtered = filterRecipesByTime(filtered, filterMaxTime);
    }

    // Apply min rating filter
    if (filterMinRating) {
      filtered = filterRecipesByRating(filtered, filterMinRating);
    }

    // Apply sorting
    switch (sortBy) {
      case 'rating':
        filtered = sortRecipesByRating(filtered, 'desc');
        break;
      case 'time':
        filtered = sortRecipesByTotalTime(filtered, 'asc');
        break;
      case 'title':
        filtered = sortRecipesByTitle(filtered, 'asc');
        break;
    }

    return filtered;
  };

  const filteredRecipes = getFilteredRecipes();
  const totalPages = Math.ceil(filteredRecipes.length / pageSize);
  const paginatedRecipes = filteredRecipes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          RecipeBrowseGrid Component
        </h1>
        <p className="text-muted-foreground text-lg">
          Recipe-specific grid wrapper with RecipeCard integration, pagination,
          and recipe actions.
        </p>
      </div>

      <div className="space-y-12">
        {/* Interactive Demo */}
        <Card size="lg">
          <CardHeader>
            <CardTitle>Interactive Demo</CardTitle>
            <CardDescription>
              Test RecipeBrowseGrid with various configurations and track
              actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Controls */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2">
                  <span className="text-sm font-medium">Variant:</span>
                  <select
                    value={cardVariant}
                    onChange={e =>
                      setCardVariant(e.target.value as typeof cardVariant)
                    }
                    className="rounded border px-2 py-1"
                  >
                    <option value="default">Default</option>
                    <option value="elevated">Elevated</option>
                    <option value="outlined">Outlined</option>
                  </select>
                </label>

                <label className="flex items-center gap-2">
                  <span className="text-sm font-medium">Size:</span>
                  <select
                    value={cardSize}
                    onChange={e =>
                      setCardSize(e.target.value as typeof cardSize)
                    }
                    className="rounded border px-2 py-1"
                  >
                    <option value="sm">Small</option>
                    <option value="default">Default</option>
                    <option value="lg">Large</option>
                  </select>
                </label>

                <label className="flex items-center gap-2">
                  <span className="text-sm font-medium">Page Size:</span>
                  <select
                    value={pageSize}
                    onChange={e => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="rounded border px-2 py-1"
                  >
                    <option value="6">6</option>
                    <option value="12">12</option>
                    <option value="24">24</option>
                  </select>
                </label>
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showQuickActions}
                    onChange={e => setShowQuickActions(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show Quick Actions</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showMenu}
                    onChange={e => setShowMenu(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show Menu</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showAuthor}
                    onChange={e => setShowAuthor(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show Author</span>
                </label>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => setLoading(false), 2000);
                  }}
                >
                  Test Loading State
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowError(!showError)}
                >
                  Toggle Error State
                </Button>
              </div>
            </div>

            {lastAction && (
              <div className="bg-primary/10 text-primary mb-6 rounded-md p-3">
                <p className="text-sm">
                  Last action: <strong>{lastAction}</strong> (Total:{' '}
                  {clickCount})
                </p>
              </div>
            )}

            <RecipeBrowseGrid
              recipes={paginatedRecipes}
              loading={loading}
              error={showError ? 'Failed to load recipes' : null}
              cardVariant={cardVariant}
              cardSize={cardSize}
              showQuickActions={showQuickActions}
              showMenu={showMenu}
              showAuthor={showAuthor}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredRecipes.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={size => {
                setPageSize(size);
                setCurrentPage(1);
              }}
              onRecipeClick={recipe => handleAction('Clicked', recipe)}
              onFavorite={recipe => handleAction('Favorited', recipe)}
              onShare={recipe => handleAction('Shared', recipe)}
              onAddToCollection={recipe =>
                handleAction('Added to Collection', recipe)
              }
              onQuickView={recipe => handleAction('Quick View', recipe)}
              onRetry={() => {
                handleAction('Retry clicked');
                setShowError(false);
              }}
            />
          </CardContent>
        </Card>

        {/* Grid Configurations */}
        <div>
          <h2 className="text-foreground mb-4 text-2xl font-semibold">
            Grid Configurations
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-muted-foreground mb-3 text-sm font-medium">
                Default Columns (2/3/4)
              </h3>
              <RecipeBrowseGrid
                recipes={recipes.slice(0, 8)}
                cardSize="sm"
                showPagination={false}
              />
            </div>

            <div>
              <h3 className="text-muted-foreground mb-3 text-sm font-medium">
                Wide Columns (1/2/3)
              </h3>
              <RecipeBrowseGrid
                recipes={recipes.slice(0, 6)}
                columns={{ mobile: 1, tablet: 2, desktop: 3 }}
                cardSize="default"
                showPagination={false}
              />
            </div>

            <div>
              <h3 className="text-muted-foreground mb-3 text-sm font-medium">
                Compact Columns (2/3/4/6)
              </h3>
              <RecipeBrowseGrid
                recipes={recipes.slice(0, 12)}
                columns={{ mobile: 2, tablet: 4, desktop: 6 }}
                cardSize="sm"
                showPagination={false}
                gap="sm"
              />
            </div>
          </div>
        </div>

        {/* States */}
        <div>
          <h2 className="text-foreground mb-4 text-2xl font-semibold">
            States
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-muted-foreground mb-3 text-sm font-medium">
                Loading State
              </h3>
              <RecipeBrowseGrid recipes={[]} loading={true} skeletonCount={6} />
            </div>

            <div>
              <h3 className="text-muted-foreground mb-3 text-sm font-medium">
                Empty State
              </h3>
              <RecipeBrowseGrid
                recipes={[]}
                emptyMessage="No recipes found"
                emptyDescription="Try adjusting your filters"
              />
            </div>
          </div>
        </div>

        {/* Filtering Examples */}
        <div>
          <h2 className="text-foreground mb-4 text-2xl font-semibold">
            Filtering & Sorting
          </h2>

          <div className="mb-4 flex flex-wrap gap-4">
            <div>
              <label className="text-muted-foreground mb-1 block text-sm">
                Difficulty
              </label>
              <select
                value={filterDifficulty ?? ''}
                onChange={e =>
                  setFilterDifficulty(
                    e.target.value ? (e.target.value as DifficultyLevel) : null
                  )
                }
                className="rounded border px-3 py-2"
              >
                <option value="">All</option>
                <option value={DifficultyLevel.BEGINNER}>Beginner</option>
                <option value={DifficultyLevel.EASY}>Easy</option>
                <option value={DifficultyLevel.MEDIUM}>Medium</option>
                <option value={DifficultyLevel.HARD}>Hard</option>
              </select>
            </div>

            <div>
              <label className="text-muted-foreground mb-1 block text-sm">
                Max Time
              </label>
              <select
                value={filterMaxTime ?? ''}
                onChange={e =>
                  setFilterMaxTime(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                className="rounded border px-3 py-2"
              >
                <option value="">Any</option>
                <option value="30">30 min or less</option>
                <option value="60">1 hour or less</option>
                <option value="120">2 hours or less</option>
              </select>
            </div>

            <div>
              <label className="text-muted-foreground mb-1 block text-sm">
                Min Rating
              </label>
              <select
                value={filterMinRating ?? ''}
                onChange={e =>
                  setFilterMinRating(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                className="rounded border px-3 py-2"
              >
                <option value="">Any</option>
                <option value="4">4+ stars</option>
                <option value="4.5">4.5+ stars</option>
                <option value="4.8">4.8+ stars</option>
              </select>
            </div>

            <div>
              <label className="text-muted-foreground mb-1 block text-sm">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="rounded border px-3 py-2"
              >
                <option value="none">None</option>
                <option value="rating">Highest Rated</option>
                <option value="time">Quickest First</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFilterDifficulty(null);
                  setFilterMaxTime(null);
                  setFilterMinRating(null);
                  setSortBy('none');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>

          <p className="text-muted-foreground mb-4 text-sm">
            Showing {filteredRecipes.length} of {recipes.length} recipes
          </p>

          <RecipeBrowseGrid
            recipes={paginatedRecipes}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            cardSize="sm"
            emptyMessage="No recipes match your filters"
          />
        </div>

        {/* Code Example */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-foreground mb-2 font-medium">Basic Usage</h3>
              <pre className="text-muted-foreground bg-muted overflow-x-auto rounded-md p-4 text-sm">
                <code>{`import { RecipeBrowseGrid } from '@/components/recipe/RecipeBrowseGrid';

<RecipeBrowseGrid
  recipes={recipes}
  onRecipeClick={(recipe) => router.push(\`/recipes/\${recipe.recipeId}\`)}
  onFavorite={(recipe) => toggleFavorite(recipe.recipeId)}
/>`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-foreground mb-2 font-medium">
                With Pagination & TanStack Query
              </h3>
              <pre className="text-muted-foreground bg-muted overflow-x-auto rounded-md p-4 text-sm">
                <code>{`const { data, isLoading, error, refetch } = useRecipes(filters);

<RecipeBrowseGrid
  recipes={data?.recipes ?? []}
  loading={isLoading}
  error={error}
  onRetry={refetch}
  currentPage={filters.page}
  totalPages={data?.totalPages}
  totalItems={data?.totalItems}
  onPageChange={(page) => setFilters({ ...filters, page })}
  onPageSizeChange={(size) => setFilters({ ...filters, pageSize: size })}
  isOwner={(recipe) => recipe.author?.id === currentUserId}
  onEdit={(recipe) => router.push(\`/recipes/\${recipe.recipeId}/edit\`)}
  onDelete={(recipe) => deleteRecipe(recipe.recipeId)}
/>`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-foreground mb-2 font-medium">
                With Filtering & Sorting
              </h3>
              <pre className="text-muted-foreground bg-muted overflow-x-auto rounded-md p-4 text-sm">
                <code>{`import {
  filterRecipesByDifficulty,
  sortRecipesByRating
} from '@/types/recipe/browse-grid';

const filteredRecipes = sortRecipesByRating(
  filterRecipesByDifficulty(recipes, DifficultyLevel.EASY),
  'desc'
);

<RecipeBrowseGrid recipes={filteredRecipes} />`}</code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
