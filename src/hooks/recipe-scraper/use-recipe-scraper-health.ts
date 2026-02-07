import { useQuery } from '@tanstack/react-query';
import { healthApi } from '@/lib/api/recipe-scraper';
import { QUERY_KEYS } from '@/constants';
import type { HealthCheckResponse } from '@/types/recipe-scraper';

/**
 * Hook to get root service information and basic health status
 * GET /
 */
export const useRecipeScraperRoot = () => {
  return useQuery({
    queryKey: QUERY_KEYS.RECIPE_SCRAPER.ROOT,
    queryFn: () => healthApi.getRoot(),
  });
};

/**
 * Hook to get Prometheus metrics for monitoring and observability
 * GET /metrics
 */
export const useRecipeScraperMetrics = () => {
  return useQuery({
    queryKey: QUERY_KEYS.RECIPE_SCRAPER.METRICS,
    queryFn: () => healthApi.getMetrics(),
  });
};

/**
 * Hook for readiness check including database and external dependencies
 * GET /ready
 */
export const useRecipeScraperReadiness = () => {
  return useQuery({
    queryKey: QUERY_KEYS.RECIPE_SCRAPER.READINESS,
    queryFn: () => healthApi.getReadiness(),
  });
};

/**
 * Hook for comprehensive health check including all dependencies and metrics
 * GET /health
 */
export const useRecipeScraperHealth = () => {
  return useQuery<HealthCheckResponse>({
    queryKey: QUERY_KEYS.RECIPE_SCRAPER.HEALTH,
    queryFn: () => healthApi.getHealth(),
  });
};
