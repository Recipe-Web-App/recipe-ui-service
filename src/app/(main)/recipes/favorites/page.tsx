'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ViewToggle } from '@/components/ui/view-toggle';
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
} from '@/components/ui/empty-state';
import { RecipeBrowseGrid } from '@/components/recipe/RecipeBrowseGrid';
import { RecipeBrowseList } from '@/components/recipe/RecipeBrowseList';
import { RecipeFilters } from '@/components/recipe/RecipeFilters';
import { AddToCollectionModal } from '@/components/recipe/AddToCollectionModal';
import {
  useFavoriteRecipes,
  useUnfavoriteRecipe,
} from '@/hooks/recipe-management';
import { useAuthStore } from '@/stores/auth-store';
import { useToastStore } from '@/stores/ui/toast-store';
import type { RecipeFilterValues } from '@/types/recipe/filters';
import { DEFAULT_RECIPE_FILTER_VALUES } from '@/types/recipe/filters';
import type { RecipeCardRecipe } from '@/types/ui/recipe-card';
import type { RecipeDto } from '@/types/recipe-management/recipe';

// Store tags separately for filtering (RecipeCardRecipe doesn't have tags)
const recipeTagsMap = new Map<number, string[]>();

function getRecipeTags(recipeId: number): string[] {
  return recipeTagsMap.get(recipeId) ?? [];
}

// Filter recipes client-side based on filter values
function filterRecipes(
  recipes: RecipeCardRecipe[],
  filters: RecipeFilterValues
): RecipeCardRecipe[] {
  return recipes.filter(recipe => {
    // Search filter
    if (filters.search?.trim()) {
      const searchLower = filters.search.toLowerCase();
      const matchesTitle = recipe.title.toLowerCase().includes(searchLower);
      const matchesDescription = recipe.description
        ?.toLowerCase()
        .includes(searchLower);
      if (!matchesTitle && !matchesDescription) {
        return false;
      }
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const recipeTags = getRecipeTags(recipe.recipeId);
      const hasMatchingTag = filters.tags.some(tag =>
        recipeTags.some((rt: string) => rt.toLowerCase() === tag.toLowerCase())
      );
      if (!hasMatchingTag) {
        return false;
      }
    }

    // Prep time filter
    if (filters.prepTime) {
      const [min, max] = filters.prepTime;
      const prepTime = recipe.preparationTime ?? 0;
      if (prepTime < min || prepTime > max) {
        return false;
      }
    }

    // Cook time filter
    if (filters.cookTime) {
      const [min, max] = filters.cookTime;
      const cookTime = recipe.cookingTime ?? 0;
      if (cookTime < min || cookTime > max) {
        return false;
      }
    }

    // Difficulty filter
    if (filters.difficulty && filters.difficulty.length > 0) {
      if (!recipe.difficulty) {
        return false;
      }
      if (!filters.difficulty.includes(recipe.difficulty)) {
        return false;
      }
    }

    // Rating filter
    if (filters.minRating && filters.minRating !== '0') {
      const minRating = parseFloat(filters.minRating);
      if ((recipe.rating ?? 0) < minRating) {
        return false;
      }
    }

    return true;
  });
}

// Convert RecipeDto to RecipeCardRecipe for display
function mapFavoriteToCardRecipe(recipe: RecipeDto): RecipeCardRecipe {
  return {
    recipeId: recipe.recipeId,
    title: recipe.title,
    description: recipe.description,
    imageUrl: undefined, // TODO: Add media integration
    preparationTime: recipe.preparationTime,
    cookingTime: recipe.cookingTime,
    difficulty: recipe.difficulty,
    servings: recipe.servings,
    rating: undefined, // Would come from reviews
    reviewCount: recipe.comments?.length ?? 0,
    isFavorite: true, // Always true - these are favorites
    author: {
      id: recipe.userId,
      name: 'Chef', // TODO: Fetch actual username
      role: 'user',
    },
    createdAt: recipe.createdAt,
  };
}

