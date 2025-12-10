import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FormInput } from './FormField';
import { useSearchForm } from '@/hooks/forms/useSearchForm';
import type { SearchFormData } from '@/lib/validation/search-schemas';
import type { SearchRecipesResponse } from '@/types/recipe-management/search';
import { DifficultyLevel } from '@/types/recipe-management/common';
import { cn } from '@/lib/utils';
import type { UseFormReturn } from 'react-hook-form';
import type { PaginationParams } from '@/lib/api/recipe-management/client';
import { X } from 'lucide-react';

/**
 * Options for difficulty levels
 */
const DIFFICULTY_OPTIONS = [
  { value: DifficultyLevel.BEGINNER, label: 'Beginner' },
  { value: DifficultyLevel.EASY, label: 'Easy' },
  { value: DifficultyLevel.MEDIUM, label: 'Medium' },
  { value: DifficultyLevel.HARD, label: 'Hard' },
  { value: DifficultyLevel.EXPERT, label: 'Expert' },
];

/**
 * Props for SearchForm component
 */
export interface SearchFormProps {
  onSearch?: (results: SearchRecipesResponse) => void;
  onResultsChange?: (results: SearchRecipesResponse) => void;
  onError?: (error: Error) => void;
  initialFilters?: Partial<SearchFormData>;
  autoSearch?: boolean;
  debounceMs?: number;
  paginationParams?: PaginationParams;
  showCard?: boolean;
  className?: string;
  compact?: boolean;
  title?: string;
}

/**
 * SearchForm component for advanced recipe search
 */
export function SearchForm({
  onSearch,
  onResultsChange,
  onError,
  initialFilters,
  autoSearch = false,
  debounceMs = 300,
  paginationParams,
  showCard = true,
  className,
  compact = false,
  title = 'Search Recipes',
}: SearchFormProps) {
  const {
    form,
    handleSubmit,
    clearFilters,
    isSearching,
    hasActiveFilters,
    activeFilterCount,
    addIngredient,
    removeIngredient,
    addTag,
    removeTag,
    toggleDifficulty,
  } = useSearchForm({
    onSearch,
    onResultsChange,
    onError,
    initialFilters,
    autoSearch,
    debounceMs,
    paginationParams,
  });

  // State for ingredient and tag input
  const [ingredientInput, setIngredientInput] = React.useState('');
  const [tagInput, setTagInput] = React.useState('');

  // Watch form values
  const formValues = form.watch();
  const ingredients = formValues.ingredients ?? [];
  const tags = formValues.tags ?? [];
  const difficulty = formValues.difficulty;

  // Handle adding ingredient
  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredientInput.trim()) {
      addIngredient(ingredientInput.trim());
      setIngredientInput('');
    }
  };

  // Handle adding tag
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (tagInput.trim()) {
      addTag(tagInput.trim());
      setTagInput('');
    }
  };

  // Form content
  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Search Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Basic Search</h3>

        {/* Search Query */}
        <FormInput
          form={form as UseFormReturn<SearchFormData>}
          name="query"
          label="Search"
          placeholder="Search recipes by name or description..."
          helperText="Enter at least 2 characters to search"
        />
      </div>

      {/* Ingredients Section */}
      {!compact && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Filter by Ingredients</h3>

          {/* Add Ingredient Input */}
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Add ingredient (e.g., tomato)"
                value={ingredientInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setIngredientInput(e.target.value)
                }
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddIngredient(e);
                  }
                }}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleAddIngredient}
              disabled={!ingredientInput.trim() || isSearching}
            >
              Add
            </Button>
          </div>

          {/* Display Ingredients */}
          {ingredients.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {ingredient}
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    disabled={isSearching}
                    className="hover:text-destructive ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tags Section */}
      {!compact && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Filter by Tags</h3>

          {/* Add Tag Input */}
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Add tag (e.g., vegetarian)"
                value={tagInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTagInput(e.target.value)
                }
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(e);
                  }
                }}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleAddTag}
              disabled={!tagInput.trim() || isSearching}
            >
              Add
            </Button>
          </div>

          {/* Display Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    disabled={isSearching}
                    className="hover:text-destructive ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Difficulty Section */}
      {!compact && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Filter by Difficulty</h3>

          <div className="flex flex-wrap gap-2">
            {DIFFICULTY_OPTIONS.map(option => {
              const isSelected = difficulty === option.value;
              return (
                <Button
                  key={option.value}
                  type="button"
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleDifficulty(option.value)}
                  disabled={isSearching}
                >
                  {option.label}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Time Constraints Section */}
      {!compact && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Time Constraints</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput
              form={form as UseFormReturn<SearchFormData>}
              name="maxPrepTime"
              label="Max Prep Time (minutes)"
              type="number"
              placeholder="e.g., 30"
              helperText="Maximum preparation time"
            />

            <FormInput
              form={form as UseFormReturn<SearchFormData>}
              name="maxCookTime"
              label="Max Cook Time (minutes)"
              type="number"
              placeholder="e.g., 60"
              helperText="Maximum cooking time"
            />
          </div>
        </div>
      )}

      {/* Servings Section */}
      {!compact && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Servings</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput
              form={form as UseFormReturn<SearchFormData>}
              name="minServings"
              label="Min Servings"
              type="number"
              placeholder="e.g., 2"
              helperText="Minimum number of servings"
            />

            <FormInput
              form={form as UseFormReturn<SearchFormData>}
              name="maxServings"
              label="Max Servings"
              type="number"
              placeholder="e.g., 8"
              helperText="Maximum number of servings"
            />
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Badge variant="secondary">
              {activeFilterCount} active filter
              {activeFilterCount !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          {!autoSearch && (
            <Button
              type="submit"
              disabled={isSearching}
              loading={isSearching}
              className="flex-1 sm:flex-none"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          )}

          {hasActiveFilters && (
            <Button
              type="button"
              variant="outline"
              onClick={clearFilters}
              disabled={isSearching}
              className="flex-1 sm:flex-none"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </form>
  );

  // Render with or without card wrapper
  if (showCard) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>{formContent}</CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {title && <h2 className="mb-6 text-xl font-bold">{title}</h2>}
      {formContent}
    </div>
  );
}
