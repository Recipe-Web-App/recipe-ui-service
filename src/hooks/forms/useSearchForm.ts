import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState, useEffect } from 'react';
import {
  searchFormSchema,
  searchFormDefaultValues,
  convertToSearchRecipesRequest,
  validationOptions,
  hasActiveFilters as checkHasActiveFilters,
} from '@/lib/validation/search-schemas';
import type { SearchFormData } from '@/lib/validation/search-schemas';
import { useAdvancedRecipeSearch } from '@/hooks/recipe-management/useSearch';
import type { SearchRecipesResponse } from '@/types/recipe-management/search';
import type { PaginationParams } from '@/lib/api/recipe-management/client';
import type { UseFormReturn } from 'react-hook-form';
import { DifficultyLevel } from '@/types/recipe-management/common';

/**
 * Options for search form hook
 */
interface SearchFormOptions {
  onSearch?: (results: SearchRecipesResponse) => void;
  onResultsChange?: (results: SearchRecipesResponse) => void;
  onError?: (error: Error) => void;
  initialFilters?: Partial<SearchFormData>;
  autoSearch?: boolean;
  debounceMs?: number;
  paginationParams?: PaginationParams;
}

/**
 * Return type for search form hook
 */
interface SearchFormReturn {
  form: UseFormReturn<SearchFormData>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  resetForm: () => void;
  clearFilters: () => void;
  isSearching: boolean;
  searchResults: SearchRecipesResponse | undefined;
  searchError: Error | null;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  // Dynamic field helpers
  addIngredient: (ingredient: string) => void;
  removeIngredient: (index: number) => void;
  addTag: (tag: string) => void;
  removeTag: (index: number) => void;
  toggleDifficulty: (level: DifficultyLevel) => void;
  // Validation helpers
  getFieldError: (fieldName: keyof SearchFormData) => string | undefined;
  validateField: (fieldName: keyof SearchFormData) => Promise<boolean>;
  validateForm: () => Promise<boolean>;
  clearErrors: () => void;
}

/**
 * Hook for search form with advanced filtering
 */
