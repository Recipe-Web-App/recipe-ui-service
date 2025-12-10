import type { RecipeDto } from '@/types/recipe-management/recipe';
import type { RecipeTagDto } from '@/types/recipe-management/tag';
import { DifficultyLevel } from '@/types/recipe-management/common';
import type { CheckboxOption, SelectOption } from '@/types/ui/filter-panel';

/**
 * Recipe filter values interface
 * Defines the shape of filter state for recipe browsing
 */
export interface RecipeFilterValues {
  /** Search term for filtering recipe titles/descriptions */
  search?: string;
  /** Selected tag IDs */
  tags?: string[];
  /** Prep time range [min, max] in minutes */
  prepTime?: [number, number];
  /** Cook time range [min, max] in minutes */
  cookTime?: [number, number];
  /** Selected difficulty levels */
  difficulty?: string[];
  /** Minimum rating (0-5 stars) */
  minRating?: string;
}

/**
 * RecipeFilters component props
 */
export interface RecipeFiltersProps {
  /** Array of recipes to extract tags from */
  recipes: RecipeDto[];
  /** Current filter values (controlled) */
  values: RecipeFilterValues;
  /** Callback when filter values change */
  onFilterChange: (values: RecipeFilterValues) => void;
  /** Optional className for styling */
  className?: string;
  /** Whether filters are collapsible (mobile) */
  collapsible?: boolean;
  /** Default collapsed state */
  defaultCollapsed?: boolean;
  /** Total number of results with current filters */
  totalResults?: number;
  /** Whether to show result count */
  showResultCount?: boolean;
  /** Loading state for results */
  loadingResults?: boolean;
  /** Panel title */
  title?: string;
  /** Panel variant */
  variant?: 'default' | 'compact' | 'full';
  /** Panel size */
  size?: 'sm' | 'md' | 'lg';
  /** Panel position */
  position?: 'sidebar' | 'drawer' | 'modal';
  /** Whether to show header */
  showHeader?: boolean;
  /** Whether to show footer */
  showFooter?: boolean;
}

/**
 * Default filter values
 * Shows all recipes by default
 */
export const DEFAULT_RECIPE_FILTER_VALUES: RecipeFilterValues = {
  search: '',
  tags: [],
  prepTime: [0, 120],
  cookTime: [0, 120],
  difficulty: [],
  minRating: '0',
};

/**
 * Filter configuration constants
 */
export const RECIPE_FILTER_CONSTANTS = {
  /** Maximum prep time in minutes */
  MAX_PREP_TIME: 120,
  /** Maximum cook time in minutes */
  MAX_COOK_TIME: 120,
  /** Prep time slider step */
  PREP_TIME_STEP: 5,
  /** Cook time slider step */
  COOK_TIME_STEP: 5,
  /** Search debounce delay in ms */
  SEARCH_DEBOUNCE_DELAY: 300,
} as const;

/**
 * Extract unique tags from an array of recipes
 * Returns sorted array of unique tag names as checkbox options
 */
export function extractUniqueTags(recipes: RecipeDto[]): CheckboxOption[] {
  const tagMap = new Map<string, RecipeTagDto>();

  recipes.forEach(recipe => {
    recipe.tags?.forEach(tag => {
      if (!tagMap.has(tag.name)) {
        tagMap.set(tag.name, tag);
      }
    });
  });

  return Array.from(tagMap.values())
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(tag => ({
      id: tag.name,
      label: tag.name,
    }));
}

/**
 * Get difficulty level options for checkbox filter
 */
export function getDifficultyOptions(): CheckboxOption[] {
  return [
    {
      id: DifficultyLevel.BEGINNER,
      label: 'Beginner',
      description: 'Perfect for first-time cooks',
    },
    {
      id: DifficultyLevel.EASY,
      label: 'Easy',
      description: 'Simple recipes with few steps',
    },
    {
      id: DifficultyLevel.MEDIUM,
      label: 'Medium',
      description: 'Some cooking experience helpful',
    },
    {
      id: DifficultyLevel.HARD,
      label: 'Hard',
      description: 'Advanced techniques required',
    },
    {
      id: DifficultyLevel.EXPERT,
      label: 'Expert',
      description: 'For professional chefs',
    },
  ];
}

/**
 * Get minimum rating options for select filter
 */
export function getRatingOptions(): SelectOption[] {
  return [
    { value: '0', label: 'All Ratings' },
    { value: '2', label: '2+ Stars' },
    { value: '3', label: '3+ Stars' },
    { value: '4', label: '4+ Stars' },
    { value: '4.5', label: '4.5+ Stars' },
  ];
}

/**
 * Format time value for display
 */
export function formatFilterTime(minutes: number): string {
  if (minutes === 0) return '0 min';
  if (minutes >= 120) return '2+ hrs';
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  return `${minutes} min`;
}

/**
 * Convert RecipeFilterValues to generic FilterValues for FilterPanel
 */
export function recipeFiltersToFilterValues(
  values: RecipeFilterValues
): Record<string, unknown> {
  return {
    search: values.search ?? '',
    tags: values.tags ?? [],
    prepTime: values.prepTime ?? [0, 120],
    cookTime: values.cookTime ?? [0, 120],
    difficulty: values.difficulty ?? [],
    minRating: values.minRating ?? '0',
  };
}

/**
 * Convert generic FilterValues from FilterPanel to RecipeFilterValues
 */
export function filterValuesToRecipeFilters(
  values: Record<string, unknown>
): RecipeFilterValues {
  return {
    search: typeof values.search === 'string' ? values.search : undefined,
    tags: Array.isArray(values.tags) ? (values.tags as string[]) : undefined,
    prepTime: Array.isArray(values.prepTime)
      ? (values.prepTime as [number, number])
      : undefined,
    cookTime: Array.isArray(values.cookTime)
      ? (values.cookTime as [number, number])
      : undefined,
    difficulty: Array.isArray(values.difficulty)
      ? (values.difficulty as string[])
      : undefined,
    minRating:
      typeof values.minRating === 'string' ? values.minRating : undefined,
  };
}