export default function FavoriteRecipesPage() {
  const router = useRouter();
  const { addSuccessToast, addErrorToast, addInfoToast } = useToastStore();

  // Auth store for ownership detection
  const { user, authUser } = useAuthStore();
  const currentUserId = user?.id ?? authUser?.user_id ?? null;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // View mode state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter state
  const [filters, setFilters] = useState<RecipeFilterValues>(
    DEFAULT_RECIPE_FILTER_VALUES
  );

  // Modal state (only AddToCollection - no delete dialog for favorites)
  const [showAddToCollection, setShowAddToCollection] = useState(false);
  const [selectedRecipeForCollection, setSelectedRecipeForCollection] =
    useState<RecipeCardRecipe | null>(null);

  // Fetch favorite recipes with TanStack Query
  // Note: Using a large page size to get all favorites, then filter client-side
  const { data, isLoading, error, refetch } = useFavoriteRecipes({
    page: 0,
    size: 100, // Get all for client-side filtering
  });

  // Unfavorite mutation
  const unfavoriteMutation = useUnfavoriteRecipe();

  // Ownership detection - check if current user owns the recipe
  const isOwner = useCallback(
    (recipe: RecipeCardRecipe): boolean => {
      if (!currentUserId) return false;
      return recipe.author?.id === currentUserId;
    },
    [currentUserId]
  );

  // Get recipes from data
  const dataContent = data?.recipes;

  // Map and filter recipes
  const allRecipes = useMemo(() => {
    if (!dataContent) return [];
    // Update tags map for filtering
    dataContent.forEach(recipe => {
      if (recipe.tags) {
        recipeTagsMap.set(
          recipe.recipeId,
          recipe.tags.map(t => t.name)
        );
      }
    });
    return dataContent.map(mapFavoriteToCardRecipe);
  }, [dataContent]);

  // Apply filters
  const filteredRecipes = useMemo(() => {
    return filterRecipes(allRecipes, filters);
  }, [allRecipes, filters]);

  // Paginate
  const totalPages = Math.ceil(filteredRecipes.length / pageSize);
  const paginatedRecipes = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecipes.slice(start, start + pageSize);
  }, [filteredRecipes, currentPage, pageSize]);

  // Reset to page 1 when filters change
  const handleFilterChange = useCallback((newFilters: RecipeFilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  // Recipe action handlers
  const handleRecipeClick = useCallback(
    (recipe: RecipeCardRecipe) => {
      router.push(`/recipes/${recipe.recipeId}?from=favorites`);
    },
    [router]
  );

  const handleEdit = useCallback(
    (recipe: RecipeCardRecipe) => {
      // Only allow editing if user owns the recipe
      if (isOwner(recipe)) {
        router.push(`/recipes/${recipe.recipeId}/edit`);
      }
    },
    [router, isOwner]
  );

  const handleUnfavorite = useCallback(
    async (recipe: RecipeCardRecipe) => {
      try {
        await unfavoriteMutation.mutateAsync(recipe.recipeId);
        addSuccessToast('Recipe removed from favorites.');
        void refetch();
      } catch {
        addErrorToast('Failed to remove from favorites.');
      }
    },
    [unfavoriteMutation, addSuccessToast, addErrorToast, refetch]
  );

  const handleAddToCollection = useCallback((recipe: RecipeCardRecipe) => {
    setSelectedRecipeForCollection(recipe);
    setShowAddToCollection(true);
  }, []);

  const handleShare = useCallback(
    (_recipe: RecipeCardRecipe) => {
      // TODO: Implement share
      addInfoToast('Share functionality will be available soon.');
    },
    [addInfoToast]
  );

  // Check if error is an Error object
  const errorMessage =
    error instanceof Error ? error.message : error ? String(error) : null;

  // Empty state checks - only show empty state when no error and no recipes
  const hasNoRecipes = !isLoading && !error && allRecipes.length === 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Favorite Recipes
          </h1>
          <p className="text-muted-foreground text-sm">
            {isLoading
              ? 'Loading your favorites...'
              : `${filteredRecipes.length} recipe${filteredRecipes.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle value={viewMode} onValueChange={setViewMode} size="md" />
          <Button asChild>
            <Link href="/recipes">
              <Search className="mr-2 h-4 w-4" />
              Browse Recipes
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Filters Sidebar */}
        {!hasNoRecipes && (
          <aside className="w-full shrink-0 lg:w-64">
            <RecipeFilters
              recipes={data?.recipes ?? []}
              values={filters}
              onFilterChange={handleFilterChange}
              totalResults={filteredRecipes.length}
              showResultCount
              loadingResults={isLoading}
            />
          </aside>
        )}

        {/* Recipe Grid/List */}
        <main className="flex-1">
          {hasNoRecipes ? (
            <EmptyState variant="default" size="lg">
              <EmptyStateIcon>
                <Heart className="h-12 w-12" />
              </EmptyStateIcon>
              <EmptyStateTitle>No favorite recipes yet</EmptyStateTitle>
              <EmptyStateDescription>
                You haven&apos;t favorited any recipes yet. Browse recipes and
                click the heart icon to save your favorites!
              </EmptyStateDescription>
              <EmptyStateActions>
                <Button asChild>
                  <Link href="/recipes">
                    <Search className="mr-2 h-4 w-4" />
                    Browse Recipes
                  </Link>
                </Button>
              </EmptyStateActions>
            </EmptyState>
          ) : viewMode === 'grid' ? (
            <RecipeBrowseGrid
              recipes={paginatedRecipes}
              loading={isLoading}
              error={errorMessage}
              onRetry={() => refetch()}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              emptyMessage="No recipes match your filters"
              emptyDescription="Try adjusting your search or filter criteria"
              isOwner={isOwner}
              onRecipeClick={handleRecipeClick}
              onEdit={handleEdit}
              onAddToCollection={handleAddToCollection}
              onFavorite={handleUnfavorite}
              onShare={handleShare}
              showQuickActions
              showMenu
              showAuthor
            />
          ) : (
            <RecipeBrowseList
              recipes={paginatedRecipes}
              loading={isLoading}
              error={errorMessage}
              onRetry={() => refetch()}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              emptyMessage="No recipes match your filters"
              emptyDescription="Try adjusting your search or filter criteria"
              isOwner={isOwner}
              onRecipeClick={handleRecipeClick}
              onEdit={handleEdit}
              onAddToCollection={handleAddToCollection}
              onFavorite={handleUnfavorite}
              onShare={handleShare}
            />
          )}
        </main>
      </div>

      {/* Add to Collection Modal */}
      {selectedRecipeForCollection && (
        <AddToCollectionModal
          open={showAddToCollection}
          onOpenChange={open => {
            setShowAddToCollection(open);
            if (!open) {
              setSelectedRecipeForCollection(null);
            }
          }}
          recipe={selectedRecipeForCollection}
        />
      )}
    </div>
  );
}