export function useSearchForm(options?: SearchFormOptions): SearchFormReturn {
  const {
    onSearch,
    onResultsChange,
    onError,
    initialFilters,
    autoSearch = false,
    debounceMs = 300,
    paginationParams,
  } = options ?? {};

  // Initialize form with default or initial values
  const [initialValues] = useState<SearchFormData>({
    ...searchFormDefaultValues,
    ...initialFilters,
  });

  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: initialValues,
    ...validationOptions,
  });

  // Watch form values for auto-search
  // React Hook Form's watch() is intentionally not memoized to track form changes
  // eslint-disable-next-line react-hooks/incompatible-library
  const formValues = form.watch();

  // State for search criteria
  const [searchCriteria, setSearchCriteria] =
    useState<SearchFormData>(initialValues);

  // Use the advanced search hook
  const searchRequest = convertToSearchRecipesRequest(searchCriteria);
  const searchQuery = useAdvancedRecipeSearch(searchRequest, paginationParams);

  // Manual submit handler
  const handleSubmit = form.handleSubmit(async (data: SearchFormData) => {
    try {
      setSearchCriteria(data);
      // The search query will automatically refetch due to criteria change
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error('Unknown error');
      onError?.(errorObj);
    }
  });

  // Auto-search with debounce
  useEffect(() => {
    if (!autoSearch) return;

    const timer = setTimeout(() => {
      if (checkHasActiveFilters(formValues)) {
        setSearchCriteria(formValues);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [formValues, autoSearch, debounceMs]);

  // Call onSearch when search completes successfully
  useEffect(() => {
    if (searchQuery.data && searchQuery.isSuccess) {
      onSearch?.(searchQuery.data);
    }
  }, [searchQuery.data, searchQuery.isSuccess, onSearch]);

  // Call onResultsChange whenever results change
  useEffect(() => {
    if (searchQuery.data) {
      onResultsChange?.(searchQuery.data);
    }
  }, [searchQuery.data, onResultsChange]);

  // Call onError when search fails
  useEffect(() => {
    if (searchQuery.error) {
      const errorObj =
        searchQuery.error instanceof Error
          ? searchQuery.error
          : new Error('Search failed');
      onError?.(errorObj);
    }
  }, [searchQuery.error, onError]);

  // Reset form to initial values
  const resetForm = useCallback(() => {
    form.reset(initialValues);
    setSearchCriteria(initialValues);
  }, [form, initialValues]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    form.reset(searchFormDefaultValues);
    setSearchCriteria(searchFormDefaultValues);
  }, [form]);

  // Add ingredient
  const addIngredient = useCallback(
    (ingredient: string) => {
      const currentIngredients = form.getValues('ingredients') ?? [];
      form.setValue('ingredients', [...currentIngredients, ingredient], {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [form]
  );

  // Remove ingredient
  const removeIngredient = useCallback(
    (index: number) => {
      const currentIngredients = form.getValues('ingredients') ?? [];
      const newIngredients = currentIngredients.filter((_, i) => i !== index);
      form.setValue('ingredients', newIngredients, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [form]
  );

  // Add tag
  const addTag = useCallback(
    (tag: string) => {
      const currentTags = form.getValues('tags') ?? [];
      form.setValue('tags', [...currentTags, tag], {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [form]
  );

  // Remove tag
  const removeTag = useCallback(
    (index: number) => {
      const currentTags = form.getValues('tags') ?? [];
      const newTags = currentTags.filter((_, i) => i !== index);
      form.setValue('tags', newTags, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [form]
  );

  // Toggle difficulty level
  const toggleDifficulty = useCallback(
    (level: DifficultyLevel) => {
      const currentDifficulty = form.getValues('difficulty') ?? [];
      const newDifficulty = currentDifficulty.includes(level)
        ? currentDifficulty.filter(d => d !== level)
        : [...currentDifficulty, level];
      form.setValue('difficulty', newDifficulty, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [form]
  );

  // Get field error
  const getFieldError = useCallback(
    (fieldName: keyof SearchFormData) => {
      const errors = form.formState.errors as Record<
        string,
        { message?: string }
      >;
      return errors[fieldName as string]?.message;
    },
    [form.formState.errors]
  );

  // Validate single field
  const validateField = useCallback(
    async (fieldName: keyof SearchFormData) => {
      const result = await form.trigger(fieldName);
      return result;
    },
    [form]
  );

  // Validate entire form
  const validateForm = useCallback(async () => {
    const result = await form.trigger();
    return result;
  }, [form]);

  // Clear errors
  const clearErrors = useCallback(() => {
    form.clearErrors();
  }, [form]);

  // Calculate active filters
  const hasFilters = checkHasActiveFilters(formValues);
  let activeFilterCount = 0;
  if (formValues.query && formValues.query.length >= 2) activeFilterCount++;
  if (formValues.ingredients && formValues.ingredients.length > 0)
    activeFilterCount++;
  if (formValues.tags && formValues.tags.length > 0) activeFilterCount++;
  if (formValues.difficulty && formValues.difficulty.length > 0)
    activeFilterCount++;
  if (formValues.maxPrepTime !== undefined) activeFilterCount++;
  if (formValues.maxCookTime !== undefined) activeFilterCount++;
  if (formValues.minRating !== undefined) activeFilterCount++;

  return {
    form,
    handleSubmit,
    resetForm,
    clearFilters,
    isSearching: searchQuery.isLoading || searchQuery.isFetching,
    searchResults: searchQuery.data,
    searchError: searchQuery.error as Error | null,
    hasActiveFilters: hasFilters,
    activeFilterCount,
    addIngredient,
    removeIngredient,
    addTag,
    removeTag,
    toggleDifficulty,
    getFieldError,
    validateField,
    validateForm,
    clearErrors,
  };
}
