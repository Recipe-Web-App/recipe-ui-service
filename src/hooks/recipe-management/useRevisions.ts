import { useQuery } from '@tanstack/react-query';
import { revisionsApi, recipesApi } from '@/lib/api/recipe-management';
import { QUERY_KEYS } from '@/constants';
import type {
  RevisionDto,
  RecipeRevisionsResponse,
  StepRevisionsResponse,
  IngredientRevisionsResponse,
} from '@/types/recipe-management';

/**
 * Hook to fetch recipe revisions
 */
export const useRecipeRevisions = (recipeId: number) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE_REVISIONS, recipeId],
    queryFn: () => revisionsApi.getRecipeRevisions(recipeId),
    enabled: !!recipeId,
    staleTime: 10 * 60 * 1000, // 10 minutes (revision history doesn't change frequently)
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook to fetch step revisions
 */
export const useStepRevisions = (recipeId: number, stepId: number) => {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.RECIPE_MANAGEMENT.STEP_REVISIONS,
      recipeId,
      stepId,
    ],
    queryFn: () => revisionsApi.getStepRevisions(recipeId, stepId),
    enabled: !!recipeId && !!stepId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook to fetch ingredient revisions
 */
export const useIngredientRevisions = (
  recipeId: number,
  ingredientId: number
) => {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.RECIPE_MANAGEMENT.INGREDIENT_REVISIONS,
      recipeId,
      ingredientId,
    ],
    queryFn: () => revisionsApi.getIngredientRevisions(recipeId, ingredientId),
    enabled: !!recipeId && !!ingredientId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook to fetch all revisions for a recipe (recipe, steps, and ingredients)
 * Useful for comprehensive audit trails or history views
 */
export const useAllRecipeRevisions = (recipeId: number, enabled = true) => {
  // Pass enabled parameter down by using 0 to disable the revisions query
  const recipeRevisions = useRecipeRevisions(
    enabled && !!recipeId ? recipeId : 0
  );

  // Get recipe data to determine which steps and ingredients to fetch revisions for
  const recipeQuery = useQuery({
    queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE, recipeId],
    queryFn: () => recipesApi.getRecipeById(recipeId),
    enabled: enabled && !!recipeId,
    staleTime: 5 * 60 * 1000,
  });

  // This would need to be expanded based on the actual recipe structure
  // For now, we'll return the recipe revisions as the main data
  return {
    recipeRevisions,
    recipe: recipeQuery.data,
    isLoading: recipeRevisions.isLoading ?? recipeQuery.isLoading,
    error: recipeRevisions.error ?? recipeQuery.error,
    isError: recipeRevisions.isError ?? recipeQuery.isError,
  };
};

/**
 * Hook to get the latest revision for a recipe component
 * Useful for displaying "last modified" information
 */
export const useLatestRevision = (
  recipeId: number,
  type: 'recipe' | 'step' | 'ingredient',
  componentId?: number
) => {
  const recipeRevisionsQuery = useRecipeRevisions(recipeId);
  const stepRevisionsQuery = useStepRevisions(recipeId, componentId ?? 0);
  const ingredientRevisionsQuery = useIngredientRevisions(
    recipeId,
    componentId ?? 0
  );

  // Enable the appropriate query based on type
  const enableRecipe = type === 'recipe';
  const enableStep = type === 'step' && !!componentId;
  const enableIngredient = type === 'ingredient' && !!componentId;

  let query;
  switch (type) {
    case 'recipe':
      query = { ...recipeRevisionsQuery, enabled: enableRecipe };
      break;
    case 'step':
      query = { ...stepRevisionsQuery, enabled: enableStep };
      break;
    case 'ingredient':
      query = { ...ingredientRevisionsQuery, enabled: enableIngredient };
      break;
    default:
      query = { data: null, isLoading: false, error: null };
  }

  // Extract the latest revision from the data with proper typing
  const queryData = query.data as
    | RecipeRevisionsResponse
    | StepRevisionsResponse
    | IngredientRevisionsResponse
    | undefined;
  const latestRevision = queryData?.revisions?.[0] ?? null;

  return {
    ...query,
    latestRevision,
    lastModifiedAt: latestRevision?.createdAt ?? null,
    lastModifiedBy: latestRevision?.createdBy ?? null,
  };
};

/**
 * Hook to compare revisions between different versions
 * Useful for showing diffs or changes between versions
 */
export const useRevisionComparison = (
  recipeId: number,
  type: 'recipe' | 'step' | 'ingredient',
  componentId?: number,
  fromRevision?: number,
  toRevision?: number
) => {
  // Always call all hooks to avoid conditional hook calls
  const recipeRevisionsQuery = useRecipeRevisions(recipeId);
  const stepRevisionsQuery = useStepRevisions(recipeId, componentId ?? 0);
  const ingredientRevisionsQuery = useIngredientRevisions(
    recipeId,
    componentId ?? 0
  );

  // Select the appropriate query based on type
  let revisionsQuery;
  switch (type) {
    case 'recipe':
      revisionsQuery = recipeRevisionsQuery;
      break;
    case 'step':
      revisionsQuery = componentId
        ? stepRevisionsQuery
        : { data: null, isLoading: false, error: null };
      break;
    case 'ingredient':
      revisionsQuery = componentId
        ? ingredientRevisionsQuery
        : { data: null, isLoading: false, error: null };
      break;
    default:
      revisionsQuery = { data: null, isLoading: false, error: null };
  }

  const revisionsData = revisionsQuery.data as
    | RecipeRevisionsResponse
    | StepRevisionsResponse
    | IngredientRevisionsResponse
    | undefined;
  const revisions = revisionsData?.revisions ?? [];
  const fromRev = revisions.find(
    (r: RevisionDto) => r.revisionId === fromRevision
  );
  const toRev = revisions.find((r: RevisionDto) => r.revisionId === toRevision);

  return {
    ...revisionsQuery,
    fromRevision: fromRev,
    toRevision: toRev,
    hasValidComparison: !!(fromRev && toRev),
    changes: toRev?.changes ?? null,
  };
};
