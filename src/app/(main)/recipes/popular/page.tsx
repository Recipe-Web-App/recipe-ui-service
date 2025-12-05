'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Globe, Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ViewToggle } from '@/components/ui/view-toggle';
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
} from '@/components/ui/empty-state';
import { WebRecipeBrowseGrid } from '@/components/recipe/WebRecipeBrowseGrid';
import { WebRecipeBrowseList } from '@/components/recipe/WebRecipeBrowseList';
import {
  usePopularRecipes,
  useCreateRecipeFromUrl,
} from '@/hooks/recipe-scraper';
import { useDebounce } from '@/hooks/use-debounce';
import { useToastStore } from '@/stores/ui/toast-store';
import {
  mapWebRecipeToCardData,
  type WebRecipeCardData,
} from '@/types/ui/web-recipe-card';

/**
 * PopularRecipesPage
 *
 * Displays popular recipes from around the web.
 * These are external recipes that can be viewed, imported, or have their links copied.
 *
 * Features:
 * - Grid and list view modes
 * - Search filtering by recipe name
 * - Pagination
 * - Open external recipe in new tab
 * - Import recipe to app via recipe-scraper service
 * - Copy recipe link to clipboard
 */
export default function PopularRecipesPage() {
  const { addSuccessToast, addErrorToast, addInfoToast } = useToastStore();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // View mode state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const { debouncedValue: debouncedSearch } = useDebounce(searchQuery, {
    delay: 300,
  });

  // Fetch popular recipes with TanStack Query
  // Fetch a large batch and filter client-side for search
  const { data, isLoading, error, refetch } = usePopularRecipes({
    limit: 100,
    offset: 0,
  });

  // Import mutation
  const importMutation = useCreateRecipeFromUrl();

  // Map web recipes to card data
  const recipes = data?.recipes;
  const allRecipes = useMemo(() => {
    if (!recipes) return [];
    return recipes.map(mapWebRecipeToCardData);
  }, [recipes]);

  // Filter by search query
  const filteredRecipes = useMemo(() => {
    if (!debouncedSearch.trim()) return allRecipes;
    const searchLower = debouncedSearch.toLowerCase();
    return allRecipes.filter(recipe =>
      recipe.recipeName.toLowerCase().includes(searchLower)
    );
  }, [allRecipes, debouncedSearch]);

  // Paginate
  const totalPages = Math.ceil(filteredRecipes.length / pageSize);
  const paginatedRecipes = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecipes.slice(start, start + pageSize);
  }, [filteredRecipes, currentPage, pageSize]);

  // Reset to page 1 when search changes
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      setCurrentPage(1);
    },
    []
  );

  // Recipe action handlers
  const handleRecipeClick = useCallback((recipe: WebRecipeCardData) => {
    // Open the recipe URL in a new tab
    window.open(recipe.url, '_blank', 'noopener,noreferrer');
  }, []);

  const handleOpenExternal = useCallback((recipe: WebRecipeCardData) => {
    window.open(recipe.url, '_blank', 'noopener,noreferrer');
  }, []);

  const handleImport = useCallback(
    async (recipe: WebRecipeCardData) => {
      try {
        addInfoToast(`Importing "${recipe.recipeName}"...`);
        await importMutation.mutateAsync({
          recipeUrl: recipe.url,
        });
        addSuccessToast(
          `"${recipe.recipeName}" has been imported to your recipes!`
        );
      } catch {
        addErrorToast(
          `Failed to import "${recipe.recipeName}". The recipe may not be accessible.`
        );
      }
    },
    [importMutation, addSuccessToast, addErrorToast, addInfoToast]
  );

  const handleCopyLink = useCallback(
    async (recipe: WebRecipeCardData) => {
      try {
        await navigator.clipboard.writeText(recipe.url);
        addSuccessToast('Recipe link copied to clipboard!');
      } catch {
        addErrorToast('Failed to copy link to clipboard.');
      }
    },
    [addSuccessToast, addErrorToast]
  );

  const handleRetry = useCallback(() => {
    void refetch();
  }, [refetch]);

  // Check if error is an Error object
  const errorMessage =
    error instanceof Error ? error.message : error ? String(error) : null;

  // Empty state check - only show when no error and no recipes after loading
  const hasNoRecipes = !isLoading && !error && allRecipes.length === 0;

  // No search results check
  const hasNoSearchResults =
    !isLoading &&
    !error &&
    allRecipes.length > 0 &&
    filteredRecipes.length === 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Popular Recipes</h1>
          <p className="text-muted-foreground text-sm">
            {isLoading
              ? 'Loading popular recipes from the web...'
              : `${filteredRecipes.length} recipe${filteredRecipes.length !== 1 ? 's' : ''} from around the web`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle value={viewMode} onValueChange={setViewMode} size="md" />
          <Button variant="outline" onClick={handleRetry} disabled={isLoading}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-6">
        {/* Search Bar - Only show when we have recipes */}
        {!hasNoRecipes && (
          <div className="flex items-center gap-4">
            <div className="relative max-w-md flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                type="search"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10"
                aria-label="Search popular recipes"
              />
            </div>
            {debouncedSearch && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
              >
                Clear search
              </Button>
            )}
          </div>
        )}

        {/* Recipe Grid/List */}
        <main>
          {hasNoRecipes ? (
            <EmptyState variant="default" size="lg">
              <EmptyStateIcon>
                <Globe className="h-12 w-12" />
              </EmptyStateIcon>
              <EmptyStateTitle>No popular recipes found</EmptyStateTitle>
              <EmptyStateDescription>
                We couldn&apos;t find any popular recipes right now. Check back
                later for new recipes from around the web.
              </EmptyStateDescription>
              <EmptyStateActions>
                <Button onClick={handleRetry}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/recipes">Browse My Recipes</Link>
                </Button>
              </EmptyStateActions>
            </EmptyState>
          ) : hasNoSearchResults ? (
            <EmptyState variant="default" size="md">
              <EmptyStateIcon>
                <Search className="h-12 w-12" />
              </EmptyStateIcon>
              <EmptyStateTitle>No recipes match your search</EmptyStateTitle>
              <EmptyStateDescription>
                Try adjusting your search terms or clear the search to see all
                recipes.
              </EmptyStateDescription>
              <EmptyStateActions>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                >
                  Clear Search
                </Button>
              </EmptyStateActions>
            </EmptyState>
          ) : viewMode === 'grid' ? (
            <WebRecipeBrowseGrid
              recipes={paginatedRecipes}
              loading={isLoading}
              error={errorMessage}
              onRetry={handleRetry}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredRecipes.length}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              onRecipeClick={handleRecipeClick}
              onOpenExternal={handleOpenExternal}
              onImport={handleImport}
              onCopyLink={handleCopyLink}
              showQuickActions
              aria-label="Popular recipes grid"
            />
          ) : (
            <WebRecipeBrowseList
              recipes={paginatedRecipes}
              loading={isLoading}
              error={errorMessage}
              onRetry={handleRetry}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredRecipes.length}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              onRecipeClick={handleRecipeClick}
              onOpenExternal={handleOpenExternal}
              onImport={handleImport}
              onCopyLink={handleCopyLink}
              showQuickActions
              aria-label="Popular recipes list"
            />
          )}
        </main>
      </div>
    </div>
  );
}
