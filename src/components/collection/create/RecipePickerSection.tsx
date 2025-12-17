'use client';

import * as React from 'react';
import { UseFormReturn, Controller, useWatch } from 'react-hook-form';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
import { useDebouncedRecipeSearch } from '@/hooks/recipe-management';
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
  const [searchQuery, setSearchQuery] = React.useState('');

  // Watch recipes to get current selections
  const recipes = useWatch({ control, name: 'recipes' });

  // Search for recipes with debounce
  const {
    data: searchResponse,
    isLoading,
    error,
  } = useDebouncedRecipeSearch(searchQuery, 300, { page: 0, size: 10 });

  // Create set of selected recipe IDs for quick lookup
  const selectedRecipeIds = React.useMemo(
    () => new Set(recipes.map(r => r.recipeId)),
    [recipes]
  );

  // Transform search results to RecipeSearchResult format
  const searchResults: RecipeSearchResult[] = React.useMemo(() => {
    if (!searchResponse?.content) return [];
    return searchResponse.content.map(recipe => ({
      recipeId: recipe.recipeId,
      title: recipe.title,
      description: recipe.description,
      imageUrl: undefined, // RecipeDto doesn't have imageUrl in the search response
    }));
  }, [searchResponse]);

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

      setValue('recipes', [...recipes, newRecipe], { shouldValidate: true });
    },
    [recipes, selectedRecipeIds, setValue]
  );

  // Handle removing a recipe
  const handleRemoveRecipe = React.useCallback(
    (recipeId: string) => {
      const updatedRecipes = recipes
        .filter(r => r.id !== recipeId)
        .map((r, index) => ({ ...r, displayOrder: index }));
      setValue('recipes', updatedRecipes, { shouldValidate: true });
    },
    [recipes, setValue]
  );

  // Handle reordering recipes
  const handleReorderRecipes = React.useCallback(
    (reorderedRecipes: CollectionRecipeFormData[]) => {
      setValue('recipes', reorderedRecipes, { shouldValidate: true });
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
          <Input
            id="recipe-search"
            label="Search Recipes"
            placeholder="Search by recipe name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            disabled={isMaxRecipesReached}
            helperText={
              isMaxRecipesReached
                ? 'Maximum recipes reached. Remove some to add more.'
                : undefined
            }
          />
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Search Results</h4>
            <div className="border-border max-h-[300px] overflow-y-auto rounded-lg border p-2">
              <RecipeSearchResults
                results={searchResults}
                selectedRecipeIds={selectedRecipeIds}
                onAddRecipe={handleAddRecipe}
                isLoading={isLoading}
                error={error?.message ?? null}
                searchQuery={searchQuery}
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
