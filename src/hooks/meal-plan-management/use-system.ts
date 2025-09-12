import { useQuery } from '@tanstack/react-query';
import { systemApi } from '@/lib/api/meal-plan-management';
import { QUERY_KEYS } from '@/constants';

// Safe system keys to prevent TypeScript unsafe member access warnings
const SWAGGER_UI = QUERY_KEYS.MEAL_PLAN_MANAGEMENT
  .SWAGGER_UI as readonly string[];
const OPENAPI_JSON = QUERY_KEYS.MEAL_PLAN_MANAGEMENT
  .OPENAPI_JSON as readonly string[];
const SERVICE_INFO = QUERY_KEYS.MEAL_PLAN_MANAGEMENT
  .SERVICE_INFO as readonly string[];
const CONFIGURATION = QUERY_KEYS.MEAL_PLAN_MANAGEMENT
  .CONFIGURATION as readonly string[];

/**
 * Hook to fetch Swagger UI HTML
 */
export const useMealPlanSwaggerUI = (enabled = true) => {
  return useQuery({
    queryKey: SWAGGER_UI,
    queryFn: () => systemApi.getSwaggerUI(),
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchInterval: false, // Documentation doesn't change frequently
    retry: 2,
  });
};

/**
 * Hook to fetch OpenAPI JSON specification
 */
export const useMealPlanOpenAPIJson = (enabled = true) => {
  return useQuery({
    queryKey: OPENAPI_JSON,
    queryFn: () => systemApi.getOpenAPIJson(),
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchInterval: false, // OpenAPI spec doesn't change frequently
    retry: 2,
  });
};

/**
 * Hook to fetch service information
 */
export const useMealPlanServiceInfo = (enabled = true) => {
  return useQuery({
    queryKey: SERVICE_INFO,
    queryFn: () => systemApi.getServiceInfo(),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes for updated service info
    retry: 2,
  });
};

/**
 * Hook to fetch safe configuration values
 */
export const useMealPlanConfiguration = (enabled = true) => {
  return useQuery({
    queryKey: CONFIGURATION,
    queryFn: () => systemApi.getConfiguration(),
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchInterval: false, // Configuration doesn't change frequently
    retry: 2,
  });
};
