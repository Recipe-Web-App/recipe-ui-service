'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, BookOpen } from 'lucide-react';
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
import { DraftBanner } from '@/components/recipe/DraftBanner';
import { BulkActionToolbar } from '@/components/recipe/BulkActionToolbar';
import { AddToCollectionModal } from '@/components/recipe/AddToCollectionModal';
import { useMyRecipes } from '@/hooks/recipe-management';
import { useDeleteRecipe } from '@/hooks/recipe-management';
import { useToastStore } from '@/stores/ui/toast-store';
import type { RecipeFilterValues } from '@/types/recipe/filters';
import { DEFAULT_RECIPE_FILTER_VALUES } from '@/types/recipe/filters';
import type { RecipeCardRecipe } from '@/types/ui/recipe-card';
import type { RecipeDto } from '@/types/recipe-management/recipe';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Convert RecipeDto to RecipeCardRecipe for display
function mapRecipeToCardRecipe(recipe: RecipeDto): RecipeCardRecipe {
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
    isFavorite: (recipe.favorites?.length ?? 0) > 0,
    author: {
      id: recipe.userId,
      name: 'You', // This is the user's own recipes
      role: 'user',
    },
    createdAt: recipe.createdAt,
  };
}

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

export default function MyRecipesPage() {
  const router = useRouter();
  const { addSuccessToast, addErrorToast, addInfoToast } = useToastStore();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // View mode state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter state
  const [filters, setFilters] = useState<RecipeFilterValues>(
    DEFAULT_RECIPE_FILTER_VALUES
  );

  // Selection state for bulk actions
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Modal state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddToCollection, setShowAddToCollection] = useState(false);
  const [selectedRecipeForCollection, setSelectedRecipeForCollection] =
    useState<RecipeCardRecipe | null>(null);

  // Fetch recipes with TanStack Query
  // Note: Using a large page size to get all user recipes, then filter client-side
  const { data, isLoading, error, refetch } = useMyRecipes({
    page: 0,
    size: 100, // Get all for client-side filtering
  });

  // Delete mutation
  const deleteRecipeMutation = useDeleteRecipe();

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
    return dataContent.map(mapRecipeToCardRecipe);
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

  // Selection handlers
  const handleSelectAll = useCallback(() => {
    const allIds = paginatedRecipes.map(r => r.recipeId);
    setSelectedIds(new Set(allIds));
  }, [paginatedRecipes]);

  const handleDeselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const handleToggleSelect = useCallback((recipeId: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(recipeId)) {
        next.delete(recipeId);
      } else {
        next.add(recipeId);
      }
      return next;
    });
  }, []);

  const handleCancelSelection = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedIds(new Set());
  }, []);

  // Enter selection mode when first item selected
  const handleRecipeClick = useCallback(
    (recipe: RecipeCardRecipe) => {
      if (isSelectionMode) {
        handleToggleSelect(recipe.recipeId);
      } else {
        router.push(`/recipes/${recipe.recipeId}?from=my-recipes`);
      }
    },
    [isSelectionMode, handleToggleSelect, router]
  );

  // Bulk delete
  const handleBulkDelete = useCallback(async () => {
    setShowDeleteConfirm(false);

    const idsToDelete = Array.from(selectedIds);
    let successCount = 0;

    for (const id of idsToDelete) {
      try {
        await deleteRecipeMutation.mutateAsync(id);
        successCount++;
      } catch {
        // Continue with other deletions
      }
    }

    if (successCount > 0) {
      addSuccessToast(
        `Successfully deleted ${successCount} recipe${successCount !== 1 ? 's' : ''}.`
      );
      setSelectedIds(new Set());
      setIsSelectionMode(false);
      void refetch();
    }

    if (successCount < idsToDelete.length) {
      addErrorToast(
        `Failed to delete ${idsToDelete.length - successCount} recipe${idsToDelete.length - successCount !== 1 ? 's' : ''}.`
      );
    }
  }, [
    selectedIds,
    deleteRecipeMutation,
    addSuccessToast,
    addErrorToast,
    refetch,
  ]);

  // Recipe action handlers
  const handleEdit = useCallback(
    (recipe: RecipeCardRecipe) => {
      router.push(`/recipes/${recipe.recipeId}/edit`);
    },
    [router]
  );

  const handleDelete = useCallback((recipe: RecipeCardRecipe) => {
    setSelectedIds(new Set([recipe.recipeId]));
    setShowDeleteConfirm(true);
  }, []);

  const handleAddToCollection = useCallback((recipe: RecipeCardRecipe) => {
    setSelectedRecipeForCollection(recipe);
    setShowAddToCollection(true);
  }, []);

  const handleFavorite = useCallback(
    (_recipe: RecipeCardRecipe) => {
      // TODO: Implement favorite toggle
      addInfoToast('Favorite functionality will be available soon.');
    },
    [addInfoToast]
  );

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
      {/* Draft Banner */}
      <DraftBanner className="mb-2" />

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Recipes</h1>
          <p className="text-muted-foreground text-sm">
            {isLoading
              ? 'Loading your recipes...'
              : `${filteredRecipes.length} recipe${filteredRecipes.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle value={viewMode} onValueChange={setViewMode} size="md" />
          <Button asChild>
            <Link href="/recipes/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Recipe
            </Link>
          </Button>
        </div>
      </div>

      {/* Bulk Action Toolbar */}
      {isSelectionMode && selectedIds.size > 0 && (
        <BulkActionToolbar
          selectedCount={selectedIds.size}
          totalCount={paginatedRecipes.length}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onDelete={() => setShowDeleteConfirm(true)}
          onAddToCollection={() => setShowAddToCollection(true)}
          onCancel={handleCancelSelection}
          isDeleting={deleteRecipeMutation.isPending}
        />
      )}

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
                <BookOpen className="h-12 w-12" />
              </EmptyStateIcon>
              <EmptyStateTitle>No recipes yet</EmptyStateTitle>
              <EmptyStateDescription>
                You haven&apos;t created any recipes yet. Start by creating your
                first recipe!
              </EmptyStateDescription>
              <EmptyStateActions>
                <Button asChild>
                  <Link href="/recipes/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Recipe
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
              isOwner={true}
              onRecipeClick={handleRecipeClick}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddToCollection={handleAddToCollection}
              onFavorite={handleFavorite}
              onShare={handleShare}
              showQuickActions
              showMenu
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
              isOwner={true}
              onRecipeClick={handleRecipeClick}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddToCollection={handleAddToCollection}
              onFavorite={handleFavorite}
              onShare={handleShare}
            />
          )}
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Delete Recipe{selectedIds.size > 1 ? 's' : ''}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              {selectedIds.size === 1
                ? 'this recipe'
                : `${selectedIds.size} recipes`}
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={deleteRecipeMutation.isPending}
            >
              {deleteRecipeMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
