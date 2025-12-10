import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchApi } from '@/lib/api/recipe-management';
import { QUERY_KEYS } from '@/constants';
import type {
  SearchRecipesRequest,
  SearchRecipesResponse,
} from '@/types/recipe-management';
import { DifficultyLevel } from '@/types/recipe-management';
import type { PaginationParams } from '@/lib/api/recipe-management/client';

/**
 * Hook to search recipes
 */
export const useSearchRecipes = (
  searchData: SearchRecipesRequest,
  params?: PaginationParams
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.SEARCH, searchData, params],
    queryFn: () => searchApi.searchRecipes(searchData, params),
    enabled: !!(
      searchData.recipeNameQuery ??
      searchData.tags?.length ??
      searchData.difficulty
    ),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for simple text-based recipe search
 */
export const useSimpleRecipeSearch = (
  query: string,
  params?: PaginationParams
) => {
  const searchData: SearchRecipesRequest = { recipeNameQuery: query };

  return useQuery({
    queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.SEARCH, 'simple', query, params],
    queryFn: () => searchApi.searchRecipes(searchData, params),
    enabled: !!query && query.length >= 2, // Only search with at least 2 characters
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for debounced search
 * Useful for real-time search as user types
 */
export const useDebouncedRecipeSearch = (
  query: string,
  delay = 300,
  params?: PaginationParams
) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  return useSimpleRecipeSearch(debouncedQuery, params);
};

/**
 * Hook for advanced search with multiple filters
 */
export const useAdvancedRecipeSearch = (
  filters: SearchRecipesRequest,
  params?: PaginationParams
) => {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.RECIPE_MANAGEMENT.SEARCH,
      'advanced',
      filters,
      params,
    ],
    queryFn: () => searchApi.searchRecipes(filters, params),
    enabled: !!(
      filters.recipeNameQuery ??
      filters.tags?.length ??
      filters.difficulty ??
      filters.ingredients?.length
    ),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for tag-based recipe search
 */
export const useRecipesByTags = (tags: string[], params?: PaginationParams) => {
  const searchData: SearchRecipesRequest = { tags };

  return useQuery({
    queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.SEARCH, 'tags', tags, params],
    queryFn: () => searchApi.searchRecipes(searchData, params),
    enabled: !!(tags && tags.length > 0),
    staleTime: 5 * 60 * 1000, // 5 minutes (tag searches are more stable)
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

/**
 * Hook for difficulty-based recipe search
 */
export const useRecipesByDifficulty = (
  difficulty: DifficultyLevel | undefined,
  params?: PaginationParams
) => {
  const searchData: SearchRecipesRequest = {
    difficulty,
  };

  return useQuery({
    queryKey: [
      ...QUERY_KEYS.RECIPE_MANAGEMENT.SEARCH,
      'difficulty',
      difficulty,
      params,
    ],
    queryFn: () => searchApi.searchRecipes(searchData, params),
    enabled: !!difficulty,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

/**
 * Hook for ingredient-based recipe search
 */
export const useRecipesByIngredients = (
  ingredients: string[],
  params?: PaginationParams
) => {
  const searchData: SearchRecipesRequest = { ingredients };

  return useQuery({
    queryKey: [
      ...QUERY_KEYS.RECIPE_MANAGEMENT.SEARCH,
      'ingredients',
      ingredients,
      params,
    ],
    queryFn: () => searchApi.searchRecipes(searchData, params),
    enabled: !!(ingredients && ingredients.length > 0),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

/**
 * Custom hook for building and executing complex search queries
 */
export const useRecipeSearchBuilder = () => {
  const [searchCriteria, setSearchCriteria] = useState<SearchRecipesRequest>(
    {}
  );
  const [params, setParams] = useState<PaginationParams | undefined>();

  const searchQuery = useSearchRecipes(searchCriteria, params);

  const updateSearch = (newCriteria: Partial<SearchRecipesRequest>) => {
    setSearchCriteria(prev => ({ ...prev, ...newCriteria }));
  };

  const updateParams = (newParams: Partial<PaginationParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  const clearSearch = () => {
    setSearchCriteria({});
    setParams(undefined);
  };

  return {
    searchCriteria,
    params,
    searchQuery,
    updateSearch,
    updateParams,
    clearSearch,
    isSearching: searchQuery.isLoading,
    searchResults: searchQuery.data as SearchRecipesResponse | undefined,
    searchError: searchQuery.error,
  };
};
