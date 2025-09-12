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
 * Hook for basic liveness check (Kubernetes/container orchestration)
 * GET /api/liveness
 */
export const useRecipeScraperLiveness = () => {
  return useQuery({
    queryKey: QUERY_KEYS.RECIPE_SCRAPER.LIVENESS,
    queryFn: () => healthApi.getLiveness(),
  });
};

/**
 * Hook for readiness check including database and external dependencies
 * GET /api/readiness
 */
export const useRecipeScraperReadiness = () => {
  return useQuery({
    queryKey: QUERY_KEYS.RECIPE_SCRAPER.READINESS,
    queryFn: () => healthApi.getReadiness(),
  });
};

/**
 * Hook for comprehensive health check including all dependencies and metrics
 * GET /api/health
 */
export const useRecipeScraperHealth = () => {
  return useQuery<HealthCheckResponse>({
    queryKey: QUERY_KEYS.RECIPE_SCRAPER.HEALTH,
    queryFn: () => healthApi.getHealth(),
  });
};

/**
 * Hook for legacy health check endpoint (deprecated)
 * GET /api/recipe-scraper/health
 * @deprecated Use useRecipeScraperHealth instead
 */
export const useRecipeScraperLegacyHealth = () => {
  return useQuery({
    queryKey: QUERY_KEYS.RECIPE_SCRAPER.LEGACY_HEALTH,
    queryFn: () => healthApi.getLegacyHealth(),
  });
};
