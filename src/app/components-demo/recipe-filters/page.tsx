'use client';

import React, { useState, useMemo } from 'react';
import { RecipeFilters } from '@/components/recipe/RecipeFilters';
import { RecipeBrowseGrid } from '@/components/recipe/RecipeBrowseGrid';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { DifficultyLevel } from '@/types/recipe-management/common';
import type { RecipeDto } from '@/types/recipe-management/recipe';
import type { RecipeFilterValues } from '@/types/recipe/filters';
import { DEFAULT_RECIPE_FILTER_VALUES } from '@/types/recipe/filters';

// Sample recipe data
const sampleRecipes: RecipeDto[] = [
  {
    recipeId: 1,
    userId: 'user-1',
    title: 'Chocolate Chip Cookies',
    description: 'Classic soft and chewy cookies with chocolate chips',
    servings: 24,
    preparationTime: 15,
    cookingTime: 12,
    difficulty: DifficultyLevel.EASY,
    createdAt: '2024-01-01T10:00:00Z',
    tags: [
      { tagId: 1, name: 'Dessert' },
      { tagId: 2, name: 'Baking' },
      { tagId: 3, name: 'American' },
    ],
  },
  {
    recipeId: 2,
    userId: 'user-1',
    title: 'Pasta Carbonara',
    description: 'Classic Italian pasta with eggs, cheese, and pancetta',
    servings: 4,
    preparationTime: 10,
    cookingTime: 20,
    difficulty: DifficultyLevel.MEDIUM,
    createdAt: '2024-01-02T10:00:00Z',
    tags: [
      { tagId: 4, name: 'Italian' },
      { tagId: 5, name: 'Pasta' },
      { tagId: 6, name: 'Dinner' },
    ],
  },
  {
    recipeId: 3,
    userId: 'user-2',
    title: 'Vegan Buddha Bowl',
    description: 'Healthy and colorful bowl with quinoa and roasted vegetables',
    servings: 2,
    preparationTime: 20,
    cookingTime: 0,
    difficulty: DifficultyLevel.EASY,
    createdAt: '2024-01-03T10:00:00Z',
    tags: [
      { tagId: 7, name: 'Vegan' },
      { tagId: 8, name: 'Healthy' },
      { tagId: 9, name: 'Lunch' },
    ],
  },
  {
    recipeId: 4,
    userId: 'user-3',
    title: 'Thai Green Curry',
    description: 'Spicy and aromatic Thai curry with chicken and vegetables',
    servings: 6,
    preparationTime: 25,
    cookingTime: 30,
    difficulty: DifficultyLevel.HARD,
    createdAt: '2024-01-04T10:00:00Z',
    tags: [
      { tagId: 10, name: 'Thai' },
      { tagId: 11, name: 'Spicy' },
      { tagId: 6, name: 'Dinner' },
    ],
  },
  {
    recipeId: 5,
    userId: 'user-1',
    title: 'Overnight Oats',
    description: 'Simple make-ahead breakfast with oats and fruit',
    servings: 1,
    preparationTime: 5,
    cookingTime: 0,
    difficulty: DifficultyLevel.BEGINNER,
    createdAt: '2024-01-05T10:00:00Z',
    tags: [
      { tagId: 12, name: 'Breakfast' },
      { tagId: 8, name: 'Healthy' },
      { tagId: 13, name: 'Quick' },
    ],
  },
  {
    recipeId: 6,
    userId: 'user-2',
    title: 'Classic Margherita Pizza',
    description: 'Traditional Italian pizza with tomato, mozzarella, and basil',
    servings: 4,
    preparationTime: 120,
    cookingTime: 15,
    difficulty: DifficultyLevel.MEDIUM,
    createdAt: '2024-01-06T10:00:00Z',
    tags: [
      { tagId: 4, name: 'Italian' },
      { tagId: 6, name: 'Dinner' },
      { tagId: 2, name: 'Baking' },
    ],
  },
];

