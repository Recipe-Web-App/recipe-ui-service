// Recipe Management Hooks - Centralized Exports
// This file provides a single entry point for all recipe-management related hooks

// Core Recipe Operations
export {
  useRecipes,
  useRecipe,
  useRecipeDescription,
  useRecipeHistory,
  useCreateRecipe,
  useUpdateRecipe,
  useDeleteRecipe,
  useTrendingRecipes,
  useSuggestedRecipes,
} from './useRecipes';

// Ingredient Management
export {
  useRecipeIngredients,
  useScaleIngredients,
  useShoppingList,
  useAddIngredientComment,
  useEditIngredientComment,
  useDeleteIngredientComment,
  useInvalidateIngredients,
} from './useIngredients';

// Step Management
export {
  useRecipeSteps,
  useStepComments,
  useAddStepComment,
  useEditStepComment,
  useDeleteStepComment,
  useInvalidateSteps,
} from './useSteps';

// Tag Management
export {
  useRecipeTags,
  useAddTagToRecipe,
  useRemoveTagFromRecipe,
  useRecipeTagManager,
  useInvalidateTags,
} from './useTags';

// Review Management
export {
  useRecipeReviews,
  useAddRecipeReview,
  useEditRecipeReview,
  useDeleteRecipeReview,
  useRecipeReviewManager,
  useInvalidateReviews,
} from './useReviews';

// Revision History
export {
  useRecipeRevisions,
  useStepRevisions,
  useIngredientRevisions,
  useAllRecipeRevisions,
  useLatestRevision,
  useRevisionComparison,
} from './useRevisions';

// Media Management
export {
  useRecipeMedia,
  useIngredientMedia,
  useStepMedia,
  useUploadRecipeMedia,
  useUploadIngredientMedia,
  useUploadStepMedia,
  useDeleteRecipeMedia,
  useDeleteIngredientMedia,
  useDeleteStepMedia,
  useMediaManager,
  useInvalidateMedia,
} from './useMedia';

// Search Operations
export {
  useSearchRecipes,
  useSimpleRecipeSearch,
  useDebouncedRecipeSearch,
  useAdvancedRecipeSearch,
  useRecipesByTags,
  useRecipesByDifficulty,
  useRecipesByIngredients,
  useRecipeSearchBuilder,
} from './useSearch';

// Comment Management
export {
  useRecipeComments,
  useAddRecipeComment,
  useEditRecipeComment,
  useDeleteRecipeComment,
} from './useRecipeComments';

// Favorite Management
export {
  useFavoriteRecipes,
  useFavoriteRecipe,
  useUnfavoriteRecipe,
  useIsRecipeFavorited,
} from './useFavorites';

// User Operations
export { useMyRecipes, useMyCollections } from './useUsers';

// Collection Management
export {
  useCollections,
  useCollection,
  useSearchCollections,
  useCreateCollection,
  useUpdateCollection,
  useDeleteCollection,
} from './useCollections';

// Health Monitoring
export {
  useRecipeManagementHealth,
  useRecipeManagementReadiness,
  useRecipeManagementLiveness,
  useRecipeManagementStatus,
  useRecipeManagementHealthMonitor,
  useIsServiceOperational,
  useHealthComponents,
} from './useHealth';

// Service Monitoring
export {
  useRecipeManagementInfo,
  useRecipeManagementMetrics,
  useRecipeManagementMetric,
  usePrometheusMetrics,
  useRecipeManagementEnvironment,
  useRecipeManagementEnvironmentProperty,
  useRecipeManagementConfigProperties,
  useRecipeManagementDashboard,
  useMetricMonitor,
  usePerformanceMetrics,
  useSystemInformation,
} from './useMonitoring';

// Re-import hooks for use in compound hooks
import { useRecipe } from './useRecipes';
import { useRecipeIngredients } from './useIngredients';
import { useRecipeSteps } from './useSteps';
import { useRecipeTags } from './useTags';
import { useRecipeReviews } from './useReviews';
import { useRecipeMedia } from './useMedia';
import { useRecipeManagementHealth } from './useHealth';
import {
  useRecipeManagementInfo,
  usePerformanceMetrics,
} from './useMonitoring';
import type { RecipeManagementHealthResponse } from '@/types/recipe-management';

// Commonly used hook combinations
export const useRecipeWithDetails = (recipeId: number) => {
  const recipe = useRecipe(recipeId);
  const ingredients = useRecipeIngredients(recipeId);
  const steps = useRecipeSteps(recipeId);
  const tags = useRecipeTags(recipeId);
  const reviews = useRecipeReviews(recipeId);
  const media = useRecipeMedia(recipeId);

  return {
    recipe,
    ingredients,
    steps,
    tags,
    reviews,
    media,
    isLoading: recipe.isLoading || ingredients.isLoading || steps.isLoading,
    hasError: recipe.isError || ingredients.isError || steps.isError,
  };
};

// Service status overview
export const useRecipeManagementOverview = () => {
  const health = useRecipeManagementHealth();
  const info = useRecipeManagementInfo();
  const performanceMetrics = usePerformanceMetrics();

  const healthData = health.data as RecipeManagementHealthResponse | undefined;

  return {
    health,
    info,
    performanceMetrics,
    isHealthy: healthData?.status === 'UP',
    isLoading: health.isLoading || info.isLoading,
    hasError: health.isError || info.isError,
  };
};
