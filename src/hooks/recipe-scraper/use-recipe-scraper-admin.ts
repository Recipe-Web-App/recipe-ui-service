import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/recipe-scraper';

/**
 * Hook to clear the Recipe Scraper service cache
 * DELETE /api/recipe-scraper/admin/cache
 *
 * This endpoint is intended for administrative use only and requires
 * service-to-service authentication with admin scope.
 */
export const useClearRecipeScraperCache = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, void>({
    mutationFn: () => adminApi.clearCache(),
    onSuccess: () => {
      // Invalidate all recipe scraper queries to ensure fresh data after cache clear
      queryClient.invalidateQueries({
        queryKey: ['recipeScraper'],
      });
    },
  });
};