export default function RecipeFiltersDemo() {
  const [filterValues, setFilterValues] = useState<RecipeFilterValues>(
    DEFAULT_RECIPE_FILTER_VALUES
  );

  // Filter recipes based on current filter values
  const filteredRecipes = useMemo(() => {
    return sampleRecipes.filter(recipe => {
      // Search filter
      if (filterValues.search) {
        const searchLower = filterValues.search.toLowerCase();
        const titleMatch = recipe.title.toLowerCase().includes(searchLower);
        const descMatch = recipe.description
          ?.toLowerCase()
          .includes(searchLower);
        if (!titleMatch && !descMatch) return false;
      }

      // Tags filter
      if (filterValues.tags && filterValues.tags.length > 0) {
        const recipeTags = recipe.tags?.map(t => t.name) ?? [];
        const hasTag = filterValues.tags.some(tag => recipeTags.includes(tag));
        if (!hasTag) return false;
      }

      // Prep time filter
      if (filterValues.prepTime) {
        const [min, max] = filterValues.prepTime;
        const prepTime = recipe.preparationTime ?? 0;
        if (prepTime < min || prepTime > max) return false;
      }

      // Cook time filter
      if (filterValues.cookTime) {
        const [min, max] = filterValues.cookTime;
        const cookTime = recipe.cookingTime ?? 0;
        if (cookTime < min || cookTime > max) return false;
      }

      // Difficulty filter
      if (filterValues.difficulty && filterValues.difficulty.length > 0) {
        if (
          recipe.difficulty &&
          !filterValues.difficulty.includes(recipe.difficulty)
        ) {
          return false;
        }
      }

      // Rating filter (simulated - recipes don't have ratings in this mock)
      // In real app, would filter by recipe.rating >= parseFloat(filterValues.minRating)

      return true;
    });
  }, [filterValues]);

  // Enrich recipes with additional data (deterministic based on recipeId)
  const enrichedRecipes = useMemo(
    () =>
      filteredRecipes.map(recipe => ({
        ...recipe,
        imageUrl: `https://images.unsplash.com/photo-${1500000000000 + recipe.recipeId}?w=400`,
        rating: 4 + ((recipe.recipeId * 0.01) % 1),
        reviewCount: (recipe.recipeId * 17) % 200,
        isFavorite: recipe.recipeId % 3 === 0,
        author: {
          id: recipe.userId,
          name: `Chef ${recipe.userId}`,
          avatar: `https://i.pravatar.cc/150?u=${recipe.userId}`,
          role: 'chef' as const,
          verified: recipe.recipeId % 2 === 0,
          rating: 4.5,
          recipeCount: 25,
        },
      })),
    [filteredRecipes]
  );

  const handleFilterChange = (newValues: RecipeFilterValues) => {
    setFilterValues(newValues);
  };

  const handleReset = () => {
    setFilterValues(DEFAULT_RECIPE_FILTER_VALUES);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          RecipeFilters Component
        </h1>
        <p className="text-muted-foreground text-lg">
          Entity-specific filter panel for recipe browsing. Responsive with
          drawer on mobile and inline panel on desktop/tablet.
        </p>
      </div>

      <div className="space-y-8">
        {/* Current State Display */}
        <Card size="lg">
          <CardHeader>
            <CardTitle>Current Filter State</CardTitle>
            <CardDescription>
              Active filters and their values (updates in real-time)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-4">
              <pre className="overflow-x-auto text-sm">
                {JSON.stringify(filterValues, null, 2)}
              </pre>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleReset}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium transition-colors"
              >
                Reset Filters
              </button>
              <div className="text-muted-foreground flex items-center text-sm">
                Showing {filteredRecipes.length} of {sampleRecipes.length}{' '}
                recipes
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Demo */}
        <Card size="lg">
          <CardHeader>
            <CardTitle>Live Filter Demo</CardTitle>
            <CardDescription>
              Try the filters to see recipes update in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
              {/* Filter Panel */}
              <div className="lg:sticky lg:top-4 lg:h-fit">
                <RecipeFilters
                  recipes={sampleRecipes}
                  values={filterValues}
                  onFilterChange={handleFilterChange}
                  totalResults={filteredRecipes.length}
                  showResultCount
                  title="Filter Recipes"
                  variant="default"
                  size="md"
                  position="sidebar"
                />
              </div>

              {/* Filtered Recipe Grid */}
              <div>
                {enrichedRecipes.length > 0 ? (
                  <RecipeBrowseGrid
                    recipes={enrichedRecipes}
                    columns={{ mobile: 1, tablet: 2, desktop: 3 }}
                    gap="md"
                    cardVariant="elevated"
                    cardSize="default"
                  />
                ) : (
                  <div className="bg-muted flex flex-col items-center justify-center rounded-lg p-12 text-center">
                    <p className="text-muted-foreground text-lg font-medium">
                      No recipes match your filters
                    </p>
                    <p className="text-muted-foreground mt-2 text-sm">
                      Try adjusting your filters to see more results
                    </p>
                    <button
                      onClick={handleReset}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 rounded-md px-4 py-2 text-sm font-medium transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Highlights */}
        <Card size="lg">
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>
              RecipeFilters component capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>
                  <strong>Dynamic Tag Extraction:</strong> Tags are
                  automatically extracted from recipe entities
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>
                  <strong>Responsive Design:</strong> Drawer on mobile
                  (&lt;768px), inline panel on desktop/tablet
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>
                  <strong>Session State:</strong> Integrates with search-filter
                  store for session-only persistence
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>
                  <strong>Filter Types:</strong> Search, tags (checkboxes), prep
                  time (range), cook time (range), difficulty (checkboxes),
                  rating (select)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>
                  <strong>Real-time Updates:</strong> Filtered results update
                  immediately as filters change
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>
                  <strong>Clear & Reset:</strong> Easy to clear all filters or
                  reset to defaults
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
