'use client';

import * as React from 'react';
import { UseFormReturn, Controller, useWatch } from 'react-hook-form';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { SelectedRecipesList } from './SelectedRecipesList';
import {
  RecipeSearchResults,
  type RecipeSearchResult,
} from './RecipeSearchResults';
import {
  useDebouncedRecipeSearch,
  useSuggestedRecipes,
} from '@/hooks/recipe-management';
import { createCollectionRecipeFormData } from '@/types/collection/create-collection-form';
import type {
  CreateCollectionFormData,
  CollectionRecipeFormData,
  SectionComponentProps,
} from '@/types/collection/create-collection-form';
import { CREATE_COLLECTION_LIMITS } from '@/types/collection/create-collection-form';

/**
 * Props for the RecipePickerSection component.
 */
export interface RecipePickerSectionProps extends SectionComponentProps {
  /** React Hook Form instance */
  form: UseFormReturn<CreateCollectionFormData>;
}

/**
 * RecipePickerSection Component
 *
 * Second section of the create collection form.
 * Allows users to search for and select recipes to add to their collection.
 */
export function RecipePickerSection({
  form,
  isActive = true,
}: RecipePickerSectionProps) {
  const {
    control,
    setValue,
    formState: { errors },
  } = form;
  const [searchInput, setSearchInput] = React.useState('');
  const [submittedQuery, setSubmittedQuery] = React.useState('');

  // Watch recipes to get current selections
  const recipes = useWatch({ control, name: 'recipes' });

  // Search for recipes - only triggers when submittedQuery changes (on button click/Enter)
  const {
    data: searchResponse,
    isLoading: isSearchLoading,
    error: searchError,
  } = useDebouncedRecipeSearch(submittedQuery, 0, { page: 0, size: 10 });

  // Fetch suggested recipes when no search has been performed
  const {
    data: suggestedResponse,
    isLoading: isSuggestedLoading,
    error: suggestedError,
  } = useSuggestedRecipes(5, !submittedQuery && isActive);

  // Handle search submission
  const handleSearch = React.useCallback(() => {
    if (searchInput.trim().length >= 2) {
      setSubmittedQuery(searchInput.trim());
    }
  }, [searchInput]);

  // Handle Enter key press
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearch();
      }
    },
    [handleSearch]
  );

  // Create set of selected recipe IDs for quick lookup
  const selectedRecipeIds = React.useMemo(
    () => new Set(recipes.map(r => r.recipeId)),
    [recipes]
  );

  // Transform search results to RecipeSearchResult format
  const searchResults: RecipeSearchResult[] = React.useMemo(() => {
    if (!searchResponse?.recipes) return [];
    return searchResponse.recipes.map(recipe => ({
      recipeId: recipe.recipeId,
      title: recipe.title,
      description: recipe.description,
      imageUrl: undefined, // RecipeDto doesn't have imageUrl in the search response
    }));
  }, [searchResponse]);

  // Transform suggested recipes to RecipeSearchResult format
  const suggestedRecipes: RecipeSearchResult[] = React.useMemo(() => {
    if (!suggestedResponse?.recipes) return [];
    return suggestedResponse.recipes.map(recipe => ({
      recipeId: recipe.recipeId,
      title: recipe.title,
      description: recipe.description,
      imageUrl: undefined,
    }));
  }, [suggestedResponse]);

  // Handle adding a recipe
  const handleAddRecipe = React.useCallback(
    (recipe: RecipeSearchResult) => {
      if (selectedRecipeIds.has(recipe.recipeId)) return;
      if (recipes.length >= CREATE_COLLECTION_LIMITS.MAX_RECIPES) return;

      const newRecipe = createCollectionRecipeFormData(
        {
          recipeId: recipe.recipeId,
          recipeTitle: recipe.title,
          recipeDescription: recipe.description,
          recipeImageUrl: recipe.imageUrl,
        },
        recipes.length
      );

      setValue('recipes', [...recipes, newRecipe], {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [recipes, selectedRecipeIds, setValue]
  );

  // Handle removing a recipe
  const handleRemoveRecipe = React.useCallback(
    (recipeId: string) => {
      const updatedRecipes = recipes
        .filter(r => r.id !== recipeId)
        .map((r, index) => ({ ...r, displayOrder: index }));
      setValue('recipes', updatedRecipes, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [recipes, setValue]
  );

  // Handle reordering recipes
  const handleReorderRecipes = React.useCallback(
    (reorderedRecipes: CollectionRecipeFormData[]) => {
      setValue('recipes', reorderedRecipes, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue]
  );

  if (!isActive) return null;

  const isMaxRecipesReached =
    recipes.length >= CREATE_COLLECTION_LIMITS.MAX_RECIPES;

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">Add Recipes</CardTitle>
        <CardDescription>
          Search for recipes and add them to your collection. You can reorder
          them by dragging.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        {/* Recipe count and limit indicator */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">
            {recipes.length} / {CREATE_COLLECTION_LIMITS.MAX_RECIPES} recipes
            selected
          </span>
          {recipes.length < CREATE_COLLECTION_LIMITS.MIN_RECIPES && (
            <span className="text-destructive text-sm">
              At least {CREATE_COLLECTION_LIMITS.MIN_RECIPES} recipe required
            </span>
          )}
        </div>

        {/* Search Input */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                id="recipe-search"
                label="Search Recipes"
                placeholder="Search by recipe name..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                leftIcon={<Search className="h-4 w-4" />}
                disabled={isMaxRecipesReached}
                helperText={
                  isMaxRecipesReached
                    ? 'Maximum recipes reached. Remove some to add more.'
                    : searchInput.length > 0 && searchInput.length < 2
                      ? 'Enter at least 2 characters to search'
                      : undefined
                }
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={handleSearch}
              disabled={isMaxRecipesReached || searchInput.trim().length < 2}
              className="mt-6"
              aria-label="Search recipes"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Suggested Recipes (shown when no search performed) */}
        {!submittedQuery && suggestedRecipes.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Suggested Recipes</h4>
            <div className="border-border max-h-[300px] overflow-y-auto rounded-lg border p-2">
              <RecipeSearchResults
                results={suggestedRecipes}
                selectedRecipeIds={selectedRecipeIds}
                onAddRecipe={handleAddRecipe}
                isLoading={isSuggestedLoading}
                error={suggestedError?.message ?? null}
                searchQuery="suggested"
              />
            </div>
          </div>
        )}

        {/* Search Results */}
        {submittedQuery && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Search Results</h4>
            <div className="border-border max-h-[300px] overflow-y-auto rounded-lg border p-2">
              <RecipeSearchResults
                results={searchResults}
                selectedRecipeIds={selectedRecipeIds}
                onAddRecipe={handleAddRecipe}
                isLoading={isSearchLoading}
                error={searchError?.message ?? null}
                searchQuery={submittedQuery}
              />
            </div>
          </div>
        )}

        {/* Selected Recipes */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Selected Recipes</h4>
          <Controller
            name="recipes"
            control={control}
            render={() => (
              <SelectedRecipesList
                recipes={recipes}
                onReorder={handleReorderRecipes}
                onRemove={handleRemoveRecipe}
              />
            )}
          />
          {errors.recipes?.message && (
            <p className="text-destructive text-sm" role="alert">
              {errors.recipes.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

RecipePickerSection.displayName = 'RecipePickerSection';
