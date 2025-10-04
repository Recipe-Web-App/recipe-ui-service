/**
 * Service URL Configuration
 *
 * Default service URLs for local development using .local domains.
 * These can be overridden by environment variables for different environments.
 *
 * Environment variables take precedence:
 * - NEXT_PUBLIC_AUTH_SERVICE_URL
 * - NEXT_PUBLIC_MEAL_PLAN_MANAGEMENT_SERVICE_URL
 * - NEXT_PUBLIC_MEDIA_MANAGEMENT_SERVICE_URL
 * - NEXT_PUBLIC_RECIPE_MANAGEMENT_SERVICE_URL
 * - NEXT_PUBLIC_RECIPE_SCRAPER_SERVICE_URL
 * - NEXT_PUBLIC_USER_MANAGEMENT_SERVICE_URL
 */

/**
 * Default service URLs for local development
 */
export const SERVICE_URLS = {
  /**
   * Auth Service - OAuth2 authentication and authorization
   * @default http://auth-service.local/api/v1/auth
   */
  AUTH: 'http://auth-service.local/api/v1/auth',

  /**
   * Meal Plan Management Service - Meal planning and scheduling
   * @default http://meal-plan-management.local/api/v1/meal-plan-management
   */
  MEAL_PLAN_MANAGEMENT:
    'http://meal-plan-management.local/api/v1/meal-plan-management',

  /**
   * Media Management Service - File upload and media processing
   * @default http://media-management.local/api/v1/media-management
   */
  MEDIA_MANAGEMENT: 'http://media-management.local/api/v1/media-management',

  /**
   * Recipe Management Service - Recipe CRUD operations
   * @default http://recipe-management.local/api/v1/recipe-management
   */
  RECIPE_MANAGEMENT: 'http://recipe-management.local/api/v1/recipe-management',

  /**
   * Recipe Scraper Service - Web scraping and recipe import
   * @default http://recipe-scraper.local/api/v1/recipe-scraper
   */
  RECIPE_SCRAPER: 'http://recipe-scraper.local/api/v1/recipe-scraper',

  /**
   * User Management Service - User profiles and preferences
   * @default http://user-management.local/api/v1/user-management
   */
  USER_MANAGEMENT: 'http://user-management.local/api/v1/user-management',
} as const;

/**
 * Service URL type for type-safe service references
 */
export type ServiceUrl = (typeof SERVICE_URLS)[keyof typeof SERVICE_URLS];

/**
 * Get service URL with environment variable override support
 *
 * @param serviceKey - The service key from SERVICE_URLS
 * @param envVarName - The environment variable name to check
 * @returns The service URL (env var takes precedence over default)
 */
export function getServiceUrl(
  serviceKey: keyof typeof SERVICE_URLS,
  envVarName: string
): string {
  // Safe access: serviceKey is constrained to keyof SERVICE_URLS
  // eslint-disable-next-line security/detect-object-injection
  const defaultUrl = SERVICE_URLS[serviceKey];

  // Safe access: envVarName is expected to be a NEXT_PUBLIC_* variable
  // eslint-disable-next-line security/detect-object-injection
  const envUrl = process.env[envVarName];

  return envUrl ?? defaultUrl;
}
