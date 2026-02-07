import { useQuery } from '@tanstack/react-query';
import { pairingApi } from '@/lib/api/recipe-scraper';
import { QUERY_KEYS } from '@/constants';
import type { PairingSuggestionsResponse } from '@/types/recipe-scraper';

/**
 * Hook to get recipe pairing suggestions using AI-powered analysis
 * GET /api/recipe-scraper/recipes/{recipe_id}/pairings
 *
 * @param recipeId - The ID of the recipe (must be > 0)
 * @param params.limit - Maximum number of pairing suggestions to return (1-100, default: 50)
 * @param params.offset - Number of suggestions to skip for pagination (default: 0)
 * @param params.countOnly - If true, return only the total count instead of pairing data (default: false)
 */
export const useRecipePairings = (
  recipeId: number,
  params?: {
    limit?: number;
    offset?: number;
    countOnly?: boolean;
  }
) => {
  return useQuery<PairingSuggestionsResponse>({
    queryKey: [...QUERY_KEYS.RECIPE_SCRAPER.RECIPE_PAIRINGS, recipeId, params],
    queryFn: () => pairingApi.getPairingSuggestions(recipeId, params),
    enabled: recipeId > 0,
  });
};
